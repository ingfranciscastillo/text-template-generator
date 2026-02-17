import * as React from "react";
import { Input } from "@/components/ui/input";

interface VariablesFormProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export const VariablesForm: React.FC<VariablesFormProps> = ({
  variables,
  values,
  onChange,
}) => {
  const handleValueChange = (varName: string, value: string) => {
    onChange({
      ...values,
      [varName]: value,
    });
  };

  if (variables.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
        No hay variables detectadas. Usa {"{{variable}}"} en tu plantilla para crear campos de entrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">
        Variables ({variables.length})
      </h3>
      <div className="space-y-3">
        {variables.map((varName) => (
          <div key={varName} className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {varName}
            </label>
            <Input
              value={values[varName] || ""}
              onChange={(e) => handleValueChange(varName, e.target.value)}
              placeholder={`Valor para ${varName}`}
              className="h-9"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
