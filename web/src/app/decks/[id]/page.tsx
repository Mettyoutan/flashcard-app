"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Deck } from "@/types/deck";
import { type Card as CardType } from "@/types/card";
import { apiFetch, ApiError } from "@/lib/api";
import CardItem from "@/components/cards/CardItem";
import CreateCardForm from "@/components/cards/CreateCardForm";
import { Button } from "@/components/ui/button";

/**
 ** /decks/[id]
 */
export default function DeckDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [deck, setDeck] = useState<Deck | null>(null); // Dibuat null default karena deck belum ada, harus fetch ke api dari ID dahulu
  const [cards, setCards] = useState<CardType[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryTick, setRetryTick] = useState(0);

  function handleCardCreated(card: CardType) {
    setCards((prev) => [card, ...prev]);
  }

  function handleCardUpdated(card: CardType) {
    setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
  }

  function handleCardDeleted(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  }

  useEffect(() => {
    // Ambil access
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    let ignore = false;

    async function loadData() {
      try {
        const [deck, cards] = await Promise.all([
          apiFetch<Deck>(`/decks/${id}`, { method: "GET" }),
          apiFetch<CardType[]>(`/decks/${id}/cards`, { method: "GET" }),
        ]);
        if (!ignore) {
          setDeck(deck);
          setCards(cards);
        }
      } catch (e) {
        if (ignore) return;
        if (e instanceof ApiError && e.status === 401) {
          router.replace("/login");
          return;
        }
        setError(e instanceof ApiError ? e.message : "Gagal mengambil deck.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [id, router, retryTick]);

  if (isLoading) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">{deck?.title ?? "Deck"}</h1>

      <CreateCardForm deckId={id} onCreated={handleCardCreated} />

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
        <p className="text-sm text-muted-foreground">
          Belum ada card, bikin yang pertama di atas ↑
        </p>
      )}

      {!error && cards.length > 0 && (
        <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onUpdated={handleCardUpdated}
              onDeleted={handleCardDeleted}
            ></CardItem>
          ))}
        </div>
      )}
    </div>
  );
}
