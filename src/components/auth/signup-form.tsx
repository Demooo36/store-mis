"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SignUpForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ password: false, confirm: false });
  const toggleShow = (key: "password" | "confirm") =>
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(form.email);
    console.log(form.password);
    console.log(form.confirmPassword);
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Create your account</h1>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={show.password ? "text" : "password"}
                placeholder="Password"
                required
                className="pr-10"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => toggleShow("password")}
                aria-label={show.password ? "Hide password" : "Show password"}
                aria-pressed={show.password}
              >
                {show.password ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                id="confirm-password"
                type={show.confirm ? "text" : "password"}
                placeholder="Password"
                required
                className="pr-10"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => toggleShow("confirm")}
                aria-label={show.confirm ? "Hide password" : "Show password"}
                aria-pressed={show.confirm}
              >
                {show.confirm ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </Field>
          <Field>
            <Button type="submit">Sign Up</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center [&>a]:no-underline">
        Already have an account? {""}
        <Link className="font-bold" href="/auth/signin">
          Login
        </Link>
      </FieldDescription>
      <FieldDescription className="px-6 text-center text-stone-400">
        By continuing, you agree to Storify's <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
