import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import * as THREE from 'three';
import { Float, Text } from '@react-three/drei';

//================= Geometries / Materials ========================

//ThreeJS and ReactThreeFibers color managment will conflict without this setting
THREE.ColorManagement.legacyMode = false;

//Create them only once then reuse them. . . performance. . .
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 'white' });
const floorMaterialTwo = new THREE.MeshStandardMaterial({
  color: 'mediumpurple',
});
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' });

// ============================== FLOOR =================================
export const Block = ({ position = [0, 0, 0], material = floorMaterial }) => (
  <group position={position}>
    <mesh
      receiveShadow
      geometry={boxGeometry}
      material={material}
      position={[0, -0.1, 0]}
      scale={[4, 0.2, 4]}
    />
  </group>
);
export const StartBlock = ({ position = [0, 0, 0] }) => (
  <group position={position}>
    <Float>
      <Text
        position={[1, 1, 0]}
        fontSize={0.3}
        maxWidth={0.25}
        rotation-y={[-0.25]}
      >
        MARBLE RACE
      </Text>
    </Float>
    <Block />
  </group>
);

// ======================= FINISH LINE ==================================
export const FinishLine = ({
  position = [0, 0, 0],
  material = floorMaterial,
}) => {
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={material}
        position={[0, 0, 0]}
        scale={[4, 0.4, 4]}
      />
    </group>
  );
};

// ============================== SPINNER =================================
export const Spinner = ({ position = [0, 0, 0] }) => {
  const [speed] = useState(() => {
    let randomNum = Math.random() + 0.25;
    let result = randomNum * (randomNum > 0.5 ? -1 : 1);
    return result;
  });
  const obstacleRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacleRef.current.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <Block position={[0, 0, 0]} material={floorMaterialTwo} />
      <RigidBody
        ref={obstacleRef}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          position={[0, -0.1, 0]}
          scale={[0.3, 0.3, 3.5]}
        />
      </RigidBody>
    </group>
  );
};

// ================================ LIMBO ===================================
export const Limbo = ({ position = [0, 0, 0] }) => {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacleRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const yAxis = Math.sin(time + timeOffset) + 1.4;

    obstacleRef.current.setNextKinematicTranslation({
      x: position[0],
      y: yAxis,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <Block position={[0, 0, 0]} material={floorMaterialTwo} />
      <RigidBody
        ref={obstacleRef}
        type='kinematicPosition'
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          position={[0, -0.1, 0]}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
};

// ================================ LIMBO ===================================
export const Slider = ({ position = [0, 0, 0] }) => {
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacleRef = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const xAxis = Math.sin(time + timeOffset);

    obstacleRef.current.setNextKinematicTranslation({
      x: xAxis,
      y: position[1] + 1.15,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <Block position={[0, 0, 0]} material={floorMaterialTwo} />
      <RigidBody
        ref={obstacleRef}
        type='kinematicPosition'
        position={[0, 0, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          position={[0, -0.1, 0]}
          scale={[1.5, 2, 0.3]}
        />
      </RigidBody>
    </group>
  );
};

const Bounds = ({ length = 1 }) => {
  return (
    <RigidBody type='fixed' restitution={0.2} friction={0}>
      <mesh
        castShadow
        receiveShadow
        geometry={boxGeometry}
        material={wallMaterial}
        position={[-2, 1, -(length * 2) + 2]}
        scale={[0.1, 2, 4 * length]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={boxGeometry}
        material={wallMaterial}
        position={[2, 1, -(length * 2) + 2]}
        scale={[0.1, 2, 4 * length]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={boxGeometry}
        material={wallMaterial}
        position={[0, 1, -(length * 4) + 2]}
        scale={[4, 2, 0.2]}
      />
      <CuboidCollider
        args={[2, 0.1, length * 2]}
        position={[0, -0.1, -(length * 2) + 2]}
        restitution={0.2}
        friction={1}
      />
    </RigidBody>
  );
};

export const Level = ({
  count = 10,
  types = [Spinner, Slider, Limbo],
  seed = 0,
}) => {
  const components = useMemo(() => {
    const components = [];

    for (let i = 0; i < count; i++) {
      let randomNum = Math.floor(Math.random() * types.length);
      const type = types[randomNum];
      components.push(type);
    }

    return components;
  }, [count, types, seed]);

  return (
    <>
      <StartBlock position={[0, 0, 0]} />
      {components.map((Component, index) => (
        <Component key={index} position={[0, 0, -((index + 1) * 4)]} />
      ))}
      <Bounds length={count + 2} />
      <FinishLine position={[0, 0, -(count + 1) * 4]} />
    </>
  );
};

// const [hitSound] = useState(() => new Audio('./hit.mp3'));
// const cube = useRef();
// const ball = useRef();
// const spin = useRef();

// const cubeJump = () => {
//   console.log(cube.current);
//   const mass = cube.current.mass();
//   cube.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
//   cube.current.applyTorqueImpulse({ x: 0, y: Math.PI, z: 0 });
// };
// const ballJump = () => {
//   console.log(ball.current);
//   ball.current.applyImpulse({ x: 0, y: 20, z: 0 });
//   // ball.current.applyTorqueImpulse({ x: Math.PI, y: 0, z: 0 });
// };

// {/* ================================ SPHERE ============================== */}
// <RigidBody
//   ref={ball}
//   colliders='ball'
//   position={[2, 1.5, 0]}
//   restitution={1.5} // how much bounce
//   friction={0.7} // how much it slides ex: carpet or cement
// >
//   <mesh castShadow onClick={ballJump}>
//     <sphereGeometry scale={1.2} />
//     <meshStandardMaterial color={'mediumpurple'} />
//   </mesh>
// </RigidBody>

// {/* ================================ CUBE ============================== */}
// <RigidBody
//   position={[-2, 1.5, 0]}
//   ref={cube}
//   gravityScale={1}
//   restitution={1}
//   colliders={false}
//   onSleep={() => console.log('sleep')}
// >
//   <mesh castShadow onClick={cubeJump}>
//     <boxGeometry args={[1.5, 1.5, 1.5]} />
//     <meshStandardMaterial />
//   </mesh>
//   <CuboidCollider mass={1} args={[0.75, 0.75, 0.75]} />
// </RigidBody>

{
  /* ================================ SPINNER ==============================
        <RigidBody
          ref={spin}
          position={[0, 0.2, 0]}
          friction={0}
          type='kinematicPosition'
        >
          <mesh castShadow scale={[0.4, 0.4, 15]}>
            <boxGeometry />
            <meshStandardMaterial color={'red'} />
          </mesh>
        </RigidBody> */
}

{
  /* <Wall
          position={[-10, 5, 40]}
          rotation={[0, 0, Math.PI * 0.5]}
          scale={[1, 1, 5]}
        />
        <Wall
          position={[10, 5, 40]}
          rotation={[0, 0, -Math.PI * 0.5]}
          scale={[1, 1, 5]}
        /> */
}
