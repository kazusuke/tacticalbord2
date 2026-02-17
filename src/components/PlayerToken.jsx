import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import styles from './PlayerToken.module.css';

export function PlayerToken({ player, id, style = {}, className = '', showName = true, onClick }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { player }
    });

    const draggingStyle = {
        transform: CSS.Translate.toString(transform),
        ...style,
    };

    // Manual click detection to work reliably with dnd-kit
    const [startPos, setStartPos] = React.useState(null);

    const handlePointerDown = (e) => {
        setStartPos({ x: e.clientX, y: e.clientY });
        // Call dnd-kit listener
        listeners.onPointerDown(e);
    };

    const handlePointerUp = (e) => {
        if (startPos && onClick) {
            const dist = Math.sqrt(
                Math.pow(e.clientX - startPos.x, 2) + Math.pow(e.clientY - startPos.y, 2)
            );
            if (dist < 5) {
                // It's a click
                onClick();
            }
        }
        setStartPos(null);
        // Note: dnd-kit might handle pointer up globally, but we hook here for click
    };

    return (
        <div
            ref={setNodeRef}
            style={draggingStyle}
            {...attributes}
            // Spread listeners but override pointer handlers if needed, 
            // actually we need to composite them.
            // dnd-kit listeners: onPointerDown, onKeyDown
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onKeyDown={listeners.onKeyDown}
            className={`${styles.token} ${isDragging ? styles.isDragging : ''} ${className}`}
            title={player.name}
        >
            <div className={styles.circle}>
                {player.number}
            </div>
            {showName && (
                <span className={styles.label}>
                    {player.name}
                </span>
            )}
        </div>
    );
}

PlayerToken.propTypes = {
    player: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    showName: PropTypes.bool,
    onClick: PropTypes.func
};
