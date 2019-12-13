/* eslint-disable class-methods-use-this */
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const axios = require('axios');
const pdf = require('html-pdf');
const developerList = require('./data/developerList.json');
const colourPicker = require('./data/colourPicker.json');

inquirer.registerPrompt(
  'autocomplete',
  require('inquirer-autocomplete-prompt')
);

class ProfileMe {
  constructor() {
    this.githubUserName = null;
    this.colour = null;
  }

  choices(jsonFile) {
    return [...Object.keys(jsonFile)].sort();
  }

  searchDev(answers, input) {
    input = input || '';
    return new Promise(function(resolve) {
      const fuzzyResult = fuzzy.filter(
        input,
        Object.keys(developerList).sort()
      );
      resolve(fuzzyResult.map(el => el.string));
    });
  }

  promptUser() {
    return inquirer
      .prompt([
        {
          type: 'autocomplete',
          name: 'developer',
          message: "Which developer's profile would you like to see?",
          source: this.searchDev,
        },
        {
          type: 'list',
          name: 'colour',
          message: 'Choose your preferred colour',
          choices: this.choices(colourPicker),
        },
      ])
      .then(answers => {
        console.log('Answers: ');
        console.log(JSON.stringify(answers, null, 2));

        this.githubUserName = developerList[answers.developer];
        const [prim, sec, fon, imgb] = Object.values(
          ...colourPicker[answers.colour]
        );
        console.log('Color hash: ');
        console.log(`Primary Color: ${prim}`);
        console.log(`Secondary Color: ${sec}`);
        console.log(`Font Color: ${fon}`);
        console.log(`Image Border: ${imgb}`);
        this.makeApiRequest();
      });
  }

  makeApiRequest() {
    return Promise.all([
      axios.get(`https://api.github.com/users/${this.githubUserName}`),
      axios.get(`https://api.github.com/users/${this.githubUserName}/starred`),
    ]).then(
      ([
        {
          data: {
            avatar_url,
            location,
            name,
            blog,
            bio,
            public_repos,
            followers,
            following,
          },
        },
        {
          data: { length },
        },
      ]) => {
        this.avatar_url = avatar_url;
        this.location = !(location === null) ? location : `Earth`;
        this.name = !(name === null) ? name : this.githubUserName;
        this.blog = !(blog === null) ? blog : `Eat Pray Love Code`;
        this.bio = !(bio === null) ? bio : `Ad Astra Per Aspera`;
        this.public_repos = !(public_repos === null) ? public_repos : 0;
        this.followers = !(followers === null) ? followers : 0;
        this.following = !(following === null) ? following : 0;
        this.stars = length;
        console.log(this);
        this.createHtml();
      }
    );
  }

  createHtml() {
    this.html = `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme:700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="./dist/css/main.css">
    </head>

    <body>
      <div class="wrapper">
        <div class="img-container">
          <img src="${this.avatar_url}" alt="${this.name}">
        </div>
        <div class="main-container">
          <div class="main-container__greeting">
            <p class="p-h1">Hi!</p>
            <p class="p-h1 name">My name is ${this.name}!</p>
            <ul class="social">
              <li><i class="fas fa-location-arrow"></i>${this.location}</li>
              <li><i class="fab fa-github-alt"></i>${this.githubUserName}</li>
              <li><i class="fas fa-rss"></i>${this.blog}</li>
            </ul>
          </div>
        </div>

        <div class="sub-container">

          <p class="p-b">${this.bio}</p>

          <div class="sub-card-container">
            <div class="sub-card">
              <p class="p-h2 sub">Public Repositories<br>${this.public_repos}</p>
            </div>
            <div class="sub-card">
              <p class="p-h2 sub">Followers<br>${this.followers}</p>
            </div>
            <div class="break"></div>
            <div class="sub-card">
              <p class="p-h2 sub">Github Stars<br>${this.stars}</p>
            </div>
            <div class="sub-card">
              <p class="p-h2 sub">Following<br>${this.following}</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
    this.createPdf();
  }

  createPdf() {
    pdf
      .create(this.html)
      .toFile(`./data/pdfs/${this.githubUserName}-bio.pdf`, function(err, res) {
        if (err) return console.log(err);
        console.log(res);
      });
  }
}

const me = new ProfileMe();
me.promptUser();
