import { Check, Copy, Code, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { copyText } from "../lib/copy-text";
import type { ComponentDocId } from "./component-code";

type LiveSpecimenProps = {
  id: string;
  children: ReactNode;
  controls?: ReactNode;
  specimen?: "compact" | "context" | "flow";
  note?: string;
  onReset?: () => void;
};

export function LiveSpecimen({ id, children, controls, specimen = "compact", note, onReset }: LiveSpecimenProps) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const disclosureRef = useRef<HTMLDetailsElement>(null);
  const activeIdRef = useRef(id);

  useEffect(() => {
    activeIdRef.current = id;
    setCopied(false);
    setCode("");
    if (disclosureRef.current) disclosureRef.current.open = false;
  }, [id]);

  const loadCode = async () => {
    if (code) return code;
    const module = await import("./component-code");
    const nextCode = module.componentCode[id as ComponentDocId] ?? "";
    if (activeIdRef.current === id) setCode(nextCode);
    return nextCode;
  };

  const copyCode = async () => {
    const source = await loadCode();
    if (source && await copyText(source)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <section className="live-specimen" aria-label="Live component specimen">
      <div className="live-specimen__toolbar">
        {controls ?? <strong>Preview</strong>}
        <div className="live-specimen__actions">
          {note && <span>{note}</span>}
          {onReset && <button type="button" aria-label="Reset specimen" title="Reset specimen" onClick={onReset}><ArrowCounterClockwise aria-hidden="true" /></button>}
        </div>
      </div>
      <div className="live-specimen__body">
        <div className="live-specimen__preview" data-specimen={specimen}>
          <div className="live-specimen__center">{children}</div>
        </div>
      </div>
      <details ref={disclosureRef} className="live-specimen__disclosure" onToggle={(event) => { if (event.currentTarget.open) void loadCode(); }}>
        <summary onPointerEnter={() => void loadCode()} onFocus={() => void loadCode()}><span><Code aria-hidden="true" /> Show code</span><small>index.tsx</small></summary>
        <div className="live-specimen__code">
          <div className="live-specimen__file"><span>index.tsx</span><small>React</small><button type="button" aria-label={copied ? "Code copied" : "Copy code"} title={copied ? "Copied" : "Copy code"} onClick={() => void copyCode()}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</button></div>
          <pre tabIndex={0}><code>{code || "Loading…"}</code></pre>
        </div>
      </details>
    </section>
  );
}
