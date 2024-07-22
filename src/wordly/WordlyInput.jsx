// src/wordly/WordlyInput.jsx
import React, { useRef, useEffect } from 'react';
import { TextField, Box } from '@mui/material';

export default function WordlyInput({ row, inputs, onInputChange, colors, disabled, onSubmit, givenLetterIndex, currentGuessIndex }) {
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
          if (row === 0 && index + 1 === givenLetterIndex) {
            inputRefs.current[index + 2]?.focus();
          } else {
            inputRefs.current[index + 1]?.focus();
          }
        }
      }
    } else if (isBackspace) {
        event.preventDefault(); // Prevent the default backspace behavior

        if (inputs[index] === '') {
        if (index > 0) {
            const prevIndex = (row === 0 && index - 1 === givenLetterIndex) ? index - 2 : index - 1;
            onInputChange(row, prevIndex, ''); // Clear the previous input
            if (prevIndex >= 0) {
            inputRefs.current[prevIndex]?.focus();
            } else {
            inputRefs.current[index]?.focus();
            }
        } else {
            onInputChange(row, index, ''); // Clear current input if at index 0
        }
        } else {
        onInputChange(row, index, ''); // Clear current input
        if (index > 0) {
            const prevIndex = (row === 0 && index - 1 === givenLetterIndex) ? index - 2 : index - 1;
            if (prevIndex >= 0) {
            inputRefs.current[prevIndex]?.focus();
            } else {
            inputRefs.current[index]?.focus();
            }
        } else if (index === 0 && givenLetterIndex === 0 && row === 0) {
            inputRefs.current[1]?.focus();
        }
        }
        } else if (isEnter) {
        onSubmit();
        }
  };

  useEffect(() => {
    if (currentGuessIndex === row) {
      const firstEmpty = inputs.findIndex((input, index) => input === "" && (row !== 0 || index !== givenLetterIndex));
      if (firstEmpty !== -1) {
        inputRefs.current[firstEmpty]?.focus();
      } else if (row === 0 && givenLetterIndex !== null && inputs[givenLetterIndex] === "") {
        inputRefs.current[givenLetterIndex]?.focus();
      } else {
        inputRefs.current[inputs.length - 1]?.focus();
      }
    }
  }, [currentGuessIndex, row, inputs, givenLetterIndex]);

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
