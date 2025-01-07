import { UserSession } from "@/types/auth";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  /**
   * Map a user to a session
   * @param user - The user to map
   * @returns The session
   */
  const mapUserToSession = (user: User) => {
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
    };
  };

  useEffect(() => {
    const supabase = createClient();

    /**
     * Initialize the user
     * @returns void
     */
    const initializeUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw new Error(error.message);

        setUserSession(user ? mapUserToSession(user) : null);
      } catch (error) {
        setUserSession(null);
      }
    };

    initializeUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserSession(session?.user ? mapUserToSession(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return userSession;
};
