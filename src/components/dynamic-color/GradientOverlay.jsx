import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

/** GLSL vertex shader: pass UV coordinates */
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/** GLSL fragment shader: Simplex Noise gradient + film grain */
const fragmentShader = `
  uniform float uTime;
  uniform float uScrollIn;
  uniform float uScrollOut;
  uniform vec2 uResolution;
  uniform vec3 uColorLight;
  uniform vec3 uColorDark;
  uniform float uGrainIntensity;

  varying vec2 vUv;

  // Simplex Noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Film Grain
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    float wave = snoise(vec2(vUv.x * 0.8, uTime * 0.25)) * 0.04;
    float distortedY = vUv.y + wave;

    // Phase 1: dark color rises up from the bottom
    float progressIn = uScrollIn * 1.2 + 0.15;
    float maskIn = smoothstep(progressIn - 0.2, progressIn + 0.2, distortedY);
    float darkFromIn = 1.0 - maskIn;

    // Outro: light color rises up from the bottom, top edge stays dark
    float topEdge = smoothstep(0.85, 1.0, distortedY);
    float lightReach = uScrollOut * 0.85;
    float isLight = smoothstep(lightReach + 0.15, lightReach - 0.15, distortedY);
    float outroDark = 1.0 - isLight * (1.0 - topEdge);

    float darkAmount = darkFromIn * (1.0 - uScrollOut + uScrollOut * outroDark);

    vec3 color = mix(uColorLight, uColorDark, darkAmount);

    // Film grain
    float grain = random(vUv * uResolution + uTime) * uGrainIntensity;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Convert a hex color to an RGB array in the 0-1 range
 * @param {string} hex - hex color in '#RRGGBB' format
 * @returns {number[]} [r, g, b] (0-1 range)
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [0, 0, 0];
}

/**
 * GradientOverlay component
 *
 * A scroll-reactive gradient background overlay built on Three.js WebGL.
 * The boundary ripples organically via Simplex Noise, and colors transition as the user scrolls.
 *
 * Behavior:
 * 1. A WebGL canvas that covers the entire screen is created
 * 2. On scroll, the dark color rises from bottom to top and covers the light color
 * 3. When the scrollOutRef element enters the viewport, the light color rises again
 * 4. The boundary deforms over time like waves via Simplex Noise
 * 5. A film grain texture is overlaid on top of everything
 *
 * Props:
 * @param {string} colorLight - hex color for the light region [Optional, default: theme.palette.grey[200]]
 * @param {string} colorDark - hex color for the dark region [Optional, default: theme.palette.secondary.main]
 * @param {object} scrollOutRef - React ref for the element that anchors the outro section [Optional]
 * @param {boolean} isGrain - whether to apply the film grain effect [Optional, default: true]
 * @param {number} grainIntensity - film grain intensity (0 to 0.1) [Optional, default: 0.035]
 * @param {object} sx - MUI sx style [Optional]
 *
 * Example usage:
 * <GradientOverlay />
 * <GradientOverlay colorLight="#f5f5f5" colorDark="#263238" scrollOutRef={outroRef} />
 */
function GradientOverlay({
  colorLight,
  colorDark,
  scrollOutRef,
  isGrain = true,
  grainIntensity = 0.035,
  sx = {},
}) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const animationIdRef = useRef(0);

  /** Resolve default colors based on the theme */
  const resolvedLight = colorLight || theme.palette.grey[200];
  const resolvedDark = colorDark || theme.palette.secondary.main;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    /** Initialize the Three.js scene */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /** Color conversion and uniform setup */
    const rgbLight = hexToRgb(resolvedLight);
    const rgbDark = hexToRgb(resolvedDark);

    const uniforms = {
      uTime: { value: 0 },
      uScrollIn: { value: 0 },
      uScrollOut: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColorLight: { value: new THREE.Color(...rgbLight) },
      uColorDark: { value: new THREE.Color(...rgbDark) },
      uGrainIntensity: { value: isGrain ? grainIntensity : 0 },
    };

    /** Create the shader material */
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /** Track scroll progress (lerp interpolation) */
    let targetScrollIn = 0;
    let targetScrollOut = 0;
    let currentScrollIn = 0;
    let currentScrollOut = 0;

    const updateScrollTarget = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      targetScrollIn = Math.min(scrollY / windowHeight, 1);

      if (scrollOutRef?.current) {
        const outroRect = scrollOutRef.current.getBoundingClientRect();
        const outroProgress = (windowHeight - outroRect.top) / windowHeight;
        targetScrollOut = Math.max(0, Math.min(1, outroProgress));
      }
    };

    /** Handle resize */
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', handleResize);

    /** Render loop */
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      currentScrollIn += (targetScrollIn - currentScrollIn) * 0.06;
      currentScrollOut += (targetScrollOut - currentScrollOut) * 0.06;

      uniforms.uTime.value = elapsedTime;
      uniforms.uScrollIn.value = currentScrollIn;
      uniforms.uScrollOut.value = currentScrollOut;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    /** Clean up resources */
    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('scroll', updateScrollTarget);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [resolvedLight, resolvedDark, scrollOutRef, isGrain, grainIntensity]);

  return (
    <Box
      ref={ containerRef }
      sx={ {
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        ...sx,
      } }
    />
  );
}

export default GradientOverlay;
