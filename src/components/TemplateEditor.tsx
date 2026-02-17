import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface TemplateEditorProps {
  content: string;
  onChange: (content: string) => void;
  invalidVars: string[];
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  content,
  onChange,
  invalidVars,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Contenido de la Plantilla
      </label>
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe tu plantilla usando {{variable}} para insertar variables..."
        className="min-h-[200px] font-mono text-sm resize-y"
      />
      
      {invalidVars.length > 0 && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Variables inválidas detectadas:</p>
            <p className="mt-1">
              {invalidVars.map((v) => `"${v}"`).join(", ")}
            </p>
            <p className="text-xs mt-1 text-muted-foreground">
              Las variables solo pueden contener letras, números y guiones bajos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
