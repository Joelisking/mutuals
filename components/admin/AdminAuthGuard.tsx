"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "@/lib/redux/store";
import { selectIsAuthenticated } from "@/lib/redux/slices/auth";
import { ReduxState } from "@/lib/redux/store";
import { Loader2 } from "lucide-react";

// Selector for redux-persist's internal rehydration flag
const selectIsRehydrated = (state: ReduxState) =>
  (state?.persistedReducer as any)?._persist?.rehydrated === true;

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isRehydrated = useSelector(selectIsRehydrated);

  useEffect(() => {
    // Only redirect after persist has finished loading from storage
    if (isRehydrated && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isRehydrated, isAuthenticated, router]);

  // Show spinner until we know the auth state
  if (!isRehydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Middleware already blocked the route server-side; this handles
    // the case where the token expires client-side mid-session.
    return null;
  }

  return <>{children}</>;
}
