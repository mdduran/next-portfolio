import * as React from 'react';
import type { PlayerInput } from './physics';

const LEFT_KEYS = ['ArrowLeft', 'KeyA'];
const RIGHT_KEYS = ['ArrowRight', 'KeyD'];
const JUMP_KEYS = ['Space', 'ArrowUp', 'KeyW'];
const INTERACT_KEYS = ['KeyE', 'Enter'];
const GAME_KEYS = [...LEFT_KEYS, ...RIGHT_KEYS, ...JUMP_KEYS, ...INTERACT_KEYS];

// Keys pressed on a focused link/button should act on it, not the game
const isInteractiveTarget = (target: EventTarget | null) => target instanceof HTMLElement && !!target.closest('a, button, input');

// Keyboard controls for the platformer. Returns a mutable input object the game
// loop reads every frame (touch controls write to the same object). Number keys
// call onTravel with a zero-based index.
export function usePlayControls(onInteract: () => void, onTravel: (index: number) => void, enabled: boolean): React.RefObject<PlayerInput> {
  const input = React.useRef<PlayerInput>({ left: false, right: false, jumpHeld: false, jumpQueued: false });
  const callbacks = React.useRef({ onInteract, onTravel });
  React.useEffect(() => {
    callbacks.current = { onInteract, onTravel };
  });

  React.useEffect(() => {
    const state = input.current;
    const release = () => {
      state.left = false;
      state.right = false;
      state.jumpHeld = false;
    };
    if (!enabled) {
      release();
      return undefined;
    }

    const onKey = (event: KeyboardEvent) => {
      const digit = /^Digit([1-9])$/.exec(event.code);
      if (digit && event.type === 'keydown' && !event.repeat && !isInteractiveTarget(event.target)) {
        callbacks.current.onTravel(Number(digit[1]) - 1);
        return;
      }
      if (!GAME_KEYS.includes(event.code) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isInteractiveTarget(event.target) && (event.code === 'Enter' || event.code === 'Space')) return;
      event.preventDefault();
      const down = event.type === 'keydown';
      if (LEFT_KEYS.includes(event.code)) state.left = down;
      if (RIGHT_KEYS.includes(event.code)) state.right = down;
      if (JUMP_KEYS.includes(event.code)) {
        if (down && !event.repeat) state.jumpQueued = true;
        state.jumpHeld = down;
      }
      if (INTERACT_KEYS.includes(event.code) && down && !event.repeat) callbacks.current.onInteract();
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    // Avoid stuck keys when the window loses focus mid-press
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      window.removeEventListener('blur', release);
    };
  }, [enabled]);

  return input;
}
