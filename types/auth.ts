import { UserMetadata } from "@supabase/supabase-js";

export interface UserSession {
  id: string;
  email: string | undefined;
  user_metadata: UserMetadata;
}

export interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  error: Error | null;
}
