// Tipos para el Generador de Plantillas de Texto

export interface TemplateItem {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type PlaceholderStyle = "brackets" | "empty";

export interface ExtractVariablesResult {
  vars: string[];
  invalid: string[];
}

export interface RenderTemplateOptions {
  placeholderStyle?: PlaceholderStyle;
}
