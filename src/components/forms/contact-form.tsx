"use client";

import { ArrowUpRight, CircleCheck, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { serviceOptions } from "@/data/services";
import type { ContactInput, ContactResponse } from "@/lib/validation";

const validateContact: Resolver<ContactInput> = async (...args) => {
  const [{ zodResolver }, { contactSchema }] = await Promise.all([
    import("@hookform/resolvers/zod"),
    import("@/lib/validation"),
  ]);
  return zodResolver(contactSchema)(...args);
};

const initialValues: ContactInput = {
  name: "",
  email: "",
  organization: "",
  phone: "",
  service: "General inquiry",
  description: "",
  website: "",
};
const inputFields = [
  {
    name: "name",
    label: "Full name",
    placeholder: "Your name",
    autoComplete: "name",
    type: "text",
    required: true,
    maxLength: 120,
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@company.com",
    autoComplete: "email",
    type: "email",
    required: true,
    maxLength: 254,
  },
  {
    name: "organization",
    label: "Organization name",
    placeholder: "Company or organization",
    autoComplete: "organization",
    type: "text",
    required: false,
    maxLength: 160,
  },
  {
    name: "phone",
    label: "Phone number",
    placeholder: "+962",
    autoComplete: "tel",
    type: "tel",
    required: false,
    maxLength: 40,
  },
] as const;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<ContactInput>({
    defaultValues: initialValues,
    resolver: validateContact,
  });
  const [result, setResult] = useState<ContactResponse>();
  const sending = useRef(false);

  async function submit(values: ContactInput) {
    if (sending.current) return;
    sending.current = true;
    setResult(undefined);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(25_000),
      });
      const payload: ContactResponse = await response.json();
      if (response.ok && payload.ok) {
        reset(initialValues);
        setResult(payload);
      } else if (!payload.ok) {
        for (const field of [
          ...inputFields.map(({ name }) => name),
          "service",
          "description",
        ] as const) {
          const message = payload.fields?.[field]?.[0];
          if (message) setError(field, { type: "server", message });
        }
        setResult(payload);
      } else {
        throw new Error("Unexpected response");
      }
    } catch {
      setResult({
        ok: false,
        message:
          "We couldn’t confirm your inquiry was sent. Please try again in a moment.",
      });
    } finally {
      sending.current = false;
    }
  }

  return (
    <form
      className="contact-form"
      aria-label="Project inquiry"
      noValidate
      onSubmit={(event) => {
        if (sending.current) {
          event.preventDefault();
          return;
        }
        setResult(undefined);
        clearErrors();
        void handleSubmit(submit)(event);
      }}
    >
      <div className="form-grid">
        {inputFields.map(
          ({
            name,
            label,
            placeholder,
            autoComplete,
            type,
            required,
            maxLength,
          }) => (
            <div className="form-field" key={name}>
              <label htmlFor={`contact-${name}`}>
                {label}
                {!required && <span>Optional</span>}
              </label>
              <input
                id={`contact-${name}`}
                {...register(name)}
                {...{
                  placeholder,
                  autoComplete,
                  type,
                  required,
                  maxLength,
                }}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `error-${name}` : undefined}
              />
              {errors[name] && (
                <p id={`error-${name}`} className="field-error">
                  {errors[name].message}
                </p>
              )}
            </div>
          ),
        )}
      </div>
      <div className="form-field">
        <label htmlFor="contact-service">Service of interest</label>
        <select
          id="contact-service"
          {...register("service")}
          aria-invalid={Boolean(errors.service)}
          aria-describedby={errors.service ? "error-service" : undefined}
        >
          {serviceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        {errors.service && (
          <p id="error-service" className="field-error">
            {errors.service.message}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="contact-description">Project description</label>
        <textarea
          id="contact-description"
          {...register("description")}
          placeholder="Tell us a little about what you want to build or improve."
          rows={5}
          required
          maxLength={5000}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "error-description" : undefined
          }
        />
        {errors.description && (
          <p id="error-description" className="field-error">
            {errors.description.message}
          </p>
        )}
      </div>
      <div hidden aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <button
        className="button form-submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle
              size={18}
              className="animate-spin motion-reduce:animate-none"
            />{" "}
            Sending inquiry…
          </>
        ) : (
          <>
            Send inquiry <ArrowUpRight size={18} />
          </>
        )}
      </button>
      {result?.ok && (
        <p className="form-result success" role="status">
          <CircleCheck size={19} /> Your inquiry was sent. Thank you for getting
          in touch.
        </p>
      )}
      {result && !result.ok && (
        <p className="form-result field-error" role="alert">
          {result.message}
        </p>
      )}
    </form>
  );
}
