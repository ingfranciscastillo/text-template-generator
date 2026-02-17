import { describe, it, expect } from "vitest";
import {
  extractVariables,
  renderTemplate,
  syncValues,
} from "./templateEngine";

describe("templateEngine", () => {
  describe("extractVariables", () => {
    it("debe extraer variables básicas", () => {
      const template = "Hola {{nombre}}, bienvenido a {{empresa}}";
      const result = extractVariables(template);
      
      expect(result.vars).toEqual(["nombre", "empresa"]);
      expect(result.invalid).toEqual([]);
    });

    it("debe manejar espacios alrededor de variables", () => {
      const template = "Hola {{  nombre  }}, bienvenido";
      const result = extractVariables(template);
      
      expect(result.vars).toEqual(["nombre"]);
      expect(result.invalid).toEqual([]);
    });

    it("debe deduplicar variables repetidas", () => {
      const template = "{{nombre}} {{nombre}} {{nombre}}";
      const result = extractVariables(template);
      
      expect(result.vars).toEqual(["nombre"]);
      expect(result.vars).toHaveLength(1);
    });

    it("debe detectar variables inválidas", () => {
      const template = "Hola {{123variable}} y {{}} y {{!invalid}}";
      const result = extractVariables(template);
      
      expect(result.vars).toEqual([]);
      expect(result.invalid.length).toBeGreaterThan(0);
    });

    it("debe aceptar guiones bajos en variables", () => {
      const template = "{{primer_nombre}} {{nombre_completo_2}}";
      const result = extractVariables(template);
      
      expect(result.vars).toEqual(["primer_nombre", "nombre_completo_2"]);
      expect(result.invalid).toEqual([]);
    });

    it("debe manejar plantilla sin variables", () => {
      const template = "Texto simple sin variables";
      const result = extractVariables(template);
      
      expect(result.vars).toEqual([]);
      expect(result.invalid).toEqual([]);
    });

    it("debe extraer variables en orden de aparición", () => {
      const template = "{{b}} {{a}} {{c}} {{b}}";
      const result = extractVariables(template);
      
      expect(result.vars).toEqual(["b", "a", "c"]);
    });
  });

  describe("renderTemplate", () => {
    it("debe reemplazar variables correctamente", () => {
      const template = "Hola {{nombre}}";
      const values = { nombre: "Juan" };
      
      const result = renderTemplate(template, values);
      
      expect(result).toBe("Hola Juan");
    });

    it("debe usar placeholder [var] por defecto", () => {
      const template = "Hola {{nombre}}";
      const values = {};
      
      const result = renderTemplate(template, values);
      
      expect(result).toBe("Hola [nombre]");
    });

    it("debe usar placeholder vacío cuando se especifica", () => {
      const template = "Hola {{nombre}}";
      const values = {};
      
      const result = renderTemplate(template, values, { placeholderStyle: "empty" });
      
      expect(result).toBe("Hola ");
    });

    it("debe manejar múltiples variables", () => {
      const template = "{{saludo}} {{nombre}}, bienvenido a {{lugar}}";
      const values = { saludo: "Hola", nombre: "María", lugar: "Madrid" };
      
      const result = renderTemplate(template, values);
      
      expect(result).toBe("Hola María, bienvenido a Madrid");
    });

    it("debe manejar valores vacíos como faltantes", () => {
      const template = "Hola {{nombre}}";
      const values = { nombre: "   " };
      
      const result = renderTemplate(template, values);
      
      expect(result).toBe("Hola [nombre]");
    });

    it("debe manejar espacios en variables", () => {
      const template = "Hola {{  nombre  }}";
      const values = { nombre: "Pedro" };
      
      const result = renderTemplate(template, values);
      
      expect(result).toBe("Hola Pedro");
    });
  });

  describe("syncValues", () => {
    it("debe agregar nuevas variables con valor vacío", () => {
      const vars = ["a", "b"];
      const prev = {};
      
      const result = syncValues(vars, prev);
      
      expect(result).toEqual({ a: "", b: "" });
    });

    it("debe mantener valores existentes", () => {
      const vars = ["a", "b"];
      const prev = { a: "valor_a", c: "valor_c" };
      
      const result = syncValues(vars, prev);
      
      expect(result).toEqual({ a: "valor_a", b: "" });
    });

    it("debe eliminar variables que ya no existen", () => {
      const vars = ["a"];
      const prev = { a: "valor_a", b: "valor_b" };
      
      const result = syncValues(vars, prev);
      
      expect(result).toEqual({ a: "valor_a" });
      expect(result).not.toHaveProperty("b");
    });

    it("debe manejar array vacío de variables", () => {
      const vars: string[] = [];
      const prev = { a: "valor_a" };
      
      const result = syncValues(vars, prev);
      
      expect(result).toEqual({});
    });
  });
});
