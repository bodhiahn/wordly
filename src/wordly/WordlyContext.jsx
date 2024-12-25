import React, { createContext, useContext, useReducer } from 'react';
import { GAME_CONSTANTS } from './constants';

const WordlyContext = createContext();

const initialState = {
  guesses: Array(GAME_CONSTANTS.MAX_TRIES).fill().map(() => Array(6).fill("")),
  currentGuessIndex: 0,
  colors: Array(GAME_CONSTANTS.MAX_TRIES).fill().map(() => Array(6).fill("")),
  error: '',
  correctWord: '',
  gameOver: false,
  givenLetterIndex: null
};

const wordlyReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_GUESS':
      const newGuesses = state.guesses.map((guess, rowIndex) =>
        rowIndex === action.row ? guess.map((letter, colIndex) => 
          colIndex === action.col ? action.value.toUpperCase() : letter
        ) : guess
      );
      return { ...state, guesses: newGuesses };
    case 'UPDATE_COLORS':
      return { ...state, colors: action.colors };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_GAME_OVER':
      return { ...state, gameOver: action.gameOver };
    case 'RESET_GAME':
      const randomIndex = Math.floor(Math.random() * action.correctWord.length);
      return { 
        ...initialState, 
        correctWord: action.correctWord,
        givenLetterIndex: randomIndex  // Ensure this is set
      };
    case 'INCREMENT_GUESS_INDEX':
      return {
        ...state,
        currentGuessIndex: state.currentGuessIndex + 1
      };
    default:
      return state;
  }
};

export const WordlyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wordlyReducer, initialState);
  return (
    <WordlyContext.Provider value={{ state, dispatch }}>
      {children}
    </WordlyContext.Provider>
  );
};

export const useWordly = () => useContext(WordlyContext);
