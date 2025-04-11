// src/contexts/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { UserType } from "@/types/user";

// Define user context types
type UserContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserType | null;
  isLoading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  session: null,
  user: null,
  userRole: null,
  isLoading: true,
  error: null,
  refreshUserData: async () => {},
});

// Make a hook for easy context usage
export const useUser = () => useContext(UserContext);

// Global cache for role information
let userRoleCache: {
  role: UserType | null;
  userId: string | null;
  timestamp: number;
} = {
  role: null,
  userId: null,
  timestamp: 0
};

// Cache expiry time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

// Create a client component wrapper
function UserProviderClient({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<any>(null);
  
  // Initialize Supabase
  useEffect(() => {
    const initSupabase = async () => {
      console.log("Initializing Supabase client...");
      try {
        const client = await createClient();
        console.log("Supabase client initialized successfully");
        setSupabase(client);
      } catch (err) {
        console.error("Failed to initialize Supabase client:", err);
        setError("Authentication initialization failed");
        setIsLoading(false);
      }
    };
    
    initSupabase();
  }, []);
  
  // Load session data
  useEffect(() => {
    if (!supabase) {
      console.log("Waiting for Supabase client...");
      return;
    }
    
    console.log("Setting up auth state...");
    let mounted = true;
    let authListener: any = null;
    
    const setupAuth = async () => {
      try {
        console.log("UserContext: Getting initial session...");
        const { data, error: getSessionError } = await supabase.auth.getSession();
        
        console.log("UserContext: getSession returned.", { sessionExists: !!data?.session, error: getSessionError });
        
        if (!mounted) return;
        
        const currentSession = data?.session;
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user) {
          console.log("UserContext: Session found. Fetching user role...");
          await fetchUserRole(currentSession.user);
        } else {
          console.log("UserContext: No initial session found. Setting loading to false.");
          setIsLoading(false);
        }
        
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (_event: string, newSession: Session | null) => {
            if (!mounted) return;
            
            console.log("Auth state changed:", _event);
            setSession(newSession);
            setUser(newSession?.user || null);
            
            if (!newSession?.user) {
              setUserRole(null);
              setIsLoading(false);
              return;
            }
            
            if (newSession?.user?.id !== currentSession?.user?.id) {
              await fetchUserRole(newSession.user);
            }
          }
        );
        
        authListener = listener;
      } catch (err) {
        console.error("Error setting up auth:", err);
        if (mounted) {
          setError("Authentication failed");
          setIsLoading(false);
        }
      }
    };
    
    setupAuth();
    
    const fetchUserRole = async (user: User) => {
      console.log("UserContext: fetchUserRole started for user:", user.id);
      let roleFound: UserType | null = null;
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();
        console.log("UserContext: Profile check done.", { profile, profileError, rawType: profile?.type });

        if (profile?.type) {
          // Ensure the type is a valid UserType enum value by normalizing the case
          const typeUpper = profile.type.toUpperCase();
          console.log("UserContext: Type converted to uppercase:", typeUpper);
          
          // Verify that the type exists in UserType enum
          if (Object.values(UserType).includes(typeUpper as UserType)) {
            roleFound = typeUpper as UserType;
            console.log("UserContext: Valid role found:", roleFound);
          } else {
            console.warn("UserContext: Invalid role in profile:", typeUpper);
            roleFound = UserType.CLIENT; // Default fallback
          }
        }

        if (!roleFound) {
          console.log("UserContext: No valid role found. Setting default role.");
          roleFound = UserType.CLIENT;
        }

      } catch (err) {
        console.error("UserContext: Error caught in fetchUserRole try block:", err);
        roleFound = UserType.CLIENT;
      } finally {
        if (mounted) {
          console.log("UserContext: Setting final role:", roleFound);
          setUserRole(roleFound);
          setIsLoading(false);
        }
      }
    };
    
    return () => {
      mounted = false;
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);
  
  // Function to manually refresh user data
  const refreshUserData = async () => {
    if (!user || !supabase) return;
    
    setIsLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', data.session.user.id)
          .single();
        
        if (profile?.type) {
          const typeUpper = profile.type.toUpperCase();
          if (Object.values(UserType).includes(typeUpper as UserType)) {
            setUserRole(typeUpper as UserType);
          } else {
            setUserRole(UserType.CLIENT);
          }
        } else {
          setUserRole(UserType.CLIENT);
        }
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError("Failed to refresh user data");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <UserContext.Provider value={{ 
      session, 
      user, 
      userRole, 
      isLoading, 
      error, 
      refreshUserData 
    }}>
      {children}
    </UserContext.Provider>
  );
}

// Export a wrapper component that ensures client-side only rendering
export function UserProvider({ children }: { children: ReactNode }) {
  return <UserProviderClient>{children}</UserProviderClient>;
}