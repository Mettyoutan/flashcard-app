"use client";

import { useState, type SubmitEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { apiFetch, ApiError } from "@/lib/api";
import type { Deck } from "@/types/deck";
import { cn } from "@/lib/utils";

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 50;

// onCreated -> function yg dijalankan untuk update state di parent component setelah deck berhasil terbuat
// , tanpa fetch yang baru lagi
type CreateDeckFormProps = {
  onCreated: (deck: Deck) => void;
};

export default function CreateDeckForm({ onCreated }: CreateDeckFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Karena form, butuh function handleSubmit
  // Untuk activate request ke server
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setIsSubmitting(true);

    try {
      const deck = await apiFetch<Deck>("/decks", {
        method: "POST",
        body: { title, description: description || undefined },
      });

      onCreated(deck);
      setTitle("");
      setDescription("");
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Submittion failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bikin Deck Baru</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Buat form dan style manual */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={title} // Tampilin value dari state
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <p
              className={cn(
                "text-xs",
                title.length >= TITLE_MAX
                  ? "text-red-500"
                  : "text-muted-foreground",
              )}
            >
              {title.length}/{TITLE_MAX}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
            />
            <p
              className={cn(
                "text-xs",
                description.length >= DESCRIPTION_MAX
                  ? "text-red-500"
                  : "text-muted-foreground",
              )}
            >
              {description.length}/{DESCRIPTION_MAX}
            </p>
          </div>
          <div>{error && <p className="text-sm text-red-500">{error}</p>}</div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Bikin..." : "Bikin Deck"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
