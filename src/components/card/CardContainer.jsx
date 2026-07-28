import { forwardRef } from 'react';
import Box from '@mui/material/Box';

/**
 * CardContainer component
 *
 * A wrapper component with predefined, commonly used card styles.
 * Supports a variety of variants such as outlined, elevation, and ghost.
 *
 * How it works:
 * 1. Applies a predefined style based on variant
 * 2. Provides visual feedback on hover
 * 3. Allows additional customization via the sx prop
 *
 * Props:
 * @param {string} variant - Card style ('outlined' | 'elevation' | 'ghost' | 'filled') [Optional, default: 'outlined']
 * @param {string} padding - Inner padding ('none' | 'sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {string} radius - Corner radius ('none' | 'sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {boolean} isInteractive - Enable hover effect [Optional, default: false]
 * @param {boolean} isSelected - Show selected state [Optional, default: false]
 * @param {function} onClick - Click handler [Optional]
 * @param {node} children - Card content [Required]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <CardContainer variant="elevation" padding="lg" isInteractive>
 *   <Typography>Card Content</Typography>
 * </CardContainer>
 */
const CardContainer = forwardRef(function CardContainer({
  variant = 'outlined',
  padding = 'md',
  radius = 'md',
  isInteractive = false,
  isSelected = false,
  onClick,
  children,
  sx,
  ...props
}, ref) {
  /**
   * Padding size map
   */
  const paddingMap = {
    none: 0,
    sm: 2,
    md: 3,
    lg: 4,
  };

  /**
   * Border radius map
   */
  const radiusMap = {
    none: 0,
    sm: 1,
    md: 2,
    lg: 3,
  };

  /**
   * Base style per variant
   */
  const getVariantStyles = () => {
    const base = {
      position: 'relative',
      overflow: 'hidden',
    };

    switch (variant) {
      case 'elevation':
        return {
          ...base,
          backgroundColor: 'background.paper',
          boxShadow: 'none',
        };

      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          border: 'none',
        };

      case 'filled':
        return {
          ...base,
          backgroundColor: 'grey.100',
          border: 'none',
        };

      case 'outlined':
      default:
        return {
          ...base,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        };
    }
  };

  /**
   * Interactive styles (hover, click)
   */
  const getInteractiveStyles = () => {
    if (!isInteractive && !onClick) return {};

    const hoverStyles = {
      outlined: { borderColor: 'text.primary' },
      elevation: { backgroundColor: 'action.hover' },
      ghost: { backgroundColor: 'action.hover' },
      filled: { backgroundColor: 'grey.200' },
    };

    return {
      cursor: 'pointer',
      transition: 'background-color 150ms, border-color 150ms',
      '&:hover': hoverStyles[variant] || hoverStyles.outlined,
    };
  };

  /**
   * Selected state styles
   */
  const getSelectedStyles = () => {
    if (!isSelected) return {};

    return {
      borderColor: 'primary.main',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'primary.main',
      },
    };
  };

  return (
    <Box
      ref={ref}
      onClick={onClick}
      sx={{
        p: paddingMap[padding] ?? paddingMap.md,
        borderRadius: radiusMap[radius] ?? radiusMap.md,
        ...getVariantStyles(),
        ...getInteractiveStyles(),
        ...getSelectedStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

export { CardContainer };
