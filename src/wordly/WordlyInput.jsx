// src/wordly/WordlyInput.jsx
import React, { useRef, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import { GAME_CONSTANTS } from './constants';

export default function WordlyInput({ row, inputs, onInputChange, colors, disabled, onSubmit, currentGuessIndex }) {
  const inputRefs = useRef([]);

  const handleKeyDown = (index) => (event) => {
    const { key } = event;
    const isAlphaOrSpace = /^[A-Z ]$/i.test(key);
    const isBackspace = key === "Backspace";
    const isEnter = key === "Enter";

    if (isAlphaOrSpace) {
      if (inputs.join('').length < 6) {
        event.preventDefault(); // Prevent the default action of the key
        onInputChange(row, index, key.toUpperCase());
        if (index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1]?.focus();
        } else {
          inputRefs.current[index]?.focus(); // Stay on the last input
        }
      }
    } else if (isBackspace) {
      event.preventDefault(); // Prevent the default backspace behavior

      if (inputs[index] === '') {
        if (index > 0) {
          onInputChange(row, index - 1, ''); // Clear the previous input
          inputRefs.current[index - 1]?.focus();
        } else {
          onInputChange(row, index, ''); // Clear current input if at index 0
        }
      } else {
        onInputChange(row, index, ''); // Clear current input
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    } else if (isEnter) {
      onSubmit();
    }
  };

  useEffect(() => {
    if (currentGuessIndex === row) {
      const firstEmpty = inputs.findIndex((input) => input === "");
      if (firstEmpty !== -1) {
        inputRefs.current[firstEmpty]?.focus();
      } else {
        inputRefs.current[inputs.length - 1]?.focus();
      }
    }
  }, [currentGuessIndex, row, inputs]);

  return (
    <Box display="flex" justifyContent="center">
      {Array.from({ length: 6 }).map((_, index) => (
        <TextField
          key={index}
          value={inputs[index] || ''}
          onKeyDown={handleKeyDown(index)}
          inputRef={(ref) => (inputRefs.current[index] = ref)}
          variant="outlined"
          margin="normal"
          inputProps={{ 
            maxLength: 1, 
            style: { 
              textAlign: 'center',
              backgroundColor: colors[index] === GAME_CONSTANTS.COLORS.CORRECT ? '#4caf50' :
                              colors[index] === GAME_CONSTANTS.COLORS.PARTIAL ? '#ff9800' :
                              colors[index] === GAME_CONSTANTS.COLORS.WRONG ? '#9e9e9e' :
                              '#e0e0e0',
              color: disabled ? (colors[index] ? 'white' : '#666') : 'black',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              padding: '8px',
              width: '35px',
              height: '45px',
              border: 'none',
              borderRadius: '4px',
            }
          }}
          sx={{
            width: '3rem',
            margin: '0 0.5rem',
            '& .MuiOutlinedInput-root': {
              backgroundColor: colors[index] === GAME_CONSTANTS.COLORS.CORRECT ? '#4caf50' :
                              colors[index] === GAME_CONSTANTS.COLORS.PARTIAL ? '#ff9800' :
                              colors[index] === GAME_CONSTANTS.COLORS.WRONG ? '#9e9e9e' :
                              '#e0e0e0',
              borderRadius: '4px',
              '& input.Mui-disabled': {
                color: colors[index] ? 'white' : '#666',
                WebkitTextFillColor: colors[index] ? 'white' : '#666',
              },
              '&:hover': {
                backgroundColor: colors[index] === GAME_CONSTANTS.COLORS.CORRECT ? '#4caf50' :
                                colors[index] === GAME_CONSTANTS.COLORS.PARTIAL ? '#ff9800' :
                                colors[index] === GAME_CONSTANTS.COLORS.WRONG ? '#9e9e9e' :
                                '#e0e0e0',
              },
              '& fieldset': {
                border: 'none',
                borderRadius: '4px',
              },
            },
          }}
          disabled={disabled}
        />
      ))}
    </Box>
  );
}
