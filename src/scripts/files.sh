#!/bin/bash

# Create base directory
mkdir -p src/components/Dashboard/UserView
mkdir -p src/components/Dashboard/UserView/hooks
mkdir -p src/components/Dashboard/UserView/Tabs
mkdir -p src/components/Dashboard/UserView/Sidebar

# Create empty files
# Main files
touch src/components/Dashboard/UserView/ModernUserProfile.tsx
touch src/components/Dashboard/UserView/UserHeader.tsx
touch src/components/Dashboard/UserView/UserProfileTabs.tsx
touch src/components/Dashboard/UserView/types.ts

# Hook files
touch src/components/Dashboard/UserView/hooks/useUserForm.ts
touch src/components/Dashboard/UserView/hooks/useUserData.ts

# Tab files
touch src/components/Dashboard/UserView/Tabs/ProfileTab.tsx
touch src/components/Dashboard/UserView/Tabs/AddressTab.tsx
touch src/components/Dashboard/UserView/Tabs/DetailsTab.tsx
touch src/components/Dashboard/UserView/Tabs/FilesTab.tsx

# Sidebar files
touch src/components/Dashboard/UserView/Sidebar/UserStatusCard.tsx
touch src/components/Dashboard/UserView/Sidebar/UserDocumentsCard.tsx
touch src/components/Dashboard/UserView/Sidebar/UserArchiveCard.tsx

echo "Folder structure and empty files created successfully!"