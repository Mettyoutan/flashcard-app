"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

/*
  Kenapa pakai useEffect?
  - Kalau langsung ubah sesuatu tanpa useEffect, di component langsung, maka 
    tiap kali render component, effect tersebut jalan terus menerus
*/

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use effect dijalankan setelah component selesai render
  // Digunakan untuk akses dunia luar
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("access_token")));
    setIsLoading(false);
  }, []);

  async function handleLogout() {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
    // Remove access from localStorage
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
  }

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Flashcard App</h1>

      {/* Logika cek apakah sudah login */}
      {isLoggedIn ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <div className="flex gap-4">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button variant="outline" onClick={() => router.push("/signin")}>
            Daftar
          </Button>
        </div>
      )}
    </div>
  );
}
