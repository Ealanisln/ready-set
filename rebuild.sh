#!/bin/bash

# Stop any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "next"

# Clean the Next.js cache
echo "Cleaning Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies (optional, uncomment if needed)
# echo "Reinstalling dependencies..."
# pnpm install

# Build the project
echo "Rebuilding the project..."
pnpm run build

echo "Done! Start the development server with 'pnpm run dev'" 