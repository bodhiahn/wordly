// src/App.jsx
import React from 'react';
import WordlyGame from './wordly/WordlyGame';
import { WordlyProvider } from './wordly/WordlyContext';

export default function App() {
  return (
    <div className="App">
      <WordlyProvider>
        <WordlyGame />
      </WordlyProvider>
    </div>
  );
}
