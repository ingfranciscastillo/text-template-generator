import * as React from "react";
import { Download, Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateItem } from "@/types";
import { exportTemplates, importTemplates } from "@/lib/storage";

interface ImportExportProps {
  templates: TemplateItem[];
  onImport: (templates: TemplateItem[]) => void;
}

export const ImportExport: React.FC<ImportExportProps> = ({
  templates,
  onImport,
}) => {
  const [importText, setImportText] = React.useState("");
  const [showImport, setShowImport] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportTemplates(templates);
    
    // Intentar usar clipboard API primero
    navigator.clipboard.writeText(json).then(() => {
      alert("JSON copiado al portapapeles");
    }).catch(() => {
      // Fallback: descargar como archivo
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `plantillas-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handleImport = () => {
    setError(null);
    
    if (!importText.trim()) {
      setError("Por favor, pega el JSON para importar");
      return;
    }

    try {
      const imported = importTemplates(importText, templates);
      onImport(imported);
      setImportText("");
      setShowImport(false);
      alert(`${imported.length} plantilla(s) importada(s) correctamente`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al importar");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">
        Importar / Exportar
      </h3>
      
      <div className="flex gap-2">
        <Button onClick={handleExport} variant="outline" size="sm" className="flex-1">
          <Download className="size-4 mr-2" />
          Exportar
        </Button>
        <Button 
          onClick={() => setShowImport(!showImport)} 
          variant="outline" 
          size="sm" 
          className="flex-1"
        >
          <Upload className="size-4 mr-2" />
          Importar
        </Button>
      </div>

      {showImport && (
        <div className="space-y-3 p-3 bg-muted/50 rounded-md">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Pega aquí el JSON de plantillas..."
            className="w-full h-24 p-2 text-xs font-mono bg-background border border-border rounded resize-none"
          />
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json"
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              <FileUp className="size-3 mr-1" />
              Subir archivo
            </Button>
          </div>

          {error && (
            <div className="text-xs text-destructive">{error}</div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleImport} size="sm" className="flex-1">
              Importar
            </Button>
            <Button 
              onClick={() => {
                setShowImport(false);
                setImportText("");
                setError(null);
              }} 
              variant="ghost" 
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
