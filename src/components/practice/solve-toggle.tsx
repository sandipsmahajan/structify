"use client";

import { useSession } from "next-auth/react";
import { DiamondButton } from "@/components/ui/diamond-button";
import { useState } from "react";

export function SolveToggle({ problemId, initialSolved }: { problemId: string; initialSolved: boolean }) {
  const { data: session } = useSession();
  const [solved, setSolved] = useState(initialSolved);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const toggle = async () => {
    setLoading(true);
    const newSolved = !solved;
    setSolved(newSolved);
    try {
      await fetch("/api/problems/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, solved: newSolved }),
      });
    } catch {
      setSolved(!newSolved);
    }
    setLoading(false);
  };

  return (
    <DiamondButton variant={solved ? "primary" : "ghost"} size="sm" onClick={toggle} disabled={loading}>
      {solved ? "Solved" : "Mark Solved"}
    </DiamondButton>
  );
}
