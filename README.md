# ChessIQ

A comprehensive chess analysis and training platform that leverages AI and chess engines to help players improve their game through detailed analysis, personalized training plans, and performance tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Services](#services)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

ChessIQ is a full-stack chess improvement platform designed to provide players with professional-grade analysis tools and personalized training recommendations. The platform analyzes your chess games using Stockfish engine, generates AI-powered training plans, and tracks your performance metrics over time.

## ✨ Features

### 🔍 Game Analysis
- **Deep Chess Engine Analysis**: Powered by Stockfish for accurate position evaluation
- **Move-by-Move Breakdown**: Interactive chessboard with detailed move annotations
- **Mistake Detection**: Automatic identification of blunders, mistakes, and inaccuracies
- **Opening Classification**: Identifies openings played and provides insights
- **Tactical Pattern Recognition**: Highlights missed tactical opportunities

### 📊 Performance Dashboard
- **Interactive Analytics**: Visualize your performance trends with Chart.js
- **KPI Tracking**: Monitor key performance indicators including:
  - Average accuracy across games
  - Blunder/Mistake/Inaccuracy rates
  - Win/Loss/Draw statistics
  - Rating progression
  - Time control performance
- **Filterable Views**: Analyze performance by time period, color, and time control

### 🎓 AI-Powered Training Plans
- **Personalized Recommendations**: AI analyzes your game history to create custom training plans
- **Structured Learning Paths**: Week-by-week breakdown of focused training areas
- **Progressive Difficulty**: Training adapts to your rating and improvement areas
- **Comprehensive Coverage**: Addresses openings, tactics, endgames, and strategic concepts

### 🔐 User Management
- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Track multiple players and their progress
- **Session Management**: Secure token refresh and logout mechanisms

## 🏗️ Architecture

ChessIQ follows a microservices architecture with a React frontend and Node.js backend services communicating via REST APIs and Redis Pub/Sub.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              React Frontend (Port 80)                 │    │
│  │                                                          │    │
│  │  • Authentication UI      • Game Analysis UI           │    │
│  │  • Dashboard & Charts     • Training Plan UI           │    │
│  │  • Interactive Chessboard • Profile Management         │    │
│  └────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              │ HTTP/REST                         │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                         API GATEWAY                               │
│                              │                                    │
│                        Nginx (Port 80)                           │
│                    API Routing & Load Balancing                  │
└──────────────────────────────┼───────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
┌─────────────▼─────┐  ┌──────▼──────┐  ┌─────▼──────────┐
│  Auth Service     │  │  Dashboard  │  │ Training Plan  │
│   (Port 3002)     │  │   Service   │  │    Service     │
│                   │  │ (Port 3001) │  │  (Port 3003)   │
│ • JWT Auth        │  │             │  │                │
│ • User CRUD       │  │ • KPI Calc  │  │ • AI Generate  │
│ • Token Refresh   │  │ • Analytics │  │ • Plan CRUD    │
└─────────┬─────────┘  └──────┬──────┘  └────────┬───────┘
          │                   │                   │
          │            ┌──────▼──────┐            │
          │            │   Chess     │            │
          │            │  Analysis   │            │
          │            │   Service   │            │
          │            │ (Port 3000) │            │
          │            │             │            │
          │            │ • Stockfish │            │
          │            │ • PGN Parse │            │
          │            │ • Analysis  │            │
          │            └──────┬──────┘            │
          │                   │                   │
┌─────────▼───────────────────▼───────────────────▼────────────────┐
│                    MESSAGING & CACHING LAYER                      │
│                                                                    │
│              Redis (Port 6379) - Pub/Sub Messaging                │
│                                                                    │
│  • Service-to-Service Communication                               │
│  • Event Broadcasting (Analysis Complete, Training Generated)     │
│  • Real-time Updates                                              │
└────────────────────────────────────────────────────────────────────┘
          │                   │                   │
┌─────────▼───────────────────▼───────────────────▼────────────────┐
│                      DATA PERSISTENCE LAYER                       │
│                                                                    │
│                   MongoDB (Port 27017)                            │
│                                                                    │
│  Collections:                                                     │
│  • users          - User accounts and profiles                   │
│  • games          - Chess game data and PGN                      │
│  • analyses       - Stockfish analysis results                   │
│  • trainingplans  - AI-generated training content                │
│  • sessions       - User session tokens                          │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT INFRASTRUCTURE                      │
│                                                                   │
│               Oracle Cloud Infrastructure (OCI)                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Kubernetes Cluster (OKE)                        │  │
│  │                                                            │  │
│  │  • Container Orchestration                                │  │
│  │  • Auto-scaling & Load Balancing                          │  │
│  │  • Service Discovery                                      │  │
│  │  • Health Monitoring                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│                       │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Highlights

**Frontend Layer**
- Single Page Application (SPA) built with React
- Component-based architecture for maintainability
- React Router for client-side routing
- Axios for HTTP requests with interceptors for authentication

**Microservices Layer**
- **Auth Service**: Handles user authentication, registration, and JWT token management
- **Chess Analysis Service**: Integrates Stockfish engine for game analysis and PGN parsing
- **Dashboard Service**: Aggregates game data and computes performance KPIs
- **Training Plan Service**: Generates AI-powered personalized training recommendations

**Communication**
- REST APIs for client-server communication
- Redis Pub/Sub for asynchronous service-to-service messaging
- Event-driven architecture for real-time updates

**Data Layer**
- MongoDB for document-based storage
- Indexed queries for optimal performance
- Aggregation pipelines for complex analytics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **chess.js** - Chess logic and validation
- **react-chessboard** - Interactive chessboard component
- **Marked** - Markdown parsing for training plans

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Redis** - Pub/Sub messaging
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Chess Engine
- **Stockfish** - Chess analysis engine
- **PGN Parser** - Chess game notation parsing

### DevOps
- **Docker** - Containerization
- **Kubernetes (OKE)** - Container orchestration
- **Nginx** - Reverse proxy and load balancing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB 6.0+
- Redis 7.0+
- Stockfish chess engine

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/varun-vbr/ChessIQ.git
cd chessiq
```

2. **Install dependencies**

```bash
# Install frontend dependencies
cd chessiq-ui
npm install

# Install backend service dependencies
cd ../auth-service
npm install

cd ../chess-analysis-service
npm install

cd ../dashboard-service
npm install

cd ../training-service
npm install
```

3. **Configure environment variables**

Create `.env` files in each service directory:

**auth-service/.env**
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/chessiq
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=7d
REDIS_HOST=localhost
REDIS_PORT=6379
```

**chess-analysis-service/.env**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chessiq
REDIS_HOST=localhost
REDIS_PORT=6379
```

**dashboard-service/.env**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/chessiq
REDIS_HOST=localhost
REDIS_PORT=6379
```

**training-service/.env**
```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/chessiq
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=your_openai_api_key_here
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:80
```

4. **Start the services**

**Using Docker Compose (Recommended)**
```bash
docker-compose up -d
```

**Manual startup**
```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Start Redis
redis-server

# Start each service
cd backend/auth-service && npm start
cd backend/chess-analysis-service && npm start
cd backend/dashboard-service && npm start
cd backend/training-service && npm start

# Start frontend
cd frontend && npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:80

## 📦 Services

### Auth Service (Port 3002)

Handles user authentication and authorization.

**Key Features:**
- User registration and login
- JWT token generation and validation
- Token refresh mechanism
- Password hashing with bcrypt
- Protected route middleware

**Main Endpoints:**
- `POST /api/v1/user/signup` - Register new user
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/logout` - User logout

### Chess Analysis Service (Port 3000)

Integrates Stockfish for deep chess analysis.

**Key Features:**
- PGN parsing and validation
- Stockfish engine integration
- Move evaluation and classification
- Opening identification
- Tactical pattern detection

**Main Endpoints:**
- `POST /api/v1/analysis/` - Analyze a chess game
- `GET /api/v1/analysis/` - Get user's analyzed games

**Analysis Process:**
1. Parse PGN notation
2. Validate move legality
3. Evaluate each position with Stockfish
4. Classify move quality (book, best, good, inaccuracy, mistake, blunder)
5. Identify critical positions and missed opportunities
6. Store results in MongoDB
7. Publish completion event via Redis

### Dashboard Service (Port 3001)

Computes and serves performance analytics.

**Key Features:**
- KPI calculation using MongoDB aggregation
- Performance trends analysis
- Win/loss/draw statistics
- Average accuracy computation
- Time control filtering

**Main Endpoints:**
- `GET /api/v1/dashboard/kpis` - Get user KPIs
- `GET /api/v1/dashboard/games` - Get game history
- `GET /api/v1/dashboard/trends` - Get performance trends

**KPIs Computed:**
- Total games analyzed
- Win rate percentage
- Average accuracy score
- Blunder rate
- Mistake rate
- Inaccuracy rate
- Performance by color (white/black)
- Performance by time control

### Training Plan Service (Port 3003)

Generates AI-powered personalized training plans.

**Key Features:**
- AI analysis of game weaknesses
- Personalized training plan generation
- Structured week-by-week curriculum
- Markdown-formatted content
- Progress tracking

**Main Endpoints:**
- `POST /api/v1/training/generate` - Generate new training plan
- `GET /api/v1/training` - Get user's training plans

**Training Plan Generation:**
1. Fetch user's recent games and analyses
2. Identify patterns in mistakes and weaknesses
3. Generate AI prompt with user context
4. Create structured training curriculum
5. Store plan with week-by-week breakdown
6. Publish generation event via Redis

## 📡 API Documentation

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Common Response Formats

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Sample API Calls

**Register User**
```bash
curl -X POST http://localhost:80/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "chessmaster",
    "email": "chess@example.com",
    "password": "securepass123",
    "chesscomUsername": "chessmaster99"
  }'
```

**Analyze Game**
```bash
curl -X POST http://localhost:80/api/analysis/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pgn": "[Event \"Casual Game\"]\n[Site \"Chess.com\"]\n...",
    "userId": "user_id_here"
  }'
```

**Get Dashboard KPIs**
```bash
curl -X GET http://localhost:80/api/dashboard/kpis/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚢 Deployment

### Docker Build

```bash
# Build all images
docker-compose build

# Build specific service
docker build -t chessiq-ui ./chessiq-ui
docker build -t chessiq-auth ./auth-service
docker build -t chessiq-analysis ./chess-analysis-service
docker build -t chessiq-dashboard ./dashboard-service
docker build -t chessiq-training ./training-service
```

### Kubernetes Deployment

The application is deployed on Oracle Kubernetes Engine (OKE).

**Deploy to Kubernetes:**
```bash
# Apply configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/frontend
kubectl logs -f deployment/auth-service
```

**Key Kubernetes Resources:**
- Deployments for each service
- Services for internal communication
- Ingress for external access
- ConfigMaps for environment configuration
- Secrets for sensitive data

## 💻 Development

### Project Structure

```
chessiq/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service modules
│   │   ├── context/         # React context providers
│   │   └── App.js           # Main application component
│   └── package.json
│
├── backend/
│   ├── auth-service/        # Authentication microservice
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Auth middleware
│   │   └── server.js        # Service entry point
│   │
│   ├── chess-analysis-service/  # Chess analysis microservice
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/        # Stockfish integration
│   │   └── server.js
│   │
│   ├── dashboard-service/   # Analytics microservice
│   │   ├── models/
│   │   ├── routes/
│   │   ├── aggregations/    # MongoDB pipelines
│   │   └── server.js
│   │
│   └── training-service/    # Training plan microservice
│       ├── models/
│       ├── routes/
│       ├── services/        # AI integration
│       └── server.js
│
├── k8s/                     # Kubernetes manifests
├── docker-compose.yml       # Local development setup
└── README.md
```

### Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test locally**
```bash
docker-compose up
```

3. **Run tests** (when available)
```bash
npm test
```

4. **Commit and push**
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

5. **Create pull request**

### Code Style

- Follow ESLint configuration
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous operations

### Adding a New Service

1. Create service directory in `/`
2. Initialize npm project
3. Set up Express server
4. Define models and routes
5. Configure Redis pub/sub if needed
6. Add Dockerfile
7. Update docker-compose.yml
8. Create Kubernetes manifests
9. Update this README

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Varun Rao**
- Target Role: Staff Software Engineer
- Chess Rating: ~1130-1170
- GitHub: [Your GitHub Profile]

## 🙏 Acknowledgments

- Stockfish chess engine team
- Chess.com and Lichess.com for inspiration
- OpenAI for AI capabilities
- The open-source community

---

**Built with ♟️ by a chess enthusiast for chess enthusiasts**
