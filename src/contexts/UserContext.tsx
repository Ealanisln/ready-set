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
        console.log("Getting initial session...");
        // Get initial session
        const { data } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        const currentSession = data?.session;
        console.log("Initial session:", currentSession ? "Found" : "Not found");
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Only fetch role if we have a user
        if (currentSession?.user) {
          console.log("Fetching user role...");
          await fetchUserRole(currentSession.user);
        } else {
          console.log("No user session, setting loading to false");
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
      try {
        const now = Date.now();
        
        // Check cache first
        if (
          userRoleCache.role &&
          userRoleCache.userId === user.id &&
          now - userRoleCache.timestamp < CACHE_EXPIRY
        ) {
          console.log("Using cached user role:", userRoleCache.role, "for user:", user.id);
          setUserRole(userRoleCache.role);
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching user role from API for user:", user.id);
        
        // Make the API call with a unique timestamp to bust cache
        const response = await fetch(`/api/users/current-user?_t=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-store',
            'x-request-source': 'UserProvider',
          }
        });
        
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.type) {
            // Update the cache
            userRoleCache = {
              role: data.type,
              userId: user.id,
              timestamp: now
            };
            
            setUserRole(data.type);
            console.log("Fetched and set user role:", data.type);
          } else {
            // Fallback to metadata
            const metadataType = user.user_metadata?.type || user.user_metadata?.role;
            if (metadataType) {
              setUserRole(metadataType);
              
              // Cache this too
              userRoleCache = {
                role: metadataType,
                userId: user.id,
                timestamp: now
              };
              
              console.log("Using role from metadata:", metadataType);
            }
          }
        } else {
          console.error("Failed to fetch user role", response.status);
          
          // Fallback to metadata if API fails
          const metadataType = user.user_metadata?.type || user.user_metadata?.role;
          if (metadataType) {
            setUserRole(metadataType);
            console.log("Using role from metadata (fallback):", metadataType);
          }
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        // Fallback to metadata on error
        const metadataType = user.user_metadata?.type || user.user_metadata?.role;
        if (metadataType) {
          setUserRole(metadataType);
          console.log("Using role from metadata (error fallback):", metadataType);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
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