import type {Session} from "@supabase/supabase-js";
import {Loader2} from "lucide-react";
import {useState, useEffect} from "react";
import {Navigate, Outlet} from "react-router";

import {supabase} from "@/supabaseClient";

export function PrivateRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {data: {session: currentSession}} = await supabase.auth.getSession();
        setSession(currentSession);
      } catch (error) {
        console.error("Erro ao buscar a sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    void checkSession();

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      setSession(updatedSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
