import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import type { Decorator } from "@storybook/react-vite";
import { Toaster, TooltipProvider } from "../src/components/ui";
import "../src/styles.css";
import "../src/stories/storybook.css";

const withSystemProviders: Decorator = (Story) => (
  <TooltipProvider>
    <Story />
    <Toaster />
  </TooltipProvider>
);

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
    withSystemProviders,
  ],
  initialGlobals: {
    theme: "light",
  },
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
      sort: "requiredFirst",
    },
    docs: {
      codePanel: true,
    },
    a11y: {
      context: "body",
      test: "error",
      options: {
        runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
      },
    },
    options: {
      storySort: {
        order: ["Components", ["Controls", "Overlays", "Navigation", "Disclosure", "Feedback", "Data display", "Interaction"]],
      },
    },
  },
};

export default preview;
