import * as React from 'react';
import { Button, Typography } from '@mui/material';
import type { Project } from '@type';
import ProjectArt from '@components/ProjectArt';
import type { PlayerInput } from './physics';
import styles from './PlayHud.module.scss';

export const PreviewCard = ({ project, onOpen }: { project: Project; onOpen: () => void }): React.ReactElement => (
  <div className={styles.preview} data-augmented-ui="tl-clip br-clip both">
    <ProjectArt project={project} className={styles.previewArt} />
    <div className={styles.previewBody}>
      <Typography className={styles.previewTitle} variant="h6" component="h2">
        {project.title}
      </Typography>
      <Typography variant="body2">{project.summary}</Typography>
      <Button className={styles.openButton} variant="contained" color="success" onClick={onOpen}>
        Open ▶ <span className={styles.keyHint}>(E)</span>
      </Button>
    </div>
  </div>
);

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
export const TouchControls = ({ inputRef }: { inputRef: React.RefObject<PlayerInput> }): React.ReactElement => {
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
  );
};

export const KeyboardHint = (): React.ReactElement => <p className={styles.keyboardHint}>← → move · Space jump · E open</p>;
