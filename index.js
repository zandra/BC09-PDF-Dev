/* eslint-disable no-unused-vars */
const axios = require('axios')
const inquirer = require('inquirer')
const pdf = require('html-pdf')

class ProfileGenerator {
  constructor() {
    this.githubUserName = null
  }

  promptUserName () {
    return inquirer
      .prompt([
        {
          type: 'input',
          name: "developer",
          message: "What profile would you like to see?",
          default: 'douglascrockford'
        }
      ])
      .then(answers => {
        this.githubUserName = answers.developer
        this.makeApiCall()
      })
  }

  makeApiCall() {
      return Promise.all([
        axios.get(`https://api.github.com/users/${this.githubUserName}`),
        axios.get(`https://api.github.com/users/${this.githubUserName}/starred`)
      ])
      .then(
        ([{data}, {data: {length}}]) => {
        this.name = !(data.name === null) ? data.name : this.githubUserName;
        this.location = !(data.location === null) ? data.location : 'Earth';
        this.bio = !(data.bio === null) ? data.bio : '';
        this.company = !(data.company === null) ? `Currently @ ${data.company},` : '';
        this.avatar_url = data.avatar_url;
        this.public_repos = data.public_repos;
        this.followers = data.followers;
        this.following = data.following;
        this.stars = length;
        this.createHtml()
      }
    );
  }

  createHtml() {
    this.html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Github Profile</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          font-family:  "Gill Sans", sans-serif;
          font-weight: 500;
          font-size: 15px;
          color: #ffffff;
          font-stretch: condensed;
        }
        .pdf-wrapper {
          height: 265mm;
          width: 203.2mm;
          text-align: center;
          background: #6495ed;
          box-shadow:0 0 0.5cm rgba(0, 0, 0, 0.5); ;
        }
        .image-container {
          position: absolute;
          left: 55mm;
          margin-left: auto;
          margin-right: auto;
          z-index: 2;
          height: 150px;
          width: 150px;
          top: 4mm;     
        }
        img {
          border: 5px solid #ffff00;
          border-radius: 50%;
          max-width: 100%;
          max-height: 100%;
          z-index: 2;
        }
        .top-container {
          position: absolute;
          height: 70mm;
          width: 95%;
          background: #fa8072;
          top: 10mm;
          left: 4.25mm;
          bottom: -10px;
          border-radius: 5px;
          z-index: 1;
        }
        .greeting {
          position: relative;
          text-align: center;
          top: 35mm;
    
        }
        .bottom-container {
          position: absolute;
          height: 80mm;
          width: 100%;
          top: 75mm;
          z-index: 0;
          background: white;
        }
        .bio {
          position: relative;
          top: 8mm;
          text-align: center;
          color: black;
        }
        .card-container {
          position: relative;
          text-align: center;
          width: 100%;
          top: 10mm;
        }
        .card {
          background: #fa8072;
          color:  #ffffff;
          box-shadow: 0 0 0.1cm rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          width: 50mm;
          height: 15mm;
        }
        .card-top-left {
          position: absolute;
          left: 25mm;
        }
        .card-top-right {
          position: absolute;
          right: 25mm;
        }
        .card-bottom-left {
          position: absolute;
          left: 25mm;
          top: 20mm;
        }
        .card-bottom-right {
          position: absolute;
          right: 25mm;
          top: 20mm;
        }
        .p-h2 {
          font-size: 15px;
        }
      </style>
    </head>
    <body>
      <div class="pdf-wrapper">
        <div class="image-container"><img src="${this.avatar_url}" alt="Profile"></div>
        <div class="top-container">
          <div class="greeting">
            <h1>${this.name}</h1>
            <p>${this.company}&nbsp;${this.location}</p>
          </div>
        </div>
        <div class="bottom-container">
          <div class="bio"><h4>${this.bio}</h4></div>
          <div class="card-container">
            <div class="card card-top-left">
              <p class="p-h2 sub">Public Repositories<br>${this.public_repos}</p>
            </div>
            <div class="card card-top-right">
              <p class="p-h2 sub">Followers<br>${this.followers}</p>
            </div>
            <div class="card card-bottom-left">
              <p class="p-h2 sub">Github Stars<br>${this.stars}</p>
            </div>
            <div class="card card-bottom-right">
              <p class="p-h2 sub">Following<br>${this.following}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- End of wrapper  -->
    </body>
    </html>`
    ;
  this.createPdf()
  }

  createPdf(){
    pdf
    .create(this.html, {format: "Letter", "footer": { "height":"10mm", "contents": {first: `<span style="color:#444;font-size:10px;vertical-align:-20px;margin-left:70mm;">(${(new Date().toDateString())})</span>`}}})
    .toFile(`./data/pdfs/${this.githubUserName}-profile.pdf`, function(err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  }
}

const profile = new ProfileGenerator()
profile.promptUserName()