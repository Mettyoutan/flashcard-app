"use client";

import { useState, type SubmitEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { apiFetch, ApiError } from "@/lib/api";
import type { Deck } from "@/types/deck";

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
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const deck = await apiFetch<Deck>("/deck", {
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
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
            />
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
