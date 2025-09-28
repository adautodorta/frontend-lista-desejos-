"use client";

import {EyeIcon, EyeOffIcon} from "lucide-react";
import {useState} from "react";

import {Label} from "./label";

import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

interface PasswordInputProps {
  className?: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | undefined;
}

export const PasswordInput = ({className, label, onChange, error}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const type = showPassword ? "text" : "password";
  const Icon = showPassword ? EyeOffIcon : EyeIcon;

  const handleToggle = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <>
      <Label className={cn(
        "text-base font-normal mt-[24px]",
        error ? "text-[var(--error-color)]" : "text-[var(--text-primary)]",
      )}
      >
        {label}
      </Label>

      <div className="relative mt-[8px]">
        <Input
          onChange={onChange}
          type={type}
          className={cn(
            "text-base font-normal text-[var(--text-primary)] h-[56px] rounded-2xl pr-12",
            "placeholder:text-[var(--text-secondary)]",
            error
              ? "border border-[var(--error-color)] bg-[var(--background-input-label)]"
              : "border border-[var(--border-input-label)] bg-[var(--background-input-label)]",
            className,
          )}
        />

        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          onClick={handleToggle}
        >
          <Icon className="stroke-muted-foreground size-6" />
        </button>
      </div>
    </>
  );
};
