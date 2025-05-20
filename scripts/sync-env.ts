import * as fs from 'fs';
import * as dotenv from 'dotenv';
import axios from 'axios';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error(`❌ .env.local file not found at ${envPath}`);
  process.exit(1);
}

// Command line arguments parsing
const args = process.argv.slice(2);
const resourceId = args[0];
const isDebugMode = args.includes('--debug');
const isDryRun = args.includes('--dry-run');
const hasFilter = args.some(arg => arg.startsWith('--filter='));
const filterPrefix = hasFilter 
  ? args.find(arg => arg.startsWith('--filter='))?.split('=')[1] || ''
  : null;

// Help text for command usage
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: pnpm env:sync <resource-id> [options]

Options:
  --debug         Enable debug mode with detailed logging
  --dry-run       Show what would be done without making any changes
  --filter=PREFIX Only sync variables starting with PREFIX
  --help, -h      Show this help message

Examples:
  pnpm env:sync 123                    # Sync all variables to resource 123
  pnpm env:sync 123 --dry-run          # Show what would be synced without making changes
  pnpm env:sync 123 --filter=DATABASE_ # Only sync variables starting with DATABASE_
  pnpm env:sync 123 --debug            # Show detailed debug information
  `);
  process.exit(0);
}

// Configuration
const COOLIFY_URL = process.env.COOLIFY_URL || 'https://coolify.readysetllc.com/api';
const COOLIFY_TOKEN = process.env.COOLIFY_TOKEN;
const ENV_FILE = '.env.local';

if (!COOLIFY_TOKEN) {
  console.error('❌ COOLIFY_TOKEN environment variable is not set in .env.local');
  console.error('Please add it to your .env.local file:');
  console.error('COOLIFY_TOKEN=your_token_here');
  process.exit(1);
}

// Get resource ID from command line
if (!resourceId) {
  console.error('❌ Please provide a resource ID as argument');
  console.error('Usage: pnpm env:sync <resource-id> [options]');
  console.error('\nTo get a list of available resources, run:');
  console.error('pnpm env:list');
  console.error('\nFor more options, run: pnpm env:sync --help');
  process.exit(1);
}

// Debug logging function
function debug(...args: any[]) {
  if (isDebugMode) {
    console.log('[DEBUG]', ...args);
  }
}

// Configure axios headers
const axiosConfig = {
  headers: {
    'Authorization': `Bearer ${COOLIFY_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

// Resource type detection - affects API endpoints
let detectedResourceType: string | null = null;

// Define possible API endpoint variations with more attempts
const API_ENDPOINT_VARIATIONS = [
  // Original endpoints
  '/v1/resources/{id}/environment-variables',
  '/v1/resources/{id}/environment',
  '/v1/resources/{id}/env',
  
  // Try alternative endpoints
  '/v1/services/{id}/environment-variables',
  '/v1/services/{id}/environment',
  '/v1/services/{id}/env',
  
  // Application-specific endpoints
  '/v1/applications/{id}/environment-variables',
  '/v1/applications/{id}/environment',
  '/v1/applications/{id}/env',
  
  // Try v2 endpoints if they exist
  '/v2/resources/{id}/environment-variables',
  '/v2/resources/{id}/environment',
  '/v2/resources/{id}/env',
  
  // Try v3 endpoints in case of future updates
  '/v3/resources/{id}/environment-variables',
  
  // Try without resource prefix
  '/v1/{id}/environment-variables',
  '/v1/{id}/environment',
  '/v1/{id}/env',
  
  // Try direct endpoint
  '/v1/environment-variables/{id}',
  '/v1/environment/{id}',
];

interface EnvVariable {
  id?: string;
  name: string;
  value: string;
  isBuildVariable?: boolean;
  isSecret?: boolean;
}

/**
 * Replace placeholders in an endpoint path
 */
function formatEndpoint(template: string, id: string): string {
  // If resource type is detected, try using that type's endpoints first
  if (detectedResourceType && template.includes('resources')) {
    return template.replace('resources', detectedResourceType).split('{id}').join(id);
  }
  return template.split('{id}').join(id);
}

async function tryApiRequest(method: string, endpointTemplate: string, data?: any): Promise<any> {
  // Ensure resourceId is treated as a string
  const endpoint = formatEndpoint(endpointTemplate, resourceId as string);
  const url = `${COOLIFY_URL}${endpoint}`;
  
  debug(`Trying ${method} request to: ${url}`);
  if (data && isDebugMode) {
    debug('Request data:', JSON.stringify(data).substring(0, 100) + '...');
  }
  
  try {
    let response;
    if (method === 'GET') {
      response = await axios.get(url, axiosConfig);
    } else if (method === 'POST') {
      response = await axios.post(url, data, axiosConfig);
    } else if (method === 'PUT') {
      response = await axios.put(url, data, axiosConfig);
    } else if (method === 'DELETE') {
      response = await axios.delete(url, axiosConfig);
    }
    
    debug(`Response status: ${response?.status}`);
    if (response?.data && isDebugMode) {
      debug(`Response data:`, JSON.stringify(response.data).substring(0, 200) + '...');
    }
    return response;
  } catch (error: any) {
    if (error.response) {
      debug(`Error ${error.response.status} for ${url}: ${JSON.stringify(error.response.data)}`);
      
      if (error.response.status === 404) {
        // Return null for 404 so we can try the next endpoint
        return null;
      }
    } else {
      debug(`Network error for ${url}: ${error.message}`);
    }
    // For other errors, re-throw
    throw error;
  }
}

async function tryApiEndpoints(method: string, data?: any): Promise<any> {
  let lastError = null;
  let endpoint: string;
  
  // If we have a detected resource type, prioritize those endpoints
  let endpoints = [...API_ENDPOINT_VARIATIONS];
  
  for (endpoint of endpoints) {
    try {
      const response = await tryApiRequest(method, endpoint, data);
      if (response !== null) {
        debug(`✅ Successfully used endpoint: ${endpoint}`);
        // Save the successful endpoint type for future calls
        if (endpoint.includes('/services/')) {
          detectedResourceType = 'services';
        } else if (endpoint.includes('/applications/')) {
          detectedResourceType = 'applications';
        }
        return response;
      }
    } catch (error) {
      lastError = error;
    }
  }
  
  // If we get here, all endpoints failed
  throw lastError || new Error('All API endpoints failed with 404');
}

async function deleteVariable(variableId: string): Promise<boolean> {
  for (const endpoint of API_ENDPOINT_VARIATIONS) {
    try {
      const deleteEndpoint = `${endpoint}/${variableId}`;
      // Ensure resourceId is treated as a string
      const url = `${COOLIFY_URL}${formatEndpoint(deleteEndpoint, resourceId as string)}`;
      
      if (isDryRun) {
        debug(`[DRY RUN] Would delete variable ID ${variableId} at ${url}`);
        return true;
      }
      
      await axios.delete(url, axiosConfig);
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Try next endpoint
        continue;
      }
      throw error;
    }
  }
  return false;
}

// Try to discover API endpoints and resource type
async function discoverEndpoints(): Promise<void> {
  console.log('Attempting to discover API endpoints and resource type...');
  
  // Try to get API docs or version info
  try {
    const response = await axios.get(`${COOLIFY_URL}`, axiosConfig);
    console.log('API info found:', response.data);
    
    // Try to extract version
    if (response.data.version) {
      console.log(`Coolify API version: ${response.data.version}`);
    }
  } catch (error: any) {
    console.log('Could not get API info');
  }
  
  // Try to discover resource type
  try {
    // Check if it's a service
    const servicesResponse = await axios.get(`${COOLIFY_URL}/v1/services`, axiosConfig);
    if (servicesResponse.data && Array.isArray(servicesResponse.data)) {
      const service = servicesResponse.data.find((r: any) => r.id.toString() === resourceId);
      if (service) {
        detectedResourceType = 'services';
        console.log(`Resource found as service: ${service.name}`);
        return;
      }
    }
  } catch (error: any) {
    debug('Resource is not a service');
  }
  
  try {
    // Check if it's an application
    const applicationsResponse = await axios.get(`${COOLIFY_URL}/v1/applications`, axiosConfig);
    if (applicationsResponse.data && Array.isArray(applicationsResponse.data)) {
      const application = applicationsResponse.data.find((r: any) => r.id.toString() === resourceId);
      if (application) {
        detectedResourceType = 'applications';
        console.log(`Resource found as application: ${application.name}`);
        return;
      }
    }
  } catch (error: any) {
    debug('Resource is not an application');
  }
  
  // Try general resources list
  try {
    const response = await axios.get(`${COOLIFY_URL}/v1/resources`, axiosConfig);
    console.log('Resources found:', response.data.length);
    // Look for the specific resource
    const resource = response.data.find((r: any) => r.id.toString() === resourceId);
    if (resource) {
      console.log('Found resource:', resource.name, 'type:', resource.type || 'unknown');
      if (resource.type) {
        detectedResourceType = `${resource.type}s`; // Add plural for endpoint
        console.log(`Setting detected resource type to: ${detectedResourceType}`);
      }
    } else {
      console.log('⚠️ Resource ID not found! Available resource IDs:');
      response.data.slice(0, 5).forEach((r: any) => {
        console.log(`- ID: ${r.id}, Name: ${r.name}, Type: ${r.type || 'unknown'}`);
      });
    }
  } catch (error: any) {
    console.log('Could not list resources');
  }
}

async function syncEnvironmentVariables() {
  try {
    if (isDryRun) {
      console.log(`DRY RUN MODE: No changes will be made to resource ${resourceId}`);
    } else {
      console.log(`Starting environment variable sync for resource ${resourceId}...`);
    }
    
    if (filterPrefix) {
      console.log(`Filtering variables: only syncing variables starting with '${filterPrefix}'`);
    }
    
    // Step 1: Read .env.local file
    console.log(`Reading variables from ${ENV_FILE}...`);
    const envContent = fs.readFileSync(ENV_FILE, 'utf8');
    const envVars = dotenv.parse(envContent);
    
    // Filter variables if prefix is specified
    let filteredVars = Object.entries(envVars);
    if (filterPrefix) {
      filteredVars = filteredVars.filter(([name]) => name.startsWith(filterPrefix));
      console.log(`Filtered to ${filteredVars.length} variables starting with '${filterPrefix}'`);
    }
    
    // Format variables for API
    const newVariables = filteredVars
      // Don't include the Coolify token itself in the variables we send
      .filter(([name]) => name !== 'COOLIFY_TOKEN' && name !== 'COOLIFY_URL')
      .map(([name, value]) => ({
        name,
        value,
        isBuildVariable: false, // Set to true for build-time variables if needed
        isSecret: name.includes('SECRET') || name.includes('KEY') || name.includes('PASSWORD')
      }));
    
    console.log(`Found ${newVariables.length} variables to sync`);
    
    // Discover API endpoints and resource type first
    await discoverEndpoints();
    
    // Step 2: Get existing variables from Coolify
    console.log(`Fetching existing variables from Coolify...`);
    
    let getResponse;
    try {
      getResponse = await tryApiEndpoints('GET');
    } catch (error: any) {
      console.error('❌ Failed to fetch existing variables. Will attempt to upload new ones anyway.');
      getResponse = { data: { variables: [] } };
    }
    
    // Try to normalize the response data structure
    let existingVariables: EnvVariable[] = [];
    if (getResponse.data) {
      if (Array.isArray(getResponse.data)) {
        existingVariables = getResponse.data;
      } else if (getResponse.data.variables && Array.isArray(getResponse.data.variables)) {
        existingVariables = getResponse.data.variables;
      } else if (getResponse.data.environmentVariables && Array.isArray(getResponse.data.environmentVariables)) {
        existingVariables = getResponse.data.environmentVariables;
      } else if (getResponse.data.env && Array.isArray(getResponse.data.env)) {
        existingVariables = getResponse.data.env;
      }
    }
    
    console.log(`Found ${existingVariables.length} existing variables in Coolify`);
    
    // Filter existing variables if a prefix is specified
    if (filterPrefix) {
      const originalCount = existingVariables.length;
      existingVariables = existingVariables.filter(v => v.name.startsWith(filterPrefix));
      console.log(`Filtered existing variables: ${existingVariables.length} of ${originalCount} match prefix '${filterPrefix}'`);
    }
    
    // Print tables for comparison
    if (isDebugMode || isDryRun) {
      console.log('\nExisting variables in Coolify:');
      console.log('-'.repeat(60));
      console.log('| Name'.padEnd(30) + '| Value'.padEnd(30) + '|');
      console.log('-'.repeat(60));
      
      existingVariables.forEach(v => {
        const displayValue = v.isSecret ? '********' : (v.value || '').substring(0, 25);
        console.log(`| ${v.name.padEnd(28)}| ${displayValue.padEnd(28)}|`);
      });
      
      console.log('-'.repeat(60));
      
      console.log('\nNew variables from local file:');
      console.log('-'.repeat(60));
      console.log('| Name'.padEnd(30) + '| Value'.padEnd(30) + '|');
      console.log('-'.repeat(60));
      
      newVariables.forEach(v => {
        const displayValue = v.isSecret ? '********' : v.value.substring(0, 25);
        console.log(`| ${v.name.padEnd(28)}| ${displayValue.padEnd(28)}|`);
      });
      
      console.log('-'.repeat(60));
    }
    
    if (isDryRun) {
      console.log('\n[DRY RUN] Summary of changes:');
      console.log(`- Would remove: ${existingVariables.length} variables`);
      console.log(`- Would add: ${newVariables.length} variables`);
      console.log('\nRun without --dry-run to apply these changes.');
      return;
    }
    
    // Step 3: Delete all existing variables
    if (existingVariables.length > 0) {
      console.log(`Removing ${existingVariables.length} existing variables...`);
      
      // Some APIs require deleting variables one by one
      for (const variable of existingVariables) {
        try {
          const deleted = await deleteVariable(variable.id as string);
          if (!deleted) {
            console.warn(`⚠️ Could not delete variable ${variable.name} - will try to overwrite`);
          }
        } catch (deleteError: any) {
          console.error(`Failed to delete variable ${variable.name}: ${deleteError.message}`);
          // Continue with other variables even if one fails
        }
      }
      
      console.log(`Existing variables removed`);
    }
    
    // Step 4: Upload all new variables
    console.log(`Uploading ${newVariables.length} variables from local file...`);
    
    let uploadSuccess = false;
    
    // Try different payload formats
    const payloadVariations = [
      { variables: newVariables },                  // Standard format
      { env: newVariables },                        // Alternative format
      { data: { variables: newVariables } },        // Nested format
      { environmentVariables: newVariables },       // Another variation
      newVariables,                                 // Direct array
    ];
    
    // First try POST with different payload formats
    for (const payload of payloadVariations) {
      if (uploadSuccess) break;
      
      try {
        await tryApiEndpoints('POST', payload);
        uploadSuccess = true;
        console.log('✅ Environment variables successfully synced!');
      } catch (error: any) {
        debug(`POST attempt failed with payload format:`, JSON.stringify(payload).substring(0, 50) + '...');
        // Continue to next format
      }
    }
    
    // If POST failed, try PUT with different payload formats
    if (!uploadSuccess) {
      console.error('❌ Failed to upload variables using POST method.');
      console.error('Attempting with PUT method...');
      
      for (const payload of payloadVariations) {
        if (uploadSuccess) break;
        
        try {
          await tryApiEndpoints('PUT', payload);
          uploadSuccess = true;
          console.log('✅ Environment variables successfully synced using PUT method!');
        } catch (error: any) {
          debug(`PUT attempt failed with payload format:`, JSON.stringify(payload).substring(0, 50) + '...');
          // Continue to next format
        }
      }
    }
    
    // As a last resort, try uploading variables one by one
    if (!uploadSuccess) {
      console.error('❌ Failed to upload variables using PUT method.');
      console.log('Attempting to upload variables one by one...');
      let successCount = 0;
      
      for (const variable of newVariables) {
        try {
          // Try different formats for single variable upload too
          for (const format of [
            { variable },
            variable,
            { data: variable },
            { environmentVariable: variable }
          ]) {
            try {
              await tryApiEndpoints('POST', format);
              successCount++;
              break; // Break the inner loop once one format works
            } catch (formatError: any) {
              // Try next format
              continue;
            }
          }
        } catch (singleError: any) {
          console.error(`Failed to upload variable ${variable.name}: ${singleError.message}`);
        }
      }
      
      if (successCount > 0) {
        console.log(`✅ Successfully uploaded ${successCount} out of ${newVariables.length} variables.`);
        uploadSuccess = true;
      } else {
        throw new Error('All upload methods failed');
      }
    }
    
    if (uploadSuccess) {
      // Print summary
      console.log('\nSync Summary:');
      console.log(`- Removed: ${existingVariables.length} variables`);
      console.log(`- Added: ${newVariables.length} variables`);
      
      // Print the first few variable names that were synced (without values for security)
      console.log('\nSynced variables (sample):');
      newVariables.slice(0, Math.min(5, newVariables.length)).forEach(v => {
        console.log(`- ${v.name}`);
      });
      
      if (newVariables.length > 5) {
        console.log(`... and ${newVariables.length - 5} more variables`);
      }
      
      console.log('\nDone. To redeploy your application with the new variables, use the Coolify dashboard.');
    }
    
  } catch (error: any) {
    console.error('\n❌ Failed to sync environment variables:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    
    console.error('\nTroubleshooting suggestions:');
    console.error('1. Verify your COOLIFY_TOKEN is correct');
    console.error('2. Check that the resource ID is valid and accessible with your token');
    console.error('3. Try using the Coolify UI to verify API version compatibility');
    console.error('4. Check Coolify documentation for API changes: https://coolify.io/docs');
    console.error('5. Run with --debug flag for more information: pnpm env:sync 4 --debug');
    console.error('6. Run with --dry-run flag to test without making changes: pnpm env:sync 4 --dry-run');
    console.error('7. Try filtering to a subset of variables: pnpm env:sync 4 --filter=DATABASE_');
    
    process.exit(1);
  }
}

// Execute the sync
syncEnvironmentVariables(); 