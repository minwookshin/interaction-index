import { MagnifyingGlass } from "@phosphor-icons/react";
import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import type { BehaviorContract } from "../../lib/behavior-contract";
import { cn } from "../../lib/cn";

export const actionListContract: BehaviorContract = {
  input: ["Typing", "Arrow keys", "Pointer hover", "Pointer click"],
  origin: "Selection begins at the first enabled result and follows the query.",
  enter: "Results update in place; the active row uses a quiet monochrome fill.",
  active: "Input retains DOM focus while aria-activedescendant tracks the active option.",
  exit: "Enter or click invokes one action and clears transient selection state.",
  interruption: "An empty result set keeps the query editable and announces no results.",
  keyboard: ["Arrow Up/Down: move", "Home/End: jump", "Enter: run", "Escape: clear query"],
  reducedMotion: "Filtering and selection update without animated displacement.",
};

export type ActionListItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "danger";
  inactiveReason?: string;
};

export type ActionListProps = {
  items: readonly ActionListItem[];
  onAction: (item: ActionListItem) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  autoFocus?: boolean;
  defaultQuery?: string;
};

export function ActionList({ items, onAction, placeholder = "Search actions…", emptyMessage = "No actions found", className, autoFocus, defaultQuery = "" }: ActionListProps) {
  const listId = useId();
  const [query, setQuery] = useState(defaultQuery);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return items;
    return items.filter((item) => `${item.label} ${item.description ?? ""}`.toLocaleLowerCase().includes(normalized));
  }, [items, query]);
  const enabledIndices = filtered.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled && !item.loading).map(({ index }) => index);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = enabledIndices.includes(activeIndex) ? activeIndex : (enabledIndices[0] ?? -1);

  const move = (direction: 1 | -1) => {
    if (!enabledIndices.length) return;
    const position = enabledIndices.indexOf(safeActiveIndex);
    const nextPosition = (position + direction + enabledIndices.length) % enabledIndices.length;
    setActiveIndex(enabledIndices[nextPosition]);
  };

  const runActive = () => {
    const item = filtered[safeActiveIndex];
    if (item && !item.disabled && !item.loading) onAction(item);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); move(1); }
    if (event.key === "ArrowUp") { event.preventDefault(); move(-1); }
    if (event.key === "Home" && enabledIndices.length) { event.preventDefault(); setActiveIndex(enabledIndices[0]); }
    if (event.key === "End" && enabledIndices.length) { event.preventDefault(); setActiveIndex(enabledIndices.at(-1) ?? 0); }
    if (event.key === "Enter") { event.preventDefault(); runActive(); }
    if (event.key === "Escape" && query) { event.preventDefault(); setQuery(""); setActiveIndex(0); }
  };

  return (
    <div className={cn("teum-action-list", className)}>
      <div className="teum-action-list__search">
        <MagnifyingGlass aria-hidden="true" />
        <input
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search actions"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={safeActiveIndex >= 0 ? `${listId}-${filtered[safeActiveIndex]?.id}` : undefined}
        />
        <kbd aria-label="Command K">⌘K</kbd>
      </div>
      <div id={listId} className="teum-action-list__items" role="listbox" aria-label="Actions">
        {filtered.map((item, index) => (
          <div
            id={`${listId}-${item.id}`}
            key={item.id}
            role="option"
            aria-selected={index === safeActiveIndex}
            aria-disabled={item.disabled || item.loading || undefined}
            className="teum-action-list__item"
            data-active={index === safeActiveIndex || undefined}
            data-disabled={item.disabled || undefined}
            data-loading={item.loading || undefined}
            data-variant={item.variant}
            title={item.inactiveReason}
            onPointerEnter={() => !item.disabled && !item.loading && setActiveIndex(index)}
            onClick={() => !item.disabled && !item.loading && onAction(item)}
          >
            <span className="teum-action-list__icon" aria-hidden="true">{item.icon}</span>
            <span className="teum-action-list__copy">
              <span>{item.label}</span>
              {(item.description || item.inactiveReason) && <small>{item.inactiveReason ?? item.description}</small>}
            </span>
            {item.loading ? <span className="teum-spinner" aria-hidden="true" /> : item.shortcut && <kbd>{item.shortcut}</kbd>}
          </div>
        ))}
      </div>
      {!filtered.length && <div className="teum-action-list__empty" role="status">{emptyMessage}</div>}
    </div>
  );
}
