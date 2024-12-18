# Connect 4 Game 🎮

A modern, interactive implementation of the classic Connect 4 game built with React and Node.js. Features include user authentication, multiple difficulty levels, and a sleek cyberpunk-inspired design.

[View Live Demo](https://connect-4-game-by-kalash.vercel.app/) | [Report Bug](https://github.com/kalash387/Connect-4-Game-FE-and-BE/issues) | [Request Feature](https://github.com/kalash387/Connect-4-Game-FE-and-BE/issues)

## 🎥 Game Preview

Experience the sleek, cyberpunk-inspired interface of our Connect 4 game:

![Connect 4 Game Screenshot](/assets/game-screenshot.png)

## ✨ Features

- **🎯 Multiple Game Modes**
  - Three difficulty levels (Easy, Medium, Hard)
  - 60-second timer per turn
  - Winning animations with confetti effects
  - Interactive game board with hover effects

- **👤 User Authentication**
  - Secure login and registration
  - Guest mode available
  - Password visibility toggle
  - Protected game routes

- **🎨 Modern UI/UX**
  - Animated backgrounds with particles and energy lines
  - Real-time game status updates
  - Cyberpunk-inspired theme

## 🚀 Live Demo

Experience the game: [Connect 4 Game](https://connect-4-game-by-kalash.vercel.app/)

## 💻 Built With

* [React.js](https://reactjs.org/)
* [Node.js](https://nodejs.org/)
* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)
* [Material-UI](https://mui.com/)
* [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

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

3. Install backend dependencies
   ```sh
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory and add:
   ```
   DB_URI=your_mongodb_connection_string
   PORT=5001
   ```

5. Start the backend server
   ```sh
   cd backend
   npm start
   ```

6. Start the frontend development server
   ```sh
   cd frontend
   npm start
   ```

## 🎯 Game Rules

1. Players take turns dropping colored discs into a 7x6 grid
2. First player to connect 4 discs in a row (horizontally, vertically, or diagonally) wins
3. Each turn has a 60-second time limit
4. Game ends in a draw if the board fills up with no winner

## 🤖 Bot Difficulty Levels

- **Easy**: Bot makes random moves
- **Medium**: Bot can block player's winning moves
- **Hard**: Bot strategically plans moves and blocks player's attempts

## 🔐 Security Features

- Encrypted passwords using bcrypt
- JWT authentication
- Protected API endpoints
- Secure user sessions

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

* [Material-UI](https://mui.com/)
* [React Icons](https://react-icons.github.io/react-icons/)
* [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)