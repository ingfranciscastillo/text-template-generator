import * as React from "react";
import {
  Search,
  Plus,
  Trash2,
  Copy,
  Edit2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TemplateItem } from "@/types";

interface TemplateListProps {
  templates: TemplateItem[];
  selectedId: string | null;
  onSelect: (template: TemplateItem) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (template: TemplateItem) => void;
  onRename: (id: string, newName: string) => void;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
  onDuplicate,
  onRename,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");

  const filteredTemplates = React.useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const query = searchQuery.toLowerCase();
    return templates.filter((t) =>
      t.name.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  const handleStartRename = (template: TemplateItem) => {
    setEditingId(template.id);
    setEditName(template.name);
  };

  const handleSaveRename = () => {
    if (editingId && editName.trim()) {
      onRename(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Plantillas</h2>
          <Button onClick={onCreate} size="sm" variant="outline">
            <Plus className="size-4 mr-1" />
            Nueva
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredTemplates.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {searchQuery
              ? "No se encontraron plantillas"
              : "No hay plantillas. Crea una nueva para comenzar."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelect(template)}
                className={`group p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedId === template.id ? "bg-muted" : ""
                }`}
              >
                {editingId === template.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleSaveRename}
                      autoFocus
                      className="h-7 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {template.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartRename(template);
                          }}
                          className="p-1 hover:bg-muted rounded"
                          title="Renombrar"
                        >
                          <Edit2 className="size-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(template);
                          }}
                          className="p-1 hover:bg-muted rounded"
                          title="Duplicar"
                        >
                          <Copy className="size-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("¿Eliminar esta plantilla?")) {
                              onDelete(template.id);
                            }
                          }}
                          className="p-1 hover:bg-muted rounded text-destructive"
                          title="Eliminar"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 ml-6">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
