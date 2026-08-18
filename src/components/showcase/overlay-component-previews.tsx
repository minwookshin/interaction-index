import {
  Archive,
  Bell,
  CaretDown,
  Check,
  Copy,
  Package,
  Rows,
  Star,
  Trash,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  TextField,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui";
import "./overlay-component-previews.css";

const COMPONENT_FEEDBACK_TOAST_ID_PREFIX = "component-feedback";

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
] as const;

type Priority = (typeof priorityOptions)[number]["value"];

function priorityLabel(value: Priority) {
  return priorityOptions.find((option) => option.value === value)?.label ?? value;
}

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

export function FavoriteTooltipPreview() {
  const [favorite, setFavorite] = useState(false);
  const label = favorite ? "Remove from favorites" : "Add to favorites";

  return (
    <div className="teum-tooltip-preview" data-favorite={favorite || undefined}>
      <Tooltip>
        <TooltipTrigger
          render={(
            <IconButton
              variant="secondary"
              aria-label={label}
              aria-pressed={favorite}
              onClick={() => setFavorite((value) => !value)}
            >
              <Star weight={favorite ? "fill" : "regular"} />
            </IconButton>
          )}
        />
        <TooltipContent>{label} <kbd>F</kbd></TooltipContent>
      </Tooltip>
      <span className="teum-sr-only" role="status" aria-live="polite">
        {favorite ? "Added to favorites" : ""}
      </span>
    </div>
  );
}

export function ViewOptionsPopoverPreview() {
  const [showContracts, setShowContracts] = useState(true);

  return (
    <section className="product-context product-context--toolbar teum-view-options-preview" aria-label="Component view options example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Rows aria-hidden="true" /></span>
        <div>
          <strong>Components</strong>
          <span>{showContracts ? "Contracts visible" : "Contracts hidden"}</span>
        </div>
      </div>
      <Popover>
        <PopoverTrigger render={<Button variant="secondary" size="small" trailingIcon={<CaretDown />}>View</Button>} />
        <PopoverContent className="teum-popover--compact teum-view-options-preview__popover" side="bottom" align="end">
          <div className="popover-copy"><PopoverTitle>View options</PopoverTitle></div>
          <div className="teum-view-options-preview__setting">
            <Switch label="Show contracts" checked={showContracts} onCheckedChange={setShowContracts} />
          </div>
        </PopoverContent>
      </Popover>
    </section>
  );
}

export function IssueContextMenuPreview() {
  const [following, setFollowing] = useState(false);
  const [archived, setArchived] = useState(false);
  const [message, showMessage] = useTransientMessage();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="context-menu-demo-card context-menu-demo-card--primary teum-context-menu-preview">
        <span className="product-context__icon"><Rows aria-hidden="true" /></span>
        <span>
          <strong>Motion contract</strong>
          <small>{message || (archived ? "Archived" : following ? "Following · Shift + F10" : "Shift + F10")}</small>
        </span>
        {archived && <Check aria-label="Archived" weight="bold" />}
        <span className="teum-sr-only" role="status" aria-live="polite">{message}</span>
      </ContextMenuTrigger>
      <ContextMenuContent aria-label="Issue context menu">
        <ContextMenuLabel>Issue</ContextMenuLabel>
        <ContextMenuCheckboxItem
          checked={following}
          closeOnClick={false}
          onCheckedChange={(checked) => setFollowing(checked === true)}
        >
          <span className="teum-overlay-preview__menu-copy"><Bell />Follow</span>
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => showMessage("Issue duplicated")}><Copy />Duplicate</ContextMenuItem>
        <ContextMenuItem onClick={() => { setArchived((value) => !value); showMessage(archived ? "Issue restored" : "Issue archived"); }}>
          <Archive />{archived ? "Restore" : "Archive"}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="teum-menu__item--danger" onClick={() => showMessage("Delete requires confirmation")}><Trash />Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function IssuePropertiesSheetPreview() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Motion contract");
  const [priority, setPriority] = useState<Priority>("medium");
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftPriority, setDraftPriority] = useState<Priority>(priority);
  const [message, showMessage] = useTransientMessage();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftTitle(title);
      setDraftPriority(priority);
    }
    setOpen(nextOpen);
  };

  const save = () => {
    setTitle(draftTitle.trim() || title);
    setPriority(draftPriority);
    setOpen(false);
    showMessage("Properties saved");
  };

  return (
    <section className="product-context product-context--toolbar teum-sheet-preview" aria-label="Issue property panel example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Rows aria-hidden="true" /></span>
        <div>
          <strong>{title}</strong>
          <span>{message || `INT-184 · ${priorityLabel(priority)}`}</span>
        </div>
      </div>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger render={<Button variant="secondary" size="small">Properties</Button>} />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Issue properties</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <TextField label="Title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
            <Select
              label="Priority"
              options={priorityOptions}
              value={draftPriority}
              onValueChange={(nextValue) => nextValue && setDraftPriority(nextValue as Priority)}
            />
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={save}>Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <span className="teum-sr-only" role="status" aria-live="polite">{message}</span>
    </section>
  );
}

export function DiscardDraftAlertPreview() {
  const [draftPresent, setDraftPresent] = useState(true);
  const [message, showMessage] = useTransientMessage();

  if (!draftPresent) {
    return (
      <section className="product-context product-context--toolbar teum-alert-dialog-preview" aria-label="Discarded draft example">
        <div className="product-context__identity">
          <span className="product-context__icon"><Package aria-hidden="true" /></span>
          <div><strong>Component draft</strong><span>{message || "Discarded"}</span></div>
        </div>
        <Button variant="secondary" size="small" onClick={() => { setDraftPresent(true); showMessage("Draft restored"); }}>Restore</Button>
        <span className="teum-sr-only" role="status" aria-live="polite">{message}</span>
      </section>
    );
  }

  return (
    <section className="product-context product-context--toolbar teum-alert-dialog-preview" aria-label="Component draft example">
      <div className="product-context__identity">
        <span className="product-context__icon"><Package aria-hidden="true" /></span>
        <div><strong>Component draft</strong><span>{message || "Unpublished changes"}</span></div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="secondary" size="small" />}>Discard</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
            <AlertDialogDescription>Unpublished changes will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>Keep draft</AlertDialogClose>
            <AlertDialogClose
              render={<Button className="teum-overlay-preview__danger-button" variant="primary" />}
              onClick={() => { setDraftPresent(false); showMessage("Draft discarded"); }}
            >
              Discard
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <span className="teum-sr-only" role="status" aria-live="polite">{message}</span>
    </section>
  );
}

const catalogToastSequence = [
  { tone: "success", title: "Component saved", description: "Button is ready for review." },
  { tone: "undo", title: "Component archived", description: undefined },
  { tone: "error", title: "Couldn’t publish", description: "Check the registry configuration." },
] as const;

export function ComponentToastPreview() {
  const nextToast = useRef(0);

  const showToast = () => {
    const sequenceIndex = nextToast.current;
    const message = catalogToastSequence[sequenceIndex % catalogToastSequence.length];
    const toastId = `${COMPONENT_FEEDBACK_TOAST_ID_PREFIX}-${sequenceIndex}`;
    nextToast.current += 1;

    if (message.tone === "error") {
      toast.error(message.title, {
        id: toastId,
        description: message.description,
        action: undefined,
      });
      return;
    }

    if (message.tone === "undo") {
      toast(message.title, {
        id: toastId,
        description: undefined,
        action: {
          label: "Undo",
          onClick: () => toast.success("Component restored", {
            id: toastId,
            description: undefined,
            action: undefined,
          }),
        },
      });
      return;
    }

    toast.success(message.title, {
      id: toastId,
      description: message.description,
      action: undefined,
    });
  };

  return <Button variant="primary" onClick={showToast}>Show toast</Button>;
}
