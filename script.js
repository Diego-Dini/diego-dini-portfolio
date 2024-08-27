const rotationSpeed = 0.05;

const maxProjectDisplay = 24;
const magnitude = 90;

const mainAngle = 360 / maxProjectDisplay

// Get the circle container element and initialize rotation degree
const projectRoullet = document.getElementById("project-roullet") // div
const projectDisplayContainer = document.getElementById("project-display"); // div
const circleContainer = document.getElementById("circle-container"); // div
let circleRotation = -360 + mainAngle;
const initialDir = -1;
let rotationDir = -1;

let currentProject = null
let projects = []

const currentProjectTitle = document.getElementById("current-project-title")
const currentProjectDescription = document.getElementById("current-project-description")
const currentProjectTags = document.getElementById("current-project-tags")


// Call setup_page function to initialize the page content
setupPage();


setInterval(() => {
        currentProject += 1
        if (currentProject >= maxProjectDisplay) {
            currentProject = 0
        }

        let children = projectDisplayContainer.children

        for (let i = 0; i < children.length; i++){
            children[i].style.opacity = 0.25
        }

        circleRotation = currentProject * mainAngle
        circleContainer.style.transform = `rotate(${-circleRotation}deg)`
        circleContainer.style.opacity = 1;
        children[currentProject].style.opacity = 1;
        setCurrentProject(projects[currentProject])
}, 5000); 



// Function to set up the page by fetching data and updating content
function setupPage() {
    // Select elements by ID
    const aboutNameElement = document.getElementById("about-name"); // h1
    const aboutTitleElement = document.getElementById("about-titles"); // h2
    const aboutResumeElement = document.getElementById("about-resume"); // h3

    // Fetch data from the JSON file
    fetch("assets/information.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(json => {
            // Update the page content with fetched data
            aboutNameElement.textContent = json.name;
            aboutTitleElement.textContent = json.titles;
            aboutResumeElement.textContent = json.resume;

            setSoftSkills(json.soft_skills);
            setHardSkills(json.hard_skills);

            projects = json.projects
            setCurrentProject(projects[0])
            setProject(json.projects);

            

        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Function to display projects in a circular layout
function setProject(new_projects) {
    const addNewProjectDisplay = (projectDisplayID, pos, src = "assets/place_holder.png", alt = "nothing here") => {

        let newProjectImg = document.createElement("img");
        newProjectImg.alt = alt;
        newProjectImg.src = src;
        newProjectImg.className = "project-img";

        let newProjectDisplay = document.createElement("div");
        newProjectDisplay.appendChild(newProjectImg)
        newProjectDisplay.id = `project-display-${projectDisplayID}`
        newProjectDisplay.className = "project-img";
        newProjectDisplay.style.transform = `rotate(${projectDisplayID * mainAngle}deg)`
        newProjectDisplay.style.left = `${pos.x}vw`;
        newProjectDisplay.style.top = `${pos.y}vw`;

        // Set opacity for projects other than the first one
        if (projectDisplayID > 0) {
            newProjectDisplay.style.opacity = 0.5;
        }
        projectDisplayContainer.appendChild(newProjectDisplay);
    }
    let cicleCounter = 0
    for (let i = 0; i < maxProjectDisplay; i++) {
        let pos = getProjectCoord(i * mainAngle, magnitude);
        let indexCorrention = cicleCounter * new_projects.length
        if (i >= new_projects.length) {
            cicleCounter ++
            
        } 
        let nextNewProject = new_projects[i-indexCorrention]
        addNewProjectDisplay(i, pos, nextNewProject.display_img_src, nextNewProject.title)
        projects.push(nextNewProject)
    }
}

function setCurrentProject(project) { 
    currentProjectTitle.innerText = project.title;
    currentProjectDescription.innerText = project.description;
    currentProjectTags.innerHTML = project.tags.map(item => `#${item}`).join(' <br> ') + ' <br>';
}

// Function to display soft skills
function setSoftSkills(softSkills) {
    const softSkillClass = "secondary-text skill-item";
    const softSkillsContainer = document.getElementById("soft-skill-container"); // div

    softSkills.forEach(skill => {
        let newSkill = document.createElement("p");
        newSkill.className = softSkillClass;
        newSkill.textContent = `#${skill}`;
        softSkillsContainer.appendChild(newSkill);
    });
}

// Function to display hard skills
function setHardSkills(hardSkills) {
    const hardSkillClass = "secondary-text skill-item right";
    const hardSkillsContainer = document.getElementById("hard-skill-container"); // div

    hardSkills.forEach(skill => {
        let newSkill = document.createElement("p");
        newSkill.className = hardSkillClass;
        newSkill.textContent = `#${skill}`;
        hardSkillsContainer.appendChild(newSkill);
    });
}

// Function to calculate coordinates for project display in a circular layout
function getProjectCoord(angle, magnitude) {
    let adjustedAngle = angle - 90; // Adjust the angle to start from the top

    let angleRad = adjustedAngle * (Math.PI / 180); // Convert angle to radians

    let x = magnitude * Math.cos(angleRad);
    let y = magnitude * Math.sin(angleRad);
    console.log(`angle: ${adjustedAngle} x:${x}`)
    return { x: x, y: y };
}