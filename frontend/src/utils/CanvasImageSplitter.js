import React, { useRef, useEffect } from 'react';

const CanvasImageSplitter = ({ imageSrc, rows, cols, pieceSize, onPiecesReady }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }
    
        const context = canvas.getContext('2d');
        if (!context) {
            console.error('Failed to get canvas context');
            return;
        }
    
        const image = new Image();
        image.src = imageSrc;
    
        image.onload = () => {
            console.log('Image loaded successfully');
            canvas.width = cols * pieceSize;
            canvas.height = rows * pieceSize;
    
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
    
            // Generate piece images
            const pieces = [];
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * pieceSize;
                    const y = row * pieceSize;
                    const pieceCanvas = document.createElement('canvas');
                    pieceCanvas.width = pieceSize;
                    pieceCanvas.height = pieceSize;
                    const pieceContext = pieceCanvas.getContext('2d');
                    pieceContext.drawImage(canvas, x, y, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);
                    pieces.push(pieceCanvas.toDataURL());
                }
            }
    
            onPiecesReady(pieces);
        };
    
        image.onerror = () => {
            console.error('Failed to load image');
        };
    
        // Cleanup function
        return () => {
            // Clear canvas or other cleanups if necessary
        };
    }, [imageSrc, rows, cols, pieceSize]);
    

    return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default CanvasImageSplitter;