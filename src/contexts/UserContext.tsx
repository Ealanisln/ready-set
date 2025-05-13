// src/contexts/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { UserType } from "@/types/user";
import { H } from 'highlight.run';

// Define user context types
type UserContextType = {
  session: Session | null;
  user: User | null;
  userRole: UserType | null;
  isLoading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
};

// Create the context
const UserContext = createContext<UserContextType>({
  session: null,
  user: null,
  userRole: null,
  isLoading: true,
  error: null,
  refreshUserData: async () => {},
});

// Export the hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Helper function to identify user to Highlight
const identifyUserToHighlight = (user: User, role?: UserType) => {
  if (typeof window !== 'undefined') {
    H.identify(user.email || user.id, {
      id: user.id,
      email: user.email || 'no-email',
      role: role || 'unknown'
    });
  }
};

// Helper function to fetch user role
const fetchUserRole = async (supabase: any, user: User, setUserRole: (role: UserType) => void) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', user.id)
      .single();

    let role = UserType.CLIENT;
    if (profile?.type) {
      const typeUpper = profile.type.toUpperCase();
      const enumValues = Object.values(UserType).map(val => val.toUpperCase());
      
      if (enumValues.includes(typeUpper)) {
        const originalEnumValue = Object.values(UserType).find(
          val => val.toUpperCase() === typeUpper
        );
        role = originalEnumValue as UserType;
      }
    }
    
    setUserRole(role);
    return role;
  } catch (err) {
    console.error("Error fetching user role:", err);
    return null;
  }
};

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
  
  // Load user data
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
        console.log("UserContext: Getting initial user data...");
        const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
        if (getUserError) {
          console.error("Error getting user:", getUserError);
          setIsLoading(false);
          return;
        }
        
        if (currentUser) {
          setUser(currentUser);
          console.log("UserContext: User found. Fetching user role...");
          const role = await fetchUserRole(supabase, currentUser, setUserRole);
          identifyUserToHighlight(currentUser, role || undefined);
        } else {
          console.log("UserContext: No user found. Setting loading to false.");
          setUser(null);
          setUserRole(null);
        }
        
        setIsLoading(false);
        
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (_event: string, session: Session | null) => {
            if (!mounted) return;
            
            console.log("Auth state changed:", _event);
            setSession(session);
            
            const newUser = session?.user || null;
            setUser(newUser);
            
            if (!newUser) {
              setUserRole(null);
              return;
            }
            
            if (newUser?.id !== currentUser?.id) {
              const role = await fetchUserRole(supabase, newUser, setUserRole);
              identifyUserToHighlight(newUser, role || undefined);
            }
          }
        );
        
        authListener = listener;
      } catch (error) {
        console.error("Error in auth setup:", error);
        if (mounted) {
          setError("Authentication setup failed");
          setIsLoading(false);
        }
      }
    };
    
    setupAuth();
    
    return () => {
      mounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);
  
  // Function to manually refresh user data
  const refreshUserData = async () => {
    if (!supabase) return;
    
    setIsLoading(true);
    try {
      const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser();
      
      if (getUserError) {
        throw getUserError;
      }
      
      setUser(currentUser);
      
      if (currentUser) {
        const role = await fetchUserRole(supabase, currentUser, setUserRole);
        identifyUserToHighlight(currentUser, role || undefined);
      } else {
        setUserRole(null);
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

// Export the provider component
export function UserProvider({ children }: { children: ReactNode }) {
  return (
    <UserProviderClient>
      {children}
    </UserProviderClient>
  );
}