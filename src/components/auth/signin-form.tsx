"use client";

import { FormEvent, useState } from "react";

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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema, type SignInInput } from "@/lib/validations";

export function SignInForm() {
  const [form, setForm] = useState<SignInInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = signInSchema.safeParse(form);
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) => i.path[0] === "email");
      const passwordIssue = result.error.issues.find(
        (i) => i.path[0] === "password",
      );

      setError({
        email: emailIssue?.message,
        password: passwordIssue?.message,
      });
      return;
    }

    if (result.success) {
      setError({});
    }

    console.log(form.email);
    console.log(form.password);
  }

  const handleChange =
    (key: "email" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center items-center w-full">
        <div className="bg-gray-200 py-10 px-5">
          <h1 className="text-center">STORIFY LOGO</h1>
        </div>
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="text"
                  value={form.email}
                  placeholder="m@example.com"
                  onChange={handleChange("email")}
                  required
                />
                {error.email ? (
                  <FieldDescription className="text-red-500 text-sm">
                    {error.email}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  value={form.password}
                  type="password"
                  onChange={handleChange("password")}
                  required
                />
              </Field>
              {error.password ? (
                <FieldDescription className="text-red-500 text-sm">
                  {error.password}
                </FieldDescription>
              ) : null}
              <Field>
                <Button type="submit">Sign In</Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/auth/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
