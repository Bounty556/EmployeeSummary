const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const templatesDir = path.resolve(__dirname, 'templates');

const render = require("./lib/htmlRenderer");

const managerQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of your team\'s manager?',
        validate: nameValidation
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is your team manager\'s id?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your team manager\'s email?',
        validate: emailValidation
    },
    {
        type: 'input',
        name: 'officeNumber',
        message: 'What is the number of the office that they manage?',
        validate: numberValidation
    }
];

const engineerQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the Engineer?',
        validate: nameValidation
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is the Engineer\'s ID?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is the Engineer\'s email?',
        validate: emailValidation
    },
    {
        type: 'input',
        name: 'github',
        message: 'What is the Engineer\'s github username?',
        validate: userNameValidation
    }
];

const internQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the Intern?',
        validate: nameValidation
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is the Intern\'s ID?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is the Intern\'s email?',
        validate: emailValidation
    },
    {
        type: 'input',
        name: 'school',
        message: 'What school does the Intern attend?',
        validate: nameValidation
    }
];

const followupQuestion = [
    {
        type: 'list',
        name: 'response',
        message: 'What would you like to do next?',
        choices: [
            'Add an Engineer',
            'Add an Intern',
            'Finish'
        ]
    }
];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

let employees = [];

// Begin question chain for user
askManagerInfo();

// Grabs the managers info
function askManagerInfo() {
    inquirer.prompt(managerQuestions)
        .then(answers => {
            let {name, id, email, officeNumber} = answers;

            // Add manager to employee array
            employees.push(new Manager(name, id, email, officeNumber));

            askFollowupQuestion();
        });
}

// Ask whether user wants to add another employee, or stop
function askFollowupQuestion() {
    inquirer.prompt(followupQuestion)
        .then(answer => {
            let {response} = answer;

            switch (response) {
                case 'Add an Engineer':
                    askEngineerInfo();
                    break;
                case 'Add an Intern':
                    askInternInfo();
                    break;
                case 'Finish':
                default:
                    renderHTML();
            }
        });
}

function askEngineerInfo() {
    inquirer.prompt(engineerQuestions)
        .then(answers => {
            let {name, id, email, github} = answers;

            // Add engineer to employee array
            employees.push(new Engineer(name, id, email, github));

            askFollowupQuestion();
        });
}

function askInternInfo() {
    inquirer.prompt(internQuestions)
        .then(answers => {
            let {name, id, email, school} = answers;

            // Add intern to employee array
            employees.push(new Intern(name, id, email, school));

            askFollowupQuestion();
        });
}

// Grabs template main html and inserts the generated html into it, finally writing it out to main.html
function renderHTML() {
    const generatedHTML = render(employees);
    let mainTemplateHTML = fs.readFileSync(path.join(templatesDir, 'main.html'), 'utf-8');

    // Insert our generated HTML into the main template HTML
    mainTemplateHTML = mainTemplateHTML.replace(/{{ team }}/, generatedHTML);

    // Make the output folder if it doesn't exist yet
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFileSync(outputPath, mainTemplateHTML);

    console.log(`Done! Your generated team.html file can be found in the ${OUTPUT_DIR} folder.`);
}

function nameValidation(userInput) {
    // Only use characters and spaces
    return /^[a-zA-Z ]+$/.test(userInput)
}

function numberValidation(userInput) {
    // Only use numbers
    return /^[1234567890]+$/.test(userInput);
}

function userNameValidation(userInput) {
    // Don't use spaces
    return /^[^\s]+$/.test(userInput);
}

function emailValidation(userInput) {
    // any number of characters, then an @ symbol, then any number of characters, then a period, than any number of characters
    return /^[^@\s]+@[a-zA-Z]+.[a-zA-Z]+$/.test(userInput);
}