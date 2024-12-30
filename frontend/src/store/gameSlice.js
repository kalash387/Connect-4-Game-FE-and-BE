import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    gameId: null,
    isMultiplayer: false,
    players: {
        player1: null,
        player2: null
    },
    board: Array(6).fill().map(() => Array(7).fill(0)),
    currentPlayer: 1,
    gameStatus: 'waiting', // waiting, active, finished
    isPlayerTurn: false
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        createGame: (state) => {
            state.isMultiplayer = true;
            state.gameStatus = 'active';
        },
        joinGame: (state, action) => {
            state.gameId = action.payload.gameId;
            state.isMultiplayer = true;
            state.gameStatus = 'active';
        },
        updateGameState: (state, action) => {
            const { board, currentPlayer, gameStatus } = action.payload;
            state.board = board;
            state.currentPlayer = currentPlayer;
            state.gameStatus = gameStatus;
        },
        resetGame: () => initialState
    }
});

export const { createGame, joinGame, updateGameState, resetGame } = gameSlice.actions;
export default gameSlice.reducer; 