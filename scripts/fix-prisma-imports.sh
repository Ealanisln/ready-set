#!/bin/bash

# Check if we're in the project root directory
if [ ! -d "./src" ] || [ ! -d "./prisma" ]; then
  echo "Error: Please run this script from the project root directory."
  exit 1
fi

echo "Starting to fix Prisma imports..."

# Replace UserType imports
echo "Replacing UserType imports..."
find src -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*UserType.*prisma/client" | while read file; do
  echo "Processing $file"
  # For files that import both UserType and Prisma
  if grep -q "import { Prisma, UserType }" "$file"; then
    sed -i '' 's/import { Prisma, UserType } from .*prisma\/client.*/import { Prisma } from "@prisma\/client";\nimport { UserType } from "@\/types\/prisma-types";/g' "$file"
  # For files that import both UserType and UserStatus  
  elif grep -q "import { UserType, UserStatus }" "$file"; then
    sed -i '' 's/import { UserType, UserStatus } from .*prisma\/client.*/import { UserType, UserStatus } from "@\/types\/prisma-types";/g' "$file"
  # For files that import Prisma, UserStatus, and UserType
  elif grep -q "import { Prisma, UserStatus, UserType }" "$file"; then
    sed -i '' 's/import { Prisma, UserStatus, UserType } from .*prisma\/client.*/import { Prisma } from "@prisma\/client";\nimport { UserStatus, UserType } from "@\/types\/prisma-types";/g' "$file"
  # For files that import just UserType
  else
    sed -i '' 's/import { UserType } from .*prisma\/client.*/import { UserType } from "@\/types\/prisma-types";/g' "$file"
  fi
done

# Replace other enum imports that might be in the project
for enum in "UserStatus" "DriverStatus" "CateringStatus" "OnDemandStatus" "ApplicationStatus" "VehicleType" "CateringNeedHost" "FormType"; do
  echo "Replacing $enum imports..."
  find src -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*$enum.*prisma/client" | while read file; do
    echo "Processing $file for $enum"
    # Don't modify files we've already processed for UserType to avoid double-replacing
    if ! grep -q "import.*UserType.*@/types/prisma-types" "$file"; then
      if grep -q "import { Prisma, $enum }" "$file"; then
        sed -i '' "s/import { Prisma, $enum } from .*prisma\/client.*/import { Prisma } from \"@prisma\/client\";\nimport { $enum } from \"@\/types\/prisma-types\";/g" "$file"
      else
        sed -i '' "s/import { $enum } from .*prisma\/client.*/import { $enum } from \"@\/types\/prisma-types\";/g" "$file"
      fi
    fi
  done
done

echo "All imports have been fixed!"
echo "Don't forget to commit the generated Prisma client folder:"
echo "git add prisma/generated/"
echo "git commit -m \"feat: add pre-generated prisma client and fix imports\"" 