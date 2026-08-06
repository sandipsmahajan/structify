"use client";

import { useSession } from "next-auth/react";
import { DiamondButton } from "@/components/ui/diamond-button";
import { useState } from "react";

export function SolveToggle({ problemId, initialSolved }: { problemId: string; initialSolved: boolean }) {
  const { data: session } = useSession();
  const [solved, setSolved] = useState(initialSolved);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    const newSolved = !solved;
    setSolved(newSolved);
    if (!session) {
      return;
    }
    setLoading(true);
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

  const label = solved ? "Solved" : "Mark Solved";

  return (
    <DiamondButton variant={solved ? "primary" : "ghost"} size="sm" onClick={toggle} disabled={loading}>
      {label}
    </DiamondButton>
  );
}
