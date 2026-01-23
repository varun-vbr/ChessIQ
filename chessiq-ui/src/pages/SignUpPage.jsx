import { AuthLayout } from "../components/auth-layout";
import { Button } from "../components/button";
import { Checkbox, CheckboxField } from "../components/checkbox";
import { ErrorMessage, Field, Label } from "../components/fieldset";
import { Heading } from "../components/heading";
import { Input } from "../components/input";
import { Strong, Text, TextLink } from "../components/text";
//import { Logo } from "./logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
  const [errors, setErrors] = useState(new Map());
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault(); // 🚨 CRITICAL

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const newErrors = new Map();

    if (!name) {
      newErrors.set("name", "Name is required");
    }

    if (!email) {
      newErrors.set("email", "Email is required");
    }

    if (!password) {
      newErrors.set("password", "Password is required");
    }
    if (!confirmPassword) {
      newErrors.set("confirmPassword", "Confirm Password is required");
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.set("confirmPassword", "Passwords do not match");
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return; // 🚨 STOP submission
    }

    setErrors(new Map()); // clear errors
    const payload = {
      name,
      email,
      password,
      passwordConfirm: confirmPassword,
    };

    const response = await fetch("http://localhost:3002/api/v1/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    console.log(response);
    if (response.status !== 201) {
      const loginErrors = new Map();
      loginErrors.set("name", "Error creating account");
      setErrors(loginErrors);
      return;
    } else {
      navigate("/mainpage");
      const result = await response.json();
      console.log(result);
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Heading>Create your account</Heading>
        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" invalid={errors.has("email")} />
          {errors.has("email") && (
            <ErrorMessage>{errors.get("email")}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Full name</Label>
          <Input name="name" invalid={errors.has("name")} />
          {errors.has("name") && (
            <ErrorMessage>{errors.get("name")}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            invalid={errors.has("password")}
            autoComplete="new-password"
          />
          {errors.has("password") && (
            <ErrorMessage>{errors.get("password")}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            invalid={errors.has("confirmPassword")}
            autoComplete="new-password"
          />
          {errors.has("confirmPassword") && (
            <ErrorMessage>{errors.get("confirmPassword")}</ErrorMessage>
          )}
        </Field>
        <CheckboxField>
          <Checkbox name="remember" color="teal" />
          <Label>Get emails about product updates and news.</Label>
        </CheckboxField>
        <Button type="submit" className="w-full" color="teal">
          Create account
        </Button>
        <Text>
          Already have an account?{" "}
          <TextLink onClick={() => navigate("/")}>
            <Strong>Sign in</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}

export default SignUpPage;
