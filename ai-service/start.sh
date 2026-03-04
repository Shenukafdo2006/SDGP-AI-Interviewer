#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting AI Interview Service...${NC}"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Please edit .env and add your GEMINI_API_KEY${NC}"
    exit 1
fi

# Check for venv
if [ ! -d venv ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install -r requirements.txt

# Start FastAPI server
echo -e "${GREEN}Starting FastAPI server on http://localhost:8000${NC}"
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
