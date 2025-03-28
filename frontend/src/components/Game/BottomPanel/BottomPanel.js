import React, { useState, useEffect } from 'react';
import './BottomPanel.css';
import { FaReact } from 'react-icons/fa';

const BottomPanel = ({ onTimerExpiry, gameOver, gameStarted, currentPlayer }) => {
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            setTimer(60);
        }
    }, [currentPlayer, gameStarted, gameOver]);

    useEffect(() => {
        if (gameStarted && !gameOver) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer > 1) return prevTimer - 1;

                    clearInterval(intervalId);
                    onTimerExpiry();
                    setTimer(60);
                    return 0;
                });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [gameStarted, gameOver, onTimerExpiry]);

    const isLowTime = timer <= 10;

    return (
        <div className="bottom-panel">
            <div className={`timer-container ${isLowTime ? 'low-time' : ''}`}>
                <div className="timer-value">{timer}</div>
                <div className="timer-label">SECONDS</div>
            </div>
            <div className="footer-mention">
                <span className="made-by">
                    <span className="creator-name">
                        Powered by React <FaReact className="react-icon" />, perfected by <a 
                            href="https://kalashdevfolio.netlify.app/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title="Visit Kalash's Portfolio"
                        >
                            Kalash
                        </a> <span className="emoji">✨</span>
                    </span>
                </span>
            </div>
        </div>
    );
};

export default BottomPanel;