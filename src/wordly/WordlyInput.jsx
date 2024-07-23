// src/wordly/WordlyInput.jsx
import React, { useRef, useEffect } from 'react';
import { TextField, Box } from '@mui/material';

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
          inputProps={{ maxLength: 1, style: { textAlign: 'center', backgroundColor: colors[index] } }}
          style={{ width: '3rem', margin: '0 0.5rem' }}
          disabled={disabled}
        />
      ))}
    </Box>
  );
}
