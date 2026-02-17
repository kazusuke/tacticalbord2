import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import styles from './PlayerToken.module.css';

export function PlayerToken({ player, id, style = {}, className = '', showName = true }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { player }
    });

    const draggingStyle = {
        transform: CSS.Translate.toString(transform),
        ...style,
    };

    return (
        <div
            ref={setNodeRef}
            style={draggingStyle}
            {...listeners}
            {...attributes}
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
    showName: PropTypes.bool
};
