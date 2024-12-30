import React, { useState, useEffect } from 'react';
import TopPanel from './TopPanel/TopPanel';
import BottomPanel from './BottomPanel/BottomPanel';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import confetti from 'canvas-confetti'; // First, run: npm install canvas-confetti
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { database } from '../../services/firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import { createGame, joinGame, updateGameState } from '../../store/gameSlice';
import MultiplayerControls from './MultiplayerControls/MultiplayerControls';

import { Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material';
import './Game.css';
import Instructions from './Instructions/Instructions';
import { getGameAnalytics } from '../../services/analyticsService';
import AnalyticsDialog from './AnalyticsDialog/AnalyticsDialog';

const Game = () => {
	const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(0)));
	const [currentPlayer, setCurrentPlayer] = useState(1);
	const [hoveredCol, setHoveredCol] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [difficulty, setDifficulty] = useState('easy');
	const [gameStarted, setGameStarted] = useState(false);
	const [showInstructions, setShowInstructions] = useState(false);
	const [winningCells, setWinningCells] = useState([]);
	const [isShowingWinner, setIsShowingWinner] = useState(false);
	const [playerScore, setPlayerScore] = useState(0);
	const [botScore, setBotScore] = useState(0);
	const [moveCount, setMoveCount] = useState(0);
	const [timer, setTimer] = useState(60);
	const navigate = useNavigate();
	const [analytics, setAnalytics] = useState(null);
	const [showAnalytics, setShowAnalytics] = useState(false);
	const [gameStartTime, setGameStartTime] = useState(null);
	const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
	const dispatch = useDispatch();
	const { gameId, isMultiplayer } = useSelector(state => state.game);
	const [waitingForPlayer, setWaitingForPlayer] = useState(false);
	const [isHost, setIsHost] = useState(false);
	const [gameMode, setGameMode] = useState(null); // 'single' or 'multiplayer'

	// 1. ALL useEffect hooks must be here at the top
	useEffect(() => {
		if (!isMultiplayer && currentPlayer === 2 && !gameOver) {
			setTimeout(botMove, 500);
		}
	}, [currentPlayer, isMultiplayer]);

	useEffect(() => {
		console.log('Game ID changed:', gameId);
		if (gameId) {
			const gameRef = ref(database, `games/${gameId}`);
			console.log('Setting up Firebase listener, isHost:', isHost);
			
			const unsubscribe = onValue(gameRef, (snapshot) => {
				if (snapshot.exists()) {
					const gameData = snapshot.val();
					console.log('Firebase update received:', gameData);

					setBoard(gameData.board);
					setCurrentPlayer(gameData.currentPlayer);
					
					if (gameData.status === 'finished' && gameData.winner) {
						console.log('Game finished, winner:', gameData.winner, 'isHost:', isHost);
						setGameOver(true);
						setWinner(gameData.winner);
						setTimeout(() => {
							setDialogOpen(true);
						}, 1000);
						
						const playerWon = (isHost && gameData.winner === 1) || (!isHost && gameData.winner === 2);
						if (playerWon) {
							triggerWinAnimation();
						}
					}
					
					if (gameData.status === 'active' && gameData.players.player2) {
						setGameStarted(true);
						setWaitingForPlayer(false);
					} else if (gameData.status === 'waiting') {
						setWaitingForPlayer(true);
					}
				}
			});

			return () => unsubscribe();
		}
	}, [gameId, isHost]);

	useEffect(() => {
		// Create hexagons
		const hexContainer = document.createElement('div');
		hexContainer.className = 'hex-container';
		const container = document.querySelector('.game-container');
		if (container) {
			container.appendChild(hexContainer);

			for (let i = 0; i < 20; i++) {
				const hex = document.createElement('div');
				hex.className = 'hexagon';
				hex.style.left = `${Math.random() * 100}%`;
				hex.style.animationDelay = `${Math.random() * 20}s`;
				hexContainer.appendChild(hex);
			}

			// Create energy lines
			const createEnergyLine = () => {
				const line = document.createElement('div');
				line.className = 'energy-line';
				line.style.top = `${Math.random() * 100}%`;
				line.style.animation = 'energyLine 3s linear';
				container.appendChild(line);

				// Remove the line after animation
				setTimeout(() => line.remove(), 3000);
			};

			// Create cyber grid
			const grid = document.createElement('div');
			grid.className = 'cyber-grid';
			container.appendChild(grid);

			// Periodically create energy lines
			const lineInterval = setInterval(createEnergyLine, 2000);

			return () => {
				clearInterval(lineInterval);
				if (hexContainer.parentNode) {
					hexContainer.remove();
				}
				if (grid.parentNode) {
					grid.remove();
				}
			};
		}
	}, []);

	useEffect(() => {
		// Create floating particles
		const container = document.querySelector('.game-container');
		const particleCount = 50;

		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle';
			particle.style.left = `${Math.random() * 100}%`;
			particle.style.top = `${Math.random() * 100}%`;
			particle.style.opacity = Math.random() * 0.5;
			particle.style.animationDelay = `${Math.random() * 15}s`;
			container.appendChild(particle);
		}

		return () => {
			const particles = document.querySelectorAll('.particle');
			particles.forEach(particle => particle.remove());
		};
	}, []);

	useEffect(() => {
		if (gameStarted && !gameStartTime) {
			setGameStartTime(Date.now());
		}
	}, [gameStarted, gameStartTime]);

	useEffect(() => {
		// Only auto-start for multiplayer mode
		if (gameMode === 'multiplayer' && isHost) {
			setWaitingForPlayer(true);
		}
	}, [gameMode, isHost]);

	// Function to handle when timer expires
	const handleTimerExpiry = async () => {
		setGameOver(true);
		await handleGameEnd(null); // null for timeout
		setDialogOpen(true);
	};

	const triggerWinAnimation = () => {
		// Fire confetti from both sides
		const duration = 2500;
		const animationEnd = Date.now() + duration;
		const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

		function randomInRange(min, max) {
			return Math.random() * (max - min) + min;
		}

		const interval = setInterval(function () {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);

			// Left side confetti
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
			});

			// Right side confetti
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
			});
		}, 250);
	};

	const checkDraw = (board) => {
		// Check if all cells are filled (no zeros)
		return board.every(row => row.every(cell => cell !== 0));
	};

	const handleColumnClick = async (colIndex) => {
		if (gameOver) return;

		// For single player mode, start game on first move
		if (gameMode === 'single' && !gameStarted) {
			setGameStarted(true);
			setGameStartTime(Date.now());
		}

		if (gameMode === 'multiplayer') {
			const isPlayer1 = currentPlayer === 1;
			if ((isPlayer1 && !isHost) || (!isPlayer1 && isHost)) {
				return; // Not your turn
			}
		}

		const updatedBoard = board.map(row => [...row]);
		let rowIndex = 5;
		while (rowIndex >= 0 && updatedBoard[rowIndex][colIndex] !== 0) {
			rowIndex--;
		}

		if (rowIndex < 0) return;

		updatedBoard[rowIndex][colIndex] = currentPlayer;
		setBoard(updatedBoard);

		const hasWon = checkWin(updatedBoard, currentPlayer);
		
		if (gameMode === 'single') {
			if (hasWon) {
				setGameOver(true);
				setWinner(currentPlayer);
				// Add delay before showing dialog
				triggerWinAnimation();
				setTimeout(() => {
					setDialogOpen(true);
				}, 1000); // 1.5 second delay
				return;
			}

			// Check for draw
			const isDraw = checkDraw(updatedBoard);
			if (isDraw) {
				setGameOver(true);
				setDialogOpen(true);
				return;
			}

			// If game hasn't ended, make bot move
			setCurrentPlayer(2);
			// setTimeout(() => {
			// 	botMove();
			// }, 500);
		} else if (gameMode === 'multiplayer') {
			const nextPlayer = currentPlayer === 1 ? 2 : 1;
			setCurrentPlayer(nextPlayer);
			
			// Only update Firebase if in multiplayer mode
			if (gameId) {
				await set(ref(database, `games/${gameId}`), {
					board: updatedBoard,
					currentPlayer: nextPlayer,
					status: hasWon ? 'finished' : 'active',
					winner: hasWon ? currentPlayer : null,
					players: {
						player1: 'host',
						player2: 'guest'
					}
				});
			}
		}

		setMoveCount(prev => prev + 1);
	};

	const getHighlightedCell = (colIndex) => {
		for (let row = 5; row >= 0; row--) {
			if (board[row][colIndex] === 0) {
				return { row, colIndex };
			}
		}
		return null;
	};

	const botMove = () => {
		if (gameOver) return;

		const emptyCols = board[0].map((col, colIndex) => col === 0 ? colIndex : -1).filter(colIndex => colIndex !== -1);
		let selectedCol;

		if (difficulty === 'easy') {
			// Easy: Bot plays random moves
			selectedCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
		} else if (difficulty === 'medium') {
			// Medium: Bot tries to block player's winning move but doesn't focus on winning
			const opponentWinMove = findWinningMove(1);
			selectedCol = opponentWinMove !== null ? opponentWinMove : emptyCols[Math.floor(Math.random() * emptyCols.length)];
		} else if (difficulty === 'hard') {
			// Hard: Bot checks for its own win first, then tries to block the opponent
			const botWinningMove = findWinningMove(2);
			const opponentWinMove = findWinningMove(1);
			selectedCol = botWinningMove !== null ? botWinningMove : 
						 opponentWinMove !== null ? opponentWinMove : 
						 emptyCols[Math.floor(Math.random() * emptyCols.length)];
		}

		if (selectedCol !== undefined) {
			const updatedBoard = board.map(row => [...row]);
			let rowIndex = 5;
			while (rowIndex >= 0 && updatedBoard[rowIndex][selectedCol] !== 0) {
				rowIndex--;
			}

			if (rowIndex >= 0) {
				const newBoard = updatedBoard.map(row => [...row]);
				newBoard[rowIndex][selectedCol] = 2;
				setBoard(newBoard);

				const hasWon = checkWin(newBoard, 2);
				if (hasWon) {
					setGameOver(true);
					setWinner(2);
					// Add delay before showing dialog for bot wins too
					setTimeout(() => {
						setDialogOpen(true);
					}, 1000); // 1.5 second delay
					return;
				}

				// Check for draw
				const isDraw = checkDraw(newBoard);
				if (isDraw) {
					setGameOver(true);
					setDialogOpen(true);
					return;
				}

				setCurrentPlayer(1);
			}
		}
	};

	const findWinningMove = (player) => {
		for (let colIndex = 0; colIndex < 7; colIndex++) {
			const rowIndex = getFirstEmptyRow(colIndex);
			if (rowIndex !== -1) {
				const tempBoard = board.map(row => row.slice());
				tempBoard[rowIndex][colIndex] = player;
				if (checkWin(tempBoard, player)) {
					return colIndex;
				}
			}
		}
		return null;
	};

	const getFirstEmptyRow = (colIndex) => {
		for (let row = 5; row >= 0; row--) {
			if (board[row][colIndex] === 0) {
				return row;
			}
		}
		return -1;
	};

	const checkWin = (board, player) => {
		// Check horizontal
		for (let row = 0; row < 6; row++) {
			for (let col = 0; col < 4; col++) {
				if (board[row][col] === player &&
					board[row][col + 1] === player &&
					board[row][col + 2] === player &&
					board[row][col + 3] === player) {
					setWinningCells([
						[row, col],
						[row, col + 1],
						[row, col + 2],
						[row, col + 3]
					]);
					return true;
				}
			}
		}

		// Check vertical
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 7; col++) {
				if (board[row][col] === player &&
					board[row + 1][col] === player &&
					board[row + 2][col] === player &&
					board[row + 3][col] === player) {
					setWinningCells([
						[row, col],
						[row + 1, col],
						[row + 2, col],
						[row + 3, col]
					]);
					return true;
				}
			}
		}

		// Check diagonal (down-right)
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 4; col++) {
				if (board[row][col] === player &&
					board[row + 1][col + 1] === player &&
					board[row + 2][col + 2] === player &&
					board[row + 3][col + 3] === player) {
					setWinningCells([
						[row, col],
						[row + 1, col + 1],
						[row + 2, col + 2],
						[row + 3, col + 3]
					]);
					return true;
				}
			}
		}

		// Check diagonal (down-left)
		for (let row = 0; row < 3; row++) {
			for (let col = 3; col < 7; col++) {
				if (board[row][col] === player &&
					board[row + 1][col - 1] === player &&
					board[row + 2][col - 2] === player &&
					board[row + 3][col - 3] === player) {
					setWinningCells([
						[row, col],
						[row + 1, col - 1],
						[row + 2, col - 2],
						[row + 3, col - 3]
					]);
					return true;
				}
			}
		}

		return false;
	};

	const handleRestart = async () => {
		if (gameOver) {
			await saveGameData();
		}
		
		// Reset all game states
		setBoard(Array(6).fill().map(() => Array(7).fill(0)));
		setCurrentPlayer(1);
		setGameOver(false);
		setWinner(null);
		setDialogOpen(false);
		setIsShowingWinner(false);
		setWinningCells([]);
		setMoveCount(0);
		setTimer(60);
		setGameStartTime(null);
		setGameStarted(false); // Reset gameStarted to false for both modes
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/');
	}

	const saveGameData = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				console.log('No token found');
				return;
			}

			// Determine game status based on gameOver and winner
			let gameStatus;
			if (gameOver) {
				if (winner === 1) {
					gameStatus = 'won';
				} else if (winner === 2) {
					gameStatus = 'lost';
				} else {
					gameStatus = 'draw';
				}
			} else {
				gameStatus = 'in_progress';
			}

			// console.log('Game Status:', { gameOver, winner, gameStatus }); // Debug log

			// const gameData = {
			// 	gameStatus: gameStatus,
			// 	score: playerScore,
			// 	difficulty: difficulty,
			// 	moves: moveCount,
			// 	duration: 60 - timer,
			// 	playedAt: new Date().toISOString()
			// };

			// const API_URL = 'https://connect-4-backend-3uji.onrender.com/api/auth';

			// await axios.post(
			// 	`${API_URL}/update-game`, 
			// 	gameData,
			// 	{
			// 		headers: { 
			// 			'Authorization': `Bearer ${token}`,
			// 			'Content-Type': 'application/json'
			// 		}
			// 	}
			// );
		} catch (error) {
			console.error('Error saving game data:', error.response?.data || error.message);
		}
	};

	const handleGameEnd = async (winner) => {
		const duration = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
		
		const gameData = {
			winner: winner === 1 ? 'player' : 'computer',
			moves: moveCount,
			duration: duration,
			difficulty: difficulty
		};

		try {
			const analyticsData = await getGameAnalytics(gameData);
			setAnalytics(analyticsData);
		} catch (error) {
			console.error('Error getting game analytics:', error);
		}
	};

	// Add console logs to track state changes
	useEffect(() => {
		console.log('Game state updated:', {
			gameMode,
			gameStarted,
			waitingForPlayer,
			isHost
		});
	}, [gameMode, gameStarted, waitingForPlayer, isHost]);

	// Add this function to handle analytics button click
	const handleAnalyticsClick = async () => {
		try {
			const duration = gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0;
			
			const gameData = {
				winner: gameMode === 'multiplayer' ? 
						((isHost && winner === 1) || (!isHost && winner === 2)) ? 'player' : 'computer' 
						: winner === 1 ? 'player' : 'computer',
				moves: moveCount,
				duration: duration,
				difficulty: difficulty,
				gameMode: gameMode // Add gameMode to analytics
			};

			console.log('Sending analytics data:', gameData);
			const analyticsData = await getGameAnalytics(gameData);
			console.log('Received analytics data:', analyticsData);
			
			setAnalytics(analyticsData);
			setShowAnalyticsDialog(true);
		} catch (error) {
			console.error('Error getting game analytics:', error);
		}
	};

	// Add this function to handle difficulty changes
	const handleDifficultyChange = (newDifficulty) => {
		if (gameStarted && !gameOver) {
			// Don't allow difficulty change during active game
			return;
		}
		setDifficulty(newDifficulty);
		// Reset the game when difficulty changes
		if (gameStarted) {
			handleRestart();
		}
	};

	return (
		<div className="game-container">
			{!gameMode ? (
				<div className="mode-selection-container">
					{/* Background Elements */}
					<div className="animated-background">
						<div className="cyber-grid"></div>
						<div className="floating-tokens"></div>
						<div className="particle-effect"></div>
					</div>

					{/* Main Content */}
					<div className="mode-selection-content">
						{/* Title Section */}
						<div className="game-branding">
							<h1 className="game-title">Connect <span className="highlight">4</span></h1>
							<p className="game-subtitle">Choose Your Battle Mode</p>
						</div>

						{/* Mode Cards Container */}
						<div className="mode-cards">
							{/* Single Player Card */}
							<div className="mode-card single-player"
								onClick={() => setGameMode('single')}
							>
								<div className="card-content">
									<div className="mode-icon">🎮</div>
									<h2>Single Player</h2>
									<p>Challenge our AI in different difficulty levels</p>
									<ul className="feature-list">
										<li>🤖 Adaptive AI</li>
										<li>⚡ Quick Matches</li>
										<li>🎯 Multiple Difficulties</li>
									</ul>
									<Button 
										variant="contained"
										className="mode-button"
									>
										Play Solo
									</Button>
								</div>
							</div>

							{/* Multiplayer Card */}
							<div className="mode-card multiplayer"
								onClick={() => {
									setGameMode('multiplayer');
									dispatch(createGame());
								}}
							>
								<div className="card-content">
									<div className="mode-icon">👥</div>
									<h2>Multiplayer</h2>
									<p>Challenge friends in real-time matches</p>
									<ul className="feature-list">
										<li>🌐 Real-time Battles</li>
										<li>👊 Challenge Friends</li>
										<li>🎲 Room Code System</li>
									</ul>
									<Button 
										variant="contained"
										className="mode-button"
									>
										Play Online
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<>
					{gameMode === 'multiplayer' && !gameStarted ? (
						<MultiplayerControls 
							onGameStart={() => setGameStarted(true)}
							waitingForPlayer={waitingForPlayer}
							setIsHost={setIsHost}
						/>
					) : (
						<>
							<TopPanel
								profile={gameMode === 'multiplayer' ? `Player ${isHost ? '1' : '2'}` : "Player"}
								onLogout={handleLogout}
								difficulty={difficulty}
								gameStarted={gameStarted}
								onSelectDifficulty={handleDifficultyChange}
								onShowInstructions={() => setShowInstructions(true)}
								playerScore={playerScore}
								botScore={botScore}
							/>

							<div className="game-content">
								<div className="board-container">
									<div variant="h1" className="game-title">
										Connect <span className="title-highlight">4</span>
									</div>

									<div className="game-board">
										{board.map((row, rowIndex) => (
											<React.Fragment key={rowIndex}>
												{row.map((cell, colIndex) => {
													const isWinningCell = winningCells.some(
														([row, col]) => row === rowIndex && col === colIndex
													);
													return (
														<div
															key={`${rowIndex}-${colIndex}`}
															className={`cell 
																${cell === 1 ? 'player1' : cell === 2 ? 'player2' : ''} 
																${isWinningCell ? 'winning-cell' : ''}
																${isShowingWinner && !isWinningCell ? 'non-winning-cell' : ''}`}
															onClick={() => handleColumnClick(colIndex)}
															onMouseEnter={() => setHoveredCol(colIndex)}
															onMouseLeave={() => setHoveredCol(null)}
														/>
													);
												})}
											</React.Fragment>
										))}
									</div>

									{isMultiplayer && (
										<div className="turn-indicator">
											{((currentPlayer === 1 && isHost) || (currentPlayer === 2 && !isHost)) ? 
												"Your Turn" : "Opponent's Turn"}
										</div>
									)}
								</div>
							</div>

							<BottomPanel
								onTimerExpiry={handleTimerExpiry}
								gameOver={gameOver}
								gameStarted={gameStarted}
								currentPlayer={currentPlayer}
							/>

							<Dialog
								open={dialogOpen}
								onClose={() => setDialogOpen(false)}
								PaperProps={{
									style: {
										background: 'linear-gradient(135deg, #1E1E30, #2A2A4E)',
										border: '2px solid rgba(74, 158, 255, 0.3)',
										borderRadius: '20px',
										color: 'white',
										padding: '20px',
										fontFamily: "'Audiowide', 'Orbitron', 'Rajdhani', 'Play', sans-serif"
									}
								}}
							>
								<DialogTitle
									sx={{
										textAlign: 'center',
										fontSize: '2rem',
										background: 'linear-gradient(135deg, #4a9eff, #6b5eff)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										fontFamily: 'inherit'
									}}
								>
									{winner ? (
										<><span className="emoji">🎮</span> Game Over! <span className="emoji">🎮</span></>
									) : (
										<><span className="emoji">⏰</span> Time's Up! <span className="emoji">⏰</span></>
									)}
								</DialogTitle>
								<DialogContent sx={{ textAlign: 'center', py: 3 }}>
									<Typography
										variant="h6"
										sx={{ fontFamily: 'inherit', marginBottom: 2 }}
									>
										{gameMode === 'multiplayer' ? (
											winner ? (
												((isHost && winner === 1) || (!isHost && winner === 2)) ?
													'🎉 Congratulations! You Won! 🏆' :
													'😔 You Lost! Better luck next time! 🎯'
											) : '⌛ Time\'s up! It\'s a draw! 🤝'
										) : (
											winner ? (
												winner === 1 ?
													'🎉 Congratulations! You Won! 🏆' :
													'🤖 Computer Wins! Better luck next time! 🎯'
											) : '⌛ Time\'s up! It\'s a draw! 🤝'
										)}
									</Typography>
									
									<Button
										variant="contained"
										onClick={handleAnalyticsClick}
										sx={{
											mt: 2,
											mb: 2,
											background: 'linear-gradient(135deg, #4a9eff, #2a7fff)',
											color: 'white',
											padding: '12px 30px',
											borderRadius: '8px',
											fontWeight: 'bold',
											textTransform: 'uppercase',
											letterSpacing: '1px',
											fontFamily: "'Orbitron', sans-serif",
											transition: 'all 0.3s ease',
											border: '1px solid rgba(74, 158, 255, 0.3)',
											boxShadow: '0 4px 15px rgba(74, 158, 255, 0.2)',
											'&:hover': {
												background: 'linear-gradient(135deg, #2a7fff, #4a9eff)',
												transform: 'translateY(-2px)',
												boxShadow: '0 6px 20px rgba(74, 158, 255, 0.3)',
											}
										}}
									>
										<span style={{ marginRight: '8px' }}>📊</span> View Game Analytics
									</Button>
								</DialogContent>
								<DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
									<Button
											variant="contained"
											onClick={handleRestart}
											className="restart-button"
											sx={{ fontFamily: 'inherit' }}
									>
											🎮 Play Again
									</Button>
									<Button
											variant="contained"
											onClick={handleLogout}
											className="exit-button"
											sx={{ fontFamily: 'inherit' }}
									>
											🚪 Exit Game
									</Button>
								</DialogActions>
							</Dialog>

							{showAnalytics && (
								<AnalyticsDialog 
									analytics={analytics}
									onClose={() => setShowAnalytics(false)}
								/>
							)}

							{showInstructions && (
								<Instructions onClose={() => setShowInstructions(false)} />
							)}

							<Dialog
								open={showAnalyticsDialog}
								onClose={() => setShowAnalyticsDialog(false)}
								maxWidth="md"
								PaperProps={{
									style: {
										background: 'linear-gradient(135deg, #1E1E30, #2A2A4E)',
										border: '2px solid rgba(74, 158, 255, 0.3)',
										borderRadius: '20px',
										color: 'white',
										padding: '20px',
										minWidth: '500px',
										fontFamily: "'Audiowide', 'Orbitron', 'Rajdhani', 'Play', sans-serif"
									}
								}}
							>
								<DialogTitle
									sx={{
										textAlign: 'center',
										fontSize: '2rem',
										background: 'linear-gradient(135deg, #4a9eff, #6b5eff)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										fontFamily: 'inherit'
									}}
								>
									Game Analytics
								</DialogTitle>
								<DialogContent sx={{ textAlign: 'center', py: 3 }}>
									{analytics && (
										<>
											<div className="performance-section" style={{
												marginBottom: '20px',
												padding: '15px',
												background: 'rgba(255, 255, 255, 0.05)',
												borderRadius: '10px'
											}}>
												<Typography variant="h6" sx={{ color: '#4a9eff', marginBottom: '10px' }}>
													Performance
												</Typography>
												<Typography sx={{ color: '#fff' }}>
													{analytics.performance}
												</Typography>
											</div>

											<div className="strengths-section" style={{ marginBottom: '20px' }}>
												<Typography variant="h6" sx={{ color: '#4a9eff', marginBottom: '10px' }}>
													Your Strengths
												</Typography>
												<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
													{analytics.strengths.map((strength, index) => (
														<Chip
															key={index}
															label={strength}
															sx={{
																background: 'rgba(74, 158, 255, 0.2)',
																color: '#fff',
																border: '1px solid rgba(74, 158, 255, 0.3)'
															}}
														/>
													))}
												</div>
											</div>

											<div className="recommendation-section" style={{
												padding: '15px',
												background: 'rgba(255, 255, 255, 0.05)',
												borderRadius: '10px'
											}}>
												<Typography variant="h6" sx={{ color: '#4a9eff', marginBottom: '10px' }}>
													Recommendations
												</Typography>
												<Typography sx={{ color: '#fff', marginBottom: '10px' }}>
													{analytics.recommendation}
												</Typography>
												<Typography variant="h6" sx={{ color: '#4a9eff', marginBottom: '10px', marginTop: '20px' }}>
													Next Steps
												</Typography>
												<Typography sx={{ color: '#fff' }}>
													{analytics.nextSteps}
												</Typography>
											</div>
										</>
									)}
								</DialogContent>
								<DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
									<Button
										onClick={() => setShowAnalyticsDialog(false)}
										variant="contained"
										sx={{
											background: 'linear-gradient(135deg, #4a9eff, #2a7fff)',
											fontFamily: 'inherit',
											'&:hover': {
												background: 'linear-gradient(135deg, #2a7fff, #4a9eff)',
											}
										}}
									>
										Close Analytics
									</Button>
								</DialogActions>
							</Dialog>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Game;