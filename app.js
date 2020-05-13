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
        message: 'What is the name of your team\'s manager?'
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is your team manager\'s id?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is your team manager\'s email?'
    },
    {
        type: 'number',
        name: 'officeNumber',
        message: 'What is the number of the office that they manage?'
    }
];

const engineerQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the Engineer?'
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is the Engineer\'s ID?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is the Engineer\'s email?'
    },
    {
        type: 'number',
        name: 'github',
        message: 'What is the Engineer\'s github username?'
    }
];

const internQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the Intern?'
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is the Intern\'s ID?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is the Intern\'s email?'
    },
    {
        type: 'number',
        name: 'school',
        message: 'What school does the Intern attend?'
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

start();

// Begin question chain for user
function start() {
    askManagerInfo();
}

// Grabs the managers info
function askManagerInfo() {
    inquirer.prompt(managerQuestions)
        .then(answers => {
            let {name, id, email, officeNumber} = answers;

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

            employees.push(new Engineer(name, id, email, github));

            askFollowupQuestion();
        });
}

function askInternInfo() {
    inquirer.prompt(internQuestions)
        .then(answers => {
            let {name, id, email, school} = answers;

            employees.push(new Intern(name, id, email, school));

            askFollowupQuestion();
        });
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

function renderHTML() {
    const generatedHTML = render(employees);
    let mainTemplateHTML = fs.readFileSync(path.join(templatesDir, 'main.html'), 'utf-8');

    mainTemplateHTML = mainTemplateHTML.replace(/{{ team }}/, generatedHTML);

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFileSync(outputPath, mainTemplateHTML);

    console.log('Done');
}

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
