"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpSchema, type SignUpInput } from "@/lib/validations";

import { useState } from "react";

export function SignUpForm() {
  const getFieldError = (
    nextForm: SignUpInput,
    key: "fullName" | "email" | "password" | "confirmPassword",
  ) => {
    const result = signUpSchema.safeParse(nextForm);
    if (result.success) {
      return undefined;
    }

    const issue = result.error.issues.find((i) => i.path[0] === key);
    return issue?.message;
  };

  const handleChange =
    (key: "fullName" | "email" | "password" | "confirmPassword") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextForm = { ...form, [key]: event.target.value };
      setForm(nextForm);
      setError((prev) => {
        const nextError = { ...prev, [key]: getFieldError(nextForm, key) };
        if (key === "password") {
          nextError.confirmPassword = getFieldError(
            nextForm,
            "confirmPassword",
          );
        }
        return nextError;
      });
    };
  const [form, setForm] = useState<SignUpInput>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = signUpSchema.safeParse(form);
    if (!result.success) {
      const fullNameIssue = result.error.issues.find(
        (i) => i.path[0] === "fullName",
      );
      const emailIssue = result.error.issues.find((i) => i.path[0] === "email");
      const passwordIssue = result.error.issues.find(
        (i) => i.path[0] === "password",
      );
      const confirmPasswordIssue = result.error.issues.find(
        (i) => i.path[0] === "confirmPassword",
      );

      setError({
        fullName: fullNameIssue?.message,
        email: emailIssue?.message,
        password: passwordIssue?.message,
        confirmPassword: confirmPasswordIssue?.message,
      });
      return;
    }

    if (result.success) {
      setError({});
    }
    console.log(form.fullName);
    console.log(form.email);
    console.log(form.password);
    console.log(form.confirmPassword);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center items-center w-full">
        <div className="bg-gray-200 py-10 px-5">
          <h1 className="text-center">STORIFY LOGO</h1>
        </div>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                />
                <FieldError>{error.fullName}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                />
                <FieldError>{error.email}</FieldError>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={form.password}
                      onChange={handleChange("password")}
                    />
                    <FieldError>{error.password}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                    />
                    <FieldError>{error.confirmPassword}</FieldError>
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/auth/signin">Sign In</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
