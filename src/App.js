import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Leva } from 'leva';
import Game from './components/Game';
import { KeyboardControls } from '@react-three/drei';
import Interface from './components/Interface';

const App = () => {
  const cameraSettings = {
    fov: 75,
    near: 0.1,
    far: 200,
    position: [0, 5, 5],
  };

  return (
    <>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        <Canvas
          flat
          dpr={2} // default pixel ratio
          camera={cameraSettings}
          shadows={true}
        >
          <Game />
        </Canvas>
        <Interface />
      </KeyboardControls>
    </>
  );
};

export default App;
