import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * NavMenu component
 *
 * Navigation menu component used in the header, sidebar, and drawer.
 * Supports icon and text combinations and adapts to various layouts.
 *
 * How it works:
 * 1. Define menu items with the items array
 * 2. Lay them out horizontally or vertically based on orientation
 * 3. Indicate the currently active menu with activeId
 * 4. Handle menu selection with onItemClick
 *
 * Props:
 * @param {Array} items - Array of menu items [{ id, label, icon, href, disabled }] [Required]
 * @param {string} activeId - ID of the currently active item [Optional]
 * @param {string} orientation - Layout direction ('horizontal' | 'vertical') [Optional, default: 'horizontal']
 * @param {string} variant - Style variant ('default' | 'pills' | 'underline') [Optional, default: 'default']
 * @param {string} size - Size ('sm' | 'md' | 'lg') [Optional, default: 'md']
 * @param {boolean} isIconOnly - Show icon only [Optional, default: false]
 * @param {boolean} hasIconStart - Place the icon before the text [Optional, default: true]
 * @param {function} onItemClick - Item click handler (item) => void [Optional]
 * @param {object} sx - Additional styles [Optional]
 *
 * Example usage:
 * <NavMenu
 *   items={[
 *     { id: 'home', label: 'Home', icon: <HomeIcon /> },
 *     { id: 'about', label: 'About', icon: <InfoIcon /> },
 *   ]}
 *   activeId="home"
 *   onItemClick={(item) => navigate(item.href)}
 * />
 */
const NavMenu = forwardRef(function NavMenu({
  items = [],
  activeId,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  isIconOnly = false,
  hasIconStart = true,
  onItemClick,
  sx,
  ...props
}, ref) {
  /**
   * Style map by size
   */
  const sizeMap = {
    sm: {
      padding: '6px 12px',
      fontSize: 13,
      iconSize: 18,
      gap: 0.75,
    },
    md: {
      padding: '8px 16px',
      fontSize: 14,
      iconSize: 20,
      gap: 1,
    },
    lg: {
      padding: '12px 20px',
      fontSize: 15,
      iconSize: 22,
      gap: 1.25,
    },
  };

  const sizeStyle = sizeMap[size] || sizeMap.md;
  const isVertical = orientation === 'vertical';

  /**
   * Container styles
   */
  const getContainerStyles = () => ({
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: isVertical ? 'stretch' : 'center',
    gap: isVertical ? 0.5 : 1,
  });

  /**
   * Item base styles
   */
  const getItemBaseStyles = (isActive, isDisabled) => {
    const base = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isIconOnly ? 'center' : 'flex-start',
      gap: sizeStyle.gap,
      padding: sizeStyle.padding,
      fontSize: sizeStyle.fontSize,
      fontWeight: isActive ? 600 : 400,
      textDecoration: 'none',
      borderRadius: variant === 'pills' ? 99 : 1,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      whiteSpace: 'nowrap',
      userSelect: 'none',
    };

    return base;
  };

  /**
   * Styles by variant
   */
  const getVariantStyles = (isActive) => {
    switch (variant) {
      case 'pills':
        return {
          backgroundColor: isActive ? 'primary.main' : 'transparent',
          color: isActive ? 'primary.contrastText' : 'text.primary',
          '&:hover': {
            backgroundColor: isActive ? 'primary.dark' : 'action.hover',
          },
        };

      case 'underline':
        return {
          backgroundColor: 'transparent',
          color: isActive ? 'primary.main' : 'text.secondary',
          borderBottom: '2px solid',
          borderColor: isActive ? 'primary.main' : 'transparent',
          borderRadius: 0,
          '&:hover': {
            color: 'primary.main',
            borderColor: isActive ? 'primary.main' : 'grey.300',
          },
        };

      case 'default':
      default:
        return {
          backgroundColor: isActive ? 'action.selected' : 'transparent',
          color: isActive ? 'primary.main' : 'text.primary',
          '&:hover': {
            backgroundColor: isActive ? 'action.selected' : 'action.hover',
          },
        };
    }
  };

  /**
   * Item click handler
   */
  const handleItemClick = (item) => {
    if (item.disabled) return;
    onItemClick?.(item);
  };

  if (items.length === 0) return null;

  return (
    <Box
      ref={ref}
      component="nav"
      role="navigation"
      sx={{
        ...getContainerStyles(),
        ...sx,
      }}
      {...props}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const isDisabled = item.disabled || false;

        return (
          <Box
            key={item.id}
            component={item.href ? 'a' : 'button'}
            href={item.href}
            onClick={() => handleItemClick(item)}
            role="menuitem"
            aria-current={isActive ? 'page' : undefined}
            aria-disabled={isDisabled}
            sx={{
              ...getItemBaseStyles(isActive, isDisabled),
              ...getVariantStyles(isActive),
              // Reset button styles
              border: 'none',
              background: 'none',
              font: 'inherit',
            }}
          >
            {/* Icon (start) */}
            {item.icon && hasIconStart && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: sizeStyle.iconSize,
                  height: sizeStyle.iconSize,
                  '& > svg': {
                    width: '100%',
                    height: '100%',
                  },
                }}
              >
                {item.icon}
              </Box>
            )}

            {/* Label */}
            {!isIconOnly && (
              <Typography
                component="span"
                sx={{
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  lineHeight: 1.2,
                }}
              >
                {item.label}
              </Typography>
            )}

            {/* Icon (end) */}
            {item.icon && !hasIconStart && !isIconOnly && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: sizeStyle.iconSize,
                  height: sizeStyle.iconSize,
                  '& > svg': {
                    width: '100%',
                    height: '100%',
                  },
                }}
              >
                {item.icon}
              </Box>
            )}

            {/* Icon only mode */}
            {item.icon && isIconOnly && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: sizeStyle.iconSize,
                  height: sizeStyle.iconSize,
                  '& > svg': {
                    width: '100%',
                    height: '100%',
                  },
                }}
              >
                {item.icon}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
});

export { NavMenu };
