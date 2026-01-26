import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NumberFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  step?: number;
  min?: number;
  placeholder?: string;
  integer?: boolean;
  helper?: string;
  disabled?: boolean;
}

const NumberField = ({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  placeholder,
  integer = false,
  helper,
  disabled = false
}: NumberFieldProps) => {
  const isInvalid =
    value !== null &&
    (value < min || (integer && !Number.isInteger(value)));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        inputMode={integer ? "numeric" : "decimal"}
        step={step}
        min={min}
        placeholder={placeholder}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) => {
          const next = event.target.value;
          if (next === "") {
            onChange(null);
            return;
          }
          const parsed = Number(next);
          if (Number.isNaN(parsed)) return;
          onChange(parsed);
        }}
        className={cn(
          isInvalid && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
      {isInvalid && (
        <p className="text-xs text-destructive">
          {integer
            ? "Wartość musi być liczbą całkowitą."
            : "Wartość nie może być ujemna."}
        </p>
      )}
    </div>
  );
};

export default NumberField;
