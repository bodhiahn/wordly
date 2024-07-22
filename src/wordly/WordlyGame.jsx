// src/wordly/WordlyGame.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Container, Paper, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import WordlyInput from './WordlyInput';
import words from './words.json'; // Assuming you have a words.json file
import AdminPanel from './AdminPanel';

const getNewWord = () => {
  const filteredWords = words.filter(word => word.length >= 4 && word.length <= 6);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)].toUpperCase();
};

export default function WordlyGame() {
  const [guesses, setGuesses] = useState(Array(7).fill().map(() => Array(6).fill("")));
  const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
  const [colors, setColors] = useState(Array(7).fill().map(() => Array(6).fill("")));
  const [error, setError] = useState('');
  const [correctWord, setCorrectWord] = useState(getNewWord());
  const [gameOver, setGameOver] = useState(false);
  const [givenLetterIndex, setGivenLetterIndex] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * correctWord.length);
    setGivenLetterIndex(randomIndex);
    setGuesses(prevGuesses => {
      const newGuesses = Array(7).fill().map(() => Array(6).fill(""));
      newGuesses[0][randomIndex] = correctWord[randomIndex];
      return newGuesses;
    });
  }, [correctWord]);

  const handleInputChange = (row, col, value) => {
    if (col === givenLetterIndex && row === 0) return; // Prevent changing the given letter
    const newGuesses = guesses.map((guess, rowIndex) =>
      rowIndex === row ? guess.map((letter, colIndex) => (colIndex === col ? value.toUpperCase() : letter)) : guess
    );
    setGuesses(newGuesses);
  };

  const handleSubmit = () => {
    const currentGuess = guesses[currentGuessIndex].slice(0, 6).join('').trim();
    if (currentGuess.length >= 4 && currentGuess.length <= 6) {
      if (words.includes(currentGuess.toLowerCase())) {
        const newColors = [...colors];
        let isWin = true;
        for (let i = 0; i < 6; i++) {
          if (currentGuess[i] === correctWord[i]) {
            newColors[currentGuessIndex][i] = '#4caf50'; // Green
          } else if (correctWord.includes(currentGuess[i])) {
            newColors[currentGuessIndex][i] = '#ffeb3b'; // Yellow
            isWin = false;
          } else {
            newColors[currentGuessIndex][i] = '#9e9e9e'; // Gray
            isWin = false;
          }
        }
        setColors(newColors);
        if (isWin) {
          setError(`You Win! The word was: ${correctWord}. You solved it in ${currentGuessIndex + 1} tries.`);
          setGameOver(true);
        } else {
          setCurrentGuessIndex(currentGuessIndex + 1);
          setError('');
        }
      } else {
        setError('Invalid word! Please enter a valid word.');
      }
    } else {
      setError('Word must be 4-6 Letters!');
    }
  };

  const handleNewGame = () => {
    setGuesses(Array(7).fill().map(() => Array(6).fill("")));
    setCurrentGuessIndex(0);
    setColors(Array(7).fill().map(() => Array(6).fill("")));
    setError('');
    const newWord = getNewWord();
    setCorrectWord(newWord);
    const randomIndex = Math.floor(Math.random() * newWord.length);
    setGivenLetterIndex(randomIndex);
    setGuesses(prevGuesses => {
      const newGuesses = Array(7).fill().map(() => Array(6).fill(""));
      newGuesses[0][randomIndex] = newWord[randomIndex];
      return newGuesses;
    });
    setGameOver(false);
  };

  const handleAdminOpen = () => {
    setAdminOpen(true);
  };

  const handleAdminClose = () => {
    setAdminOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Wordly
        </Typography>
        <Grid container spacing={1}>
          {guesses.map((guess, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <WordlyInput
                row={rowIndex}
                inputs={guess}
                onInputChange={handleInputChange}
                colors={colors[rowIndex]}
                disabled={rowIndex !== currentGuessIndex || gameOver}
                onSubmit={handleSubmit}
                givenLetterIndex={givenLetterIndex}
                currentGuessIndex={currentGuessIndex}
              />
            </Grid>
          ))}
        </Grid>
        {error && (
          <Typography color={gameOver ? "primary" : "error"} variant="body1" gutterBottom>
            {error}
          </Typography>
        )}
        <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" onClick={handleSubmit} disabled={currentGuessIndex >= 7 || gameOver}>
            Submit Guess
          </Button>
          <Button variant="contained" onClick={handleNewGame}>
            New Game
          </Button>
          <Button variant="contained" onClick={handleAdminOpen}>
            Admin Panel
          </Button>
        </Box>
      </Paper>
      <Dialog open={adminOpen} onClose={handleAdminClose}>
        <DialogTitle>Admin Panel</DialogTitle>
        <DialogContent>
          <AdminPanel setCorrectWord={setCorrectWord} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdminClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
