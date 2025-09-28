import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";

interface InputWithLabelProps {
  label: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  isRequired?: boolean;
}

export function InputWithLabel({
  label,
  wrapperClassName,
  labelClassName,
  inputClassName,
  placeholder,
  isRequired,
}: InputWithLabelProps) {
  return (
    <div className={wrapperClassName}>
      <Label className={cn("text-[var(--text-primary)] text-base font-normal", labelClassName)}>
        {label}
        {isRequired && "*"}
      </Label>
      <Input
        className={
          cn(
            "text-base font-normal text-[var(--text-primary)] h-[56px] border border-[var(--border-input-label)] rounded-2xl bg-[var(--background-input-label)] placeholder:text-[var(--text-secondary)]",
            inputClassName,
          )
        }
        placeholder={placeholder}
      />
    </div>
  );
}
