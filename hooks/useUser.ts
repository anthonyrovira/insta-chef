import { AuthState } from "@/types/auth";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const mapUserToSession = (user: User) => {
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    };
  };

  useEffect(() => {
    const supabase = createClient();

    const initializeUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw new Error(error.message);

        setAuthState((prev) => ({
          ...prev,
          user: user ? mapUserToSession(user) : null,
          isLoading: false,
        }));
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    };

    initializeUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState((prev) => ({
        ...prev,
        user: session?.user ? mapUserToSession(session.user) : null,
        isLoading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, []);

  return authState;
};
