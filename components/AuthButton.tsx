import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { signInWithGoogle } from "@/auth/action";
import { redirect, usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { AUTH_ROUTES } from "@/constants/auth";

export default function AuthButton({ withText }: { withText: boolean }) {
  const supabase = createClient();
  const userSession = useUser();
  const pathname = usePathname();

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

  const handleLogin = () => {
    signInWithGoogle(pathname);
  };

  return (
    <>
      {userSession ? (
        <button
          type="button"
          name="logout"
          aria-label="Logout"
          onClick={handleClickLogOut}
          className={`flex items-center justify-center rounded-lg bg-tertiary-light dark:bg-tertiary-dark transition-colors ${
            withText ? "w-full px-5 h-10" : "w-10 h-10"
          }`}
        >
          <div className="relative group flex items-center justify-center">
            <Image
              loading="lazy"
              src={userSession.user_metadata.avatar_url}
              alt="User avatar"
              width={withText ? 30 : 40}
              height={withText ? 30 : 40}
              className={`rounded-full p-2 ${withText ? "mr-1" : ""}`}
            />
            <span className="block lg:hidden">Logout</span>
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
          onClick={handleLogin}
          className={`flex items-center justify-center rounded-lg bg-tertiary-light dark:bg-tertiary-dark transition-colors ${
            withText ? "w-full px-5 h-10" : "w-10 h-10"
          }`}
        >
          <div className="relative group flex items-center justify-center">
            <img src="/google.svg" alt="Google logo" className={`w-5 h-5 ${withText ? "mr-1 p-0.5" : ""}`} />
            <span className="block lg:hidden">Login</span>
            {!withText && (
              <span
                className="absolute top-10 -left-4 rounded-lg text-sm bg-primary-dark text-white px-2 py-1 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                        pointer-events-none translate-y-1 group-hover:translate-y-0 
                        scale-95 group-hover:scale-100"
              >
                Login
              </span>
            )}
          </div>
        </button>
      )}
    </>
  );
}
