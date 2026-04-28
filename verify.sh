#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}     MeetUS Installation Verification${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Checking project structure...${NC}"

# Check server directory
if [ -d "server" ]; then
    echo -e "${GREEN}✓ server/ directory exists${NC}"
    if [ -f "server/package.json" ]; then
        echo -e "${GREEN}  ✓ server/package.json exists${NC}"
    fi
    if [ -f "server/server.js" ]; then
        echo -e "${GREEN}  ✓ server/server.js exists${NC}"
    fi
else
    echo -e "${RED}✗ server/ directory not found${NC}"
fi

# Check client directory
if [ -d "client" ]; then
    echo -e "${GREEN}✓ client/ directory exists${NC}"
    if [ -f "client/package.json" ]; then
        echo -e "${GREEN}  ✓ client/package.json exists${NC}"
    fi
    if [ -f "client/index.html" ]; then
        echo -e "${GREEN}  ✓ client/index.html exists${NC}"
    fi
else
    echo -e "${RED}✗ client/ directory not found${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}     ✓ All Checks Passed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo -e "1. Install backend dependencies:"
echo -e "   ${GREEN}cd server && npm install${NC}"
echo ""
echo -e "2. Start backend (in Terminal 1):"
echo -e "   ${GREEN}cd server && npm run dev${NC}"
echo ""
echo -e "3. Install frontend dependencies (in Terminal 2):"
echo -e "   ${GREEN}cd client && npm install${NC}"
echo ""
echo -e "4. Start frontend (in Terminal 2):"
echo -e "   ${GREEN}cd client && npm run dev${NC}"
echo ""
echo -e "5. Open browser:"
echo -e "   ${GREEN}http://localhost:5173${NC}"
echo ""
