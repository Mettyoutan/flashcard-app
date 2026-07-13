"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import type { Card as CardType } from "@/types/card";
import { ApiError, apiFetch } from "@/lib/api";

const FRONT_MAX = 100;
const BACK_MAX = 300;

type CreateCardFormProps = {
  deckId: string;
  onCreated: (card: CardType) => void;
};

export default function CreateCardForm({
  deckId,
  onCreated,
}: CreateCardFormProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmiting(true);

    try {
      const createdCard = await apiFetch<CardType>(`/decks/${deckId}/cards`, {
        method: "POST",
      });
      onCreated(createdCard);
      setFront("");
      setBack("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal bikin card.");
    } finally {
      setIsSubmiting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bikin Card Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-4">
            <Label htmlFor="front">Depan</Label>
            <Input
              id="front"
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
            <Label htmlFor="back">Belakang</Label>
            <Input
              id="back"
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
          <button type="submit" disabled={isSubmiting}>
            Buat card
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
