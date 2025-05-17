import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { signIn, user, session } = useAuth();
  const [emailVerificationNeeded, setEmailVerificationNeeded] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>();

  useEffect(() => {
    const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";

    if (user && session && !isLoggedOut && !isSubmitting) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, session, navigate, isSubmitting]);

  const onSubmit = async (data: SignInFormValues) => {
    try {
      localStorage.removeItem("isLoggedOut");
      setIsSubmitting(true);

      const result = await signIn(data.email, data.password);

      if (result?.error === "email_not_confirmed") {
        setEmailVerificationNeeded(true);
        setVerificationEmail(data.email);
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold">Sign In</h3>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      {emailVerificationNeeded && (
        <Alert className="bg-amber-50 border-amber-200">
          <Mail className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">
            Email verification required
          </AlertTitle>
          <AlertDescription className="text-amber-700">
            Please check your inbox at <strong>{verificationEmail}</strong> and
            click the verification link before signing in.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
