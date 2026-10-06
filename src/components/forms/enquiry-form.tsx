"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { quoteSolutions } from "@/content/home";
import {
  hasErrors,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryValues,
} from "@/lib/form-validation";
import { cn } from "@/lib/utils";

const labelClass =
  "text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-body";

const emptyValues: EnquiryValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  solution: quoteSolutions[0] ?? "",
  brief: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

export function EnquiryForm({
  idPrefix = "enquiry",
  submitLabel = "Submit",
  className,
  requirePhone = true,
}: {
  idPrefix?: string;
  submitLabel?: string;
  className?: string;
  requirePhone?: boolean;
}) {
  const [values, setValues] = useState<EnquiryValues>(emptyValues);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);

  function update<K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (touched) {
        setErrors(validateEnquiry(next, { requirePhone }));
      }
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    const nextErrors = validateEnquiry(values, { requirePhone });
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    // No API yet — keep the success state for UX until backend is wired.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={cn("flex flex-col items-start justify-center", className)}>
        <h3 className="text-xl font-semibold">Request received</h3>
        <p className="mt-3 text-sm leading-relaxed text-body">
          Thank you. Our technical team will review your project brief and respond
          within 24 hours.
        </p>
        <Button
          variant="brandOutline"
          size="xl"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setValues(emptyValues);
            setErrors({});
            setTouched(false);
          }}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-5", className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-name`} className={labelClass}>
            Your Name
          </Label>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            autoComplete="name"
            placeholder="John Doe"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            className="h-11 bg-background"
          />
          <FieldError message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-company`} className={labelClass}>
            Company
          </Label>
          <Input
            id={`${idPrefix}-company`}
            name="company"
            autoComplete="organization"
            placeholder="Mahraj Arabia"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            aria-invalid={Boolean(errors.company)}
            className="h-11 bg-background"
          />
          <FieldError message={errors.company} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-phone`} className={labelClass}>
            Phone
          </Label>
          <Input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+966 55 000 0000"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            className="h-11 bg-background"
          />
          <FieldError message={errors.phone} />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-email`} className={labelClass}>
            Email
          </Label>
          <Input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            className="h-11 bg-background"
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-solution`} className={labelClass}>
          Industry Solution
        </Label>
        <Select
          value={values.solution}
          onValueChange={(value) => update("solution", value)}
        >
          <SelectTrigger
            id={`${idPrefix}-solution`}
            aria-invalid={Boolean(errors.solution)}
            className="h-11 w-full bg-background"
          >
            <SelectValue placeholder="Select a solution" />
          </SelectTrigger>
          <SelectContent>
            {quoteSolutions.map((solution) => (
              <SelectItem key={solution} value={solution}>
                {solution}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError message={errors.solution} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-brief`} className={labelClass}>
          Project Brief
        </Label>
        <Textarea
          id={`${idPrefix}-brief`}
          name="brief"
          rows={4}
          placeholder="Tell us about the area size and requirements..."
          value={values.brief}
          onChange={(e) => update("brief", e.target.value)}
          aria-invalid={Boolean(errors.brief)}
          className="bg-background"
        />
        <FieldError message={errors.brief} />
      </div>

      <Button type="submit" variant="brand" size="xl" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
