/* eslint-disable no-unused-vars */
const axios = require('axios').default;
const inquirer = require('inquirer');
const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);

async function makeRequest(dev) {
  try {
    const getDev = await axios(`https://api.github.com/users/${dev}`);
    const getStars = await axios(`https://api.github.com/users/${dev}/starred`);

    const [main, stars] = await Promise.all([getDev, getStars]);
    console.log(main);
  } catch (e) {
    console.log(e);
  }
}

const questions = inquirer
  .prompt([
    {
      type: 'list',
      name: 'developer',
      message: "Which developer's profile would you like to see?",
      choices() {
        return readFileAsync('./data/developerList.json', 'utf8').then(data => [
          ...Object.keys(JSON.parse(data)),
        ]);
      },
    },
    {
      type: 'list',
      name: 'colour',
      message: 'Choose your preferred colour',
      choices() {
        return readFileAsync('./data/colourPicker.json', 'utf8').then(data => [
          ...Object.keys(JSON.parse(data)),
        ]);
      },
    },
  ])
  .then(data => {
    console.log(data);
  });

function makePage(data) {
  console.log(data);
}
