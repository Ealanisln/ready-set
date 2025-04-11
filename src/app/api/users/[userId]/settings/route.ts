import { createClient } from '@/utils/supabase/server';
import { UserStatus, UserType } from '@/types/user';
import { NextResponse } from 'next/server';

// Remove the separate RouteContext interface if it exists
// interface RouteContext { ... }

export async function PATCH(
  request: Request,
  { params }: any
) {
  try {
    const supabase = await createClient();

    // Verify the current user's permissions
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // Get the current user's role to verify permissions
    const { data: currentUserData, error: currentUserError } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUserData) {
      return NextResponse.json(
        { error: 'Failed to verify permissions' },
        { status: 500 }
      );
    }

    // Only super admins can update user settings
    if (currentUserData.type !== UserType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden: Only super admins can update user settings' },
        { status: 403 }
      );
    }

    // Get the update data from the request
    const { type, status, isTemporaryPassword } = await request.json();

    // Validate the input data
    if (!type || !Object.values(UserType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid user type provided' },
        { status: 400 }
      );
    }

    if (!status || !Object.values(UserStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid user status provided' },
        { status: 400 }
      );
    }

    if (typeof isTemporaryPassword !== 'boolean') {
      return NextResponse.json(
        { error: 'isTemporaryPassword must be a boolean value' },
        { status: 400 }
      );
    }

    // Update the user in the database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        type,
        status,
        isTemporaryPassword
      })
      .eq('id', params.userId)
      .select();

    if (error) {
      console.error('Error updating user settings:', error);
      return NextResponse.json(
        { error: 'Failed to update user settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User settings updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const supabase = await createClient();

    // Verify the current user's permissions
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // Get the current user's role to verify permissions
    const { data: currentUserData, error: currentUserError } = await supabase
      .from('profiles')
      .select('type')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUserData) {
      return NextResponse.json(
        { error: 'Failed to verify permissions' },
        { status: 500 }
      );
    }

    // Only admins and super admins can view user settings
    if (
      currentUserData.type !== UserType.ADMIN && 
      currentUserData.type !== UserType.SUPER_ADMIN
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get the user settings
    const { data, error } = await supabase
      .from('profiles')
      .select('id, type, status, isTemporaryPassword')
      .eq('id', params.userId)
      .single();

    if (error) {
      console.error('Error fetching user settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user settings' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 