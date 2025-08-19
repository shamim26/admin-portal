"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/auth.store";
import { AuthService } from "../(auth)/auth.service";
import { ROUTES } from "@/lib/slugs";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const { user, isGuest, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Allow access if guest
        if (isGuest) {
          if (mounted) setLoading(false);
          return;
        }

        // If we already have a user, skip fetching
        if (user) {
          if (mounted) setLoading(false);
          return;
        }

        const res = await AuthService.me();
        const me = res?.payload?.user ?? res?.payload ?? res?.user ?? null;
        if (mounted) setUser(me);
        if (mounted) setLoading(false);
      } catch (e) {
        console.log(e);
        if (!mounted) return;
        setLoading(false);
        router.replace(ROUTES.LOGIN);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [isGuest, user, router, setUser]);

  if (loading) return null;

  return <>{children}</>;
}
