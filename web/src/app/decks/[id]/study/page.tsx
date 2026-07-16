"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Deck } from "@/types/deck";
import type { Card as CardType } from "@/types/card";
import { CardHeader, Card, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiError, apiFetch } from "@/lib/api";

export default function StudyPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryTick, setRetryTick] = useState(0);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  // Pasang logika flip dengan index
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Prev dan reset isFlipped
  function handlePrev() {
    setCurrentIdx((idx) => (idx > 0 ? idx - 1 : 0));
    setIsFlipped(false);
  }

  function handleNext() {
    setCurrentIdx((idx) => idx + 1);
    setIsFlipped(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    let ignore = false;

    async function fecthData() {
      try {
        const [deck, cards] = await Promise.all([
          apiFetch<Deck>(`/decks/${id}`, { method: "GET" }),
          apiFetch<CardType[]>(`/decks/${id}/cards`, { method: "GET" }),
        ]);

        if (!ignore) {
          setDeck(deck);
          setCards(cards);
          setCurrentIdx(0);
          setIsFlipped(false);
        }
      } catch (e) {
        if (ignore) return;
        // Check UNAUHTHORIZED
        if (e instanceof ApiError && e.status === 401) {
          router.replace("/login");
          return;
        }
        setError(
          e instanceof ApiError ? e.message : "Gagal mengambil study page.",
        );
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fecthData();

    return () => {
      ignore = true;
    };
  }, [router, retryTick, id]);

  if (isLoading) return null;

  // Ambil current card dari idx
  // Setiap currIdx berubah, state refresh
  const currentCard = cards[currentIdx];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">{deck?.title ?? "Deck"}</h1>

      {error && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-red-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setRetryTick((t) => t + 1);
            }}
          >
            Coba lagi
          </Button>
        </div>
      )}

      {!error && cards.length === 0 && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">
            Belum ada card di deck ini, tambahkan dulu di halaman deck.
          </p>
          <Link href={`/decks/${id}`} className="text-sm underline">
            Balik ke halaman deck
          </Link>
        </div>
      )}

      {!error && cards.length > 0 && currentCard && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Kartu {currentIdx + 1} dari {cards.length}
          </p>
          <Card
            className="cursor-pointer"
            onClick={() => setIsFlipped((prev) => !prev)}
          >
            <CardHeader>
              <CardTitle>{!isFlipped ? "Depan" : "Belakang"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mt-2 text-xs text-muted-foreground">
                {!isFlipped ? currentCard.front : currentCard.back}
              </p>
            </CardContent>
          </Card>

          {/* Button untuk prev dan next */}
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              onClick={handlePrev}
              disabled={currentIdx === 0} // Sangat penting
            >
              Prev
            </Button>
            <Button
              variant={"outline"}
              onClick={handleNext}
              disabled={currentIdx === cards.length - 1} // Sangat penting
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
