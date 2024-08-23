const rotationSpeed = 0.05;

const maxProjectDisplay = 24;
const magnitude = 81;

const mainAngle = 360 / maxProjectDisplay

// Get the circle container element and initialize rotation degree
const projectDisplayContainer = document.getElementById("project-display"); // div
const circleContainer = document.getElementById("circle-container"); // div
let circleRotation = -1;
let rotationDir = 1;


// Call setup_page function to initialize the page content
setupPage();


setInterval(() => {
    circleRotation += rotationSpeed * rotationDir
    
    circleContainer.style.transform = `rotate(-${circleRotation}deg)`;
    // Calculate child index
    const childIndex = Math.floor(circleRotation / mainAngle);

    // Get all child elements
    const children = projectDisplayContainer.children;

    // Ensure the childIndex is within bounds
    if (childIndex >= 0 && childIndex < children.length) {
        for (let i = 0; i < children.length; i++) {
            children[i].style.opacity = 0.5;
        }
        if(childIndex + 1 >= children.length) {
            children[0].style.opacity = 1;
        } else {
            children[childIndex+1].style.opacity = 1;
        }

    }
    if (circleRotation >= 360-mainAngle) circleRotation = -mainAngle;
}, 50);


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
            setProject(json.projects);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Function to display projects in a circular layout
function setProject(projects) {
    for (let i = 0; i < maxProjectDisplay; i++) {
        let pos = getProjectCoord(i * mainAngle, magnitude);
        let newProject = document.createElement("div");
        let newProjectImg = document.createElement("img");
        newProject.appendChild(newProjectImg)
        newProjectImg.src = "assets/photo.png";
        newProjectImg.className = "project-img";
        newProject.className = "project-img";
        newProject.style.transform = `rotate(${i * mainAngle}deg)`
        newProject.style.left = `${pos.x}vw`;
        newProject.style.top = `${pos.y}vw`;

        // Set opacity for projects other than the first one
        if (i > 0) {
            newProject.style.opacity = 0.5;
        }

        projectDisplayContainer.appendChild(newProject);
    }
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

    return { x: x, y: y };
}
