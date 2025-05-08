const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const { randomBytes } = require('crypto')
require('dotenv').config()

// Supabase connection details
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Must use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required')
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseKey)

// Interface for user data from Google Workspace
interface GAMUser {
  name: string
  primaryEmail: string
}

// Function to read and parse CSV file
function readCSVFile(filePath: string): GAMUser[] {
  try {
    const fileContent = fs.readFileSync(path.resolve(filePath), 'utf-8')
    return parse(fileContent, {
      columns: (header: string[]) => header.map((column: string) => {
        if (column === 'name.fullName') return 'name'
        if (column === 'primaryEmail') return 'primaryEmail'
        return column
      }),
      skip_empty_lines: true
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read or parse CSV file: ${error.message}`)
    } else {
      throw new Error('Failed to read or parse CSV file: Unknown error')
    }
  }
}

// Function to create a user in Supabase
async function createUser(user: GAMUser): Promise<void> {
  try {
    console.log(`Attempting to create user: ${user.primaryEmail}`)

    // Check if the name is defined
    if (!user.name) {
      console.warn(`User ${user.primaryEmail} has no name defined. Skipping user creation.`)
      return
    }

    const nameParts = user.name.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    
    // Attempt to create a new user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: user.primaryEmail,
      email_confirm: true, // Mark email as confirmed
      password: undefined, // No password for OAuth users
      user_metadata: {
        full_name: user.name,
        first_name: firstName,
        last_name: lastName,
        source: 'google_workspace_migration'
      },
      app_metadata: {
        provider: 'google',
        imported_from: 'google_workspace'
      }
    })

    if (userError) {
      console.error(`Raw createUser error for ${user.primaryEmail}:`, userError.message) // Log raw error message
      // Check if the error is due to the user already existing
      if (userError.message.includes('User already registered') || userError.message.includes('A user with this email address has already been registered')) { // Broader check
        console.log(`User ${user.primaryEmail} already exists. Attempting to fetch ID and update profile.`)
        // Fetch the users (listUsers might not filter correctly, so we fetch and filter manually)
        const { data: listUsersData, error: fetchError } = await supabase.auth.admin.listUsers()
        
        console.log(`listUsers raw result for ${user.primaryEmail}:`, { hasData: !!listUsersData, userCount: listUsersData?.users?.length, fetchError: fetchError?.message }) // Log listUsers result

        if (fetchError || !listUsersData || !listUsersData.users) {
            console.error(`Failed to list users to find existing ID for ${user.primaryEmail}:`, fetchError?.message || 'Failed to list users')
            return
        }

        // Manually find the user with the matching email (case-insensitive)
        const existingUser = listUsersData.users.find((u: { email: string; id: string }) => u.email.toLowerCase() === user.primaryEmail.toLowerCase())

        if (!existingUser) {
            console.error(`Failed to find existing user ID for ${user.primaryEmail} in the listed users.`)
            return
        }

        const existingUserId = existingUser.id
        console.log(`Found existing user ID for ${user.primaryEmail}: ${existingUserId}. Upserting profile.`)
        
        // Upsert the profile: Update if exists, Insert if not
        const { error: profileUpsertError } = await supabase
          .from('profiles')
          .upsert({
            id: existingUserId, // Use the found ID
            email: existingUser.email, // Use the canonical email from auth
            name: user.name,
            companyName: 'Ready Set', // Add company name here
            type: 'HELPDESK', // Adjust user type as needed
            status: 'ACTIVE',
            updatedAt: new Date().toISOString() // Explicitly set updatedAt
          }, {
            onConflict: 'id' // Specify the column to check for conflicts
          })
        
        if (profileUpsertError) {
          console.error(`Error upserting profile for existing user ${user.primaryEmail}:`, profileUpsertError.message)
        } else {
          console.log(`Profile upsert attempt completed for existing user: ${user.primaryEmail}. Check DB for results.`)
        }
      } else {
        // Log other user creation errors
        console.error(`Unhandled error creating user ${user.primaryEmail}:`, userError.message)
      }
      return
    }
    
    // If user creation was successful, insert the profile
    if (userData?.user) {
      console.log(`Successfully created user: ${user.primaryEmail}. Inserting profile.`)
      const { error: profileInsertError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          email: user.primaryEmail,
          name: user.name,
          type: 'HELPDESK', // Adjust user type as needed
          status: 'ACTIVE'
        })
      
      if (profileInsertError) {
        console.error(`Error inserting profile for ${user.primaryEmail}:`, profileInsertError.message)
      } else {
        console.log(`Profile inserted for user: ${user.primaryEmail}`)
      }
    }
    
  } catch (err) {
    console.error(`Failed to process user ${user.primaryEmail}:`, err)
  }
}

// Main function to import users
async function importUsersFromGAM(csvFilePath: string): Promise<void> {
  try {
    const users = readCSVFile(csvFilePath)
    console.log(`Found ${users.length} users to import`)
    
    for (const user of users) {
      await createUser(user)
    }
    
    console.log('Import completed!')
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error importing users:', error.message)
    } else {
      console.error('Error importing users: Unknown error')
    }
  }
}

// Execute the import process
const csvFilePath = './active_users.csv' // Path to your GAM CSV export
importUsersFromGAM(csvFilePath)