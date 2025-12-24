
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "@/lib/redux/store";
import { selectIsAuthenticated, selectAuthLoading } from "@/lib/redux/slices/auth";
import { Loader2 } from "lucide-react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to allow redux-persist to rehydrate
    const timer = setTimeout(() => {
        setIsChecking(false);
        if (!isAuthenticated) {
            router.push("/admin/login");
        }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
