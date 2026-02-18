#!/bin/bash

# Sync Local Convex Data to Production
# Usage: ./scripts/sync-to-prod.sh <prod-deployment-name>

PROD_DEPLOYMENT=$1

if [ -z "$PROD_DEPLOYMENT" ]; then
  echo "Usage: $0 <prod-deployment-name>"
  echo "Example: $0 brilliant-chicken-157"
  exit 1
fi

# Ensure we're in the project root
cd "$(dirname "$0")/.."

echo "📦 Exporting local data (from current context)..."
npx convex export --path local_data.zip

if [ ! -f "local_data.zip" ]; then
  echo "❌ Export failed."
  exit 1
fi

echo "🚀 Importing to Production ($PROD_DEPLOYMENT)..."

# Trick: Clear the CONVEX_DEPLOYMENT env var or override it to force prod context
# This bypasses the 'unknown variant local' error
CONVEX_DEPLOYMENT=$PROD_DEPLOYMENT npx convex import local_data.zip --replace --yes

echo "✅ Sync Complete!"
echo "🧹 Cleaning up..."
rm local_data.zip
