"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // React component untuk Link
import { ApiError, apiFetch } from "@/lib/api";
import { type Deck } from "@/types/deck";

export default function DeckPage() {
  const router = useRouter();
  const [deckId, setDeckId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const data = await apiFetch<Deck>("/deck", {
          method: "GET",
        });
        setDeckId(data.id);
        setTitle(data.title);
        if (data.description) setDescription("");
      } catch (e: unknown) {
        setError(e instanceof ApiError ? e.message : "Failed fetching deck.");
      }
    }
    fetchData();
    setIsLoading(false);
  }, []);

  return <div className=""></div>;
}
