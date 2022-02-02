import chalk from 'chalk';
import prompts from 'prompts';

import words from './words.js';

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

    let remainingWord = word;
    for (let letter = 0; letter < word.length; letter++) {
        const guessedChar = guess[letter];
        const actualChar = word[letter];
        if (guessedChar === actualChar) {
            row += chalk.white.bgGreen.bold(` ${guessedChar} `);
            remainingWord = remainingWord.replace(guessedChar, '');
        } else if (remainingWord.includes(guessedChar)) {
            row += chalk.black.bgYellow.bold(` ${guessedChar} `);
            remainingWord = remainingWord.replace(guessedChar, '');
        } else row += chalk.white.bgGray.bold(` ${guessedChar} `);
    }
    boardState += row + '\n';
    process.stdout.write(boardState);
    return guess === word;
}

async function play(word, tries) {
    if (tries === 0) {
        console.log(`Game Over. The word is: ${word}`);
        return;
    }
    const res = await prompts(wordlePrompt);
    const guess = res.guess?.toUpperCase();

    if (typeof guess === 'undefined') {
        throw new Error('What happened???');
    }
    prevGuesses.push(guess);
    if (check(word, guess)) {
        console.log('You Win.');
        return;
    }
    process.stdout.write('\n');
    await play(word, --tries);
}

async function start() {
    console.clear();
    console.log(chalk.bgGreen(` X `), ' - correct place');
    console.log(chalk.bgYellow(` X `), ' - wrong place');
    console.log(chalk.bgGray(` X `), ' - absent');
    const nWords = 5757; // number of words we have
    const maxTries = 6;
    // get a random number from 1-5757 (inclusive)
    const index = Math.floor(Math.random() * nWords) + 1;
    const word = words[index].toUpperCase();
    try {
        await play(word, maxTries);
    } catch (err) {
        console.log(err.message);
    }
}

start();
