// src/wordly/RulesDialog.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const RulesDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Welcome to Wordly!</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Rules:
        </Typography>
        <Typography variant="body2" gutterBottom>
          1. You have 7 attempts to guess the correct word.
        </Typography>
        <Typography variant="body2" gutterBottom>
          2. Each guess must be a valid 4-6 letter english word (Spaces can be at the end!).
        </Typography>
        <Typography variant="body2" gutterBottom>
          3. After each guess, the color of the tiles will change to show how close your guess was to the word.
        </Typography>
        <Typography variant="body2" gutterBottom>
          4. Green indicates the letter is in the correct position.
        </Typography>
        <Typography variant="body2" gutterBottom>
          5. Orange indicates the letter is in the word but in the wrong position.
        </Typography>
        <Typography variant="body2" gutterBottom>
          6. Gray indicates the letter is not in the word.
        </Typography>
        <Typography variant="body2" gutterBottom>
          7. You will be given a clue letter at the start of the game.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RulesDialog;
