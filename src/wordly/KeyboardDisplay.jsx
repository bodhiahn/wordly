import React from 'react';
import { Box, Button } from '@mui/material';
import { GAME_CONSTANTS } from './constants';

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export default function KeyboardDisplay({ letterStates }) {
    
  const getButtonColor = (letter) => {
    const state = letterStates[letter];
    console.log(`Letter ${letter} state: ${state}`);

    switch (state) {
      case GAME_CONSTANTS.COLORS.CORRECT:
        return '#4caf50'; // green
      case GAME_CONSTANTS.COLORS.PARTIAL:
        return '#ff9800'; // orange
      case GAME_CONSTANTS.COLORS.WRONG:
        return '#9e9e9e'; // dark gray
      default:
        return '#e0e0e0'; // light gray
    }
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
      {KEYBOARD_LAYOUT.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 0.5 }}>
          {row.map((letter) => (
            <Button
            key={letter}
            variant="contained"
            sx={{
              minWidth: '35px',
              height: '45px',
              p: 0.5,
              backgroundColor: getButtonColor(letter),
              '&:hover': {
                backgroundColor: getButtonColor(letter),
              },
              // Add these styles to override disabled state
              '&.Mui-disabled': {
                backgroundColor: getButtonColor(letter),
                color: 'white', // Keep text visible
                opacity: 1 // Prevent fading
              }
            }}
            disabled
          >
            {letter}
          </Button>
          
          ))}
        </Box>
      ))}
    </Box>
  );
}