import * as React from 'react';
import type { ZoneLayout } from './level';
import type { PlayerInput } from './physics';
import styles from './PlayHud.module.scss';

type HoldButtonProps = {
  label: string;
  className?: string;
  onPress: () => void;
  onRelease: () => void;
  children: React.ReactNode;
};

// Touch button that stays "held" while a finger is down on it
const HoldButton = ({ label, className, onPress, onRelease, children }: HoldButtonProps): React.ReactElement => (
  <button
    type="button"
    aria-label={label}
    className={`${styles.touchButton} ${className ?? ''}`}
    onPointerDown={(event) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      onPress();
    }}
    onPointerUp={onRelease}
    onPointerCancel={onRelease}
    onContextMenu={(event) => event.preventDefault()}
  >
    {children}
  </button>
);

// On-screen controls, only shown on touch devices (see PlayHud.module.scss)
type TouchControlsProps = {
  inputRef: React.RefObject<PlayerInput>;
  // Open is only offered while a station is in reach
  canOpen: boolean;
  onOpen: () => void;
};

export const TouchControls = ({ inputRef, canOpen, onOpen }: TouchControlsProps): React.ReactElement => {
  const set = (key: 'left' | 'right', value: boolean) => {
    inputRef.current[key] = value;
  };
  return (
    <div className={styles.touchControls}>
      <div className={styles.touchGroup}>
        <HoldButton label="Move left" onPress={() => set('left', true)} onRelease={() => set('left', false)}>
          ◀
        </HoldButton>
        <HoldButton label="Move right" onPress={() => set('right', true)} onRelease={() => set('right', false)}>
          ▶
        </HoldButton>
      </div>
      <div className={styles.touchGroup}>
        {canOpen && (
          <button type="button" className={`${styles.touchButton} ${styles.open}`} onClick={onOpen}>
            Open
          </button>
        )}
        <HoldButton
          label="Jump"
          className={styles.jump}
          onPress={() => {
            inputRef.current.jumpQueued = true;
            inputRef.current.jumpHeld = true;
          }}
          onRelease={() => {
            inputRef.current.jumpHeld = false;
          }}
        >
          ▲
        </HoldButton>
      </div>
    </div>
  );
};

export const KeyboardHint = (): React.ReactElement => (
  <p className={styles.keyboardHint}>← → move · Space jump (hold to hover) · E open · 1-2 fly</p>
);

type TravelBarProps = {
  zones: ZoneLayout[];
  onTravel: (index: number) => void;
  disabled: boolean;
};

// Fast travel buttons, one per zone (number keys 1..n on keyboard)
export const TravelBar = ({ zones, onTravel, disabled }: TravelBarProps): React.ReactElement => (
  <nav className={styles.travel} aria-label="Fast travel">
    <span className={styles.travelLabel}>Fly to</span>
    {zones.map((zone, i) => (
      <button key={zone.type} type="button" className={styles.travelButton} onClick={() => onTravel(i)} disabled={disabled}>
        {zone.label}
        <kbd className={styles.travelKey}>{i + 1}</kbd>
      </button>
    ))}
  </nav>
);
