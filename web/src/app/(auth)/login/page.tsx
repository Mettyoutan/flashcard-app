"use client"; // Penting agar bisa ditandai client component dan bisa pakai react useState, dll

import { useState, SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "lucide-react";
import { Input } from "@base-ui/react";
import { Label } from "@/components/ui/label";

interface AuthResponse {
  access: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Karena form, simpan state isSubmitting

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    // Set default dulu
    setError("");
    setIsSubmitting(true);

    try {
      const data = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      // Simpen access token
      localStorage.setItem("access_token", data.access);

      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk ke akun kamu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Masuk..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Belum punya akun?{" "}
            <Link href="/signin" className="underline">
              Daftar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
