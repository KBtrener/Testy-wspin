import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroup = ({
  label,
  value,
  options,
  onChange,
  disabled = false
}: RadioGroupProps) => {
  return (
    <div className={`space-y-2${disabled ? " pointer-events-none opacity-60" : ""}`}>
      <Label>{label}</Label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => next && onChange(next)}
        className="grid w-full gap-2 sm:grid-cols-2"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} disabled={disabled}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default RadioGroup;
