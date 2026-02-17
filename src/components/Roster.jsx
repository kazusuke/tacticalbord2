import React, { useState } from 'react';
import { PlayerToken } from './PlayerToken';
import { Plus, Trash2, Users, Ban, ChevronUp, ChevronDown } from 'lucide-react';
import styles from './Roster.module.css';
import { PERIODS } from '../constants';

export function Roster({ players, fieldPlayers, playingTimes, playedPeriods, onAddPlayer, onDeletePlayer, onToggleSuspended, activePeriod }) {
    // Default to collapsed on mobile
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className={`glass-panel ${styles.panel} ${isExpanded ? styles.isExpanded : styles.isCollapsed}`}>
            {/* Mobile Handle */}
            <div className={styles.mobileHandle} onClick={toggleExpand}>
                <div className={styles.handleBar}></div>
            </div>

            <div className={styles.header}>
                <h2 className={styles.title} onClick={toggleExpand}>
                    <Users size={20} />
                    <span>Roster</span>
                    {isExpanded ? <ChevronDown size={16} className="md:hidden" /> : <ChevronUp size={16} className="md:hidden" />}
                </h2>
                <button onClick={onAddPlayer} className={`btn btn-primary ${styles.addBtn}`}>
                    <Plus size={16} />
                </button>
            </div>

            <div className={styles.list}>
                {[...players]
                    .sort((a, b) => {
                        const aOnField = fieldPlayers.has(a.id);
                        const bOnField = fieldPlayers.has(b.id);

                        const aSuspended = (a.suspendedPeriods || []).includes(activePeriod);
                        const bSuspended = (b.suspendedPeriods || []).includes(activePeriod);

                        // 1. Suspended last
                        if (aSuspended !== bSuspended) return aSuspended ? 1 : -1;

                        // 2. OnField first (if neither suspended)
                        if (!aSuspended && !bSuspended) {
                            if (aOnField !== bOnField) return aOnField ? -1 : 1;
                        }

                        // 3. Number
                        return a.number - b.number;
                    })
                    .map(player => {
                        const isOnField = fieldPlayers.has(player.id);
                        const time = playingTimes[player.id] || 0;
                        const suspendedPeriods = player.suspendedPeriods || [];
                        const isSuspended = suspendedPeriods.includes(activePeriod);
                        const periodsPlayed = playedPeriods ? playedPeriods[player.id] : new Set();

                        return (
                            <div
                                key={player.id}
                                className={`${styles.playerRow} ${isOnField ? styles.onField : ''} ${isSuspended ? styles.suspended : ''}`}
                            >
                                <div className={styles.tokenContainer}>
                                    {!isOnField && !isSuspended && (
                                        <PlayerToken
                                            id={`roster-${player.id}`}
                                            player={player}
                                            showName={false}
                                            className="relative z-10"
                                        />
                                    )}
                                    {isOnField && (
                                        <div className={styles.fieldIndicator}>
                                            On
                                        </div>
                                    )}
                                    {isSuspended && (
                                        <div className={styles.suspendedIndicator}>
                                            <Ban size={16} />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.playerInfo}>
                                    <div className={styles.playerName}>{player.name}</div>
                                    <div className={styles.timeline}>
                                        <div className={styles.blocks}>
                                            {PERIODS.map(p => {
                                                const played = periodsPlayed?.has(p);
                                                const pSuspended = suspendedPeriods.includes(p);
                                                return (
                                                    <div
                                                        key={p}
                                                        className={`
                                        ${styles.block} 
                                        ${played ? styles.playedBlock : ''}
                                        ${pSuspended ? styles.suspendedBlock : ''}
                                    `}
                                                        title={`Period ${p}`}
                                                    ></div>
                                                );
                                            })}
                                        </div>
                                        <div className={styles.timeText}>{time} mins</div>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <button
                                        onClick={() => onToggleSuspended(player.id)}
                                        className={`${styles.actionBtn} ${isSuspended ? styles.activeSuspended : ''}`}
                                        title="Toggle Suspension"
                                    >
                                        <Ban size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDeletePlayer(player.id)}
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        title="Delete Player"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
