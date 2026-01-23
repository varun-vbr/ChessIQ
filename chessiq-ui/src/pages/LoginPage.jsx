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

function LoginPage() {
  const [errors, setErrors] = useState(new Map());
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // 🚨 CRITICAL

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const newErrors = new Map();

    if (!email) {
      newErrors.set("email", "Email is required");
    }

    if (!password) {
      newErrors.set("password", "Password is required");
    }

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return; // 🚨 STOP submission
    }

    setErrors(new Map()); // clear errors
    const payload = {
      email,
      password,
      remember: formData.get("remember") === "on",
    };

    const response = await fetch("http://localhost:3002/api/v1/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    console.log(response);
    if (response.status !== 200) {
      const loginErrors = new Map();
      loginErrors.set("email", "Invalid email or password");
      setErrors(loginErrors);
      return;
    } else {
      navigate("/mainpage/upload");
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
        {/*<Logo className="h-6 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />*/}
        <Heading>Sign in to your account</Heading>
        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" invalid={errors.has("email")} />
          {errors.has("email") && (
            <ErrorMessage>{errors.get("email")}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            invalid={errors.has("password")}
          />
          {errors.has("password") && (
            <ErrorMessage>{errors.get("password")}</ErrorMessage>
          )}
        </Field>
        <div className="flex items-center justify-between">
          <CheckboxField>
            <Checkbox name="remember" color="teal" />
            <Label>Remember me</Label>
          </CheckboxField>
          <Text>
            <TextLink onClick={() => navigate("/password-reset")}>
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>
        <Button type="submit" className="w-full" color="teal">
          Login
        </Button>
        <Text>
          Don’t have an account?{" "}
          <TextLink onClick={() => navigate("/signup")}>
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}
export default LoginPage;
