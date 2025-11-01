# Slack Channel UI - Visual Design Guide

## Color Palette

### Background Colors
```css
/* Main sidebar background */
#350d36  /* Deep purple - far left sidebar */
#611f69  /* Aubergine purple - nav sidebar with channels */

/* Channel item states */
transparent                    /* Default channel */
rgba(255, 255, 255, 0.06)     /* Hover state */
#E8DFE9                        /* Selected/Active channel */
#DED0DF                        /* Selected + Hover */
```

### Text Colors
```css
/* Channel text */
rgba(255, 255, 255, 0.7)      /* Default */
rgba(255, 255, 255, 0.9)      /* Hover */
#1d1c1d                        /* Selected (dark text on light bg) */

/* Section headers */
rgba(255, 255, 255, 0.7)      /* Default */
rgba(255, 255, 255, 0.9)      /* Hover */
```

### Accent Colors
```css
#e01e5a  /* Unread badge - Slack red */
#1264a3  /* Focus outline - Slack blue */
```

## Typography

### Font Stack
```css
font-family: "Slack-Lato", "appleLogo", sans-serif;
```

### Font Sizes
```css
font-size: 15px;              /* Body text, channels, nav items */
font-size: 16px;              /* Workspace name */
font-size: 13px;              /* Helper text, placeholders */
font-size: 11px;              /* Unread badge */
```

### Font Weights
```css
font-weight: 400;             /* Normal text */
font-weight: 700;             /* Section headers, selected channel */
font-weight: 900;             /* Workspace name */
```

### Line Heights
```css
line-height: 1.46666667;      /* Body text (22px / 15px) */
line-height: 1;               /* Badges, icons */
```

## Spacing System

### Padding
```css
/* Channel items */
padding: 3px 8px;             /* Vertical, Horizontal */

/* Nav items */
padding: 4px 16px;

/* Section headers */
padding: 4px 16px;
```

### Margins
```css
/* Channel items container */
margin: 0 8px 1px 8px;        /* Creates breathing room */

/* Section gaps */
gap: 1px;                     /* Between items in same section */
gap: 16px;                    /* Between different sections */
```

### Icon Spacing
```css
gap: 6px;                     /* Icon to text gap in channels */
gap: 8px;                     /* Icon to text gap in nav items */
gap: 4px;                     /* Icon to text gap in section headers */
```

## Border Radius
```css
border-radius: 6px;           /* All interactive elements */
border-radius: 8px;           /* Workspace logo, user avatar */
border-radius: 9px;           /* Unread badge (rounded pill) */
```

## Dimensions

### Heights
```css
min-height: 28px;             /* Channel items, nav items, section headers */
height: 32px;                 /* New message button */
height: 40px;                 /* Workspace logo, user avatar */
```

### Widths
```css
width: 260px;                 /* Nav sidebar */
width: 70px;                  /* Main sidebar (far left) */

/* Icons */
width: 16px;                  /* Channel hash icon, chevrons, add icon */
width: 18px;                  /* Nav item icons, workspace icon */
width: 20px;                  /* Main sidebar nav icons */
```

## Transitions

### Timing
```css
/* Slack's standard transition */
transition: all 80ms cubic-bezier(0.36, 0.19, 0.29, 1);
```

### Applied to
- background-color changes
- color changes
- transform (chevron rotation)

## Component Structure

### Channel Item Hierarchy
```
.p-channel_sidebar__static_list__item (container)
  └── .p-channel_sidebar__channel (button)
      ├── .p-channel_sidebar__channel_icon_prefix (icon container)
      │   └── <HashIcon /> (16×16px)
      ├── .p-channel_sidebar__name (text)
      │   └── <span> (channel name)
      └── .p-channel_sidebar__channel_suffix (optional)
          └── .channel-preview-badge (unread count)
```

### Section Header Hierarchy
```
.section-header (button)
  ├── <ChevronDown /> or <ChevronRight /> (16×16px)
  └── .section-header-text (text)
```

## States & Interactions

### Channel States
1. **Default**
   - Background: transparent
   - Text: rgba(255, 255, 255, 0.7)
   - Font weight: 400

2. **Hover**
   - Background: rgba(255, 255, 255, 0.06)
   - Text: rgba(255, 255, 255, 0.9)
   - Font weight: 400

3. **Selected**
   - Background: #E8DFE9
   - Text: #1d1c1d
   - Font weight: 700

4. **Selected + Hover**
   - Background: #DED0DF (slightly darker)
   - Text: #1d1c1d
   - Font weight: 700

### Section Header States
1. **Default**
   - Icon: ChevronDown (expanded) or ChevronRight (collapsed)
   - Text: rgba(255, 255, 255, 0.7)
   - Font weight: 700

2. **Hover**
   - Background: rgba(255, 255, 255, 0.06)
   - Text: rgba(255, 255, 255, 0.9)

## Accessibility

### ARIA Attributes
```html
<!-- Channel item -->
<div role="treeitem" tabindex="0" aria-label="Channel name">

<!-- Section header -->
<button aria-expanded="true" aria-label="Channels">
```

### Focus States
```css
outline: 2px solid #1264a3;
outline-offset: 2px;
```

### Keyboard Navigation
- Tab/Shift+Tab: Move between items
- Enter/Space: Activate item
- Arrow keys: Navigate within list (future enhancement)

## Responsive Behavior

### Sidebar Width
- Fixed at 260px (does not collapse)
- Min-width prevents shrinking below 260px
- Scrollbar appears when content overflows

### Text Overflow
```css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

## Scrollbar Styling

```css
/* Webkit browsers (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
```

## Design Token Comparison

| Property | Slack Value | Our Implementation |
|----------|-------------|-------------------|
| Border Radius | 6px | 6px ✅ |
| Transition Duration | 80ms | 80ms ✅ |
| Transition Easing | cubic-bezier(0.36, 0.19, 0.29, 1) | cubic-bezier(0.36, 0.19, 0.29, 1) ✅ |
| Line Height | 1.46666667 | 1.46666667 ✅ |
| Selected Background | #E8DFE9 | #E8DFE9 ✅ |
| Sidebar Background | #611f69 | #611f69 ✅ |
| Font Size | 15px | 15px ✅ |
| Min Height | 28px | 28px ✅ |

## Implementation Checklist

- ✅ Dark purple background (#611f69)
- ✅ Light lavender selected state (#E8DFE9)
- ✅ Dark text on selected channel (#1d1c1d)
- ✅ Proper icon sizing (16×16px for hash)
- ✅ Rounded corners (6px)
- ✅ Smooth transitions (80ms)
- ✅ Slack font family
- ✅ Proper spacing and padding
- ✅ Hover states
- ✅ Unread badges
- ✅ Section headers with chevrons
- ✅ Add channels button
- ✅ Accessibility attributes
- ✅ Error handling with try-catch
- ✅ Backwards compatibility

## Browser Testing

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ | Full support |
| Firefox | ✅ | Full support |
| Safari | ✅ | Webkit scrollbar supported |
| Edge | ✅ | Chromium-based, full support |

## Performance Considerations

1. **CSS Transitions**: Hardware-accelerated properties (opacity, transform)
2. **Reflows**: Minimal layout changes on interactions
3. **Repaints**: Color/background changes optimized
4. **Memory**: No memory leaks in event handlers
5. **Rendering**: Virtual list from Stream Chat handles large channel lists
