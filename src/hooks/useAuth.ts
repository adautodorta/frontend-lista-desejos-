import {useState} from "react";

import {supabase} from "@/supabaseClient";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    return data;
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const {data, error} = await supabase.auth.signUp({email, password});
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return {login, register, logout, loading, error};
};


