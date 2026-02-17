import React from 'react';
import { X } from 'lucide-react';
import styles from './PlaytimeModal.module.css';
import { PERIODS } from '../constants'; // Assumed to be [1,2,3,4]

export function PlaytimeModal({ isOpen, onClose, players, playingTimes, playedPeriods, activePeriod }) {
    if (!isOpen) return null;

    // Sort players: maybe by playtime desc? or number?
    // Let's sort by number for consistency
    const sortedPlayers = [...players].sort((a, b) => a.number - b.number);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Playtime Stats</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.list}>
                    {sortedPlayers.map(player => {
                        const time = playingTimes[player.id] || 0;
                        const pPeriods = playedPeriods[player.id] || new Set();

                        return (
                            <div key={player.id} className={styles.row}>
                                <div className={styles.playerInfo}>
                                    <span className={styles.number}>{player.number}</span>
                                    <span className={styles.name}>{player.name}</span>
                                </div>
                                <div className={styles.stats}>
                                    <div className={styles.blocks}>
                                        {PERIODS.map(p => {
                                            const played = pPeriods.has(p);
                                            // We could show current suspended status here too?
                                            // For now just played status
                                            return (
                                                <div
                                                    key={p}
                                                    className={`${styles.block} ${played ? styles.played : ''}`}
                                                    title={`Period ${p}`}
                                                />
                                            );
                                        })}
                                    </div>
                                    <span className={styles.time}>{time} min</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
