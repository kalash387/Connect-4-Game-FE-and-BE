import React, { useState, useEffect } from 'react';
import TopPanel from './TopPanel/TopPanel';
import BottomPanel from './BottomPanel/BottomPanel';
import { Grid, Box, Typography, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Close as CloseIcon } from '@mui/icons-material';
import './Game.css'; // Ensure the custom CSS is imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Cell = styled(Box)(({ theme, isHighlighted }) => ({
  width: 60,
  height: 60,
  margin: 5,
  borderRadius: '50%',
  backgroundColor: '#2c2c2c',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  '&.player1': {
    backgroundColor: '#ff6f6f',
    boxShadow: '0 4px 8px rgba(255, 111, 111, 0.7)',
  },
  '&.player2': {
    backgroundColor: '#ffd54f',
    boxShadow: '0 4px 8px rgba(255, 213, 79, 0.7)',
  },
}));

const BoardContainer = styled(Box)(({ gameOver }) => ({
  background: 'linear-gradient(145deg, #2e2e2e, #3c3c3c)', // Gradient background
  padding: 20,
  borderRadius: 10,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
  width: '70%',
  maxWidth: '800px',
  margin: 'auto',
  position: 'relative',
  top: '36%', // Conditional top value
  transform: 'translateY(-50%)',
}));

const DialogStyled = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogPaper': {
    backgroundColor: '#2e2e2e',
    color: 'white',
    borderRadius: '10px',
  },
}));

const RestartButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ff6f6f',
  color: 'white',
  '&:hover': {
    backgroundColor: '#ff3b3b',
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
}));

const Game = () => {
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(0)));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [timer, setTimer] = useState(60);
  const [intervalId, setIntervalId] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameOver) {
      const id = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(id);
            handleTimerExpiry(); // Handle timer expiry
            return 0;
          }
        });
      }, 1000);
      setIntervalId(id); // Store interval ID for clearing later

      return () => clearInterval(id); // Cleanup on unmount
    }
  }, [currentPlayer, gameOver, gameStarted]); // Re-run when current player changes or game ends

  // Function to handle when timer expires
  const handleTimerExpiry = () => {
    setGameOver(true);
    setDialogOpen(true)
  };

  // Function to reset the timer
  const resetTimer = () => {
    setTimer(60); // Reset to 60 seconds
  };

  const handleColumnClick = (colIndex) => {
    if (gameOver) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    resetTimer(); // Reset timer when a move is made

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
          setDialogOpen(true);
          setGameStarted(false);
        } else {
          setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
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
    const checkLine = (line) => {
      return line.join('').includes(player.toString().repeat(4));
    };

    for (let row = 0; row < 6; row++) {
      if (checkLine(board[row])) return true;
    }
    for (let col = 0; col < 7; col++) {
      if (checkLine(board.map(row => row[col]))) return true;
    }

    const diagonals = [];
    for (let r = 0; r < 6 - 3; r++) {
      for (let c = 0; c < 7 - 3; c++) {
        diagonals.push([
          board[r][c],
          board[r + 1][c + 1],
          board[r + 2][c + 2],
          board[r + 3][c + 3],
        ]);
        diagonals.push([
          board[r][c + 3],
          board[r + 1][c + 2],
          board[r + 2][c + 1],
          board[r + 3][c],
        ]);
      }
    }
    for (const diag of diagonals) {
      if (checkLine(diag)) return true;
    }

    return false;
  };

  useEffect(() => {
    if (currentPlayer === 2 && !gameOver) {
      setTimeout(botMove, 500);
    }
  }, [currentPlayer]);

  const handleRestart = () => {
    setBoard(Array(6).fill().map(() => Array(7).fill(0)));
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    setDialogOpen(false);
    setGameStarted(false);
    resetTimer(); // Reset timer on restart
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="game-container">
      <TopPanel
        score={0}
        profile="Player"
        onLogout={handleLogout}
        difficulty={difficulty}
        gameStarted={gameStarted}
        onSelectDifficulty={setDifficulty}
      />      <BoardContainer gameOver={gameOver}>
        <Typography variant="h3" color="white" gutterBottom align="center">
          Connect 4 Game
        </Typography>

        <Grid container direction="column" alignItems="center">
          {board.map((row, rowIndex) => (
            <Grid container item key={rowIndex} justifyContent="center">
              {row.map((cell, colIndex) => {
                const highlightedCell = getHighlightedCell(colIndex);
                const isHighlighted = highlightedCell && highlightedCell.row === rowIndex && highlightedCell.colIndex === colIndex;
                return (
                  <Cell
                    key={colIndex}
                    className={cell === 1 ? 'player1' : cell === 2 ? 'player2' : ''}
                    isHighlighted={isHighlighted}
                    onClick={() => currentPlayer === 1 && handleColumnClick(colIndex)}
                    onMouseEnter={() => setHoveredCol(colIndex)}
                    onMouseLeave={() => setHoveredCol(null)}
                  />
                );
              })}
            </Grid>
          ))}
        </Grid>

      </BoardContainer>
      <BottomPanel timer={timer} />

      <DialogStyled
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ backgroundColor: '#2e2e2e', color: 'white', borderBottom: '1px solid #444' }}
        >
          {winner === 1 ? '🎉 Congratulations Player! 🎉' : '😢 Bot Wins! 😢'}
          <CloseButton
            onClick={() => setDialogOpen(false)}
            sx={{ position: 'absolute', top: 10, right: 10 }}
          >
            <CloseIcon />
          </CloseButton>
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: '#2e2e2e', color: 'white' }}>
          <Typography variant="h6" align="center">
            {winner === 1 ? 'You have won the game!' : 'The bot has won. Better luck next time!'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <RestartButton variant="contained" onClick={handleRestart}>
              Restart Game
            </RestartButton>
          </Box>
        </DialogContent>
      </DialogStyled>
    </div>
  );
};

export default Game;
