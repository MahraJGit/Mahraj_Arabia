"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { validateEmail } from "@/lib/form-validation";
import { cn } from "@/lib/utils";

export function SubscribeForm({
  placeholder = "Enter your email address here...",
  className,
  inputClassName,
}: {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validateEmail(email);
    setError(next);
    if (next) return;
    setDone(true);
  }

  if (done) {
    return (
      <p className={cn("text-sm font-medium text-white", className)}>
        Thanks — you&apos;re subscribed.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(validateEmail(e.target.value));
          }}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={cn(
            "h-12 flex-1 rounded border border-white/15 bg-white/15 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand/50",
            error && "border-destructive ring-2 ring-destructive/30",
            inputClassName
          )}
        />
        <Button type="submit" variant="brand" size="xl">
          Join Now
        </Button>
      </div>
      {error ? (
        <p className="text-xs text-red-200" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
