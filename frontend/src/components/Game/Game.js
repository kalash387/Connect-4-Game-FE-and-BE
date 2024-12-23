import React, { useState, useEffect } from 'react';
import TopPanel from './TopPanel/TopPanel';
import BottomPanel from './BottomPanel/BottomPanel';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import confetti from 'canvas-confetti'; // First, run: npm install canvas-confetti
import axios from 'axios';

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

		// Start game on first valid move
		if (!gameStarted) {
			setGameStarted(true);
		}

		// Process the move
		for (let row = 5; row >= 0; row--) {
			if (board[row][colIndex] === 0) {
				const newBoard = board.map((rowArr, rowIndex) =>
					rowArr.map((cell, cellIndex) => {
						if (rowIndex === row && cellIndex === colIndex) {
							return currentPlayer;
						}
						return cell;
					})
				);
				setBoard(newBoard);

				if (checkWin(newBoard, currentPlayer)) {
					setGameOver(true);
					setWinner(currentPlayer);
					setIsShowingWinner(true);

					if (currentPlayer === 1) {
						setPlayerScore(prev => prev + 1);
					} else {
						setBotScore(prev => prev + 1);
					}

					await handleGameEnd(currentPlayer);

					triggerWinAnimation();

					setTimeout(() => {
						setIsShowingWinner(false);
						setDialogOpen(true);
					}, 2500);

				} else if (checkDraw(newBoard)) {
					setGameOver(true);
					setWinner(null);
					await handleGameEnd(null);
					setDialogOpen(true);
				} else {
					setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
				}
				
				setMoveCount(prev => prev + 1);
				break;
			}
		}
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

		if (difficulty === 'easy') {
			// Easy: Bot plays random moves
			const randomCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
			handleColumnClick(randomCol);
		}
		else if (difficulty === 'medium') {
			// Medium: Bot tries to block player’s winning move but doesn't focus on winning
			const opponentWinMove = findWinningMove(1);
			if (opponentWinMove !== null) {
				handleColumnClick(opponentWinMove);
			} else {
				const randomCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
				handleColumnClick(randomCol);
			}
		}
		else if (difficulty === 'hard') {
			// Hard: Bot checks for its own win first, then tries to block the opponent, otherwise random
			const botWinningMove = findWinningMove(2);
			if (botWinningMove !== null) {
				handleColumnClick(botWinningMove);
			} else {
				const opponentWinMove = findWinningMove(1);
				if (opponentWinMove !== null) {
					handleColumnClick(opponentWinMove);
				} else {
					const randomCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
					handleColumnClick(randomCol);
				}
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

	useEffect(() => {
		if (currentPlayer === 2 && !gameOver) {
			setTimeout(botMove, 500);
		}
	}, [currentPlayer]);

	const handleRestart = async () => {
		if (gameOver) {
			await saveGameData();
		}
		setBoard(Array(6).fill().map(() => Array(7).fill(0)));
		setCurrentPlayer(1);
		setGameOver(false);
		setWinner(null);
		setDialogOpen(false);
		setIsShowingWinner(false);
		setWinningCells([]);
		setMoveCount(0);
		setGameStarted(false);
		setTimer(60);
		setGameStartTime(null);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/');
	}

	useEffect(() => {
		// Create hexagons
		const hexContainer = document.createElement('div');
		hexContainer.className = 'hex-container';
		const container = document.querySelector('.game-container');
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
			hexContainer.remove();
			grid.remove();
		};
	}, []);

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

	useEffect(() => {
		if (gameStarted && !gameStartTime) {
			setGameStartTime(Date.now());
		}
	}, [gameStarted]);

	return (
		<div className="game-container">
			<TopPanel
				profile="Player"
				onLogout={handleLogout}
				difficulty={difficulty}
					gameStarted={gameStarted}
					onSelectDifficulty={setDifficulty}
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
											onClick={() => currentPlayer === 1 && handleColumnClick(colIndex)}
											onMouseEnter={() => setHoveredCol(colIndex)}
											onMouseLeave={() => setHoveredCol(null)}
										/>
									);
								})}
							</React.Fragment>
						))}
					</div>

					<div className="game-status">
						<div className="status-container">
							<div className="status-label">CURRENT TURN</div>
							<div className={`player-indicator ${currentPlayer === 1 ? 'player1' : 'player2'}`}>
								<div className="player-avatar">
									{currentPlayer === 1 ? '👤' : '🤖'}
								</div>
								<div className="player-name">
									{currentPlayer === 1 ? 'YOUR TURN' : 'COMPUTER THINKING...'}
								</div>
							</div>
						</div>
					</div>
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
						{winner ? (
							winner === 1 ?
								'🎉 Congratulations! You Won! 🏆' :
								'🤖 Computer Wins! Better luck next time! 🎯'
						) : (
							'⌛ Time\'s up! It\'s a draw! 🤝'
						)}
					</Typography>
					
					<Button
						variant="contained"
						onClick={() => setShowAnalyticsDialog(true)}
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
		</div>
	);
};

export default Game;