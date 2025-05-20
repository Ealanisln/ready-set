# Coolify Environment Variables Sync

This guide explains how to use the scripts to synchronize your local environment variables (`.env.local`) with your Coolify deployment.

## Overview

The scripts provide these capabilities:

1. List all your Coolify resources to find the correct resource ID
2. Filter resources by type
3. Sync all or a subset of environment variables from your local `.env.local` file to a Coolify resource
4. Preview changes before applying them (dry-run mode)
5. Automatic discovery of the correct Coolify API endpoints
6. Support for multiple Coolify API versions and resource types

## Prerequisites

1. You need to have a Coolify account and API token
2. You need to add the following variables to your `.env.local` file:

```
COOLIFY_URL=https://coolify.readysetllc.com
COOLIFY_TOKEN=your_coolify_api_token_here
```

To get your Coolify API token:
1. Log in to your Coolify dashboard
2. Go to your profile settings
3. Navigate to "API Keys"
4. Create a new API key or use an existing one

## Usage

### Listing Available Resources

To see all resources in your Coolify account:

```bash
pnpm env:list
```

This will display a table with all your resources, including their IDs, names, and types.

#### List Command Options

```bash
pnpm env:list [options]
```

Options:
- `--verbose` - Show more details for each resource
- `--compact` - Show minimal information in a compact format
- `--json` - Output in JSON format for scripting
- `--type=TYPE` - Filter resources by type (e.g. `--type=service`)
- `--help`, `-h` - Show help message

Examples:
```bash
pnpm env:list --verbose               # Show detailed resource information
pnpm env:list --type=service          # List only services
pnpm env:list --json                  # Output in JSON format for scripting
```

### Syncing Environment Variables

To sync your local `.env.local` variables to a specific Coolify resource:

```bash
pnpm env:sync <resource-id>
```

Replace `<resource-id>` with the ID of your resource from the `env:list` command.

#### Sync Command Options

```bash
pnpm env:sync <resource-id> [options]
```

Options:
- `--debug` - Enable debug mode with detailed logging
- `--dry-run` - Show what would be done without making any changes
- `--filter=PREFIX` - Only sync variables starting with PREFIX
- `--help`, `-h` - Show help message

Examples:
```bash
pnpm env:sync 123 --dry-run            # Preview changes without applying them
pnpm env:sync 123 --filter=DATABASE_   # Only sync variables starting with DATABASE_
pnpm env:sync 123 --debug              # Show detailed debug information
```

## What the Sync Does

The `env:sync` script performs the following actions:

1. Auto-detects the resource type (service, application, etc.)
2. Reads all variables from your local `.env.local` file
3. If using filters, selects only the matching variables
4. Deletes the targeted environment variables in the Coolify resource
5. Uploads the selected variables to the Coolify resource

**Important**: By default, this completely replaces all environment variables in the Coolify resource. Use the `--filter` option to only update a subset of variables.

### Variables Excluded from Sync

The following variables are always excluded from the sync:
- `COOLIFY_TOKEN` - Your API token
- `COOLIFY_URL` - Your Coolify instance URL

### Variable Filtering

You can use the `--filter` option to only sync variables that start with a specific prefix. This is useful when:

- You want to update only database-related variables (`--filter=DATABASE_`)
- You want to update only API keys (`--filter=API_KEY_`)
- You want to update only a specific service's variables (`--filter=SERVICE_NAME_`)

Example:
```bash
pnpm env:sync 123 --filter=DATABASE_
```

This will only sync variables like `DATABASE_URL`, `DATABASE_USER`, etc.

## Dry Run Mode

Use the `--dry-run` flag to preview changes without applying them:

```bash
pnpm env:sync 123 --dry-run
```

This will:
1. Show all existing variables in the Coolify resource
2. Show all variables that would be added from your `.env.local` file
3. Display a summary of changes that would be made
4. Not make any actual changes to your Coolify resource

## Troubleshooting

### Authentication Issues

If you see an error like:

```
Status: 401
Error: {"message":"Unauthenticated"}
```

Check that your `COOLIFY_TOKEN` is correct in your `.env.local` file.

### Resource Not Found

If you have trouble finding your resource:

1. Run `pnpm env:list --verbose` to see all available resources
2. Look for the resource ID, name, and type
3. Try filtering by type: `pnpm env:list --type=service`

### API Version Issues

If you're experiencing API compatibility issues:

1. Run with debug mode: `pnpm env:sync 123 --debug`
2. The script will attempt to auto-discover the correct API endpoints
3. Check the output for information about discovered API structures

### After Syncing Variables

After syncing variables, you may need to:

1. Redeploy your application in Coolify for the changes to take effect
2. Restart services that depend on the environment variables

## Adding to CI/CD (Optional)

If you want to automatically sync variables when deploying:

1. Store your `COOLIFY_TOKEN` securely in your CI/CD environment
2. Add a step to run `pnpm env:sync <resource-id>` before deployment
3. For safe, targeted updates, use `pnpm env:sync <resource-id> --filter=PREFIX`

## Manual Deployment After Sync

After syncing variables, manually redeploy your application from the Coolify dashboard to ensure the new variables are used. 