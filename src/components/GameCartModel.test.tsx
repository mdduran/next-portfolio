import React from 'react';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import GameCartModel from './GameCartModel';
import ModelLoader from './ModelLoader';

describe('Game cart model tests', () => {
  test('renders test game cart model', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <React.Suspense fallback={<ModelLoader />}>
        <GameCartModel />
      </React.Suspense>
    );
    await ReactThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(1, 1);
    });
    expect(renderer.scene.children[0].type).toBe('Group');
  });
});
