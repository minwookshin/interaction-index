import { Check, DeviceMobile, Monitor, TerminalWindow } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Combobox,
  ContextSwitcher,
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
  IconButton,
  NumberField,
  RadioGroup,
  SearchInput,
  SegmentedControl,
  Switch,
  Textarea,
  TextField,
  type ComboboxOption,
} from "../ui";
import "./control-component-previews.css";

const peopleOptions = [
  { label: "Avery Stone", value: "avery", description: "Product design" },
  { label: "Mina Park", value: "mina", description: "Design engineering" },
  { label: "Noah Williams", value: "noah", description: "Product management" },
  { label: "Sofia Chen", value: "sofia", description: "Research" },
] as const;

const contextSwitcherOptions = [
  { value: "web", label: "Web", description: "Browser product interfaces", icon: <Monitor /> },
  { value: "native", label: "Native", description: "Mobile and desktop applications", icon: <DeviceMobile /> },
  { value: "terminal", label: "Terminal", description: "Keyboard-first command tools", icon: <TerminalWindow /> },
] as const;

const handlePattern = /^[a-z0-9][a-z0-9-]{2,}$/;

export function ProjectFieldPreview() {
  const [name, setName] = useState("whatiuse");
  const [touched, setTouched] = useState(false);
  const invalid = touched && name.trim().length === 0;

  return (
    <div className="primary-field-preview teum-project-field-preview">
      <Field invalid={invalid}>
        <FieldLabel>Project name</FieldLabel>
        <FieldControl
          value={name}
          required
          onChange={(event) => setName(event.currentTarget.value)}
          onBlur={() => setTouched(true)}
        />
        {!invalid && <FieldDescription>Visible to everyone in the workspace.</FieldDescription>}
        <FieldError match={invalid}>Enter a project name.</FieldError>
      </Field>
    </div>
  );
}

export function ActionButtonGroupPreview() {
  const [message, setMessage] = useState("Ready for review");
  const [approved, setApproved] = useState(false);

  return (
    <div className="teum-button-group-preview">
      <span className="teum-sr-only" role="status" aria-live="polite">{message}</span>
      <ButtonGroup aria-label="Issue actions" attached>
        <Button size="small" variant="secondary" onClick={() => setMessage("Preview opened")}>Preview</Button>
        <Button size="small" variant="secondary" onClick={() => setMessage("Issue opened")}>Open</Button>
        <IconButton
          size="small"
          variant="secondary"
          aria-label={approved ? "Remove approval" : "Approve issue"}
          aria-pressed={approved}
          onClick={() => {
            setApproved((current) => !current);
            setMessage(approved ? "Approval removed" : "Issue approved");
          }}
        >
          <Check weight={approved ? "bold" : "regular"} />
        </IconButton>
      </ButtonGroup>
    </div>
  );
}

export function ProjectTextFieldPreview() {
  const [value, setValue] = useState("minwook");
  const [touched, setTouched] = useState(false);
  const valid = handlePattern.test(value);
  const error = touched && !valid ? "Use at least three lowercase characters." : undefined;

  return (
    <div className="primary-field-preview teum-text-field-preview">
      <TextField
        label="Handle"
        value={value}
        leading={<span className="teum-text-field-preview__prefix">@</span>}
        trailing={valid ? <Check className="teum-text-field-preview__valid" weight="bold" aria-hidden="true" /> : undefined}
        error={error}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        onChange={(event) => setValue(event.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
        onBlur={() => setTouched(true)}
      />
      <span className="teum-sr-only" role="status" aria-live="polite">{valid ? "Handle available" : "Handle unavailable"}</span>
    </div>
  );
}

export function DescriptionTextareaPreview() {
  const [value, setValue] = useState("Document the interaction contract.");

  return (
    <div className="primary-field-preview teum-textarea-preview">
      <Textarea
        label="Description"
        value={value}
        maxLength={96}
        showCount
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    </div>
  );
}

export function InteractionNotesCheckboxPreview() {
  const [checked, setChecked] = useState(true);

  return (
    <Checkbox
      label="Include interaction notes"
      description={checked ? "Behavior contracts will be exported." : "Only component code will be exported."}
      checked={checked}
      onCheckedChange={(nextChecked) => setChecked(nextChecked === true)}
    />
  );
}

export function NotificationRadioPreview() {
  const [value, setValue] = useState("daily");

  return (
    <RadioGroup
      label="Send updates"
      value={value}
      onValueChange={setValue}
      options={[
        { value: "instant", label: "Immediately" },
        { value: "daily", label: "Daily digest" },
        { value: "off", label: "Never" },
      ]}
    />
  );
}

export function InteractionSwitchPreview() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="primary-setting-preview">
      <Switch
        label="Interaction previews"
        description={checked ? "Motion is enabled in specimen canvases." : "Specimens stay on their resting frame."}
        checked={checked}
        onCheckedChange={setChecked}
      />
    </div>
  );
}

export function PlatformContextSwitcherPreview() {
  const [value, setValue] = useState("web");

  return (
    <ContextSwitcher
      aria-label="Preview platform"
      options={contextSwitcherOptions}
      value={value}
      onValueChange={(nextValue) => nextValue && setValue(nextValue)}
    />
  );
}

export function AssigneeComboboxPreview() {
  const [value, setValue] = useState<ComboboxOption | null>(peopleOptions[1]);

  return (
    <div className="primary-field-preview teum-assignee-preview">
      <Combobox label="Assignee" options={peopleOptions} value={value} onValueChange={setValue} />
    </div>
  );
}

export function ComponentSearchPreview() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const updateQuery = (nextQuery: string) => {
    window.clearTimeout(timer.current);
    setQuery(nextQuery);
    if (!nextQuery) {
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), 420);
  };

  return (
    <div className="teum-component-search-preview">
      <SearchInput
        value={query}
        loading={loading}
        placeholder="Search components…"
        onChange={(event) => updateQuery(event.currentTarget.value)}
        onClear={() => updateQuery("")}
      />
      <span className="teum-sr-only" role="status" aria-live="polite">
        {loading ? "Searching components" : query ? "Search results updated" : ""}
      </span>
    </div>
  );
}

export function CompactNumberFieldPreview() {
  const [value, setValue] = useState<number | null>(24);

  return (
    <div className="primary-field-preview primary-number-field-preview">
      <NumberField
        value={value}
        onValueChange={setValue}
        min={1}
        max={99}
        inputProps={{ "aria-label": "Quantity", inputMode: "numeric" }}
      />
    </div>
  );
}

export function IssueViewSegmentedPreview() {
  const [value, setValue] = useState("list");

  return (
    <SegmentedControl
      label="Issue view"
      value={value}
      onValueChange={(nextValue) => nextValue && setValue(nextValue)}
      options={[
        { value: "list", label: "List" },
        { value: "board", label: "Board" },
        { value: "timeline", label: "Timeline" },
      ]}
    />
  );
}
