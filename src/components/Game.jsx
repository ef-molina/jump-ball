import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Debug, Physics } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Lights from './Lights';
import { Level } from './Level';
import Player from './Player';
import useGame from './stores/useGame';

const Game = () => {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <Perf position='top-left' />
      <OrbitControls />

      <Physics timeStep='vary'>
        {/* <Debug /> */}
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  );
};

export default Game;
