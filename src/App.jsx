import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { Field } from './components/Field';
import { Controls } from './components/Controls';
import { Roster } from './components/Roster';
import { PlayerToken } from './components/PlayerToken';
import { INITIAL_ROSTER, FORMATION_PRESETS, PERIOD_minutes } from './constants';
import './index.css';
import styles from './App.module.css';

export default function App() {
  const [activePeriod, setActivePeriod] = useState(1);
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  // structure: { [periodId]: { [playerId]: { x, y } } }
  const [periodsData, setPeriodsData] = useState({
    1: {}, 2: {}, 3: {}, 4: {}
  });
  const [activeFormation, setActiveFormation] = useState('4-4-2');

  const [activeDragId, setActiveDragId] = useState(null);
  const [dragStartSource, setDragStartSource] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (Object.keys(periodsData[1]).length === 0) {
      [1, 2, 3, 4].forEach(periodId => {
        applyFormation(periodId, '4-4-2');
      });
    }
  }, []);

  const { playingTimes, playedPeriods } = useMemo(() => {
    const times = {};
    const periods = {};
    roster.forEach(p => {
      times[p.id] = 0;
      periods[p.id] = new Set();
    });

    Object.entries(periodsData).forEach(([periodId, periodPlayers]) => {
      Object.keys(periodPlayers).forEach(playerId => {
        if (times[playerId] !== undefined) {
          times[playerId] += PERIOD_minutes;
          periods[playerId].add(parseInt(periodId));
        }
      });
    });
    return { playingTimes: times, playedPeriods: periods };
  }, [periodsData, roster]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragId(active.id);
    setDragStartSource(active.id.toString().startsWith('roster-') ? 'roster' : 'field');
  };

  const handleDragEndRobust = (event) => {
    const { active, over } = event;
    setActiveDragId(null);

    const playerId = active.id.toString().replace('roster-', '');
    const source = active.id.toString().startsWith('roster-') ? 'roster' : 'field';

    if (!over || over.id !== 'field') {
      if (source === 'field') {
        setPeriodsData(prev => {
          const newPeriodData = { ...prev[activePeriod] };
          delete newPeriodData[playerId];
          return { ...prev, [activePeriod]: newPeriodData };
        });
      }
      return;
    }

    const fieldRect = over.rect;
    const activeRect = active.rect.current.translated;
    if (!activeRect || !fieldRect) return;

    const centerX = activeRect.left + activeRect.width / 2;
    const centerY = activeRect.top + activeRect.height / 2;

    const xPercent = ((centerX - fieldRect.left) / fieldRect.width) * 100;
    const yPercent = ((centerY - fieldRect.top) / fieldRect.height) * 100;

    setPeriodsData(prev => ({
      ...prev,
      [activePeriod]: {
        ...prev[activePeriod],
        [playerId]: {
          x: Math.max(0, Math.min(100, xPercent)),
          y: Math.max(0, Math.min(100, yPercent))
        }
      }
    }));
  };

  const applyFormation = (periodId, formationName) => {
    setActiveFormation(formationName);
    const preset = FORMATION_PRESETS[formationName];
    if (!preset) return;

    const newPositions = {};
    preset.forEach((pos, index) => {
      if (roster[index]) {
        newPositions[roster[index].id] = { x: pos.x, y: pos.y };
      }
    });

    setPeriodsData(prev => ({
      ...prev,
      [periodId]: newPositions
    }));
  };

  const handleSmartReset = () => {
    const currentPeriodData = periodsData[activePeriod];
    // Filter out players who might be momentarily in invalid state
    const currentPlayers = Object.keys(currentPeriodData);
    if (currentPlayers.length === 0) return;

    const targetPositions = FORMATION_PRESETS[activeFormation];
    if (!targetPositions) return;

    // Calculate all distances between current players and target positions
    const edges = [];
    currentPlayers.forEach(playerId => {
      const currentPos = currentPeriodData[playerId];
      if (!currentPos) return;

      targetPositions.forEach((target, index) => {
        const dx = currentPos.x - target.x;
        const dy = currentPos.y - target.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        edges.push({ playerId, targetIndex: index, distance });
      });
    });

    // Greedy assignment: sort by distance and assign closest pairs first
    edges.sort((a, b) => a.distance - b.distance);

    const newPositions = {};
    const assignedPlayers = new Set();
    const assignedTargets = new Set();

    edges.forEach(edge => {
      if (!assignedPlayers.has(edge.playerId) && !assignedTargets.has(edge.targetIndex)) {
        assignedPlayers.add(edge.playerId);
        assignedTargets.add(edge.targetIndex);
        const target = targetPositions[edge.targetIndex];
        newPositions[edge.playerId] = { x: target.x, y: target.y };
      }
    });

    // Update positions for assigned players
    if (Object.keys(newPositions).length > 0) {
      setPeriodsData(prev => ({
        ...prev,
        [activePeriod]: {
          ...prev[activePeriod],
          ...newPositions
        }
      }));
    }
  };

  const copyPreviousPeriod = () => {
    if (activePeriod <= 1) return;
    const prevData = periodsData[activePeriod - 1];
    setPeriodsData(prev => ({
      ...prev,
      [activePeriod]: { ...prevData }
    }));
  };

  const addPlayer = () => {
    const newPlayer = {
      id: uuidv4(),
      name: `Player ${roster.length + 1}`,
      number: roster.length + 1,
    };
    setRoster([...roster, newPlayer]);
  };

  const deletePlayer = (id) => {
    if (window.confirm('Delete this player?')) {
      setRoster(prev => prev.filter(p => p.id !== id));
      setPeriodsData(prev => {
        const newData = { ...prev };
        Object.keys(newData).forEach(pId => {
          if (newData[pId][id]) {
            const newP = { ...newData[pId] };
            delete newP[id];
            newData[pId] = newP;
          }
        });
        return newData;
      });
    }
  };

  const toggleSuspended = (id) => {
    // 1. Determine new state based on CURRENT roster
    let player = roster.find(p => p.id === id);
    if (!player) return;

    const currentSuspended = player.suspendedPeriods || [];
    const isCurrentlySuspendedInActive = currentSuspended.includes(activePeriod);

    let newSuspendedPeriods;
    let periodsToRemoveFromField = [];

    if (isCurrentlySuspendedInActive) {
      // Unsuspend: Remove activePeriod and all future periods
      newSuspendedPeriods = currentSuspended.filter(p => p < activePeriod);
    } else {
      // Suspend: Add activePeriod and all future periods
      const futurePeriods = [1, 2, 3, 4].filter(p => p >= activePeriod);
      newSuspendedPeriods = [...new Set([...currentSuspended, ...futurePeriods])];
      periodsToRemoveFromField = futurePeriods;
    }

    // 2. Update Roster
    setRoster(prev => prev.map(p =>
      p.id === id ? { ...p, suspendedPeriods: newSuspendedPeriods } : p
    ));

    // 3. Update PeriodsData (Remove from field if suspending)
    if (periodsToRemoveFromField.length > 0) {
      setPeriodsData(prev => {
        const newData = { ...prev };
        periodsToRemoveFromField.forEach(periodId => {
          if (newData[periodId] && newData[periodId][id]) {
            const newPeriodPositions = { ...newData[periodId] };
            delete newPeriodPositions[id];
            newData[periodId] = newPeriodPositions;
          }
        });
        return newData;
      });
    }
  };

  const activeFieldPlayers = useMemo(() => {
    const currentPositions = periodsData[activePeriod] || {};
    return Object.entries(currentPositions).map(([pid, pos]) => {
      const player = roster.find(p => p.id === pid);
      if (!player) return null;
      return { player, x: pos.x, y: pos.y };
    }).filter(Boolean);
  }, [periodsData, activePeriod, roster]);

  const activeDragPlayer = useMemo(() => {
    if (!activeDragId) return null;
    const pid = activeDragId.toString().replace('roster-', '');
    return activeFieldPlayers.find(p => p.player.id === pid)?.player || roster.find(p => p.id === pid);
  }, [activeDragId, activeFieldPlayers, roster]);

  const activeSet = new Set(Object.keys(periodsData[activePeriod] || {}));

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEndRobust}
    >
      <div className={styles.appContainer}>
        <div className={styles.mainColumn}>
          <header className={styles.header}>
            <h1 className={styles.title}>Tactical Board</h1>
            <p className={styles.subtitle}>Managing Period {activePeriod}</p>
          </header>

          <Controls
            activePeriod={activePeriod}
            setActivePeriod={setActivePeriod}
            onCopyPrevious={copyPreviousPeriod}
            onReset={handleSmartReset}
            onSetFormation={(fmt) => applyFormation(activePeriod, fmt)}
          />

          <Field
            players={activeFieldPlayers}
            activeId={activeDragId}
          />
        </div>

        <div className={styles.rosterColumn}>
          <Roster
            players={roster}
            fieldPlayers={activeSet}
            playingTimes={playingTimes}
            playedPeriods={playedPeriods}
            onAddPlayer={addPlayer}
            onDeletePlayer={deletePlayer}
            onToggleSuspended={toggleSuspended}
            activePeriod={activePeriod}
          />
        </div>
      </div>

      <DragOverlay>
        {activeDragPlayer ? (
          <PlayerToken
            id="overlay"
            player={activeDragPlayer}
            style={{ transform: 'scale(1.1)' }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
