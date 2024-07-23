// src/wordly/WordlyGame.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Container, Paper, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import WordlyInput from './WordlyInput';
import words from './words.json'; // Assuming you have a words.json file
import AdminPanel from './AdminPanel';
import RulesDialog from './RulesDialog';

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
  const [rulesOpen, setRulesOpen] = useState(true);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * correctWord.length);
    setGivenLetterIndex(randomIndex);
  }, [correctWord]);

  const handleInputChange = (row, col, value) => {
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
        const letterCounts = {};

        // Count the letters in the correct word
        for (let letter of correctWord) {
          letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }

        for (let i = 0; i < 6; i++) {
          if (currentGuess[i] === correctWord[i]) {
            newColors[currentGuessIndex][i] = '#4caf50'; // Green
            letterCounts[currentGuess[i]]--;
          } else if (correctWord.includes(currentGuess[i]) && letterCounts[currentGuess[i]] > 0) {
            newColors[currentGuessIndex][i] = '#ffeb3b'; // Yellow
            letterCounts[currentGuess[i]]--;
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
        } else if (currentGuessIndex >= 6) {
          setError(`You failed in 7 tries. The word was: ${correctWord}.`);
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
    setGameOver(false);
  };

  const handleAdminOpen = () => {
    setAdminOpen(true);
  };

  const handleAdminClose = () => {
    setAdminOpen(false);
  };

  const handleSetWord = (newWord) => {
    setCorrectWord(newWord);
    setGuesses(Array(7).fill().map(() => Array(6).fill("")));
    setCurrentGuessIndex(0);
    setColors(Array(7).fill().map(() => Array(6).fill("")));
    setError('');
    const randomIndex = Math.floor(Math.random() * newWord.length);
    setGivenLetterIndex(randomIndex);
    setGameOver(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Wordly
        </Typography>
        <Typography variant="h6" gutterBottom>
          Clue: The letter '{correctWord[givenLetterIndex]}' is in the word!
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
        <DialogContent>
          <AdminPanel setCorrectWord={handleSetWord} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdminClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </Container>
  );
}
