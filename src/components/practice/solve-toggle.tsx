"use client";

import { useSession } from "next-auth/react";
import { DiamondButton } from "@/components/ui/diamond-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SolveToggle({ problemId, initialSolved }: { problemId: string; initialSolved: boolean }) {
  const { data: session } = useSession();
  const [solved, setSolved] = useState(initialSolved);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
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

  const label = session
    ? solved
      ? "Solved"
      : "Mark Solved"
    : "Sign in to Solve";

  return (
    <DiamondButton variant={solved && session ? "primary" : "ghost"} size="sm" onClick={toggle} disabled={loading}>
      {label}
    </DiamondButton>
  );
}
