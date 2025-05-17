import React, { createContext, useState, useContext, useEffect } from "react";
import { UserRole, Profile } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: string } | undefined>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type { UserRole };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const mapUserDataToProfile = (data: Record<string, any>) => {
    let appRole: UserRole;
    switch (data.role) {
      case "instructor":
        appRole = "instructor";
        break;
      case "mentor":
        appRole = "mentor";
        break;
      case "event_manager":
        appRole = "event_manager";
        break;
      case "college_admin":
        appRole = "college_admin";
        break;
      default:
        appRole = "instructor";
    }

    const profileData: Profile = {
      id: data.user_id,
      full_name: data.full_name || data.name,
      email: data.email,
      role: appRole,
      university_id: data.university_id || null,
      section_id: data.section_id || null,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
    };
    setProfile(profileData);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user by auth_user_id:", error);

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (userError) {
          console.error("Error fetching user data by user_id:", userError);
          return;
        }

        if (userData) {
          mapUserDataToProfile(userData);
        }

        return;
      }

      if (data) {
        mapUserDataToProfile(data);
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      }

      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      localStorage.removeItem("isLoggedOut");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });

      return undefined;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      if (errorMessage.toLowerCase().includes("email not confirmed")) {
        toast({
          title: "Email not verified",
          description: "Please check your email for the verification link",
          variant: "destructive",
        });
        return { error: "email_not_confirmed" };
      }

      toast({
        title: "Error signing in",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth/signin`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      console.error("Signup error:", error);

      toast({
        title: "Error creating account",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);

      localStorage.setItem("isLoggedOut", "true");

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setSession(null);
      setProfile(null);

      setTimeout(() => {
        window.location.replace("/auth/signin");

        toast({
          title: "Signed out successfully",
        });
      }, 100);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error signing out",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
