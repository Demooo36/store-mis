"use client";

import { useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Link from "next/link";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";

const handleSubmit = () => {
  console.log("test");
};
export default function SignInForm() {
  const [show, setShow] = useState({
    password: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="flex flex-col gap-2">
      <form>
        <FieldGroup>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Sign in to your account</h1>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="Email" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                placeholder="Password"
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"

                // aria-label={}
                // aria-pressed={}
              >
                {/* {} */}
              </Button>
            </div>
          </Field>
          <Field>
            <Button type="submit">Sign In</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center [&>a]:no-underline">
        Don't have an account? {""}
        <Link className="text-blue-500 hover:text-blue-500" href="/auth/signup">
          Sign Up
        </Link>
      </FieldDescription>
      <FieldDescription className="px-6 text-center">
        By continuing, you agree to Storify's <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
