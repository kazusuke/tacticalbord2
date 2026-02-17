import React from 'react';
import { PlayerToken } from './PlayerToken';
import { X } from 'lucide-react';
import styles from './PlayerSelectionModal.module.css';

export function PlayerSelectionModal({ isOpen, onClose, players, onSelectPlayer, activePeriod, fieldPlayers }) {
    if (!isOpen) return null;

    // Filter available players (e.g. not suspended in current period?)
    // For now show all, but maybe highlight status
    const availablePlayers = players.filter(p => {
        // Option: Filter out currently suspended?
        // Let's just show them but indicate status
        return true;
    });

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Select Replacement</h3>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.list}>
                    {availablePlayers.map(player => {
                        const isOnField = fieldPlayers.has(player.id);
                        const isSuspended = (player.suspendedPeriods || []).includes(activePeriod);

                        return (
                            <div
                                key={player.id}
                                className={`${styles.row} ${isOnField ? styles.onField : ''} ${isSuspended ? styles.suspended : ''}`}
                                onClick={() => !isSuspended && onSelectPlayer(player.id)}
                            >
                                <div className={styles.tokenWrapper}>
                                    <PlayerToken id={`modal-${player.id}`} player={player} showName={false} />
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.name}>{player.name}</span>
                                    <span className={styles.status}>
                                        {isSuspended ? 'Suspended' : isOnField ? 'On Field' : 'Bench'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
