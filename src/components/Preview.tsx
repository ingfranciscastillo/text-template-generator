import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewProps {
  content: string;
  placeholderStyle: "brackets" | "empty";
  onPlaceholderStyleChange: (style: "brackets" | "empty") => void;
}

export const Preview: React.FC<PreviewProps> = ({
  content,
  placeholderStyle,
  onPlaceholderStyleChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Vista Previa
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Mostrar placeholders:</span>
          <button
            onClick={() => onPlaceholderStyleChange("brackets")}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              placeholderStyle === "brackets"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            [var]
          </button>
          <button
            onClick={() => onPlaceholderStyleChange("empty")}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              placeholderStyle === "empty"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Vacío
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div className="min-h-[150px] p-4 bg-muted/50 rounded-md border border-border whitespace-pre-wrap font-mono text-sm text-foreground overflow-auto">
          {content || (
            <span className="text-muted-foreground italic">
              El texto renderizado aparecerá aquí...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface CopyButtonProps {
  text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para navegadores que no soportan clipboard API
      alert("Texto copiado al portapapeles");
    }
  };

  return (
    <Button
      onClick={handleCopy}
      disabled={!text}
      variant="outline"
      className="w-full"
      size="sm"
    >
      {copied ? (
        <>
          <Check className="size-4 mr-2" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="size-4 mr-2" />
          Copiar resultado
        </>
      )}
    </Button>
  );
};
