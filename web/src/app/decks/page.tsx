"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { type Deck } from "@/types/deck";
import DeckCard from "@/components/decks/DeckCard";
import CreateDeckForm from "@/components/decks/CreateDeckForm";
import { Button } from "@/components/ui/button";

export default function DeckPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]); // Buat state untuk banyak decks

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Buat loading di awal
  const [retryTick, setRetryTick] = useState(0);

  function handleCreated(deck: Deck) {
    setDecks((prev) => [...prev, deck]);
  }

  useEffect(() => {
    // DeckPage butuh Authorization, ambil access dulu, buat di cek aja
    // Kalau tidak ada, redirect
    // apiFetch() sudah ambil access token sendiri
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    let ignore = false;

    async function loadDecks() {
      try {
        // Fetch decks
        const decks = await apiFetch<Deck[]>("/decks", {
          method: "GET",
        });
        if (!ignore) setDecks(decks);
      } catch (e: unknown) {
        if (ignore) return;
        if (e instanceof ApiError && e.status === 401) {
          router.replace("/login");
          return;
        }
        setError(e instanceof ApiError ? e.message : "Failed fetching deck.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadDecks();
    return () => {
      ignore = true;
    }; // Fungsi yg dijalankan ketika component unmount / mati
    // Jadi langsung set ignore ke true, sehingga ketika response dari API baru datang
    // , setState jelas gabakal jalan

    //* Jika sebuah component unmount, ignore langsung true, hasil di tulis ke state
    //* Intinya mencegah hasil fecthAPi dipakai jika component unmount
  }, [router, retryTick]);
  // Setiap retryTick berubah, langsung pancing useEffect

  if (isLoading) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">Deck Kamu</h1>
      <CreateDeckForm onCreated={handleCreated}></CreateDeckForm>

      {error && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setRetryTick((t) => t + 1); // Pancing useEffect
            }}
          >
            Coba lagi
          </Button>
        </div>
      )}

      {!error && decks.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Belum ada deck, bikin yang pertama di atas ↑
        </p>
      )}

      {!error && decks.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Iterasi untuk buat DeckCard
            Penting sekali untuk masukin key nya yakni deck.id agar unique
          */}
          {decks.map((deck) => (
            <DeckCard key={deck.id} deck={deck}></DeckCard>
          ))}
        </div>
      )}
    </div>
  );
}
