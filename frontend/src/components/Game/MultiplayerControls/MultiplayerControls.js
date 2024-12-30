import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { database } from '../../../services/firebaseConfig';
import { ref, set, get } from 'firebase/database';
import { createGame, joinGame } from '../../../store/gameSlice';
import { Button, TextField, Box, Typography } from '@mui/material';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './MultiplayerControls.css';

const MultiplayerControls = ({ onGameStart, waitingForPlayer, setIsHost }) => {
    const [gameCode, setGameCode] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const dispatch = useDispatch();

    const handleCreateGame = async () => {
        try {
            const newGameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const gameRef = ref(database, `games/${newGameCode}`);
            const initialGameData = {
                board: Array(6).fill().map(() => Array(7).fill(0)),
                currentPlayer: 1,
                status: 'waiting',
                players: { player1: 'host' }
            };

            await set(gameRef, initialGameData);
            dispatch(createGame());
            dispatch(joinGame({ gameId: newGameCode }));
            setGameCode(newGameCode);
            setIsHost(true);
        } catch (error) {
            setError('Error creating game: ' + error.message);
        }
    };

    const handleJoinGame = async () => {
        try {
            const upperGameCode = gameCode.toUpperCase();
            const gameRef = ref(database, `games/${upperGameCode}`);
            const snapshot = await get(gameRef);

            if (!snapshot.exists()) {
                setError('Game not found');
                return;
            }

            const gameData = snapshot.val();
            if (gameData.players.player2) {
                setError('Game is full');
                return;
            }

            await set(gameRef, {
                ...gameData,
                status: 'active',
                players: { ...gameData.players, player2: 'guest' }
            });

            dispatch(joinGame({ gameId: upperGameCode }));
            setIsHost(false);
            onGameStart();
        } catch (error) {
            setError('Error joining game: ' + error.message);
        }
    };

    const copyGameCode = async (code) => {
        try {
            // Try the modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                // Fallback method for mobile browsers
                const textArea = document.createElement('textarea');
                textArea.value = code;
                textArea.style.position = 'fixed';  // Avoid scrolling to bottom
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                    alert('Copy failed. Please copy the code manually: ' + code);
                }
                
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Copy failed. Please copy the code manually: ' + code);
        }
    };

    return (
        <div className="multiplayer-controls">
            {waitingForPlayer ? (
                <div className="waiting-container">
                    <Typography variant="h5" className="waiting-text">
                        Waiting for opponent to join...
                    </Typography>
                    <div className="game-code-display">
                        <Typography variant="h6">Game Code:</Typography>
                        <div className="code-box">
                            <Typography variant="h4">{gameCode}</Typography>
                            <Button 
                                onClick={() => copyGameCode(gameCode)}
                                className="copy-button"
                                startIcon={<ContentCopyIcon />}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                        <Typography className="share-text">
                            Share this code with your opponent
                        </Typography>
                    </div>
                </div>
            ) : (
                <div className="controls-container">
                    <div className="create-game-section">
                        <Button 
                            variant="contained" 
                            onClick={handleCreateGame}
                            className="create-button"
                            startIcon={<VideogameAssetIcon />}
                        >
                            Create New Game
                        </Button>
                    </div>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div className="join-game-section">
                        <div className="join-input-group">
                            <TextField
                                value={gameCode}
                                onChange={(e) => setGameCode(e.target.value)}
                                placeholder="Enter game code"
                                className="game-code-input"
                            />
                            <Button 
                                variant="contained"
                                onClick={handleJoinGame}
                                disabled={!gameCode}
                                className="join-button"
                                startIcon={<GroupAddIcon />}
                            >
                                Join Game
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <Typography className="error-message">
                            {error}
                        </Typography>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiplayerControls; 