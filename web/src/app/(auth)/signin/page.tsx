"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch, ApiError } from "@/lib/api";

// Authresponse
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

export default function SigninPage() {
  const router = useRouter();

  // Data dari form register disimpan dengan useState()
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function yg dijalankan saat sudah pencet tombol submit
  // Data form sudah masuk via <input/> dan onChange ke useState()
  // Jadi saat user sudah pencet submit, handleSubmit() langsung lakukan apiFetch()
  async function handleSubmit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    setError("");
    setIsSubmitting(true); // Menandai kalau sudah submit

    try {
      // Ambil data dengan fetch
      // Otomatis throw Error kalau request gagal
      const data = await apiFetch<AuthResponse>("/auth/signin", {
        method: "POST",
        body: { username, email, password },
      });

      // Dapat access token, dimana kita masukin ke localStorage
      localStorage.setItem("access_token", data.access);

      // Signin berhasil --> redirect dengan next router ke '/'
      //* Sangat penting untuk redirect kalau sukses
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Signin failed.");
    } finally {
      setIsSubmitting(false); // Reset lagi
    }
  }

  // JSX yg akan diberikan ke user saat bukan '/signin'
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Signin Card */}
      <Card className="w-full max-w-sm">
        {/* CardHeader judul signin */}
        <CardHeader>
          <CardTitle>Daftar Akun</CardTitle>
          <CardDescription>
            Buat akun buat mulai bikin flashcard.
          </CardDescription>
        </CardHeader>
        {/* CardContent tempat form signin */}
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} //* PENTING! simpan input username ke useState()
                required
              />
            </div>
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error message yang muncul setelah form saat ada error */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* disabled={} bantu guard double submit */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Udah punya akun?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
