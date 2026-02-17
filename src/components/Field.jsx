import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { PlayerToken } from './PlayerToken';
import styles from './Field.module.css';

export function Field({ players, activeId }) {
    const { setNodeRef } = useDroppable({
        id: 'field',
    });

    return (
        <div className={styles.container}>
            <div ref={setNodeRef} className={styles.field}>
                {/* Field Markings */}
                <div className={styles.markingOuter}>
                    <div className={styles.cornerTopLeft}></div>
                    <div className={styles.cornerTopRight}></div>
                    <div className={styles.cornerBottomLeft}></div>
                    <div className={styles.cornerBottomRight}></div>

                    <div className={styles.midfieldLine}></div>
                    <div className={styles.centerCircle}></div>
                    <div className={styles.centerSpot}></div>

                    <div className={styles.boxTop}></div>
                    <div className={styles.boxTopInner}></div>
                    <div className={styles.arcTop}></div>

                    <div className={styles.boxBottom}></div>
                    <div className={styles.boxBottomInner}></div>
                    <div className={styles.arcBottom}></div>
                </div>

                {/* Players */}
                {players.map((p) => (
                    <PlayerToken
                        key={p.player.id}
                        id={p.player.id}
                        player={p.player}
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            transform: 'translate(-50%, -50%)', // Center based on coords
                            position: 'absolute'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
