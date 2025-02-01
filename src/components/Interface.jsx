import React, { useEffect, useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import useGame from './stores/useGame';
import { addEffect } from '@react-three/fiber';

const style = {
  height: '100%',
  width: '100%',
  position: 'fixed',
  top: '0',
  left: '0',
  // border: '1px solid red',
  pointerEvents: 'none',
};

const time = {
  position: 'absolute',
  top: '8%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  color: 'white',
  fontSize: '6vh',
};

const restart = {
  border: '2px solid white',
  borderRadius: '5px',
  position: 'absolute',
  color: 'white',
  bottom: '3%',
  left: '2%',
  padding: '2rem',
  pointerEvents: 'auto',
  cursor: 'pointer',
  background: '#00000033',
};

const controls = {
  borderRadius: '5px',
  position: 'absolute',
  color: 'white',
  bottom: '3%',
  right: '2%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '.3rem',
};

const Interface = () => {
  const { forward, backward, left, right, jump } = useKeyboardControls((state) => state);
  const reset = useGame((state) => state.restart);
  const timer = useRef();

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === 'playing') elapsedTime = Date.now() - state.startTime;
      else if (state.phase === 'ended') elapsedTime = state.endTime - state.startTime;

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (timer.current) timer.current.textContent = elapsedTime;
    });

    return () => unsubscribeEffect();
  }, []);
  return (
    <div style={style}>
      {/* ========== Time Block ======== */}
      <div ref={timer} style={time}>
        {' '}
        0.00{' '}
      </div>

      {/* ============ Restart Block =========== */}
      <div style={restart} onClick={reset}>
        {' '}
        RESTART
      </div>

      {/* =========== Controls Block ========== */}
      <div style={controls}>
        <div>
          <div className={`key ${forward ? 'active' : ''}`}></div>
        </div>
        <div style={{ display: 'flex', gap: '.3rem' }}>
          <div className={`key ${left ? 'active' : ''}`}></div>
          <div className={`key ${backward ? 'active' : ''}`}></div>
          <div className={`key ${right ? 'active' : ''}`}></div>
        </div>
        <div>
          <div
            style={{
              width: '9.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            className={`key ${jump ? 'active' : ''}`}>
            space
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
