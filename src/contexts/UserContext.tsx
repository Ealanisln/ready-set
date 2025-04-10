// src/contexts/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { UserType } from "@/components/Auth/SignUp/FormSchemas";

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

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
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
        // Get initial session
        const { data, error: getSessionError } = await supabase.auth.getSession();
        
        console.log("UserContext: getSession returned.", { sessionExists: !!data?.session, error: getSessionError });
        
        if (!mounted) return;
        
        const currentSession = data?.session;
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Only fetch role if we have a user
        if (currentSession?.user) {
          console.log("UserContext: Session found. Fetching user role...");
          await fetchUserRole(currentSession.user);
        } else {
          console.log("UserContext: No initial session found. Setting loading to false.");
          setIsLoading(false);
        }
        
        // Set up auth listener
        console.log("Setting up auth state listener...");
        const { data: listener } = supabase.auth.onAuthStateChange(
          async (_event: string, newSession: Session | null) => {
            if (!mounted) return;
            
            console.log("Auth state changed:", _event);
            setSession(newSession);
            setUser(newSession?.user || null);
            
            // Reset role if user signs out
            if (!newSession?.user) {
              setUserRole(null);
              setIsLoading(false);
              return;
            }
            
            // Only fetch role if user ID changed
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
    
    // Helper to fetch user role
    const fetchUserRole = async (user: User) => {
      console.log("UserContext: fetchUserRole started for user:", user.id);
      let roleFound: UserType | null = null;
      try {
        // First check if user has a profile in the database
        console.log("UserContext: Checking for profile...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();
        console.log("UserContext: Profile check done.", { profile, profileError });

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("UserContext: Error checking profile (excluding not found):", profileError);
        }

        if (profileError && profileError.code === 'PGRST116') {
          // If no profile exists, create one
          console.log("UserContext: Profile not found. Attempting to create profile...");

          // Ensure email exists before attempting insert
          if (!user.email) {
            console.error("UserContext: Cannot create profile: User email is missing.");
            // Handle fallback or return appropriately
            const metadataType = user.user_metadata?.type || user.user_metadata?.role;
            if (metadataType) roleFound = metadataType.toLowerCase() as UserType;
          } else {
            console.log("UserContext: Inserting new profile...");
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email, 
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'user',
                type: (user.user_metadata?.type?.toUpperCase() || user.user_metadata?.role?.toUpperCase() || 'CLIENT') as UserType,
                status: 'PENDING',
                updatedAt: new Date()
              });
            console.log("UserContext: Profile insert attempt finished.", { createError });

            if (createError) {
              console.error("UserContext: Failed to create user profile:", JSON.stringify(createError, null, 2)); 
              // Fallback to metadata
              const metadataType = user.user_metadata?.type || user.user_metadata?.role;
              if (metadataType) {
                roleFound = metadataType.toLowerCase() as UserType;
              }
            } else {
              // Profile created successfully, now fetch it to get the type (or use metadata as fallback)
              console.log("UserContext: Profile created. Re-fetching profile type or using metadata.");
              const { data: newProfile, error: newProfileError } = await supabase
                .from('profiles')
                .select('type')
                .eq('id', user.id)
                .single();
              if (newProfile?.type) {
                roleFound = newProfile.type.toLowerCase() as UserType;
              } else {
                if (newProfileError) console.error("UserContext: Error fetching newly created profile:", newProfileError);
                const metadataType = user.user_metadata?.type || user.user_metadata?.role;
                if (metadataType) roleFound = metadataType.toLowerCase() as UserType;
              }
            }
          }
        } else if (profile?.type) {
          // If we have a profile and type, use its type
          console.log("UserContext: Profile found with type:", profile.type);
          roleFound = profile.type.toLowerCase() as UserType;
        }
        
        // If role still not found, try metadata as fallback
        if (!roleFound) {
          console.log("UserContext: Role not determined from profile. Checking metadata...");
          const metadataType = user.user_metadata?.type || user.user_metadata?.role;
          if (metadataType) {
            console.log("UserContext: Found role in metadata:", metadataType);
            roleFound = metadataType.toLowerCase() as UserType;
          }
        }

        // If all else fails, set a default role
        if (!roleFound) {
          console.log("UserContext: Role not found in profile or metadata. Setting default 'client'.");
          roleFound = 'client';
        }

      } catch (err) {
        console.error("UserContext: Error caught in fetchUserRole try block:", err);
        // Fallback to metadata even in case of error
        const metadataType = user.user_metadata?.type || user.user_metadata?.role;
        if (metadataType) {
          roleFound = metadataType.toLowerCase() as UserType;
        } else {
          roleFound = 'client'; // Default role on error
        }
      } finally {
        if (mounted) {
          console.log("UserContext: fetchUserRole finally block. Determined role:", roleFound);
          setUserRole(roleFound);
          setIsLoading(false);
          console.log("UserContext: fetchUserRole finally block. Set role and isLoading to false.");
        }
      }
    };
    
    return () => {
      mounted = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);
  
  // Function to manually refresh user data
  const refreshUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Force a refetch of user role
      userRoleCache = { role: null, userId: null, timestamp: 0 };
      
      // Fetch fresh session
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          await fetch(`/api/users/current-user?_t=${Date.now()}`, {
            headers: {
              'Cache-Control': 'no-store',
              'x-request-source': 'refreshUserData',
            }
          }).then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Failed to refresh user data');
          }).then(data => {
            if (data.type) {
              setUserRole(data.type);
              userRoleCache = {
                role: data.type,
                userId: data.session.user.id,
                timestamp: Date.now()
              };
            }
          });
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