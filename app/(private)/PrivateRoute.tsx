"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import useAuthStore from "@/stores/auth.store";
import { ROUTES } from "@/lib/slugs";
import Loader from "../components/Loader";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const { user, getUser } = useAuthStore((state) => state);

  useEffect(() => {
    // Always call getUser to validate cookies on mount
    // This will either return user data or fail and clear user state
    getUser().finally(() => setLoading(false));
  }, [getUser]);

  if (loading) return <Loader variant="bars" />;

  if (!user) {
    redirect(ROUTES.LOGIN);
    return null;
  }

  return <>{children}</>;
}
