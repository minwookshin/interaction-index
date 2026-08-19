/* Generated from tokens/whatiuse.tokens.json. Do not edit directly. */

export const tokenModes = ["light","dark"] as const;
export type TokenMode = (typeof tokenModes)[number];
export const tokenPaths = [
  "foundation.system.neutral-h",
  "foundation.system.neutral-c",
  "foundation.system.sidebar-l",
  "foundation.system.stage-l",
  "foundation.system.border-alpha",
  "foundation.typography.font-ui",
  "foundation.typography.font-code",
  "foundation.typography.sizes.type-metadata",
  "foundation.typography.sizes.type-label",
  "foundation.typography.sizes.type-ui",
  "foundation.typography.sizes.type-body",
  "foundation.typography.sizes.type-row",
  "foundation.typography.sizes.type-section",
  "foundation.typography.sizes.type-title",
  "foundation.typography.sizes.line-metadata",
  "foundation.typography.sizes.line-label",
  "foundation.typography.sizes.line-ui",
  "foundation.typography.sizes.line-row",
  "foundation.typography.sizes.line-body",
  "foundation.typography.sizes.line-section",
  "foundation.typography.sizes.line-title",
  "foundation.typography.ui-weight",
  "foundation.typography.label-weight",
  "foundation.typography.heading-weight",
  "foundation.typography.ui-tracking",
  "foundation.layout.space-0",
  "foundation.layout.space-1",
  "foundation.layout.space-2",
  "foundation.layout.space-3",
  "foundation.layout.space-4",
  "foundation.layout.space-5",
  "foundation.layout.space-6",
  "foundation.layout.space-7",
  "foundation.layout.space-8",
  "foundation.layout.space-10",
  "foundation.layout.space-12",
  "foundation.layout.space-16",
  "foundation.layout.space-page-x",
  "foundation.layout.space-page-y",
  "foundation.layout.space-section",
  "foundation.layout.icon-size",
  "foundation.layout.icon-offset-y",
  "foundation.layout.control-height-sm",
  "foundation.layout.control-height-md",
  "foundation.layout.control-height-lg",
  "foundation.layout.control-padding-sm",
  "foundation.layout.control-padding-md",
  "foundation.layout.control-padding-lg",
  "foundation.layout.radius-control",
  "foundation.layout.radius-container",
  "foundation.layout.radius-overlay",
  "foundation.layout.radius-pill",
  "foundation.layout.row-height-menu",
  "foundation.layout.row-height-table",
  "foundation.layout.focus-width",
  "foundation.layout.focus-offset",
  "foundation.layout.radius-xs",
  "foundation.layout.radius-sm",
  "foundation.layout.radius-md",
  "foundation.layout.radius-lg",
  "foundation.motion.duration.hover-duration",
  "foundation.motion.duration.press-duration",
  "foundation.motion.duration.enter-duration",
  "foundation.motion.duration.exit-duration",
  "foundation.motion.duration.fast",
  "foundation.motion.duration.medium",
  "foundation.motion.easing.ease-out",
  "foundation.motion.easing.ease-in-out",
  "foundation.motion.easing.ease-drawer",
  "foundation.motion.easing.ease",
  "foundation.layers.layer-sticky",
  "foundation.layers.layer-modal-backdrop",
  "foundation.layers.layer-modal",
  "foundation.layers.layer-flyout",
  "foundation.layers.layer-toast",
  "foundation.layers.layer-navigation",
  "theme.palette.gray-50",
  "theme.palette.gray-100",
  "theme.palette.gray-200",
  "theme.palette.gray-300",
  "theme.palette.gray-400",
  "theme.palette.gray-500",
  "theme.palette.gray-600",
  "theme.palette.gray-700",
  "theme.palette.gray-800",
  "theme.palette.gray-900",
  "theme.surface.bg-canvas",
  "theme.surface.bg-sidebar",
  "theme.surface.bg-stage",
  "theme.surface.bg-subtle",
  "theme.surface.bg-surface",
  "theme.surface.bg-control",
  "theme.surface.bg-raised",
  "theme.surface.bg-overlay",
  "theme.surface.bg-float",
  "theme.surface.bg-flyout",
  "theme.surface.bg-modal",
  "theme.surface.bg-scrim",
  "theme.surface.bg-code",
  "theme.surface.canvas",
  "theme.surface.sidebar",
  "theme.surface.surface",
  "theme.surface.control-surface",
  "theme.surface.elevated-surface",
  "theme.surface.overlay-surface",
  "theme.surface.code-surface",
  "theme.surface.stage",
  "theme.surface.subtle",
  "theme.surface.hover",
  "theme.surface.active",
  "theme.surface.selected",
  "theme.surface.inverse",
  "theme.surface.inverse-hover",
  "theme.surface.on-inverse",
  "theme.surface.scrollbar-thumb",
  "theme.surface.scrollbar-thumb-hover",
  "theme.foreground.fg-default",
  "theme.foreground.fg-muted",
  "theme.foreground.fg-subtle",
  "theme.foreground.fg-disabled",
  "theme.foreground.fg-danger",
  "theme.foreground.ink",
  "theme.foreground.ink-secondary",
  "theme.foreground.ink-tertiary",
  "theme.foreground.ink-disabled",
  "theme.border.separator",
  "theme.border.control-border",
  "theme.border.control-border-hover",
  "theme.border.border-subtle",
  "theme.border.border",
  "theme.border.border-strong",
  "theme.focus.focus-control",
  "theme.focus.focus-navigation",
  "theme.focus.focus-documentation",
  "theme.focus.focus-halo",
  "theme.focus.switch-track",
  "theme.focus.switch-thumb",
  "theme.focus.focus",
  "theme.elevation.shadow-control",
  "theme.elevation.shadow-float",
  "theme.elevation.shadow-float-focus",
  "theme.elevation.shadow-flyout",
  "theme.elevation.shadow-popover",
  "theme.elevation.shadow-modal",
  "theme.elevation.shadow-dialog"
] as const;
export type TokenPath = (typeof tokenPaths)[number];
export const tokenManifest = [
  {
    "path": "foundation.system.neutral-h",
    "type": "number",
    "description": "Cool graphite hue used by optical OKLCH effects.",
    "deprecated": false,
    "cssVariable": "--whatiuse-neutral-h",
    "scope": "foundation",
    "values": {
      "light": "275",
      "dark": "275"
    },
    "resolvedValues": {
      "light": "275",
      "dark": "275"
    }
  },
  {
    "path": "foundation.system.neutral-c",
    "type": "number",
    "description": "Near-neutral chroma used by optical OKLCH effects.",
    "deprecated": false,
    "cssVariable": "--whatiuse-neutral-c",
    "scope": "foundation",
    "values": {
      "light": "0.002",
      "dark": "0.002"
    },
    "resolvedValues": {
      "light": "0.002",
      "dark": "0.002"
    }
  },
  {
    "path": "foundation.system.sidebar-l",
    "type": "number",
    "description": "Reference lightness for translucent navigation surfaces.",
    "deprecated": false,
    "cssVariable": "--whatiuse-sidebar-l",
    "scope": "foundation",
    "values": {
      "light": "0.982",
      "dark": "0.982"
    },
    "resolvedValues": {
      "light": "0.982",
      "dark": "0.982"
    }
  },
  {
    "path": "foundation.system.stage-l",
    "type": "number",
    "description": "Reference lightness for specimen stages.",
    "deprecated": false,
    "cssVariable": "--whatiuse-stage-l",
    "scope": "foundation",
    "values": {
      "light": "0.986",
      "dark": "0.986"
    },
    "resolvedValues": {
      "light": "0.986",
      "dark": "0.986"
    }
  },
  {
    "path": "foundation.system.border-alpha",
    "type": "number",
    "description": "Reference opacity for low-contrast structural separators.",
    "deprecated": false,
    "cssVariable": "--whatiuse-border-alpha",
    "scope": "foundation",
    "values": {
      "light": "0.078",
      "dark": "0.078"
    },
    "resolvedValues": {
      "light": "0.078",
      "dark": "0.078"
    }
  },
  {
    "path": "foundation.typography.font-ui",
    "type": "fontFamily",
    "description": "Primary product and documentation font stack.",
    "deprecated": false,
    "cssVariable": "--whatiuse-font-ui",
    "scope": "foundation",
    "values": {
      "light": "\"Inter Variable\", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "dark": "\"Inter Variable\", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    },
    "resolvedValues": {
      "light": "\"Inter Variable\", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "dark": "\"Inter Variable\", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    }
  },
  {
    "path": "foundation.typography.font-code",
    "type": "fontFamily",
    "description": "Code and token value font stack.",
    "deprecated": false,
    "cssVariable": "--whatiuse-font-code",
    "scope": "foundation",
    "values": {
      "light": "SFMono-Regular, \"Geist Mono\", Consolas, \"Liberation Mono\", ui-monospace, monospace",
      "dark": "SFMono-Regular, \"Geist Mono\", Consolas, \"Liberation Mono\", ui-monospace, monospace"
    },
    "resolvedValues": {
      "light": "SFMono-Regular, \"Geist Mono\", Consolas, \"Liberation Mono\", ui-monospace, monospace",
      "dark": "SFMono-Regular, \"Geist Mono\", Consolas, \"Liberation Mono\", ui-monospace, monospace"
    }
  },
  {
    "path": "foundation.typography.sizes.type-metadata",
    "type": "dimension",
    "description": "Small supporting metadata with a persistent readability floor.",
    "deprecated": false,
    "cssVariable": "--whatiuse-type-metadata",
    "scope": "foundation",
    "values": {
      "light": "11.5px",
      "dark": "11.5px"
    },
    "resolvedValues": {
      "light": "11.5px",
      "dark": "11.5px"
    }
  },
  {
    "path": "foundation.typography.sizes.type-label",
    "type": "dimension",
    "description": "Persistent navigation and field labels.",
    "deprecated": false,
    "cssVariable": "--whatiuse-type-label",
    "scope": "foundation",
    "values": {
      "light": "12px",
      "dark": "12px"
    },
    "resolvedValues": {
      "light": "12px",
      "dark": "12px"
    }
  },
  {
    "path": "foundation.typography.sizes.type-ui",
    "type": "dimension",
    "description": "Default compact control and product interface text.",
    "deprecated": false,
    "cssVariable": "--whatiuse-type-ui",
    "scope": "foundation",
    "values": {
      "light": "13.5px",
      "dark": "13.5px"
    },
    "resolvedValues": {
      "light": "13.5px",
      "dark": "13.5px"
    }
  },
  {
    "path": "foundation.typography.sizes.type-body",
    "type": "dimension",
    "description": "Documentation body copy.",
    "deprecated": false,
    "cssVariable": "--whatiuse-type-body",
    "scope": "foundation",
    "values": {
      "light": "14.5px",
      "dark": "14.5px"
    },
    "resolvedValues": {
      "light": "14.5px",
      "dark": "14.5px"
    }
  },
  {
    "path": "foundation.typography.sizes.type-row",
    "type": "dimension",
    "description": "High-salience labels in dense product rows.",
    "deprecated": false,
    "cssVariable": "--whatiuse-type-row",
    "scope": "foundation",
    "values": {
      "light": "14.5px",
      "dark": "14.5px"
    },
    "resolvedValues": {
      "light": "14.5px",
      "dark": "14.5px"
    }
  },
  {
    "path": "foundation.typography.sizes.type-section",
    "type": "dimension",
    "description": "Documentation section heading.",
    "deprecated": false,
    "cssVariable": "--whatiuse-type-section",
    "scope": "foundation",
    "values": {
      "light": "20px",
      "dark": "20px"
    },
    "resolvedValues": {
      "light": "20px",
      "dark": "20px"
    }
  },
  {
    "path": "foundation.typography.sizes.type-title",
    "type": "dimension",
    "description": "Page title for deep documentation routes.",
    "deprecated": false,
    "cssVariable": "--whatiuse-type-title",
    "scope": "foundation",
    "values": {
      "light": "32px",
      "dark": "32px"
    },
    "resolvedValues": {
      "light": "32px",
      "dark": "32px"
    }
  },
  {
    "path": "foundation.typography.sizes.line-metadata",
    "type": "dimension",
    "description": "Metadata line height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-line-metadata",
    "scope": "foundation",
    "values": {
      "light": "16px",
      "dark": "16px"
    },
    "resolvedValues": {
      "light": "16px",
      "dark": "16px"
    }
  },
  {
    "path": "foundation.typography.sizes.line-label",
    "type": "dimension",
    "description": "Label line height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-line-label",
    "scope": "foundation",
    "values": {
      "light": "16px",
      "dark": "16px"
    },
    "resolvedValues": {
      "light": "16px",
      "dark": "16px"
    }
  },
  {
    "path": "foundation.typography.sizes.line-ui",
    "type": "dimension",
    "description": "Compact control line height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-line-ui",
    "scope": "foundation",
    "values": {
      "light": "18px",
      "dark": "18px"
    },
    "resolvedValues": {
      "light": "18px",
      "dark": "18px"
    }
  },
  {
    "path": "foundation.typography.sizes.line-row",
    "type": "dimension",
    "description": "Dense product row line height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-line-row",
    "scope": "foundation",
    "values": {
      "light": "20px",
      "dark": "20px"
    },
    "resolvedValues": {
      "light": "20px",
      "dark": "20px"
    }
  },
  {
    "path": "foundation.typography.sizes.line-body",
    "type": "dimension",
    "description": "Documentation reading line height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-line-body",
    "scope": "foundation",
    "values": {
      "light": "23px",
      "dark": "23px"
    },
    "resolvedValues": {
      "light": "23px",
      "dark": "23px"
    }
  },
  {
    "path": "foundation.typography.sizes.line-section",
    "type": "dimension",
    "description": "Section heading line height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-line-section",
    "scope": "foundation",
    "values": {
      "light": "26px",
      "dark": "26px"
    },
    "resolvedValues": {
      "light": "26px",
      "dark": "26px"
    }
  },
  {
    "path": "foundation.typography.sizes.line-title",
    "type": "dimension",
    "description": "Page title line height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-line-title",
    "scope": "foundation",
    "values": {
      "light": "36px",
      "dark": "36px"
    },
    "resolvedValues": {
      "light": "36px",
      "dark": "36px"
    }
  },
  {
    "path": "foundation.typography.ui-weight",
    "type": "fontWeight",
    "description": "Optical default weight for Inter Variable controls.",
    "deprecated": false,
    "cssVariable": "--whatiuse-ui-weight",
    "scope": "foundation",
    "values": {
      "light": "470",
      "dark": "470"
    },
    "resolvedValues": {
      "light": "470",
      "dark": "470"
    }
  },
  {
    "path": "foundation.typography.label-weight",
    "type": "fontWeight",
    "description": "Compact labels and field hierarchy.",
    "deprecated": false,
    "cssVariable": "--whatiuse-label-weight",
    "scope": "foundation",
    "values": {
      "light": "560",
      "dark": "560"
    },
    "resolvedValues": {
      "light": "560",
      "dark": "560"
    }
  },
  {
    "path": "foundation.typography.heading-weight",
    "type": "fontWeight",
    "description": "Page and section headings.",
    "deprecated": false,
    "cssVariable": "--whatiuse-heading-weight",
    "scope": "foundation",
    "values": {
      "light": "580",
      "dark": "580"
    },
    "resolvedValues": {
      "light": "580",
      "dark": "580"
    }
  },
  {
    "path": "foundation.typography.ui-tracking",
    "type": "number",
    "description": "Compact UI letter spacing expressed as an em ratio.",
    "deprecated": false,
    "cssVariable": "--whatiuse-ui-tracking",
    "scope": "foundation",
    "values": {
      "light": "-0.012em",
      "dark": "-0.012em"
    },
    "resolvedValues": {
      "light": "-0.012em",
      "dark": "-0.012em"
    }
  },
  {
    "path": "foundation.layout.space-0",
    "type": "dimension",
    "description": "Zero-space reset.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-0",
    "scope": "foundation",
    "values": {
      "light": "0px",
      "dark": "0px"
    },
    "resolvedValues": {
      "light": "0px",
      "dark": "0px"
    }
  },
  {
    "path": "foundation.layout.space-1",
    "type": "dimension",
    "description": "One base spacing unit.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-1",
    "scope": "foundation",
    "values": {
      "light": "4px",
      "dark": "4px"
    },
    "resolvedValues": {
      "light": "4px",
      "dark": "4px"
    }
  },
  {
    "path": "foundation.layout.space-2",
    "type": "dimension",
    "description": "Two base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-2",
    "scope": "foundation",
    "values": {
      "light": "8px",
      "dark": "8px"
    },
    "resolvedValues": {
      "light": "8px",
      "dark": "8px"
    }
  },
  {
    "path": "foundation.layout.space-3",
    "type": "dimension",
    "description": "Three base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-3",
    "scope": "foundation",
    "values": {
      "light": "12px",
      "dark": "12px"
    },
    "resolvedValues": {
      "light": "12px",
      "dark": "12px"
    }
  },
  {
    "path": "foundation.layout.space-4",
    "type": "dimension",
    "description": "Four base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-4",
    "scope": "foundation",
    "values": {
      "light": "16px",
      "dark": "16px"
    },
    "resolvedValues": {
      "light": "16px",
      "dark": "16px"
    }
  },
  {
    "path": "foundation.layout.space-5",
    "type": "dimension",
    "description": "Five base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-5",
    "scope": "foundation",
    "values": {
      "light": "20px",
      "dark": "20px"
    },
    "resolvedValues": {
      "light": "20px",
      "dark": "20px"
    }
  },
  {
    "path": "foundation.layout.space-6",
    "type": "dimension",
    "description": "Six base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-6",
    "scope": "foundation",
    "values": {
      "light": "24px",
      "dark": "24px"
    },
    "resolvedValues": {
      "light": "24px",
      "dark": "24px"
    }
  },
  {
    "path": "foundation.layout.space-7",
    "type": "dimension",
    "description": "Seven base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-7",
    "scope": "foundation",
    "values": {
      "light": "28px",
      "dark": "28px"
    },
    "resolvedValues": {
      "light": "28px",
      "dark": "28px"
    }
  },
  {
    "path": "foundation.layout.space-8",
    "type": "dimension",
    "description": "Eight base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-8",
    "scope": "foundation",
    "values": {
      "light": "32px",
      "dark": "32px"
    },
    "resolvedValues": {
      "light": "32px",
      "dark": "32px"
    }
  },
  {
    "path": "foundation.layout.space-10",
    "type": "dimension",
    "description": "Ten base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-10",
    "scope": "foundation",
    "values": {
      "light": "40px",
      "dark": "40px"
    },
    "resolvedValues": {
      "light": "40px",
      "dark": "40px"
    }
  },
  {
    "path": "foundation.layout.space-12",
    "type": "dimension",
    "description": "Twelve base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-12",
    "scope": "foundation",
    "values": {
      "light": "48px",
      "dark": "48px"
    },
    "resolvedValues": {
      "light": "48px",
      "dark": "48px"
    }
  },
  {
    "path": "foundation.layout.space-16",
    "type": "dimension",
    "description": "Sixteen base spacing units.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-16",
    "scope": "foundation",
    "values": {
      "light": "64px",
      "dark": "64px"
    },
    "resolvedValues": {
      "light": "64px",
      "dark": "64px"
    }
  },
  {
    "path": "foundation.layout.space-page-x",
    "type": "dimension",
    "description": "Default horizontal documentation inset.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-page-x",
    "scope": "foundation",
    "values": {
      "light": "28px",
      "dark": "28px"
    },
    "resolvedValues": {
      "light": "28px",
      "dark": "28px"
    }
  },
  {
    "path": "foundation.layout.space-page-y",
    "type": "dimension",
    "description": "Default vertical documentation inset.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-page-y",
    "scope": "foundation",
    "values": {
      "light": "24px",
      "dark": "24px"
    },
    "resolvedValues": {
      "light": "24px",
      "dark": "24px"
    }
  },
  {
    "path": "foundation.layout.space-section",
    "type": "dimension",
    "description": "Primary vertical rhythm between documentation sections.",
    "deprecated": false,
    "cssVariable": "--whatiuse-space-section",
    "scope": "foundation",
    "values": {
      "light": "22px",
      "dark": "22px"
    },
    "resolvedValues": {
      "light": "22px",
      "dark": "22px"
    }
  },
  {
    "path": "foundation.layout.icon-size",
    "type": "dimension",
    "description": "Default icon box for compact controls.",
    "deprecated": false,
    "cssVariable": "--whatiuse-icon-size",
    "scope": "foundation",
    "values": {
      "light": "14px",
      "dark": "14px"
    },
    "resolvedValues": {
      "light": "14px",
      "dark": "14px"
    }
  },
  {
    "path": "foundation.layout.icon-offset-y",
    "type": "dimension",
    "description": "Optical vertical correction for the default icon family.",
    "deprecated": false,
    "cssVariable": "--whatiuse-icon-offset-y",
    "scope": "foundation",
    "values": {
      "light": "0px",
      "dark": "0px"
    },
    "resolvedValues": {
      "light": "0px",
      "dark": "0px"
    }
  },
  {
    "path": "foundation.layout.control-height-sm",
    "type": "dimension",
    "description": "Small compact control height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-height-sm",
    "scope": "foundation",
    "values": {
      "light": "28px",
      "dark": "28px"
    },
    "resolvedValues": {
      "light": "28px",
      "dark": "28px"
    }
  },
  {
    "path": "foundation.layout.control-height-md",
    "type": "dimension",
    "description": "Default compact control height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-height-md",
    "scope": "foundation",
    "values": {
      "light": "32px",
      "dark": "32px"
    },
    "resolvedValues": {
      "light": "32px",
      "dark": "32px"
    }
  },
  {
    "path": "foundation.layout.control-height-lg",
    "type": "dimension",
    "description": "Large compact control height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-height-lg",
    "scope": "foundation",
    "values": {
      "light": "36px",
      "dark": "36px"
    },
    "resolvedValues": {
      "light": "36px",
      "dark": "36px"
    }
  },
  {
    "path": "foundation.layout.control-padding-sm",
    "type": "dimension",
    "description": "Horizontal inset for small controls.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-padding-sm",
    "scope": "foundation",
    "values": {
      "light": "8px",
      "dark": "8px"
    },
    "resolvedValues": {
      "light": "8px",
      "dark": "8px"
    }
  },
  {
    "path": "foundation.layout.control-padding-md",
    "type": "dimension",
    "description": "Horizontal inset for default controls.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-padding-md",
    "scope": "foundation",
    "values": {
      "light": "10px",
      "dark": "10px"
    },
    "resolvedValues": {
      "light": "10px",
      "dark": "10px"
    }
  },
  {
    "path": "foundation.layout.control-padding-lg",
    "type": "dimension",
    "description": "Horizontal inset for large controls.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-padding-lg",
    "scope": "foundation",
    "values": {
      "light": "12px",
      "dark": "12px"
    },
    "resolvedValues": {
      "light": "12px",
      "dark": "12px"
    }
  },
  {
    "path": "foundation.layout.radius-control",
    "type": "dimension",
    "description": "Compact control radius.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-control",
    "scope": "foundation",
    "values": {
      "light": "6px",
      "dark": "6px"
    },
    "resolvedValues": {
      "light": "6px",
      "dark": "6px"
    }
  },
  {
    "path": "foundation.layout.radius-container",
    "type": "dimension",
    "description": "Persistent surface and specimen radius.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-container",
    "scope": "foundation",
    "values": {
      "light": "8px",
      "dark": "8px"
    },
    "resolvedValues": {
      "light": "8px",
      "dark": "8px"
    }
  },
  {
    "path": "foundation.layout.radius-overlay",
    "type": "dimension",
    "description": "Temporary overlay radius.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-overlay",
    "scope": "foundation",
    "values": {
      "light": "10px",
      "dark": "10px"
    },
    "resolvedValues": {
      "light": "10px",
      "dark": "10px"
    }
  },
  {
    "path": "foundation.layout.radius-pill",
    "type": "dimension",
    "description": "Fully rounded status and segmented shape.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-pill",
    "scope": "foundation",
    "values": {
      "light": "999px",
      "dark": "999px"
    },
    "resolvedValues": {
      "light": "999px",
      "dark": "999px"
    }
  },
  {
    "path": "foundation.layout.row-height-menu",
    "type": "dimension",
    "description": "Menu and action row minimum height.",
    "deprecated": false,
    "cssVariable": "--whatiuse-row-height-menu",
    "scope": "foundation",
    "values": {
      "light": "30px",
      "dark": "30px"
    },
    "resolvedValues": {
      "light": "30px",
      "dark": "30px"
    }
  },
  {
    "path": "foundation.layout.row-height-table",
    "type": "dimension",
    "description": "Default compact table row height with room for two-line identity content.",
    "deprecated": false,
    "cssVariable": "--whatiuse-row-height-table",
    "scope": "foundation",
    "values": {
      "light": "46px",
      "dark": "46px"
    },
    "resolvedValues": {
      "light": "46px",
      "dark": "46px"
    }
  },
  {
    "path": "foundation.layout.focus-width",
    "type": "dimension",
    "description": "Default visible focus indicator width.",
    "deprecated": false,
    "cssVariable": "--whatiuse-focus-width",
    "scope": "foundation",
    "values": {
      "light": "2px",
      "dark": "2px"
    },
    "resolvedValues": {
      "light": "2px",
      "dark": "2px"
    }
  },
  {
    "path": "foundation.layout.focus-offset",
    "type": "dimension",
    "description": "Default separation between a control and its focus indicator.",
    "deprecated": false,
    "cssVariable": "--whatiuse-focus-offset",
    "scope": "foundation",
    "values": {
      "light": "1px",
      "dark": "1px"
    },
    "resolvedValues": {
      "light": "1px",
      "dark": "1px"
    }
  },
  {
    "path": "foundation.layout.radius-xs",
    "type": "dimension",
    "description": "Tight utility radius.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-xs",
    "scope": "foundation",
    "values": {
      "light": "4px",
      "dark": "4px"
    },
    "resolvedValues": {
      "light": "4px",
      "dark": "4px"
    }
  },
  {
    "path": "foundation.layout.radius-sm",
    "type": "dimension",
    "description": "Alias for the compact control radius.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-sm",
    "scope": "foundation",
    "values": {
      "light": "var(--whatiuse-radius-control)",
      "dark": "var(--whatiuse-radius-control)"
    },
    "resolvedValues": {
      "light": "6px",
      "dark": "6px"
    }
  },
  {
    "path": "foundation.layout.radius-md",
    "type": "dimension",
    "description": "Alias for the persistent container radius.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-md",
    "scope": "foundation",
    "values": {
      "light": "var(--whatiuse-radius-container)",
      "dark": "var(--whatiuse-radius-container)"
    },
    "resolvedValues": {
      "light": "8px",
      "dark": "8px"
    }
  },
  {
    "path": "foundation.layout.radius-lg",
    "type": "dimension",
    "description": "Alias for the temporary overlay radius.",
    "deprecated": false,
    "cssVariable": "--whatiuse-radius-lg",
    "scope": "foundation",
    "values": {
      "light": "var(--whatiuse-radius-overlay)",
      "dark": "var(--whatiuse-radius-overlay)"
    },
    "resolvedValues": {
      "light": "10px",
      "dark": "10px"
    }
  },
  {
    "path": "foundation.motion.duration.hover-duration",
    "type": "duration",
    "description": "Frequent hover and color feedback.",
    "deprecated": false,
    "cssVariable": "--whatiuse-hover-duration",
    "scope": "foundation",
    "values": {
      "light": "120ms",
      "dark": "120ms"
    },
    "resolvedValues": {
      "light": "120ms",
      "dark": "120ms"
    }
  },
  {
    "path": "foundation.motion.duration.press-duration",
    "type": "duration",
    "description": "Immediate press and release feedback.",
    "deprecated": false,
    "cssVariable": "--whatiuse-press-duration",
    "scope": "foundation",
    "values": {
      "light": "110ms",
      "dark": "110ms"
    },
    "resolvedValues": {
      "light": "110ms",
      "dark": "110ms"
    }
  },
  {
    "path": "foundation.motion.duration.enter-duration",
    "type": "duration",
    "description": "Occasional small overlay entrance.",
    "deprecated": false,
    "cssVariable": "--whatiuse-enter-duration",
    "scope": "foundation",
    "values": {
      "light": "180ms",
      "dark": "180ms"
    },
    "resolvedValues": {
      "light": "180ms",
      "dark": "180ms"
    }
  },
  {
    "path": "foundation.motion.duration.exit-duration",
    "type": "duration",
    "description": "Faster small overlay exit.",
    "deprecated": false,
    "cssVariable": "--whatiuse-exit-duration",
    "scope": "foundation",
    "values": {
      "light": "120ms",
      "dark": "120ms"
    },
    "resolvedValues": {
      "light": "120ms",
      "dark": "120ms"
    }
  },
  {
    "path": "foundation.motion.duration.fast",
    "type": "duration",
    "description": "Compatibility alias for frequent feedback.",
    "deprecated": false,
    "cssVariable": "--whatiuse-fast",
    "scope": "foundation",
    "values": {
      "light": "var(--whatiuse-hover-duration)",
      "dark": "var(--whatiuse-hover-duration)"
    },
    "resolvedValues": {
      "light": "120ms",
      "dark": "120ms"
    }
  },
  {
    "path": "foundation.motion.duration.medium",
    "type": "duration",
    "description": "Compatibility alias for occasional entrance motion.",
    "deprecated": false,
    "cssVariable": "--whatiuse-medium",
    "scope": "foundation",
    "values": {
      "light": "var(--whatiuse-enter-duration)",
      "dark": "var(--whatiuse-enter-duration)"
    },
    "resolvedValues": {
      "light": "180ms",
      "dark": "180ms"
    }
  },
  {
    "path": "foundation.motion.easing.ease-out",
    "type": "cubicBezier",
    "description": "Responsive entrance and direct-manipulation feedback.",
    "deprecated": false,
    "cssVariable": "--whatiuse-ease-out",
    "scope": "foundation",
    "values": {
      "light": "cubic-bezier(0.23, 1, 0.32, 1)",
      "dark": "cubic-bezier(0.23, 1, 0.32, 1)"
    },
    "resolvedValues": {
      "light": "cubic-bezier(0.23, 1, 0.32, 1)",
      "dark": "cubic-bezier(0.23, 1, 0.32, 1)"
    }
  },
  {
    "path": "foundation.motion.easing.ease-in-out",
    "type": "cubicBezier",
    "description": "On-screen movement between two visible positions.",
    "deprecated": false,
    "cssVariable": "--whatiuse-ease-in-out",
    "scope": "foundation",
    "values": {
      "light": "cubic-bezier(0.77, 0, 0.175, 1)",
      "dark": "cubic-bezier(0.77, 0, 0.175, 1)"
    },
    "resolvedValues": {
      "light": "cubic-bezier(0.77, 0, 0.175, 1)",
      "dark": "cubic-bezier(0.77, 0, 0.175, 1)"
    }
  },
  {
    "path": "foundation.motion.easing.ease-drawer",
    "type": "cubicBezier",
    "description": "Interruptible drawer and shared-detail travel.",
    "deprecated": false,
    "cssVariable": "--whatiuse-ease-drawer",
    "scope": "foundation",
    "values": {
      "light": "cubic-bezier(0.32, 0.72, 0, 1)",
      "dark": "cubic-bezier(0.32, 0.72, 0, 1)"
    },
    "resolvedValues": {
      "light": "cubic-bezier(0.32, 0.72, 0, 1)",
      "dark": "cubic-bezier(0.32, 0.72, 0, 1)"
    }
  },
  {
    "path": "foundation.motion.easing.ease",
    "type": "cubicBezier",
    "description": "Compatibility alias for the system ease-out curve.",
    "deprecated": false,
    "cssVariable": "--whatiuse-ease",
    "scope": "foundation",
    "values": {
      "light": "var(--whatiuse-ease-out)",
      "dark": "var(--whatiuse-ease-out)"
    },
    "resolvedValues": {
      "light": "cubic-bezier(0.23, 1, 0.32, 1)",
      "dark": "cubic-bezier(0.23, 1, 0.32, 1)"
    }
  },
  {
    "path": "foundation.layers.layer-sticky",
    "type": "number",
    "description": "Sticky content within the document canvas.",
    "deprecated": false,
    "cssVariable": "--whatiuse-layer-sticky",
    "scope": "foundation",
    "values": {
      "light": "20",
      "dark": "20"
    },
    "resolvedValues": {
      "light": "20",
      "dark": "20"
    }
  },
  {
    "path": "foundation.layers.layer-modal-backdrop",
    "type": "number",
    "description": "Focus-trapping modal scrim.",
    "deprecated": false,
    "cssVariable": "--whatiuse-layer-modal-backdrop",
    "scope": "foundation",
    "values": {
      "light": "100",
      "dark": "100"
    },
    "resolvedValues": {
      "light": "100",
      "dark": "100"
    }
  },
  {
    "path": "foundation.layers.layer-modal",
    "type": "number",
    "description": "Focus-trapping task surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-layer-modal",
    "scope": "foundation",
    "values": {
      "light": "110",
      "dark": "110"
    },
    "resolvedValues": {
      "light": "110",
      "dark": "110"
    }
  },
  {
    "path": "foundation.layers.layer-flyout",
    "type": "number",
    "description": "Anchored temporary surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-layer-flyout",
    "scope": "foundation",
    "values": {
      "light": "120",
      "dark": "120"
    },
    "resolvedValues": {
      "light": "120",
      "dark": "120"
    }
  },
  {
    "path": "foundation.layers.layer-toast",
    "type": "number",
    "description": "Highest non-navigation feedback layer.",
    "deprecated": false,
    "cssVariable": "--whatiuse-layer-toast",
    "scope": "foundation",
    "values": {
      "light": "130",
      "dark": "130"
    },
    "resolvedValues": {
      "light": "130",
      "dark": "130"
    }
  },
  {
    "path": "foundation.layers.layer-navigation",
    "type": "number",
    "description": "Persistent application navigation and mobile drawer.",
    "deprecated": false,
    "cssVariable": "--whatiuse-layer-navigation",
    "scope": "foundation",
    "values": {
      "light": "150",
      "dark": "150"
    },
    "resolvedValues": {
      "light": "150",
      "dark": "150"
    }
  },
  {
    "path": "theme.palette.gray-50",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-50",
    "scope": "theme",
    "values": {
      "light": "#f7f7f8",
      "dark": "#111112"
    },
    "resolvedValues": {
      "light": "#f7f7f8",
      "dark": "#111112"
    }
  },
  {
    "path": "theme.palette.gray-100",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-100",
    "scope": "theme",
    "values": {
      "light": "#f2f2f3",
      "dark": "#171718"
    },
    "resolvedValues": {
      "light": "#f2f2f3",
      "dark": "#171718"
    }
  },
  {
    "path": "theme.palette.gray-200",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-200",
    "scope": "theme",
    "values": {
      "light": "#e5e5e7",
      "dark": "#222224"
    },
    "resolvedValues": {
      "light": "#e5e5e7",
      "dark": "#222224"
    }
  },
  {
    "path": "theme.palette.gray-300",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-300",
    "scope": "theme",
    "values": {
      "light": "#d1d1d4",
      "dark": "#323235"
    },
    "resolvedValues": {
      "light": "#d1d1d4",
      "dark": "#323235"
    }
  },
  {
    "path": "theme.palette.gray-400",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-400",
    "scope": "theme",
    "values": {
      "light": "#aeaeb1",
      "dark": "#555559"
    },
    "resolvedValues": {
      "light": "#aeaeb1",
      "dark": "#555559"
    }
  },
  {
    "path": "theme.palette.gray-500",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-500",
    "scope": "theme",
    "values": {
      "light": "#8e8e93",
      "dark": "#85858b"
    },
    "resolvedValues": {
      "light": "#8e8e93",
      "dark": "#85858b"
    }
  },
  {
    "path": "theme.palette.gray-600",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-600",
    "scope": "theme",
    "values": {
      "light": "#636366",
      "dark": "#b4b4ba"
    },
    "resolvedValues": {
      "light": "#636366",
      "dark": "#b4b4ba"
    }
  },
  {
    "path": "theme.palette.gray-700",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-700",
    "scope": "theme",
    "values": {
      "light": "#48484a",
      "dark": "#d1d1d5"
    },
    "resolvedValues": {
      "light": "#48484a",
      "dark": "#d1d1d5"
    }
  },
  {
    "path": "theme.palette.gray-800",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-800",
    "scope": "theme",
    "values": {
      "light": "#2c2c2e",
      "dark": "#e5e5e8"
    },
    "resolvedValues": {
      "light": "#2c2c2e",
      "dark": "#e5e5e8"
    }
  },
  {
    "path": "theme.palette.gray-900",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-gray-900",
    "scope": "theme",
    "values": {
      "light": "#1c1c1e",
      "dark": "#f2f2f4"
    },
    "resolvedValues": {
      "light": "#1c1c1e",
      "dark": "#f2f2f4"
    }
  },
  {
    "path": "theme.surface.bg-canvas",
    "type": "color",
    "description": "Application and documentation canvas.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-canvas",
    "scope": "theme",
    "values": {
      "light": "#ffffff",
      "dark": "#0e0e0f"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#0e0e0f"
    }
  },
  {
    "path": "theme.surface.bg-sidebar",
    "type": "color",
    "description": "Translucent persistent navigation surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-sidebar",
    "scope": "theme",
    "values": {
      "light": "rgb(247 247 248 / 0.9)",
      "dark": "rgb(16 16 17 / 0.92)"
    },
    "resolvedValues": {
      "light": "rgb(247 247 248 / 0.9)",
      "dark": "rgb(16 16 17 / 0.92)"
    }
  },
  {
    "path": "theme.surface.bg-stage",
    "type": "color",
    "description": "Quiet preview and product-state stage.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-stage",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.026)",
      "dark": "rgb(255 255 255 / 0.035)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.026)",
      "dark": "rgb(255 255 255 / 0.035)"
    }
  },
  {
    "path": "theme.surface.bg-subtle",
    "type": "color",
    "description": "Selected rows and low-emphasis grouped surfaces.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-subtle",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.043)",
      "dark": "rgb(255 255 255 / 0.056)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.043)",
      "dark": "rgb(255 255 255 / 0.056)"
    }
  },
  {
    "path": "theme.surface.bg-surface",
    "type": "color",
    "description": "Persistent composition surface above the canvas.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-surface",
    "scope": "theme",
    "values": {
      "light": "rgb(255 255 255 / 0.94)",
      "dark": "#141415"
    },
    "resolvedValues": {
      "light": "rgb(255 255 255 / 0.94)",
      "dark": "#141415"
    }
  },
  {
    "path": "theme.surface.bg-control",
    "type": "color",
    "description": "Compact control fill.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-control",
    "scope": "theme",
    "values": {
      "light": "rgb(255 255 255 / 0.98)",
      "dark": "#1a1a1c"
    },
    "resolvedValues": {
      "light": "rgb(255 255 255 / 0.98)",
      "dark": "#1a1a1c"
    }
  },
  {
    "path": "theme.surface.bg-raised",
    "type": "color",
    "description": "Persistent raised Float surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-raised",
    "scope": "theme",
    "values": {
      "light": "#ffffff",
      "dark": "#1e1e20"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#1e1e20"
    }
  },
  {
    "path": "theme.surface.bg-overlay",
    "type": "color",
    "description": "Base temporary overlay surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-overlay",
    "scope": "theme",
    "values": {
      "light": "#ffffff",
      "dark": "#222225"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#222225"
    }
  },
  {
    "path": "theme.surface.bg-float",
    "type": "color",
    "description": "Public Float elevation role.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-float",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-raised)",
      "dark": "var(--whatiuse-bg-raised)"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#1e1e20"
    }
  },
  {
    "path": "theme.surface.bg-flyout",
    "type": "color",
    "description": "Anchored temporary Flyout surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-flyout",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-overlay)",
      "dark": "#262629"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#262629"
    }
  },
  {
    "path": "theme.surface.bg-modal",
    "type": "color",
    "description": "Focus-trapping Modal surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-modal",
    "scope": "theme",
    "values": {
      "light": "#ffffff",
      "dark": "var(--whatiuse-bg-overlay)"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#222225"
    }
  },
  {
    "path": "theme.surface.bg-scrim",
    "type": "color",
    "description": "Modal and drawer background attenuation.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-scrim",
    "scope": "theme",
    "values": {
      "light": "rgb(0 0 0 / 0.18)",
      "dark": "rgb(0 0 0 / 0.44)"
    },
    "resolvedValues": {
      "light": "rgb(0 0 0 / 0.18)",
      "dark": "rgb(0 0 0 / 0.44)"
    }
  },
  {
    "path": "theme.surface.bg-code",
    "type": "color",
    "description": "Collapsed and expanded source-code surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-bg-code",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.02)",
      "dark": "rgb(255 255 255 / 0.025)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.02)",
      "dark": "rgb(255 255 255 / 0.025)"
    }
  },
  {
    "path": "theme.surface.canvas",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-canvas",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-canvas)",
      "dark": "var(--whatiuse-bg-canvas)"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#0e0e0f"
    }
  },
  {
    "path": "theme.surface.sidebar",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-sidebar",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-sidebar)",
      "dark": "var(--whatiuse-bg-sidebar)"
    },
    "resolvedValues": {
      "light": "rgb(247 247 248 / 0.9)",
      "dark": "rgb(16 16 17 / 0.92)"
    }
  },
  {
    "path": "theme.surface.surface",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-surface",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-surface)",
      "dark": "var(--whatiuse-bg-surface)"
    },
    "resolvedValues": {
      "light": "rgb(255 255 255 / 0.94)",
      "dark": "#141415"
    }
  },
  {
    "path": "theme.surface.control-surface",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-surface",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-control)",
      "dark": "var(--whatiuse-bg-control)"
    },
    "resolvedValues": {
      "light": "rgb(255 255 255 / 0.98)",
      "dark": "#1a1a1c"
    }
  },
  {
    "path": "theme.surface.elevated-surface",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-elevated-surface",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-raised)",
      "dark": "var(--whatiuse-bg-raised)"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#1e1e20"
    }
  },
  {
    "path": "theme.surface.overlay-surface",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-overlay-surface",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-overlay)",
      "dark": "var(--whatiuse-bg-overlay)"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#222225"
    }
  },
  {
    "path": "theme.surface.code-surface",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-code-surface",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-code)",
      "dark": "var(--whatiuse-bg-code)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.02)",
      "dark": "rgb(255 255 255 / 0.025)"
    }
  },
  {
    "path": "theme.surface.stage",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-stage",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-stage)",
      "dark": "var(--whatiuse-bg-stage)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.026)",
      "dark": "rgb(255 255 255 / 0.035)"
    }
  },
  {
    "path": "theme.surface.subtle",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-subtle",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-bg-subtle)",
      "dark": "var(--whatiuse-bg-subtle)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.043)",
      "dark": "rgb(255 255 255 / 0.056)"
    }
  },
  {
    "path": "theme.surface.hover",
    "type": "color",
    "description": "Frequent pointer hover feedback.",
    "deprecated": false,
    "cssVariable": "--whatiuse-hover",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.048)",
      "dark": "rgb(255 255 255 / 0.064)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.048)",
      "dark": "rgb(255 255 255 / 0.064)"
    }
  },
  {
    "path": "theme.surface.active",
    "type": "color",
    "description": "Pressed or actively manipulated fill.",
    "deprecated": false,
    "cssVariable": "--whatiuse-active",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.088)",
      "dark": "rgb(255 255 255 / 0.112)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.088)",
      "dark": "rgb(255 255 255 / 0.112)"
    }
  },
  {
    "path": "theme.surface.selected",
    "type": "color",
    "description": "Persistent selected-row fill.",
    "deprecated": false,
    "cssVariable": "--whatiuse-selected",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.068)",
      "dark": "rgb(255 255 255 / 0.088)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.068)",
      "dark": "rgb(255 255 255 / 0.088)"
    }
  },
  {
    "path": "theme.surface.inverse",
    "type": "color",
    "description": "Primary monochrome action fill.",
    "deprecated": false,
    "cssVariable": "--whatiuse-inverse",
    "scope": "theme",
    "values": {
      "light": "#171719",
      "dark": "#f1f3f4"
    },
    "resolvedValues": {
      "light": "#171719",
      "dark": "#f1f3f4"
    }
  },
  {
    "path": "theme.surface.inverse-hover",
    "type": "color",
    "description": "Primary action hover fill.",
    "deprecated": false,
    "cssVariable": "--whatiuse-inverse-hover",
    "scope": "theme",
    "values": {
      "light": "#262629",
      "dark": "#e2e5e7"
    },
    "resolvedValues": {
      "light": "#262629",
      "dark": "#e2e5e7"
    }
  },
  {
    "path": "theme.surface.on-inverse",
    "type": "color",
    "description": "Text and icon color on inverse actions.",
    "deprecated": false,
    "cssVariable": "--whatiuse-on-inverse",
    "scope": "theme",
    "values": {
      "light": "#f8f8f8",
      "dark": "#111315"
    },
    "resolvedValues": {
      "light": "#f8f8f8",
      "dark": "#111315"
    }
  },
  {
    "path": "theme.surface.scrollbar-thumb",
    "type": "color",
    "description": "Monochrome scrollbar thumb.",
    "deprecated": false,
    "cssVariable": "--whatiuse-scrollbar-thumb",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.18)",
      "dark": "rgb(255 255 255 / 0.2)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.18)",
      "dark": "rgb(255 255 255 / 0.2)"
    }
  },
  {
    "path": "theme.surface.scrollbar-thumb-hover",
    "type": "color",
    "description": "Scrollbar thumb hover state.",
    "deprecated": false,
    "cssVariable": "--whatiuse-scrollbar-thumb-hover",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.3)",
      "dark": "rgb(255 255 255 / 0.34)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.3)",
      "dark": "rgb(255 255 255 / 0.34)"
    }
  },
  {
    "path": "theme.foreground.fg-default",
    "type": "color",
    "description": "Primary text and icon color.",
    "deprecated": false,
    "cssVariable": "--whatiuse-fg-default",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-gray-900)",
      "dark": "var(--whatiuse-gray-900)"
    },
    "resolvedValues": {
      "light": "#1c1c1e",
      "dark": "#f2f2f4"
    }
  },
  {
    "path": "theme.foreground.fg-muted",
    "type": "color",
    "description": "Secondary explanatory text.",
    "deprecated": false,
    "cssVariable": "--whatiuse-fg-muted",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-gray-600)",
      "dark": "var(--whatiuse-gray-600)"
    },
    "resolvedValues": {
      "light": "#636366",
      "dark": "#b4b4ba"
    }
  },
  {
    "path": "theme.foreground.fg-subtle",
    "type": "color",
    "description": "Tertiary metadata and quiet labels.",
    "deprecated": false,
    "cssVariable": "--whatiuse-fg-subtle",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-gray-600)",
      "dark": "#8e8e93"
    },
    "resolvedValues": {
      "light": "#636366",
      "dark": "#8e8e93"
    }
  },
  {
    "path": "theme.foreground.fg-disabled",
    "type": "color",
    "description": "Unavailable control content.",
    "deprecated": false,
    "cssVariable": "--whatiuse-fg-disabled",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-gray-400)",
      "dark": "var(--whatiuse-gray-400)"
    },
    "resolvedValues": {
      "light": "#aeaeb1",
      "dark": "#555559"
    }
  },
  {
    "path": "theme.foreground.fg-danger",
    "type": "color",
    "description": "Accessible semantic foreground for invalid values, errors, destructive actions, and critical feedback.",
    "deprecated": false,
    "cssVariable": "--whatiuse-fg-danger",
    "scope": "theme",
    "values": {
      "light": "#d70015",
      "dark": "#ff453a"
    },
    "resolvedValues": {
      "light": "#d70015",
      "dark": "#ff453a"
    }
  },
  {
    "path": "theme.foreground.ink",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-ink",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-fg-default)",
      "dark": "var(--whatiuse-fg-default)"
    },
    "resolvedValues": {
      "light": "#1c1c1e",
      "dark": "#f2f2f4"
    }
  },
  {
    "path": "theme.foreground.ink-secondary",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-ink-secondary",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-fg-muted)",
      "dark": "var(--whatiuse-fg-muted)"
    },
    "resolvedValues": {
      "light": "#636366",
      "dark": "#b4b4ba"
    }
  },
  {
    "path": "theme.foreground.ink-tertiary",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-ink-tertiary",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-fg-subtle)",
      "dark": "var(--whatiuse-fg-subtle)"
    },
    "resolvedValues": {
      "light": "#636366",
      "dark": "#8e8e93"
    }
  },
  {
    "path": "theme.foreground.ink-disabled",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-ink-disabled",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-fg-disabled)",
      "dark": "var(--whatiuse-fg-disabled)"
    },
    "resolvedValues": {
      "light": "#aeaeb1",
      "dark": "#555559"
    }
  },
  {
    "path": "theme.border.separator",
    "type": "color",
    "description": "Low-contrast structural separator.",
    "deprecated": false,
    "cssVariable": "--whatiuse-separator",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.055)",
      "dark": "rgb(255 255 255 / 0.072)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.055)",
      "dark": "rgb(255 255 255 / 0.072)"
    }
  },
  {
    "path": "theme.border.control-border",
    "type": "color",
    "description": "Default control boundary.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-border",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.105)",
      "dark": "rgb(255 255 255 / 0.13)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.105)",
      "dark": "rgb(255 255 255 / 0.13)"
    }
  },
  {
    "path": "theme.border.control-border-hover",
    "type": "color",
    "description": "Stronger interactive boundary.",
    "deprecated": false,
    "cssVariable": "--whatiuse-control-border-hover",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.2)",
      "dark": "rgb(255 255 255 / 0.26)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.2)",
      "dark": "rgb(255 255 255 / 0.26)"
    }
  },
  {
    "path": "theme.border.border-subtle",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-border-subtle",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-separator)",
      "dark": "var(--whatiuse-separator)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.055)",
      "dark": "rgb(255 255 255 / 0.072)"
    }
  },
  {
    "path": "theme.border.border",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-border",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-control-border)",
      "dark": "var(--whatiuse-control-border)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.105)",
      "dark": "rgb(255 255 255 / 0.13)"
    }
  },
  {
    "path": "theme.border.border-strong",
    "type": "color",
    "description": "",
    "deprecated": false,
    "cssVariable": "--whatiuse-border-strong",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-control-border-hover)",
      "dark": "var(--whatiuse-control-border-hover)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.2)",
      "dark": "rgb(255 255 255 / 0.26)"
    }
  },
  {
    "path": "theme.focus.focus-control",
    "type": "color",
    "description": "Keyboard focus for product controls.",
    "deprecated": false,
    "cssVariable": "--whatiuse-focus-control",
    "scope": "theme",
    "values": {
      "light": "#85858b",
      "dark": "#a4a4aa"
    },
    "resolvedValues": {
      "light": "#85858b",
      "dark": "#a4a4aa"
    }
  },
  {
    "path": "theme.focus.focus-navigation",
    "type": "color",
    "description": "Keyboard focus for persistent navigation.",
    "deprecated": false,
    "cssVariable": "--whatiuse-focus-navigation",
    "scope": "theme",
    "values": {
      "light": "#77777d",
      "dark": "#adadb3"
    },
    "resolvedValues": {
      "light": "#77777d",
      "dark": "#adadb3"
    }
  },
  {
    "path": "theme.focus.focus-documentation",
    "type": "color",
    "description": "Keyboard focus for documentation disclosures and anchors.",
    "deprecated": false,
    "cssVariable": "--whatiuse-focus-documentation",
    "scope": "theme",
    "values": {
      "light": "#85858b",
      "dark": "#a4a4aa"
    },
    "resolvedValues": {
      "light": "#85858b",
      "dark": "#a4a4aa"
    }
  },
  {
    "path": "theme.focus.focus-halo",
    "type": "color",
    "description": "Quiet supporting halo where a single outline needs separation.",
    "deprecated": false,
    "cssVariable": "--whatiuse-focus-halo",
    "scope": "theme",
    "values": {
      "light": "rgb(28 28 30 / 0.14)",
      "dark": "rgb(255 255 255 / 0.18)"
    },
    "resolvedValues": {
      "light": "rgb(28 28 30 / 0.14)",
      "dark": "rgb(255 255 255 / 0.18)"
    }
  },
  {
    "path": "theme.focus.switch-track",
    "type": "color",
    "description": "Unchecked switch track.",
    "deprecated": false,
    "cssVariable": "--whatiuse-switch-track",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-gray-300)",
      "dark": "var(--whatiuse-gray-300)"
    },
    "resolvedValues": {
      "light": "#d1d1d4",
      "dark": "#323235"
    }
  },
  {
    "path": "theme.focus.switch-thumb",
    "type": "color",
    "description": "Switch thumb surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-switch-thumb",
    "scope": "theme",
    "values": {
      "light": "#ffffff",
      "dark": "var(--whatiuse-gray-800)"
    },
    "resolvedValues": {
      "light": "#ffffff",
      "dark": "#e5e5e8"
    }
  },
  {
    "path": "theme.focus.focus",
    "type": "color",
    "description": "Compatibility alias for product-control focus.",
    "deprecated": false,
    "cssVariable": "--whatiuse-focus",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-focus-control)",
      "dark": "var(--whatiuse-focus-control)"
    },
    "resolvedValues": {
      "light": "#85858b",
      "dark": "#a4a4aa"
    }
  },
  {
    "path": "theme.elevation.shadow-control",
    "type": "shadow",
    "description": "Optical edge definition for compact controls.",
    "deprecated": false,
    "cssVariable": "--whatiuse-shadow-control",
    "scope": "theme",
    "values": {
      "light": "0px 1px 1px 0px oklch(0.17 0.004 275 / 0.025), inset 0px 1px 0px 0px rgb(255 255 255 / 0.62)",
      "dark": "inset 0px 1px 0px 0px rgb(255 255 255 / 0.055), 0px 1px 1px 0px rgb(0 0 0 / 0.2)"
    },
    "resolvedValues": {
      "light": "0px 1px 1px 0px oklch(0.17 0.004 275 / 0.025), inset 0px 1px 0px 0px rgb(255 255 255 / 0.62)",
      "dark": "inset 0px 1px 0px 0px rgb(255 255 255 / 0.055), 0px 1px 1px 0px rgb(0 0 0 / 0.2)"
    }
  },
  {
    "path": "theme.elevation.shadow-float",
    "type": "shadow",
    "description": "Persistent raised composition surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-shadow-float",
    "scope": "theme",
    "values": {
      "light": "0px 4px 16px -8px rgb(28 28 30 / 0.08), 0px 1px 2px 0px rgb(28 28 30 / 0.04), 0px 0px 0px 1px var(--whatiuse-separator)",
      "dark": "0px 4px 16px -8px rgb(0 0 0 / 0.48), 0px 1px 2px 0px rgb(0 0 0 / 0.28), 0px 0px 0px 1px var(--whatiuse-separator)"
    },
    "resolvedValues": {
      "light": "0px 4px 16px -8px rgb(28 28 30 / 0.08), 0px 1px 2px 0px rgb(28 28 30 / 0.04), 0px 0px 0px 1px var(--whatiuse-separator)",
      "dark": "0px 4px 16px -8px rgb(0 0 0 / 0.48), 0px 1px 2px 0px rgb(0 0 0 / 0.28), 0px 0px 0px 1px var(--whatiuse-separator)"
    }
  },
  {
    "path": "theme.elevation.shadow-float-focus",
    "type": "shadow",
    "description": "Raised composition surface with active focus or selection.",
    "deprecated": false,
    "cssVariable": "--whatiuse-shadow-float-focus",
    "scope": "theme",
    "values": {
      "light": "0px 6px 24px -8px rgb(28 28 30 / 0.12), 0px 1px 2px 0px rgb(28 28 30 / 0.05), 0px 0px 0px 1px var(--whatiuse-control-border)",
      "dark": "0px 8px 26px -8px rgb(0 0 0 / 0.56), 0px 1px 2px 0px rgb(0 0 0 / 0.34), 0px 0px 0px 1px var(--whatiuse-control-border)"
    },
    "resolvedValues": {
      "light": "0px 6px 24px -8px rgb(28 28 30 / 0.12), 0px 1px 2px 0px rgb(28 28 30 / 0.05), 0px 0px 0px 1px var(--whatiuse-control-border)",
      "dark": "0px 8px 26px -8px rgb(0 0 0 / 0.56), 0px 1px 2px 0px rgb(0 0 0 / 0.34), 0px 0px 0px 1px var(--whatiuse-control-border)"
    }
  },
  {
    "path": "theme.elevation.shadow-flyout",
    "type": "shadow",
    "description": "Anchored temporary Flyout surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-shadow-flyout",
    "scope": "theme",
    "values": {
      "light": "0px 16px 34px -10px rgb(28 28 30 / 0.16), 0px 4px 10px -4px rgb(28 28 30 / 0.09), 0px 0px 0px 1px var(--whatiuse-separator)",
      "dark": "0px 20px 44px -10px rgb(0 0 0 / 0.68), 0px 5px 14px -4px rgb(0 0 0 / 0.42), 0px 0px 0px 1px var(--whatiuse-separator)"
    },
    "resolvedValues": {
      "light": "0px 16px 34px -10px rgb(28 28 30 / 0.16), 0px 4px 10px -4px rgb(28 28 30 / 0.09), 0px 0px 0px 1px var(--whatiuse-separator)",
      "dark": "0px 20px 44px -10px rgb(0 0 0 / 0.68), 0px 5px 14px -4px rgb(0 0 0 / 0.42), 0px 0px 0px 1px var(--whatiuse-separator)"
    }
  },
  {
    "path": "theme.elevation.shadow-popover",
    "type": "shadow",
    "description": "Compatibility alias for anchored popovers.",
    "deprecated": false,
    "cssVariable": "--whatiuse-shadow-popover",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-shadow-flyout)",
      "dark": "var(--whatiuse-shadow-flyout)"
    },
    "resolvedValues": {
      "light": "0px 16px 34px -10px rgb(28 28 30 / 0.16), 0px 4px 10px -4px rgb(28 28 30 / 0.09), 0px 0px 0px 1px var(--whatiuse-separator)",
      "dark": "0px 20px 44px -10px rgb(0 0 0 / 0.68), 0px 5px 14px -4px rgb(0 0 0 / 0.42), 0px 0px 0px 1px var(--whatiuse-separator)"
    }
  },
  {
    "path": "theme.elevation.shadow-modal",
    "type": "shadow",
    "description": "Focus-trapping task surface.",
    "deprecated": false,
    "cssVariable": "--whatiuse-shadow-modal",
    "scope": "theme",
    "values": {
      "light": "0px 36px 110px 0px oklch(0.17 0.004 275 / 0.15), 0px 8px 24px 0px oklch(0.17 0.004 275 / 0.065), 0px 0px 0px 1px var(--whatiuse-border)",
      "dark": "0px 42px 120px 0px rgb(0 0 0 / 0.58), 0px 10px 30px 0px rgb(0 0 0 / 0.34), 0px 0px 0px 1px var(--whatiuse-border)"
    },
    "resolvedValues": {
      "light": "0px 36px 110px 0px oklch(0.17 0.004 275 / 0.15), 0px 8px 24px 0px oklch(0.17 0.004 275 / 0.065), 0px 0px 0px 1px var(--whatiuse-border)",
      "dark": "0px 42px 120px 0px rgb(0 0 0 / 0.58), 0px 10px 30px 0px rgb(0 0 0 / 0.34), 0px 0px 0px 1px var(--whatiuse-border)"
    }
  },
  {
    "path": "theme.elevation.shadow-dialog",
    "type": "shadow",
    "description": "Compatibility alias for dialog surfaces.",
    "deprecated": false,
    "cssVariable": "--whatiuse-shadow-dialog",
    "scope": "theme",
    "values": {
      "light": "var(--whatiuse-shadow-modal)",
      "dark": "var(--whatiuse-shadow-modal)"
    },
    "resolvedValues": {
      "light": "0px 36px 110px 0px oklch(0.17 0.004 275 / 0.15), 0px 8px 24px 0px oklch(0.17 0.004 275 / 0.065), 0px 0px 0px 1px var(--whatiuse-border)",
      "dark": "0px 42px 120px 0px rgb(0 0 0 / 0.58), 0px 10px 30px 0px rgb(0 0 0 / 0.34), 0px 0px 0px 1px var(--whatiuse-border)"
    }
  }
] as const;
export const tokenByPath = Object.fromEntries(tokenManifest.map((token) => [token.path, token])) as Record<TokenPath, (typeof tokenManifest)[number]>;
export function tokenVar(path: TokenPath) {
  return `var(${tokenByPath[path].cssVariable})` as const;
}
