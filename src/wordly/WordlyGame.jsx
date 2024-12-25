// src/wordly/WordlyGame.jsx
import React, { useCallback, useMemo } from 'react';
import { Box, IconButton, Button, Grid, Typography, Container, Paper, Dialog } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import WordlyInput from './WordlyInput';
import AdminPanel from './AdminPanel';
import RulesDialog from './RulesDialog';
import KeyboardDisplay from './KeyboardDisplay';
import { useWordly } from './WordlyContext';
import { useWordlyGame } from './useWordlyGame';
import { GAME_CONSTANTS } from './constants';
import words from './words.json';

export default function WordlyGame() {
  const { state, dispatch } = useWordly();
  const { handleNewGame, checkGuess } = useWordlyGame(dispatch, state);
  const [adminOpen, setAdminOpen] = React.useState(false);
  const [rulesOpen, setRulesOpen] = React.useState(true);

  const handleInputChange = useCallback((row, col, value) => {
    dispatch({ 
      type: 'UPDATE_GUESS', 
      row, 
      col, 
      value: value.toUpperCase() 
    });
  }, [dispatch]);

  const handleSubmit = useCallback(() => {
    try {
      const currentGuess = state.guesses[state.currentGuessIndex]
        .slice(0, 6)
        .join('')
        .trim();
      
      if (currentGuess.length < GAME_CONSTANTS.MIN_WORD_LENGTH || 
          currentGuess.length > GAME_CONSTANTS.MAX_WORD_LENGTH) {
        throw new Error(`Word must be ${GAME_CONSTANTS.MIN_WORD_LENGTH}-${GAME_CONSTANTS.MAX_WORD_LENGTH} Letters!`);
      }

      if (!words.includes(currentGuess.toLowerCase())) {
        throw new Error('Invalid word! Please enter a valid word.');
      }

      const { colors, isWin } = checkGuess(currentGuess, state.correctWord);
      
      dispatch({ 
        type: 'UPDATE_COLORS', 
        colors: [...state.colors.map((row, i) => 
          i === state.currentGuessIndex ? colors : row
        )]
      });

      if (isWin) {
        dispatch({ 
          type: 'SET_ERROR',
          error: `You Win! The word was: ${state.correctWord}. You solved it in ${state.currentGuessIndex + 1} tries.`
        });
        dispatch({ type: 'SET_GAME_OVER', gameOver: true });
      } else if (state.currentGuessIndex >= GAME_CONSTANTS.MAX_TRIES - 1) {
        dispatch({ 
          type: 'SET_ERROR',
          error: `You failed in ${GAME_CONSTANTS.MAX_TRIES} tries. The word was: ${state.correctWord}.`
        });
        dispatch({ type: 'SET_GAME_OVER', gameOver: true });
      } else {
        dispatch({ type: 'INCREMENT_GUESS_INDEX' });
        dispatch({ type: 'SET_ERROR', error: '' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
    }
  }, [state.currentGuessIndex, state.guesses, state.correctWord, state.colors, checkGuess, dispatch]);

  const handleSetWord = useCallback((newWord) => {
    try {
      if (!newWord || typeof newWord !== 'string') {
        throw new Error('Invalid word format');
      }
      const randomIndex = Math.floor(Math.random() * newWord.length);
      dispatch({ 
        type: 'RESET_GAME',
        correctWord: newWord.toUpperCase(),
        givenLetterIndex: randomIndex
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: error.message });
    }
  }, [dispatch]);

  const letterStates = useMemo(() => {
    const states = {};
    // Only process up to current guess index + 1
    state.guesses.slice(0, state.currentGuessIndex + 1).forEach((guess, rowIndex) => {
      const colors = state.colors[rowIndex];
      if (colors) {
        guess.forEach((letter, letterIndex) => {
          if (!letter) return;
          const currentColor = colors[letterIndex];
          // Prioritize correct matches
          if (!states[letter] || 
              currentColor === GAME_CONSTANTS.COLORS.CORRECT ||
              (states[letter] === GAME_CONSTANTS.COLORS.WRONG && currentColor === GAME_CONSTANTS.COLORS.PARTIAL)) {
            states[letter] = currentColor;
          }
        });
      }
    });
    return states;
  }, [state.guesses, state.colors, state.currentGuessIndex]);
  
  

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={3} 
        style={{ 
          padding: '2rem',
          textAlign: 'center',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{
              fontFamily: "'Roboto Slab', serif",
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3, #3f51b5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '1.5rem'
            }}
          >
            Wordly
          </Typography>
          <IconButton
            onClick={() => setRulesOpen(true)}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Clue: The letter '{state.correctWord[state.givenLetterIndex]}' is in the word!
        </Typography>

        <Grid container spacing={1}>
          {state.guesses.map((guess, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <WordlyInput
                row={rowIndex}
                inputs={guess}
                onInputChange={handleInputChange}
                colors={state.colors[rowIndex]}
                disabled={rowIndex !== state.currentGuessIndex || state.gameOver}
                onSubmit={handleSubmit}
                currentGuessIndex={state.currentGuessIndex}
              />
            </Grid>
          ))}
        </Grid>

        {state.error && (
          <Typography 
            color={state.gameOver ? "primary" : "error"} 
            variant="body1" 
            gutterBottom
          >
            {state.error}
          </Typography>
        )}

        <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={state.currentGuessIndex >= GAME_CONSTANTS.MAX_TRIES || state.gameOver}
          >
            Submit Guess
          </Button>
          <Button variant="contained" onClick={handleNewGame}>
            New Game
          </Button>
          <Button variant="contained" onClick={() => setAdminOpen(true)}>
            Admin Panel
          </Button>
        </Box>
      </Paper>

      <Dialog open={adminOpen} onClose={() => setAdminOpen(false)}>
        <AdminPanel setCorrectWord={handleSetWord} onClose={() => setAdminOpen(false)} />
      </Dialog>

      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <KeyboardDisplay letterStates={letterStates} />
    </Container>
  );
}