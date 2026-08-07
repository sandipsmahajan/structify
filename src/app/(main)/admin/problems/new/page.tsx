"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";

export default function NewProblemPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    topicId: "", title: "", difficulty: "Easy",
    leetcodeUrl: "", hackerrankUrl: "", neetcodeUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) router.push("/admin/problems");
      else alert("Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-2xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-8">Add Problem Mapping</h1>
      <DiamondCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Topic ID (cuid)", key: "topicId" },
            { label: "Problem Title", key: "title" },
            { label: "Difficulty", key: "difficulty" },
            { label: "LeetCode URL", key: "leetcodeUrl" },
            { label: "HackerRank URL", key: "hackerrankUrl" },
            { label: "NeetCode URL", key: "neetcodeUrl" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-bd-text-muted mb-1">{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-bd-bg border border-bd-border rounded px-3 py-2 text-sm text-bd-text-primary"
              />
            </div>
          ))}
          <DiamondButton type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Add Problem"}
          </DiamondButton>
        </form>
      </DiamondCard>
    </div>
  );
}
