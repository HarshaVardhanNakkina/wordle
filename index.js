#!/usr/bin/env node

import chalk from 'chalk';
import prompts from 'prompts';

import words from './words.js';

function printBoard(board) {
    console.clear();
    for (let row of board) {
        for (let letter of row) {
            process.stdout.write(chalk.white.bgGreenBright.bold(` ${letter} `));
        }
        process.stdout.write('\n');
    }
}

const prevGuesses = [];
let boardState = '';
const wordlePrompt = {
    type: 'text',
    name: 'guess',
    message: 'Enter a 5 letter word: ',
    validate: value => {
        if (value.length != 5) return 'Word must be 5 letters';
        if (!/^[a-z]+$/i.test(value)) return 'Word must only contain lower case alphabets';
        if (!words.includes(value)) return 'Word not found in word list';
        if (prevGuesses.includes(value.toUpperCase())) return 'You have already guessed this word';
        return true;
    }
};

function check(word, guess) {
    console.clear();
    let row = '';
    for (let letter = 0; letter < word.length; letter++) {
        if (guess[letter] === word[letter]) row += chalk.white.bgGreen.bold(` ${guess[letter]} `);
        else if (word.includes(guess[letter])) row += chalk.white.bgYellow.bold(` ${guess[letter]} `);
        else row += chalk.white.bgGray.bold(` ${guess[letter]} `);
    }
    boardState += row + '\n'; //.padEnd(boardState.length + process.stdout.columns - 15, ' ');
    process.stdout.write(boardState);
    return guess === word;
}

async function play(word, tries) {
    if (tries === 0) {
        console.log(`Game Over. The word is: ${word}`);
        return;
    }
    const res = await prompts(wordlePrompt);
    const { guess } = res;

    if (typeof guess === 'undefined') {
        throw new Error('What happened???');
    }
    prevGuesses.push(guess);
    if (check(word, guess)) {
        console.log('WINNER');
        return;
    }
    process.stdout.write('\n');
    await play(word, --tries);
}

async function start() {
    console.clear();
    const nWords = 5757; // number of words we have
    const maxTries = 6;
    // get a random number from 1-5757 (inclusive)
    const index = Math.floor(Math.random() * nWords) + 1;
    const word = words[index];
    console.log(word);
    try {
        await play(word, maxTries);
    } catch (err) {
        console.log(err.message);
    }
}

start();
