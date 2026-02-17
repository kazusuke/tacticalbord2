import { v4 as uuidv4 } from 'uuid';

// Positions adjusted for 2/3 view (0-100% of the VIEW)
// GK at bottom (90%)
// Def line: Previously 70-80%. Now?
// View Height = 66% of Real.
// Real 80% (Near Goal) -> View 100 - (20/0.66) = 100 - 30 = 70%.
// Real 50% (Halfway) -> View 25%.
// FWs were at Real 20%. Now they are at Real Top.
// Real 20% is in the Top 1/3 (0-33%). So they are OUT OF VIEW or at top edge?
// "From self side to 2/3".
// This implies we focus on OUR defense/build up?
// Or we map the positions to fit in this view?
// Usually tactical boards for 2/3 are for half-court games + buildup.
// Let's squeeze the formations slightly to fit or keep them and let forwards be near top.
// 4-4-2:
// GK: Real 90 -> View 85.
// DF: Real 70 -> View 55.
// MF: Real 45 -> View 18 (Above halfway??). Halfway is 25.
// MF at Real 45 is slightly ATTACKING half relative to us?
// No, 0 is Top, 100 is Bottom.
// GK at 90 (Bottom).
// Halfway is 50.
// We show 33 to 100. (Bottom 2/3).
// So 0 in View = 33 in Real.
// 100 in View = 100 in Real.
// Formula: ViewY = (RealY - 33) / 0.66 * 100.
// If RealY < 33, it's off screen (negative).
// FW at 20 -> Negative.
// So we must ADJUST defaults to fit in 2/3 view context.
// Let's assume the user wants to place them VISIBLY.
// I will compress the Y coordinates to fit 10-90 range of the VIEW.

export const FORMATION_PRESETS = {
  '4-4-2': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'lb', x: 15, y: 70 },
    { id: 'cb1', x: 35, y: 75 },
    { id: 'cb2', x: 65, y: 75 },
    { id: 'rb', x: 85, y: 70 },
    { id: 'lm', x: 15, y: 45 },
    { id: 'cm1', x: 35, y: 50 },
    { id: 'cm2', x: 65, y: 50 },
    { id: 'rm', x: 85, y: 45 },
    { id: 'fw1', x: 35, y: 20 },
    { id: 'fw2', x: 65, y: 20 },
  ],
  '4-5-1': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'lb', x: 15, y: 75 },
    { id: 'cb1', x: 35, y: 80 },
    { id: 'cb2', x: 65, y: 80 },
    { id: 'rb', x: 85, y: 75 },
    { id: 'dm1', x: 40, y: 60 },
    { id: 'dm2', x: 60, y: 60 },
    { id: 'lm', x: 15, y: 40 },
    { id: 'am', x: 50, y: 40 },
    { id: 'rm', x: 85, y: 40 },
    { id: 'fw', x: 50, y: 20 },
  ],
  '3-4-3': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'cb1', x: 20, y: 75 },
    { id: 'cb2', x: 50, y: 80 },
    { id: 'cb3', x: 80, y: 75 },
    { id: 'wb1', x: 10, y: 50 },
    { id: 'cm1', x: 40, y: 60 },
    { id: 'cm2', x: 60, y: 60 },
    { id: 'wb2', x: 90, y: 50 },
    { id: 'lf', x: 25, y: 25 },
    { id: 'cf', x: 50, y: 20 },
    { id: 'rf', x: 75, y: 25 },
  ]
};

export const INITIAL_ROSTER = Array.from({ length: 18 }, (_, i) => ({
  id: uuidv4(),
  number: i + 1,
  name: `Player ${i + 1}`,
  position: 'FP',
  isSuspended: false // New field
}));

export const PERIODS = [1, 2, 3, 4];
export const PERIOD_minutes = 15;
