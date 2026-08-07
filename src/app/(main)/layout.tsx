import { AuthProvider } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bd-bg text-bd-text-primary">
      <AuthProvider>
        <Navbar />
        {children}
      </AuthProvider>
    </div>
  );
}
