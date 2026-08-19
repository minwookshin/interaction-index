import {
  Archive,
  Bell,
  CaretDown,
  Check,
  Copy,
  Package,
  Plus,
  Rows,
  Trash,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
  Select,
  TextField,
} from "../ui";
import "./priority-component-previews.css";

type IconActionState = "idle" | "loading" | "success";

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;

const maturityOptions = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Stable", value: "stable" },
] as const;

function useTransientMessage(clearAfter = 1400) {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const showMessage = (nextMessage: string) => {
    window.clearTimeout(timer.current);
    setMessage(nextMessage);
    timer.current = window.setTimeout(() => setMessage(""), clearAfter);
  };

  return [message, showMessage] as const;
}

export function AsyncIconButtonPreview() {
  const [state, setState] = useState<IconActionState>("idle");
  const [activation, setActivation] = useState<"pointer" | "keyboard">("pointer");
  const completionTimer = useRef<number | undefined>(undefined);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    window.clearTimeout(completionTimer.current);
    window.clearTimeout(resetTimer.current);
  }, []);

  const run = (event: MouseEvent<HTMLButtonElement>) => {
    if (state !== "idle") return;
    window.clearTimeout(completionTimer.current);
    window.clearTimeout(resetTimer.current);
    setActivation(event.detail === 0 ? "keyboard" : "pointer");
    setState("loading");
    completionTimer.current = window.setTimeout(() => {
      setState("success");
      resetTimer.current = window.setTimeout(() => setState("idle"), 1200);
    }, 720);
  };

  return (
    <div className="whatiuse-icon-action-preview" data-state={state} data-activation={activation}>
      <IconButton
        className="whatiuse-icon-action-preview__button"
        variant="secondary"
        aria-label="Create item"
        tooltip={state === "success" ? "Item created" : state === "loading" ? "Creating item" : "Create item"}
        loading={state === "loading"}
        disabled={state === "success"}
        onClick={run}
      >
        {state === "success" ? <Check weight="bold" /> : <Plus />}
      </IconButton>
      <span className="whatiuse-sr-only" role="status" aria-live="polite">
        {state === "loading" ? "Creating item" : state === "success" ? "Item created" : ""}
      </span>
    </div>
  );
}

export function PrioritySelectPreview() {
  const [value, setValue] = useState("medium");

  return (
    <div className="whatiuse-priority-select-preview">
      <Select
        label="Priority"
        options={priorityOptions}
        value={value}
        onValueChange={(nextValue) => nextValue && setValue(nextValue)}
      />
    </div>
  );
}

export function IssueActionsMenuPreview() {
  const [following, setFollowing] = useState(false);
  const [message, showMessage] = useTransientMessage();
  const metadata = message || `INT-184 · ${following ? "Following" : "In review"}`;

  return (
    <section className="product-context product-context--toolbar whatiuse-issue-menu-preview" aria-label="Issue toolbar menu example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Rows aria-hidden="true" /></span>
        <div>
          <strong>Motion contract</strong>
          <span className="whatiuse-product-context__status">{metadata}</span>
        </div>
      </div>
      <Menu>
        <MenuTrigger render={<Button variant="secondary" size="small" trailingIcon={<CaretDown />}>Actions</Button>} />
        <MenuContent className="whatiuse-issue-actions-menu" aria-label="Issue actions">
          <MenuLabel>Issue</MenuLabel>
          <MenuCheckboxItem
            checked={following}
            closeOnClick={false}
            onCheckedChange={(checked) => setFollowing(checked === true)}
          >
            <span className="whatiuse-menu-preview__item-copy"><Bell />Follow issue</span>
          </MenuCheckboxItem>
          <MenuSeparator />
          <MenuItem onClick={() => showMessage("Issue duplicated")}><Copy />Duplicate <kbd>⌘D</kbd></MenuItem>
          <MenuItem onClick={() => showMessage("Issue archived")}><Archive />Archive</MenuItem>
          <MenuSeparator />
          <MenuItem className="whatiuse-menu__item--danger" onClick={() => showMessage("Delete requires confirmation")}><Trash />Delete</MenuItem>
        </MenuContent>
      </Menu>
      <span className="whatiuse-sr-only" role="status" aria-live="polite">{message}</span>
    </section>
  );
}

type Maturity = "alpha" | "beta" | "stable";

function maturityLabel(value: Maturity) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ComponentMetadataDialogPreview() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Draft primitive");
  const [maturity, setMaturity] = useState<Maturity>("alpha");
  const [draftName, setDraftName] = useState(name);
  const [draftMaturity, setDraftMaturity] = useState<Maturity>(maturity);
  const [message, showMessage] = useTransientMessage();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftName(name);
      setDraftMaturity(maturity);
    }
    setOpen(nextOpen);
  };

  const save = () => {
    const nextName = draftName.trim() || name;
    setName(nextName);
    setMaturity(draftMaturity);
    setOpen(false);
    showMessage("Component metadata saved");
  };

  return (
    <section className="product-context product-context--toolbar whatiuse-metadata-dialog-preview" aria-label="Component metadata example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Package aria-hidden="true" /></span>
        <div>
          <strong>{name}</strong>
          <span className="whatiuse-product-context__status">{message || `${maturityLabel(maturity)} · Local component`}</span>
        </div>
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button variant="secondary" size="small">Edit details</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit component details</DialogTitle>
            <DialogDescription>Change the name and maturity shown in the catalog.</DialogDescription>
          </DialogHeader>
          <form className="whatiuse-metadata-dialog__form" onSubmit={(event) => { event.preventDefault(); save(); }}>
            <TextField
              label="Display name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
            />
            <Select
              label="Maturity"
              value={draftMaturity}
              options={maturityOptions}
              onValueChange={(nextValue) => nextValue && setDraftMaturity(nextValue as Maturity)}
            />
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <span className="whatiuse-sr-only" role="status" aria-live="polite">{message}</span>
    </section>
  );
}
