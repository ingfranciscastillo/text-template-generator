// Persistencia y operaciones de import/export

import { z } from "zod";
import type { TemplateItem } from "@/types";

const STORAGE_KEY = "text-template-generator-templates";

// Schema Zod para validación de importación
const TemplateItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const TemplatesArraySchema = z.array(TemplateItemSchema);

/**
 * Carga las plantillas desde localStorage
 */
export function loadTemplates(): TemplateItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    const result = TemplatesArraySchema.safeParse(parsed);
    
    if (result.success) {
      return result.data;
    }
    
    console.error("Invalid templates data in localStorage:", result.error);
    return [];
  } catch (error) {
    console.error("Error loading templates:", error);
    return [];
  }
}

/**
 * Guarda las plantillas en localStorage
 */
export function saveTemplates(items: TemplateItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving templates:", error);
  }
}

/**
 * Exporta plantillas a string JSON
 */
export function exportTemplates(items: TemplateItem[]): string {
  return JSON.stringify(items, null, 2);
}

/**
 * Importa plantillas desde string JSON con validación
 * Resuelve colisiones de ID creando nuevos IDs
 */
export function importTemplates(
  json: string,
  existingItems: TemplateItem[]
): TemplateItem[] {
  try {
    const parsed = JSON.parse(json);
    const result = TemplatesArraySchema.safeParse(parsed);
    
    if (!result.success) {
      throw new Error("Invalid template format: " + result.error.message);
    }
    
    const existingIds = new Set(existingItems.map((item) => item.id));
    const importedItems: TemplateItem[] = [];
    
    for (const item of result.data) {
      // Resolver colisiones de ID
      const newItem = { ...item };
      
      if (existingIds.has(item.id)) {
        // Crear nuevo ID único
        newItem.id = generateId();
        newItem.createdAt = Date.now();
      }
      
      newItem.updatedAt = Date.now();
      importedItems.push(newItem);
      existingIds.add(newItem.id);
    }
    
    return importedItems;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format");
    }
    throw error;
  }
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Crea una nueva plantilla vacía
 */
export function createEmptyTemplate(): TemplateItem {
  const now = Date.now();
  return {
    id: generateId(),
    name: "Nueva Plantilla",
    content: "",
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Duplica una plantilla existente
 */
export function duplicateTemplate(template: TemplateItem): TemplateItem {
  const now = Date.now();
  return {
    ...template,
    id: generateId(),
    name: `${template.name} (copia)`,
    createdAt: now,
    updatedAt: now,
  };
}
