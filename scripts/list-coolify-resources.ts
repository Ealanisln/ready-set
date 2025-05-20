import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Command line arguments parsing
const args = process.argv.slice(2);
const isVerboseMode = args.includes('--verbose');
const isCompactMode = args.includes('--compact');
const isJsonOutput = args.includes('--json');
const isTypeFilter = args.some(arg => arg.startsWith('--type='));
const typeFilter = isTypeFilter 
  ? args.find(arg => arg.startsWith('--type='))?.split('=')[1] || ''
  : null;

// Help text for command usage
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: pnpm env:list [options]

Options:
  --verbose       Show more details for each resource
  --compact       Show minimal information in a compact format
  --json          Output in JSON format for scripting
  --type=TYPE     Filter resources by type (e.g. --type=service)
  --help, -h      Show this help message

Examples:
  pnpm env:list                   # List all resources
  pnpm env:list --verbose         # List all resources with detailed information
  pnpm env:list --compact         # List resources in compact format
  pnpm env:list --type=service    # List only service resources
  pnpm env:list --json            # Output in JSON format
  `);
  process.exit(0);
}

// Configuration
const COOLIFY_URL = process.env.COOLIFY_URL || 'https://coolify.readysetllc.com';
const COOLIFY_TOKEN = process.env.COOLIFY_TOKEN;

if (!COOLIFY_TOKEN) {
  console.error('❌ COOLIFY_TOKEN environment variable is not set in .env.local');
  console.error('Please add it to your .env.local file:');
  console.error('COOLIFY_TOKEN=your_token_here');
  process.exit(1);
}

async function getApiInfo() {
  try {
    const response = await axios.get(
      `${COOLIFY_URL}/api`,
      {
        headers: { 'Authorization': `Bearer ${COOLIFY_TOKEN}` }
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

// Resource collection to store all discovered resources
const allResources: any[] = [];

async function listResources() {
  try {
    // Try to get API info first to understand the API version
    const apiInfo = await getApiInfo();
    if (apiInfo && !isCompactMode && !isJsonOutput) {
      console.log('Coolify API Info:');
      console.log(JSON.stringify(apiInfo, null, 2));
      console.log('\n');
    }
    
    // Try to get resources from primary endpoint
    const response = await axios.get(
      `${COOLIFY_URL}/api/v1/resources`,
      {
        headers: { 'Authorization': `Bearer ${COOLIFY_TOKEN}` }
      }
    );
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      allResources.push(...response.data);
    }
    
    // Always try alternative endpoints to get the most complete picture
    await tryAlternativeEndpoints();
    
    // Filter resources by type if requested
    let filteredResources = [...allResources];
    if (typeFilter) {
      filteredResources = allResources.filter(resource => {
        const resourceType = (resource.type || '').toLowerCase();
        return resourceType.includes(typeFilter.toLowerCase());
      });
      
      if (!isJsonOutput) {
        console.log(`Filtered to ${filteredResources.length} resources of type: ${typeFilter}`);
      }
    }
    
    // Output in JSON format if requested
    if (isJsonOutput) {
      console.log(JSON.stringify(filteredResources, null, 2));
      return;
    }
    
    // Print resources in a table
    if (!isCompactMode) {
      console.log('Your Coolify resources:');
      console.log('-'.repeat(100));
      console.log('| ID                | Name                 | Type                | Status              | Destination        |');
      console.log('-'.repeat(100));
    }
    
    if (filteredResources.length === 0) {
      if (!isCompactMode) {
        console.log('| No resources found                                                                           |');
        console.log('-'.repeat(100));
      } else {
        console.log('No resources found');
      }
      return;
    }
    
    for (const resource of filteredResources) {
      const id = (resource.id || '').toString();
      const name = resource.name || '';
      const type = resource.type || '';
      const status = resource.status || '';
      const destination = resource.destination || resource.destinationId || '';
      
      if (isCompactMode) {
        console.log(`${id}\t${name}\t${type}`);
      } else {
        const paddedId = id.padEnd(18);
        const paddedName = name.padEnd(20);
        const paddedType = type.padEnd(20);
        const paddedStatus = status.padEnd(20);
        const paddedDestination = destination.toString().padEnd(20);
        console.log(`| ${paddedId} | ${paddedName} | ${paddedType} | ${paddedStatus} | ${paddedDestination} |`);
        
        if (isVerboseMode) {
          console.log(`  Details for resource ID ${resource.id}:`);
          console.log('  ' + '-'.repeat(98));
          Object.entries(resource).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'name' && key !== 'type' && key !== 'status' && key !== 'destination') {
              console.log(`  - ${key}: ${JSON.stringify(value).substring(0, 80)}${JSON.stringify(value).length > 80 ? '...' : ''}`);
            }
          });
          console.log('  ' + '-'.repeat(98));
        }
      }
    }
    
    if (!isCompactMode) {
      console.log('-'.repeat(100));
      console.log('\nTo sync environment variables, run:');
      console.log('pnpm env:sync <resource-id> [options]');
      console.log('\nFor more options on syncing, run:');
      console.log('pnpm env:sync --help');
    }
    
    // If we have resources, try to get more info about environment variables structure
    if (filteredResources.length > 0 && isVerboseMode) {
      await tryGetEnvironmentVariablesStructure(filteredResources[0].id);
    }
    
  } catch (error: any) {
    console.error('❌ Failed to list resources:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  }
}

async function tryAlternativeEndpoints() {
  if (!isCompactMode && !isJsonOutput) {
    console.log('Searching for resources across all endpoints...');
  }
  
  const alternativeEndpoints = [
    '/api/v1/services',
    '/api/v1/applications',
    '/api/v1/destinations',
    '/api/v1/deployments',
    '/api/v2/resources',
    '/api/v1/projects',
    '/api/v1/stacks',
    '/api/v1/databases',
    '/api/v1/containers'
  ];
  
  for (const endpoint of alternativeEndpoints) {
    try {
      if (isVerboseMode) {
        console.log(`Checking ${endpoint}...`);
      }
      
      const response = await axios.get(
        `${COOLIFY_URL}${endpoint}`,
        {
          headers: { 'Authorization': `Bearer ${COOLIFY_TOKEN}` }
        }
      );
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Add endpoint type to resources 
        const resources = response.data.map((r: any) => ({
          ...r,
          coolify_endpoint: endpoint,
          type: r.type || endpoint.split('/').pop() || 'unknown'
        }));
        
        // Add to the collection, avoiding duplicates by ID
        for (const resource of resources) {
          if (!allResources.some(r => r.id === resource.id)) {
            allResources.push(resource);
          }
        }
        
        if (isVerboseMode) {
          console.log(`✅ Found ${resources.length} resources at ${endpoint}`);
        }
      }
    } catch (error: any) {
      // Ignore 404 errors, just try next endpoint
      if (error.response && error.response.status !== 404 && isVerboseMode) {
        console.error(`Error with ${endpoint}: ${error.response ? error.response.status : error.message}`);
      }
    }
  }
}

async function tryGetEnvironmentVariablesStructure(resourceId: string | number) {
  console.log('\nTesting environment variable endpoints for resource ID:', resourceId);
  
  const endpoints = [
    `/api/v1/resources/${resourceId}/environment-variables`,
    `/api/v1/resources/${resourceId}/environment`,
    `/api/v1/resources/${resourceId}/env`,
    `/api/v1/services/${resourceId}/environment-variables`,
    `/api/v1/applications/${resourceId}/environment-variables`,
    `/api/v1/services/${resourceId}/environment`,
    `/api/v1/applications/${resourceId}/environment`,
    `/api/v2/resources/${resourceId}/environment-variables`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}...`);
      const response = await axios.get(
        `${COOLIFY_URL}${endpoint}`,
        {
          headers: { 'Authorization': `Bearer ${COOLIFY_TOKEN}` }
        }
      );
      
      if (response.data) {
        console.log(`✅ Found environment variables at ${endpoint}`);
        console.log(`Structure: ${JSON.stringify(response.data).substring(0, 100)}...`);
        console.log('This endpoint should work with the env:sync script.');
        
        // Print the count of variables
        const variablesCount = Array.isArray(response.data) 
          ? response.data.length
          : (response.data.variables && Array.isArray(response.data.variables)
              ? response.data.variables.length
              : 'unknown');
        
        console.log(`Variables count: ${variablesCount}`);
        return;
      }
    } catch (error: any) {
      if (error.response) {
        console.log(`❌ ${endpoint}: ${error.response.status}`);
      } else {
        console.log(`❌ ${endpoint}: Network error`);
      }
    }
  }
  
  console.log('\nCould not find environment variables structure.');
  console.log('You may need to check the Coolify documentation or UI for the correct API endpoints.');
}

listResources(); 