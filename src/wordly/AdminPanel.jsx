// src/wordly/AdminPanel.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import words from './words.json';

const AdminPanel = ({ setCorrectWord }) => {
  const [newWord, setNewWord] = useState('');
  const [deleteWord, setDeleteWord] = useState('');
  const [message, setMessage] = useState('');

  const handleAddWord = () => {
    if (newWord.length >= 4 && newWord.length <= 6) {
      if (!words.includes(newWord.toLowerCase())) {
        words.push(newWord.toLowerCase());
        setMessage('Word added successfully!');
      } else {
        setMessage('Word already exists!');
      }
      setNewWord('');
    } else {
      setMessage('Word must be 4-6 letters long.');
    }
  };

  const handleSetWord = () => {
    if (newWord.length >= 4 && newWord.length <= 6) {
      setCorrectWord(newWord.toUpperCase());
      setMessage(`Word set to ${newWord.toUpperCase()}`);
      setNewWord('');
    } else {
      setMessage('Word must be 4-6 letters long.');
    }
  };

  const handleDeleteWord = () => {
    const index = words.indexOf(deleteWord.toLowerCase());
    if (index !== -1) {
      words.splice(index, 1);
      setMessage('Word deleted successfully!');
    } else {
      setMessage('Word not found!');
    }
    setDeleteWord('');
  };

  return (
    <Box>
      <Typography variant="h6">Admin Panel</Typography>
      <TextField
        label="New Word"
        value={newWord}
        onChange={(e) => setNewWord(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" onClick={handleAddWord}>
          Add Word
        </Button>
        <Button variant="contained" onClick={handleSetWord}>
          Set Word
        </Button>
      </Box>
      <TextField
        label="Delete Word"
        value={deleteWord}
        onChange={(e) => setDeleteWord(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleDeleteWord} fullWidth>
        Delete Word
      </Button>
      {message && (
        <Typography color="primary" variant="body1" gutterBottom>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default AdminPanel;
