import { useCallback, useEffect } from 'react';
import { GAME_CONSTANTS } from './constants';
import words from './words.json';

export const useWordlyGame = (dispatch, state) => {

    useEffect(() => {
        if (!state.correctWord) {
            const newWord = getNewWord();
            const randomIndex = Math.floor(Math.random() * newWord.length);
            dispatch({
                type: 'RESET_GAME',
                correctWord: newWord,
                givenLetterIndex: randomIndex
            });
        }
    }, []);

    const getNewWord = useCallback(() => {
        const filteredWords = words.filter(
            word => word.length >= GAME_CONSTANTS.MIN_WORD_LENGTH &&
                word.length <= GAME_CONSTANTS.MAX_WORD_LENGTH
        );
        return filteredWords[Math.floor(Math.random() * filteredWords.length)].toUpperCase();
    }, []);

    const checkGuess = useCallback((currentGuess, correctWord) => {
        const letterCounts = {};
        for (let letter of correctWord) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }

        const colors = Array(6).fill('');
        let isWin = true;

        for (let i = 0; i < 6; i++) {
            if (currentGuess[i] === correctWord[i]) {
                colors[i] = GAME_CONSTANTS.COLORS.CORRECT;
                letterCounts[currentGuess[i]]--;
            } else if (correctWord.includes(currentGuess[i]) && letterCounts[currentGuess[i]] > 0) {
                colors[i] = GAME_CONSTANTS.COLORS.PARTIAL;
                letterCounts[currentGuess[i]]--;
                isWin = false;
            } else {
                colors[i] = GAME_CONSTANTS.COLORS.WRONG;
                isWin = false;
            }
        }

        return { colors, isWin };
    }, []);

    const handleNewGame = useCallback(() => {
        const newWord = getNewWord();
        const randomIndex = Math.floor(Math.random() * newWord.length);
        dispatch({
            type: 'RESET_GAME',
            correctWord: newWord,
            givenLetterIndex: randomIndex
        });
    }, [getNewWord, dispatch]);

    return {
        getNewWord,
        checkGuess,
        handleNewGame
    };
};
