#!/bin/bash

# Script to run before pushing to verify build will succeed on Vercel
echo "==================================="
echo "🔍 Running Vercel build check"
echo "==================================="

# Create a temp folder for the build
TEMP_DIR=".build-check"
mkdir -p $TEMP_DIR

# Save current changes to a stash
echo "📦 Stashing current changes..."
git stash push -m "build-check-stash" >/dev/null 2>&1

# Clean up on exit
function cleanup {
  echo "🧹 Cleaning up..."
  git stash pop >/dev/null 2>&1
  rm -rf $TEMP_DIR
  echo "==================================="
}

# Set cleanup to run when script exits
trap cleanup EXIT

# Run typecheck
echo "🔍 Running type check..."
pnpm typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript check failed!"
  exit 1
fi
echo "✅ TypeScript check passed!"

# Run build with type checking disabled
echo "Running build with type checking disabled..."
SKIP_TYPE_CHECK=true pnpm build

# Store the exit code
exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "✅ Build completed successfully!"
  exit 0
else
  echo "❌ Build failed with exit code $exit_code"
  exit $exit_code
fi

echo "===================================" 