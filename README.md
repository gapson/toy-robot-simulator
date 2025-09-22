# Toy Robot Simulator

A full-stack application simulating a toy robot moving on a 5x5 tabletop.

## Features

- 5x5 grid interface with click-to-place robot
- Robot movement (MOVE, LEFT, RIGHT, REPORT commands)
- SQLite database for position persistence
- Keyboard controls (arrow keys, spacebar)
- Real-time position updates
- Command validation and edge protection

## Quick Start

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```

### Option 2: Manual Setup
```bash
npm run install-all
npm start
```

**Application URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Test Cases

- PLACE 0,0,NORTH → MOVE → REPORT = 0,1,NORTH
- PLACE 0,0,NORTH → LEFT → REPORT = 0,0,WEST
- PLACE 1,2,NORTH → MOVE → MOVE → RIGHT → MOVE → REPORT = 2,4,EAST

## Tech Stack

- **Backend:** NestJS + TypeORM + SQLite
- **Frontend:** React + TypeScript
- **Testing:** Jest
