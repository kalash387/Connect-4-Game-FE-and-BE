# Connect 4 Game 🎮

A modern, real-time multiplayer Connect 4 game built with React, Firebase, Express.js, AWS Lambda, and MongoDB. Features include real-time multiplayer gameplay using Firebase, serverless functions with AWS Lambda, RESTful backend API with Express.js, MongoDB for data persistence, user authentication, and a sleek cyberpunk-inspired design.

[View Live Demo](https://connect-4-game-by-kalash.vercel.app/) | [Report Bug](https://github.com/kalash387/Connect-4-Game-FE-and-BE/issues) | [Request Feature](https://github.com/kalash387/Connect-4-Game-FE-and-BE/issues)

## 🎥 Game Preview

Experience the sleek, cyberpunk-inspired interface of our Connect 4 game:

![Connect 4 Game Screenshot](/assets/game-screenshot.png)

## ✨ Key Features

- **🌐 Real-time Multiplayer**
  - Instant game updates using Firebase Realtime Database
  - Room-based matchmaking system
  - Live score tracking
  - Real-time player turn indicators
  - Multiplayer state synchronization

- **☁️ Serverless Architecture**
  - AWS Lambda functions for backend operations
  - Firebase Realtime Database for game state management
  - Scalable and cost-effective infrastructure
  - Optimized performance and reliability

- **🎮 Game Modes**
  - Multiplayer: Real-time matches against other players
  - Single Player: AI opponent with multiple difficulty levels
  - Practice mode with AI for training

- **🎯 Gameplay Features**
  - 60-second timer per turn
  - Live score tracking
  - Winning animations with confetti effects
  - Interactive game board with hover effects

- **👤 User Authentication**
  - Secure login and registration
  - Guest mode available
  - Protected game routes
  - Session management

## 🏗️ Technical Architecture

### Frontend
- React.js for UI components
- Redux for state management
- Material-UI for design components
- Firebase SDK for real-time features

### Backend
- AWS Lambda for serverless functions
- Firebase Realtime Database for game state
- Express.js for API routing
- MongoDB for user data storage

### Real-time Features
- Firebase Realtime Database for:
  - Live game state updates
  - Player moves synchronization
  - Score tracking
  - Room management

### Serverless Functions
- AWS Lambda endpoints for:
  - User authentication
  - Game analytics
  - Score management
  - API gateway integration

## 🚀 Live Demo

Experience the game: [Connect 4 Game](https://connect-4-game-by-kalash.vercel.app/)

## 💻 Tech Stack

* [React.js](https://reactjs.org/)
* [Firebase](https://firebase.google.com/)
* [AWS Lambda](https://aws.amazon.com/lambda/)
* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [Material-UI](https://mui.com/)

## 🛠️ Installation

1. Clone the repository
   ```sh
   git clone https://github.com/kalash387/Connect-4-Game-FE-and-BE.git
   ```

2. Install frontend dependencies
   ```sh
   cd frontend
   npm install
   ```

3. Configure Firebase
   - Create a Firebase project
   - Enable Realtime Database
   - Add your Firebase config to `src/services/firebaseConfig.js`
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     databaseURL: "your-database-url",
     projectId: "your-project-id",
     // ...other config
   };
   ```

4. Set up AWS Lambda
   - Create AWS Lambda functions
   - Configure API Gateway
   - Update environment variables
   ```sh
   # .env file
   REACT_APP_API_URL=your-api-gateway-url
   ```

5. Start the development server
   ```sh
   npm start
   ```

## 🎮 Multiplayer Features

- **Real-time Game State**
  - Instant move updates
  - Live score tracking
  - Player presence detection
  - Turn-based synchronization

- **Room Management**
  - Create private game rooms
  - Join existing rooms via code
  - Auto-cleanup of inactive rooms

- **Player Experience**
  - Real-time opponent moves
  - Live game statistics
  - Interactive gameplay elements
  - Instant win detection

## ⚡ Performance Optimizations

- Firebase offline persistence
- Optimized real-time updates
- Efficient state management
- Lazy loading of components
- AWS Lambda cold start optimization

## 🔐 Security Features

- Firebase security rules
- AWS IAM roles and policies
- JWT authentication
- Protected API endpoints
- Secure WebSocket connections

## 🎨 Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primary Color | ![#4a9eff](https://via.placeholder.com/10/4a9eff?text=+) #4a9eff |
| Secondary Color | ![#6b5eff](https://via.placeholder.com/10/6b5eff?text=+) #6b5eff |
| Background | ![#1E1E30](https://via.placeholder.com/10/1E1E30?text=+) #1E1E30 |
| Text Color | ![#FFFFFF](https://via.placeholder.com/10/FFFFFF?text=+) #FFFFFF |

## 📧 Contact

Kalash Rami - [kalashrami387@gmail.com](mailto:kalashrami387@gmail.com)

Project Link: [https://github.com/kalash387/Connect-4-Game-FE-and-BE](https://github.com/kalash387/Connect-4-Game-FE-and-BE)

## 🙏 Acknowledgments

* [Firebase](https://firebase.google.com/)
* [AWS Lambda](https://aws.amazon.com/lambda/)
* [Material-UI](https://mui.com/)
* [React Icons](https://react-icons.github.io/react-icons/)
* [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)