import { Card, CardHeader, CardTitle, CardDescription } from "../ui/card";
import type { Deck } from "@/types/deck";

// Karena kita buat component DeckCard, penting juga props
type DeckCardProps = {
  deck: Deck;
};

// Buat component DeckCard
// DeckCard punya parameter yg butuh props berisi deck
// Atau data dari deck
export default function DeckCard({ deck }: DeckCardProps) {
  // DeckCard punya title dan description (optional)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{deck.title}</CardTitle>
        {/* Description is nullable */}
        {deck.description && (
          <CardDescription>{deck.description}</CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}
