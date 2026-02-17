// Motor de plantillas - funciones puras

import type { ExtractVariablesResult, RenderTemplateOptions } from "@/types";

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
const INVALID_VARIABLE_REGEX = /\{\{\s*([^}]*)\s*\}\}/g;

/**
 * Extrae variables válidas e inválidas de una plantilla
 * Detecta tokens {{ ... }} aceptando espacios
 * Normaliza con trim y deduplica
 * Considera válido solo [a-zA-Z0-9_]+
 */
export function extractVariables(template: string): ExtractVariablesResult {
  const vars: string[] = [];
  const invalid: string[] = [];
  const seenVars = new Set<string>();
  const seenInvalid = new Set<string>();

  // Primero buscamos todas las coincidencias para identificar inválidas
  const allMatches = template.matchAll(INVALID_VARIABLE_REGEX);
  
  for (const match of allMatches) {
    const fullToken = match[0];
    const innerContent = match[1];
    const trimmedContent = innerContent.trim();
    
    // Verificar si es válido: empieza con letra o guión bajo, luego letras/números/guiones bajos
    const isValid = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedContent);
    
    if (isValid) {
      if (!seenVars.has(trimmedContent)) {
        seenVars.add(trimmedContent);
        vars.push(trimmedContent);
      }
    } else {
      // Guardar el token completo para mostrar el error
      if (!seenInvalid.has(fullToken)) {
        seenInvalid.add(fullToken);
        // Si tiene contenido, mostrar el contenido detectado, sino el token completo
        invalid.push(trimmedContent || fullToken);
      }
    }
  }

  return { vars, invalid };
}

/**
 * Renderiza una plantilla reemplazando las variables
 * Si falta o está vacío: usa placeholder según opciones
 */
export function renderTemplate(
  template: string,
  values: Record<string, string>,
  opts: RenderTemplateOptions = {}
): string {
  const { placeholderStyle = "brackets" } = opts;
  
  return template.replace(VARIABLE_REGEX, (_, varName) => {
    const trimmedVar = varName.trim();
    const value = values[trimmedVar];
    
    if (value && value.trim().length > 0) {
      return value;
    }
    
    // Placeholder según estilo
    return placeholderStyle === "brackets" ? `[${trimmedVar}]` : "";
  });
}

/**
 * Sincroniza valores: agrega nuevas keys con "" y elimina las que ya no existen
 * Mantiene los valores existentes para las variables que siguen presentes
 */
export function syncValues(
  vars: string[],
  prev: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const varName of vars) {
    // Mantener valor existente si existe, sino crear vacío
    result[varName] = prev[varName] ?? "";
  }
  
  return result;
}
