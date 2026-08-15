import { Check, Copy, Code, ArrowCounterClockwise } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { copyText } from "../lib/copy-text";

type LiveSpecimenProps = {
  id: string;
  code: string;
  children: ReactNode;
  controls?: ReactNode;
  specimen?: "compact" | "context" | "flow";
  note?: string;
  onReset?: () => void;
};

export function LiveSpecimen({ id, code, children, controls, specimen = "compact", note, onReset }: LiveSpecimenProps) {
  const [copied, setCopied] = useState(false);
  const disclosureRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    setCopied(false);
    if (disclosureRef.current) disclosureRef.current.open = false;
  }, [id]);

  const copyCode = async () => {
    if (await copyText(code)) {
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
      <details ref={disclosureRef} className="live-specimen__disclosure">
        <summary><span><Code aria-hidden="true" /> Show code</span><small>index.tsx</small></summary>
        <div className="live-specimen__code">
          <div className="live-specimen__file"><span>index.tsx</span><small>React</small><button type="button" aria-label={copied ? "Code copied" : "Copy code"} title={copied ? "Copied" : "Copy code"} onClick={() => void copyCode()}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</button></div>
          <pre tabIndex={0}><code>{code}</code></pre>
        </div>
      </details>
    </section>
  );
}
