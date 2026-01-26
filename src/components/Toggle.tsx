import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ToggleProps {
  label: string;
  value: boolean | "unknown" | null;
  onChange: (value: boolean | "unknown" | null) => void;
  yesLabel?: string;
  noLabel?: string;
  unknownLabel?: string;
  disabled?: boolean;
}

const Toggle = ({
  label,
  value,
  onChange,
  yesLabel = "Tak",
  noLabel = "Nie",
  unknownLabel,
  disabled = false
}: ToggleProps) => {
  const current = value === null ? "" : value === "unknown" ? "unknown" : value ? "yes" : "no";
  const columns = unknownLabel ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`space-y-2${disabled ? " pointer-events-none opacity-60" : ""}`}>
      <Label>{label}</Label>
      <ToggleGroup
        type="single"
        value={current}
        onValueChange={(next) => {
          if (next === "yes") onChange(true);
          if (next === "no") onChange(false);
          if (next === "unknown") onChange("unknown");
        }}
        className={`grid w-full ${columns} gap-2`}
      >
        <ToggleGroupItem value="yes" disabled={disabled}>
          {yesLabel}
        </ToggleGroupItem>
        <ToggleGroupItem value="no" disabled={disabled}>
          {noLabel}
        </ToggleGroupItem>
        {unknownLabel && (
          <ToggleGroupItem value="unknown" disabled={disabled}>
            {unknownLabel}
          </ToggleGroupItem>
        )}
      </ToggleGroup>
    </div>
  );
};

export default Toggle;
