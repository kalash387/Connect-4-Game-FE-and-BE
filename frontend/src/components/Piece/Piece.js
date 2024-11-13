import React from 'react';

const Piece = ({ piece, onClick }) => {
    return (
        <div
            className="piece"
            onClick={onClick}
            style={{ 
                backgroundImage: `url(${piece})`,
                width: '100px',
                height: '100px',
                backgroundSize: 'cover'
            }}
        >
        </div>
    );
};

export default Piece;
