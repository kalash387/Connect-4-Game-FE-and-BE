import React from 'react';
import './Instructions.css';

const Instructions = ({ onClose }) => {
    return (
        <div className="instructions-overlay" onClick={onClose}>
            <div className="instructions-modal" onClick={e => e.stopPropagation()}>
                <div className="instructions-content">
                    <h2 className="instructions-title">How to Play Connect 4</h2>
                    
                    <div className="instruction-step">
                        <div className="step-number">01</div>
                        <p>The game is played on a grid that's 7 columns by 6 rows.</p>
                    </div>

                    <div className="instruction-step">
                        <div className="step-number">02</div>
                        <p>Players take turns dropping their colored discs from the top into any column.</p>
                    </div>

                    <div className="instruction-step">
                        <div className="step-number">03</div>
                        <p>The first player to connect 4 discs in a row (vertically, horizontally, or diagonally) wins!</p>
                    </div>

                    <div className="instruction-step">
                        <div className="step-number">04</div>
                        <p>If all spaces are filled with no winner, the game is a draw.</p>
                    </div>

                    <button className="close-button" onClick={onClose}>
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Instructions;
