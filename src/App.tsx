import * as React from "react";
import { useDebounceCallback } from "usehooks-ts";
import type { TemplateItem, PlaceholderStyle } from "@/types";
import {
  loadTemplates,
  saveTemplates,
  createEmptyTemplate,
  duplicateTemplate,
} from "@/lib/storage";
import {
  extractVariables,
  renderTemplate,
  syncValues,
} from "@/lib/templateEngine";
import { TemplateList } from "@/components/TemplateList";
import { TemplateEditor } from "@/components/TemplateEditor";
import { VariablesForm } from "@/components/VariablesForm";
import { Preview, CopyButton } from "@/components/Preview";
import { ImportExport } from "@/components/ImportExport";
import { Input } from "@/components/ui/input";
import "./App.css";

function App() {
  const [templates, setTemplates] = React.useState<TemplateItem[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [content, setContent] = React.useState("");
  const [name, setName] = React.useState("");
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [placeholderStyle, setPlaceholderStyle] =
    React.useState<PlaceholderStyle>("brackets");
  React.useEffect(() => {
    const loaded = loadTemplates();
    setTemplates(loaded);

    if (loaded.length > 0) {
      setSelectedId(loaded[0].id);
      setContent(loaded[0].content);
      setName(loaded[0].name);
    }
  }, []);

  const { vars: variables, invalid: invalidVars } = React.useMemo(
    () => extractVariables(content),
    [content]
  );

  React.useEffect(() => {
    setValues((prev) => syncValues(variables, prev));
  }, [variables.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderedContent = React.useMemo(
    () => renderTemplate(content, values, { placeholderStyle }),
    [content, values, placeholderStyle]
  );

  const debouncedSave = useDebounceCallback((newTemplates: TemplateItem[]) => {
    saveTemplates(newTemplates);
  }, 500);

  const updateCurrentTemplate = React.useCallback(
    (updates: Partial<TemplateItem>) => {
      if (!selectedId) return;

      setTemplates((prev) => {
        const updated = prev.map((t) =>
          t.id === selectedId ? { ...t, ...updates, updatedAt: Date.now() } : t
        );
        debouncedSave(updated);
        return updated;
      });
    },
    [selectedId, debouncedSave]
  );

  // Handlers
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    updateCurrentTemplate({ content: newContent });
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    updateCurrentTemplate({ name: newName });
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    setSelectedId(template.id);
    setContent(template.content);
    setName(template.name);
    // Resetear valores al cambiar de plantilla
    const { vars } = extractVariables(template.content);
    setValues(syncValues(vars, {}));
  };

  const handleCreateTemplate = () => {
    const newTemplate = createEmptyTemplate();
    setTemplates((prev) => {
      const updated = [newTemplate, ...prev];
      saveTemplates(updated);
      return updated;
    });
    setSelectedId(newTemplate.id);
    setContent(newTemplate.content);
    setName(newTemplate.name);
    setValues({});
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTemplates(updated);

      // Si eliminamos la seleccionada, seleccionar otra
      if (id === selectedId) {
        if (updated.length > 0) {
          setSelectedId(updated[0].id);
          setContent(updated[0].content);
          setName(updated[0].name);
        } else {
          setSelectedId(null);
          setContent("");
          setName("");
        }
      }

      return updated;
    });
  };

  const handleDuplicateTemplate = (template: TemplateItem) => {
    const duplicated = duplicateTemplate(template);
    setTemplates((prev) => {
      const updated = [duplicated, ...prev];
      saveTemplates(updated);
      return updated;
    });
    setSelectedId(duplicated.id);
    setContent(duplicated.content);
    setName(duplicated.name);
  };

  const handleRenameTemplate = (id: string, newName: string) => {
    setTemplates((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, name: newName, updatedAt: Date.now() } : t
      );
      saveTemplates(updated);
      return updated;
    });

    if (id === selectedId) {
      setName(newName);
    }
  };

  const handleImportTemplates = (imported: TemplateItem[]) => {
    setTemplates((prev) => {
      const updated = [...imported, ...prev];
      saveTemplates(updated);
      return updated;
    });
  };

  const selectedTemplate = templates.find((t) => t.id === selectedId);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">
            Generador de Plantillas
          </h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {templates.length} plantilla(s)
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Template List */}
        <aside className="w-72 border-r border-border bg-card flex flex-col">
          <TemplateList
            templates={templates}
            selectedId={selectedId}
            onSelect={handleSelectTemplate}
            onCreate={handleCreateTemplate}
            onDelete={handleDeleteTemplate}
            onDuplicate={handleDuplicateTemplate}
            onRename={handleRenameTemplate}
          />
        </aside>

        {/* Center - Editor */}
        <main className="flex-1 flex flex-col min-w-0">
          {selectedTemplate ? (
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Template Name */}
                <div>
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nombre de la plantilla"
                    className="text-lg font-medium border-0 px-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Template Editor */}
                <TemplateEditor
                  content={content}
                  onChange={handleContentChange}
                  invalidVars={invalidVars}
                />

                {/* Variables Form */}
                <VariablesForm
                  variables={variables}
                  values={values}
                  onChange={setValues}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="mb-2">
                  Selecciona una plantilla o crea una nueva
                </p>
                <button
                  onClick={handleCreateTemplate}
                  className="text-primary hover:underline"
                >
                  Crear nueva plantilla
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Preview */}
        <aside className="w-80 border-l border-border bg-card p-4 overflow-auto">
          <div className="space-y-6">
            <Preview
              content={renderedContent}
              placeholderStyle={placeholderStyle}
              onPlaceholderStyleChange={setPlaceholderStyle}
            />

            <CopyButton text={renderedContent} />

            <div className="border-t border-border pt-4">
              <ImportExport
                templates={templates}
                onImport={handleImportTemplates}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
