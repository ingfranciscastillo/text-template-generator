# Text Template Generator | Generador de Plantillas de Texto

A powerful text template generator with dynamic variables, real-time preview, and local template management.

Un potente generador de plantillas de texto con variables dinámicas, preview en tiempo real y gestión de plantillas local.

---

## Features | Características

**English:**

- 📝 **Intuitive template editor** - Write templates with `{{name}}`, `{{date}}` variables
- ⚡ **Live rendering** - See the final result as you type
- 🎯 **Automatic detection** - Variables are extracted automatically from templates
- 💾 **Local persistence** - Save templates to localStorage
- 🔄 **Import/Export JSON** - Share or backup your templates easily
- 📋 **Copy to clipboard** - One click to copy the result
- 🗑️ **Full CRUD** - Create, edit, rename, and delete templates

**Español:**

- 📝 **Editor de plantillas intuitivo** - Escribe plantillas con variables `{{nombre}}`, `{{fecha}}`
- ⚡ **Renderizado en vivo** - Visualiza el resultado final mientras escribes
- 🎯 **Detección automática** - Extrae variables automáticamente de la plantilla
- 💾 **Persistencia local** - Guarda plantillas en localStorage
- 🔄 **Import/Export JSON** - Comparte o respalda tus plantillas fácilmente
- 📋 **Copiar al portapapeles** - Un click para copiar el resultado
- 🗑️ **CRUD completo** - Crea, edita, renombra y elimina plantillas

---

## Demo | Demostración

Open the project in your browser and start creating templates instantly.  
Abre el proyecto en tu navegador y empieza a crear plantillas al instante.

---

## Installation | Instalación

```bash
# Clone the repository | Clonar el repositorio
git clone https://github.com/tu-usuario/text-template-generator.git
cd text-template-generator

# Install dependencies | Instalar dependencias
npm install

# Start development server | Iniciar servidor de desarrollo
npm run dev
```

---

## Usage | Uso

### English

1. **Create a template** with variables using the `{{variable}}` format
2. **Variables are automatically detected** and appear as input fields
3. **Fill in the fields** and the result is generated in real-time
4. **Copy the result** with a single click

### Español

1. **Crea una plantilla** con variables usando el formato `{{variable}}`
2. **Las variables se detectan automáticamente** y aparecen como campos de entrada
3. **Completa los campos** y el resultado se genera en tiempo real
4. **Copia el resultado** con un solo click

**Example | Ejemplo:**

```
Hello {{name}},

Thank you for your purchase of {{product}} for ${{price}}.

Estimated delivery date: {{delivery_date}}

Best regards,
{{company}}
```

---

## Tech Stack | Tecnologías

- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vitest](https://vitest.dev/) - Testing

---

## Available Scripts | Scripts Disponibles

```bash
npm run dev      # Start dev server / Iniciar servidor de desarrollo
npm run build    # Build for production / Compilar para producción
npm run preview  # Preview production build / Previsualizar build
npm run test     # Run tests / Ejecutar tests
npm run lint     # Run ESLint / Ejecutar ESLint
```

---

## Supported Variable Types | Tipos de Variables Soportados

- `{{name}}` - Simple variables / Variables simples
- `{{full_name}}` - Snake_case variables / Variables con guiones bajos
- `{{currentDate}}` - CamelCase variables / Variables camelCase

---

## License | Licencia

[MIT](LICENSE)
