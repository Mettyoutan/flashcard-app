"use client";

import { useState, type SubmitEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { Card as CardType } from "@/types/card";
import { ApiError, apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

const FRONT_MAX = 100;
const BACK_MAX = 300;

type CardItemProps = {
  card: CardType;
  // Function dijalankan saat update
  onUpdated: (card: CardType) => void;
  // Saat deleted
  onDeleted: (cardId: string) => void;
};

export default function CardItem({
  card,
  onUpdated,
  onDeleted,
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [front, setFront] = useState(card.front); // Default valuenya langsung ada
  const [back, setBack] = useState(card.back);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jadi di dalam cardItem, bisa langsung edit manual
  // Dimana akan ada popup (trigerred oleh isEditing)

  // Saat ingin edit, memaksa/memastikan bahwa front & back sama persis
  function startEditing() {
    setFront(card.front);
    setBack(card.back);
    setError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setError("");
  }

  async function handleSave(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const updatedCard = await apiFetch<CardType>(
        `/decks/${card.deckId}/cards/${card.id}`,
        {
          method: "PATCH",
          body: { front, back },
        },
      );
      onUpdated(updatedCard);
      setIsEditing(false);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Gagal menghapus card.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Hapus card ini?")) return;

    try {
      await apiFetch<CardType>(`/decks/${card.deckId}/cards/${card.id}`, {
        method: "DELETE",
      });
      onDeleted(card.id);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Gagal hapus card.");
    }
  }

  if (isEditing) {
    return (
      <Card>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`front-${card.id}`}>Depan</Label>
              <Input
                id={`front-${card.id}`}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                maxLength={FRONT_MAX}
                required
              />
              <p
                className={cn(
                  "text-xs",
                  front.length >= FRONT_MAX
                    ? "text-red-500"
                    : "text-muted-foreground",
                )}
              >
                {front.length}/{FRONT_MAX}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`back-${card.id}`}>Belakang</Label>
              <Input
                id={`back-${card.id}`}
                value={back}
                onChange={(e) => setBack(e.target.value)}
                maxLength={BACK_MAX}
                required
              />
              <p
                className={cn(
                  "text-xs",
                  back.length >= BACK_MAX
                    ? "text-red-500"
                    : "text-muted-foreground",
                )}
              >
                {back.length}/{BACK_MAX}
              </p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Nyimpen..." : "Simpan"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEditing}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{card.front}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{card.back}</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={startEditing}>
            Edit
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
