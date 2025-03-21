// src/app/api/user/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Correctly await the params object before accessing properties
    const params = await context.params;
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = await createClient();
    
    // Check authorization
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }
    
    // Try to get the user from both tables
    
    // 1. First, try to get from profiles (seems to be your main table based on logs)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', userId)
      .single();
      
    // 2. Try to get from the user table
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('id', userId)
      .single();
    
    // 3. Get basic auth data
    const { data, error: fullAuthError } = await supabase.auth.admin.getUserById(userId);
    
    // Combine all available data
    const combinedUserData = {
      // Default values
      email: data?.user?.email || '',
      type: 'client',
      status: 'pending',
      
      // Add profile data if available
      ...(profileData || {}),
      
      // Add user data if available (will override profile data if both exist)
      ...(userData || {}),
      
      // Ensure id is correct (added last to override any id from the spread objects)
      id: userId
    };
    
    // Map profile fields to expected format if needed
    if (profileData && !userData) {
      // If we only have profile data, ensure field mappings are correct
      combinedUserData.type = profileData.type || 'client';
      
      // Map auth_user_id to id if that's the field used in profiles
      if (profileData.auth_user_id) {
        combinedUserData.id = profileData.auth_user_id;
      }
    }
    
    return NextResponse.json(combinedUserData);
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Correctly await the params object
    const params = await context.params;
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = await createClient();
    
    // Check authorization
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const userData = await request.json();
    
    // Make sure the ID matches
    if (userData.id !== userId) {
      return NextResponse.json(
        { error: 'User ID mismatch' },
        { status: 400 }
      );
    }
    
    // Get fields that shouldn't be sent to DB
    const { 
      id, email, emailVerified, ...updateData 
    } = userData;
    
    // Determine the right table to update
    let updatedUser;
    let updateError;
    
    // Check if user exists in profiles table
    const { data: profileExists } = await supabase
      .from('profiles')
      .select('auth_user_id')
      .eq('auth_user_id', userId)
      .single();
      
    if (profileExists) {
      // Update profiles table
      const result = await supabase
        .from('profiles')
        .update(updateData)
        .eq('auth_user_id', userId)
        .select('*')
        .single();
        
      updatedUser = result.data;
      updateError = result.error;
    } else {
      // Check if exists in user table
      const { data: userExists } = await supabase
        .from('user')
        .select('id')
        .eq('id', userId)
        .single();
        
      if (userExists) {
        // Update user table
        const result = await supabase
          .from('user')
          .update(updateData)
          .eq('id', userId)
          .select('*')
          .single();
          
        updatedUser = result.data;
        updateError = result.error;
      } else {
        // Create a new entry in profiles table
        const result = await supabase
          .from('profiles')
          .insert({
            auth_user_id: userId,
            ...updateData
          })
          .select('*')
          .single();
          
        updatedUser = result.data;
        updateError = result.error;
      }
    }
    
    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user data', details: String(updateError) },
        { status: 500 }
      );
    }
    
    // Return the user data
    return NextResponse.json({
      id: userId,
      email: email || authUser.email,
      ...updatedUser
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}