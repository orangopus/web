#!/bin/bash

# Clean previous build
rm -rf dist

# Install dependencies
npm install

# Build the project
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Files in dist/ directory:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi 