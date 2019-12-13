## Developer Profile to PDF

### Overview
Retrieve the Github profile of each employed developer as a simple one-page PDF file. To generate a profile, simply start typing the developer's name at the prompt to filter the directory, or use the arrow keys to navigate through the list. Then choose you preferred color palatte and your profile will be generated immediately. Features inquirer autocomplete prompt and fuzzy for fast and simple list filtering.

#### Enhancements and Fixes
- One of my biggest challenges was how to serve my css style files to the PDF generator, which unfortunately I was not able to solve before submission. I definitely want to update the generator so that it observes the css stylesheets and can account for the user's chosed colour palatte.

- Automatically open the generated PDF in a new tab

- Refactor how I call the Developer and Palatte JSON data to use promises
