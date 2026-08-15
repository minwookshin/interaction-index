import { describe, expect, it } from "vitest";
import { components, type ComponentId } from "../App";
import { componentGuidance } from "../component-guidance";
import * as controls from "./controls.stories";
import * as dataDisplay from "./data-display.stories";
import * as disclosure from "./disclosure.stories";
import * as feedback from "./feedback.stories";
import * as interaction from "./interaction.stories";
import * as navigation from "./navigation.stories";
import * as overlays from "./overlays.stories";

type StoryExport = {
  parameters?: {
    interactionIndex?: {
      componentId?: ComponentId;
    };
  };
};

const modules = [controls, dataDisplay, disclosure, feedback, interaction, navigation, overlays];

function storyComponentIds() {
  return modules.flatMap((module) =>
    Object.values(module)
      .map((story) => (story as StoryExport).parameters?.interactionIndex?.componentId)
      .filter((id): id is ComponentId => Boolean(id)),
  );
}

describe("Storybook catalog parity", () => {
  it("covers every public component exactly once", () => {
    const catalogIds = components.map((component) => component.id).sort();
    const storyIds = storyComponentIds().sort();

    expect(storyIds).toHaveLength(components.length);
    expect(new Set(storyIds).size).toBe(storyIds.length);
    expect(storyIds).toEqual(catalogIds);
  });

  it("keeps a state, keyboard, and quality contract for every story", () => {
    for (const id of storyComponentIds()) {
      expect(componentGuidance[id].states.length).toBeGreaterThan(0);
      expect(componentGuidance[id].keyboard.length).toBeGreaterThan(0);
      expect(componentGuidance[id].quality.length).toBeGreaterThan(0);
    }
  });
});
