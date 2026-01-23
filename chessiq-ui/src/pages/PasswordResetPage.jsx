import { AuthLayout } from "../components/auth-layout";
import { Button } from "../components/button";
import { Checkbox, CheckboxField } from "../components/checkbox";
import { ErrorMessage, Field, Label } from "../components/fieldset";
import { Heading } from "../components/heading";
import { Input } from "../components/input";
import { Strong, Text, TextLink } from "../components/text";
import { useNavigate } from "react-router-dom";

function PasswordResetPage() {
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault(); // 🚨 CRITICAL
    navigate("/");
  }
  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Heading>Reset your password</Heading>
        <Text>
          Enter your email and we’ll send you a link to reset your password.
        </Text>
        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" />
        </Field>
        <Button type="submit" className="w-full" color="teal">
          Reset password
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
export default PasswordResetPage;
