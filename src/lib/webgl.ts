import * as React from 'react';

let webglSupportedCache: boolean | undefined;
const getWebglSupported = (): boolean => {
  if (webglSupportedCache === undefined) {
    try {
      const canvas = document.createElement('canvas');
      webglSupportedCache = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      webglSupportedCache = false;
    }
  }
  return webglSupportedCache;
};
const subscribeNoop = (): (() => void) => () => {};

// WebGL support on the client; null during SSR
export function useWebglSupported(): boolean | null {
  return React.useSyncExternalStore(subscribeNoop, getWebglSupported, () => null);
}
