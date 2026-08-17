# Teum copy audit

## Scope

Current local `0.1.0-rc.8` build at 1280 x 720. Reviewed the landing page, Installation, Button documentation, and Preserve context pattern.

## Verdict

The information architecture is clear, but the supporting copy is over-explained. The main problem is not the amount of technical documentation. It is the extra layer of meta-copy that describes the documentation itself.

Target: remove roughly one third of supporting prose while preserving install steps, behavior contracts, accessibility, compatibility, and release limits.

## Findings

1. Landing — good structure, moderate copy noise
   - Keep the headline, install command, proof specimen, and three behavior principles.
   - Shorten the subtitle.
   - Remove the repeated sentence that restates the headline.
   - Replace `Teum treats movement, focus, and recovery as part of the component contract, not polish added after implementation.` with `Motion, focus, and recovery are part of every component.`
   - Remove `Start with the task, then choose the smallest reliable building block.`

2. Installation — useful content, highest density
   - Keep the three-step quickstart and all commands.
   - Use either the page description or `Render one component in three steps`, not both.
   - Move detailed verification prose to release evidence and leave one line: `Verified in a fresh Vite project.`
   - Collapse mutable/pinned registry explanations into one comparison note.
   - Keep ownership, plain CSS, theme, integrity, troubleshooting, and update guidance because they affect adoption.

3. Component documents — strongest opportunity for a global reduction
   - Keep component description, Product/State previews, examples, state list, Use when/Avoid when, keyboard contract, API, compatibility, and verification.
   - Delete generic helper lines under Preview, Examples, Usage, Accessibility, and Reference.
   - Replace `Visual proofs stay locked and truthful. Use the interactive Product preview above for pointer and keyboard testing.` with `Static examples. Use Product to test interaction.`
   - Replace `Public preview. APIs may change before a stable release...` with `Pre-release. APIs may change.`

4. Pattern documents — core contracts are valuable
   - Keep Use when, Avoid when, Behavior contract, keyboard controls, reduced motion, and Built from.
   - Rewrite the live-pattern headline as a task: `Open details without losing your place.`
   - Replace the meta instruction with `Open an item, switch items, then press Esc.`
   - Remove repeated uses of `Authored` where the navigation and page context already communicate it.

## Copy rules

- One heading, then at most one supporting sentence.
- Prefer a concrete task or result over a system claim.
- Delete sentences that explain where content is placed or how the reader should read it.
- Evidence uses numbers and links, not adjectives.
- Keep Teum's signature terms only in the landing principles and relevant behavior contracts.
- Avoid stacked triples unless each item is a real contract.
- Do not remove honest release limits or accessibility instructions to make the page look cleaner.

## Evidence

- `artifacts/copy-audit/2026-08-16/01-landing.png`
- `artifacts/copy-audit/2026-08-16/02-installation.png`
- `artifacts/copy-audit/2026-08-16/03-button.png`
- `artifacts/copy-audit/2026-08-16/04-preserve-context.png`

## Limit

This pass sampled the four highest-leverage templates. It does not claim that every component-specific sentence has been individually edited.
