import { AppShell } from "@/components/layout/AppShell";
import { ComplexityLab } from "@/components/visualization/ComplexityLab";

export default function BigOLabPage() {
  return <AppShell><div className="mx-auto max-w-7xl px-4 py-10"><ComplexityLab /></div></AppShell>;
}
