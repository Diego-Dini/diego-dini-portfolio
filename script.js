
main()

async function main() {
    const information = await loadInformation();
    setName(information.name)
    setTitles(information.titles)
    setBiography(information.biography)
    setSoftSkills(information.soft_skills)
    setHardSkills(information.hard_skills)
    setProjects(information.projects)
}

async function loadInformation() {
    const userLanguage = navigator.language || navigator.userLanguage;
    let fetchLink = ""
    if(userLanguage == "pt-BR") {
        fetchLink = "./assets/information-pt-BR.json"
    } else {
        fetchLink = "./assets/information-en-US.json"
    }

    try {
        const response = await fetch(fetchLink);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Failed to load information:', err);
        return null; // or handle the error as needed
    }
}

function setName(name) {
    const nameContainer = document.getElementById("personal-name")
    nameContainer.innerText = name
}

function setTitles(titles) {
   const titlesContainer = document.getElementById("personal-titles")
    titlesContainer.innerText = titles
}

function setBiography(biography) {
    const biographyContainer = document.getElementById("personal-biography")
    biographyContainer.innerText = biography
}

function setSoftSkills(softSkillsList) {
    const softSkillsContainer = document.getElementById("soft-skills-list")
    softSkillsList.forEach(skill => {
        const newSkill = document.createElement("li")
        newSkill.className = "soft"
        newSkill.innerText = skill
        softSkillsContainer.appendChild(newSkill)
    });
    

}

function setHardSkills(hardSkillsList) {
    const hardSkillsContainer = document.getElementById("hard-skills-list")
    hardSkillsList.forEach(skill => {
        const newSkill = document.createElement("li")
        newSkill.className = "hard"
        newSkill.innerText = skill
        hardSkillsContainer.appendChild(newSkill)
    });
}

function setProjects(projectsList) {
    const projectsListContainer = document.getElementById("projects-list")
    projectsList.forEach(project => {
        const newProjectDiv = document.createElement("div")
        const newProjectImg = document.createElement("img")
        const newProjectH3 = document.createElement("h3")

        newProjectDiv.appendChild(newProjectImg)
        newProjectDiv.appendChild(newProjectH3)

        newProjectDiv.className = "project"

        newProjectImg.src = project.img_src
        newProjectImg.alt = project.title

        newProjectH3.innerText = project.title
        
        projectsListContainer.appendChild(newProjectDiv)
    })
}

function setRoadMap() {

}