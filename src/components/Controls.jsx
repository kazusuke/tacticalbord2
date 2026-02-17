import React from 'react';
import { PERIODS, FORMATION_PRESETS } from '../constants';
import { Copy, RotateCcw } from 'lucide-react';
import styles from './Controls.module.css';

export function Controls({
    activePeriod,
    setActivePeriod,
    onCopyPrevious,
    onReset,
    onSetFormation
}) {
    return (
        <div className={`glass-panel ${styles.panel}`}>
            <div className={styles.tabs}>
                {PERIODS.map(p => (
                    <button
                        key={p}
                        onClick={() => setActivePeriod(p)}
                        className={`${styles.tab} ${activePeriod === p ? styles.activeTab : ''}`}
                    >
                        P{p}
                    </button>
                ))}
            </div>

            <div className={styles.actions}>
                {activePeriod > 1 && (
                    <button onClick={onCopyPrevious} className="btn btn-secondary" title="Copy formation from previous period">
                        <Copy size={16} />
                        <span className={styles.hiddenMobile}>Copy P{activePeriod - 1}</span>
                    </button>
                )}

                <button onClick={onReset} className="btn btn-danger" title="Snap to Formation">
                    <RotateCcw size={16} />
                </button>

                <div className={styles.separator}></div>

                <div className={styles.presets}>
                    {Object.keys(FORMATION_PRESETS).map(fmt => (
                        <button
                            key={fmt}
                            onClick={() => onSetFormation(fmt)}
                            className={styles.presetBtn}
                        >
                            {fmt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
