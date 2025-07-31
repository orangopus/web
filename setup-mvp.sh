#!/bin/bash

# 🚀 Orangopus MVP Setup Script
# This script helps you set up the Orangopus MVP quickly

echo "🚀 Setting up Orangopus MVP..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 14 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 14 ]; then
        print_error "Node.js version 14 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating template..."
        cat > .env << EOF
# Supabase Configuration
VUE_APP_SUPABASE_URL=your_supabase_project_url
VUE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub OAuth (Optional - for GitHub integration)
VUE_APP_GITHUB_CLIENT_ID=your_github_client_id
VUE_APP_GITHUB_CLIENT_SECRET=your_github_client_secret

# StoryChief API (Optional - for news observatory)
VUE_APP_STORYCHIEF_TOKEN=your_storychief_api_token

# App Configuration
VUE_APP_APP_NAME=Orangopus
VUE_APP_APP_DESCRIPTION=Community-Driven Development Platform
VUE_APP_APP_URL=https://orangopus.org
EOF
        print_warning "Please update the .env file with your actual values"
    else
        print_success ".env file exists"
    fi
}

# Check if Supabase is configured
check_supabase() {
    print_status "Checking Supabase configuration..."
    
    if [ -f ".env" ]; then
        if grep -q "your_supabase_project_url" .env; then
            print_warning "Supabase URL not configured. Please update .env file"
        else
            print_success "Supabase URL is configured"
        fi
        
        if grep -q "your_supabase_anon_key" .env; then
            print_warning "Supabase anon key not configured. Please update .env file"
        else
            print_success "Supabase anon key is configured"
        fi
    fi
}

# Create database tables
setup_database() {
    print_status "Setting up database tables..."
    
    if [ -f "supabase-setup.sql" ]; then
        print_status "Database setup SQL file found"
        print_warning "Please run the SQL commands in your Supabase dashboard"
        print_status "File: supabase-setup.sql"
    else
        print_warning "Database setup SQL file not found"
    fi
}

# Build the project
build_project() {
    print_status "Building the project..."
    
    if npm run build; then
        print_success "Project built successfully"
    else
        print_error "Failed to build project"
        exit 1
    fi
}

# Start development server
start_dev() {
    print_status "Starting development server..."
    
    if npm run dev; then
        print_success "Development server started"
        print_status "Open http://localhost:8080 in your browser"
    else
        print_error "Failed to start development server"
        exit 1
    fi
}

# Main setup function
main() {
    echo ""
    echo "🎯 Orangopus MVP Setup"
    echo "========================"
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    
    # Install dependencies
    install_dependencies
    
    # Check environment
    check_env
    check_supabase
    
    # Setup database
    setup_database
    
    echo ""
    echo "🎉 Setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Update the .env file with your Supabase credentials"
    echo "2. Run the SQL commands in your Supabase dashboard"
    echo "3. Start the development server: npm run dev"
    echo "4. Open http://localhost:8080 in your browser"
    echo ""
    echo "For more information, see:"
    echo "- README.md - Project overview"
    echo "- PROJECT_INDEX.md - Detailed project structure"
    echo "- env-config.md - Environment configuration"
    echo ""
}

# Run main function
main "$@" 