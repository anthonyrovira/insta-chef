import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { signInWithGoogle } from "@/auth/action";
import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { AUTH_ROUTES } from "@/constants/auth";

export default function AuthButton() {
  const supabase = createClient();
  const { user, error, isLoading } = useUser();
  const handleClickLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Disconnection error:", error.message);
        return redirect(AUTH_ROUTES.ERROR);
      }
    } catch (error) {
      console.error("Disconnection error:", error);
      return redirect(AUTH_ROUTES.ERROR);
    }
  };

  return (
    <>
      {user ? (
        <button
          type="button"
          name="logout"
          aria-label="Logout"
          onClick={handleClickLogOut}
          className="fixed top-6 right-20 mt-4 flex items-center justify-center rounded-lg bg-tertiary-light dark:bg-tertiary-dark transition-colors"
        >
          <div className="relative group">
            <Image
              loading="lazy"
              src={user.user_metadata.avatar_url}
              alt="User avatar"
              width={40}
              height={40}
              className="rounded-full p-2"
            />
            <span
              className="absolute top-12 -right-3 rounded-lg text-sm bg-primary-dark text-white px-2 py-1 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                        pointer-events-none translate-y-1 group-hover:translate-y-0 
                        scale-95 group-hover:scale-100"
            >
              Logout
            </span>
          </div>
        </button>
      ) : (
        <button
          type="button"
          name="login"
          aria-label="Login"
          onClick={signInWithGoogle}
          className="fixed top-6 right-20 mt-4 p-2 w-10 h-10 flex items-center justify-center rounded-lg 
            bg-tertiary-light dark:bg-tertiary-dark transition-all duration-200"
        >
          <div className="relative group">
            <img src="/google.svg" alt="Google logo" className="w-5 h-5" />
            <span
              className="absolute top-10 -left-4 rounded-lg text-sm bg-primary-dark text-white px-2 py-1 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                        pointer-events-none translate-y-1 group-hover:translate-y-0 
                        scale-95 group-hover:scale-100"
            >
              Login
            </span>
          </div>
        </button>
      )}
    </>
  );
}
