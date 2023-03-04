import './style.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react';
import { KeyboardControls } from '@react-three/drei';

const root = ReactDOM.createRoot(document.querySelector('#root'));

root.render(<App />);
