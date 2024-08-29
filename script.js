// Referências aos elementos DOM
const projectsListContainer = document.getElementById("projects-list");
const currentProjectContainer = document.getElementById("current-project");

// Variáveis globais
let loadedProjects = [];
let projectSegment = null;
let currentProject = 0;
let defaultDisplayPos = null;
let maxDisplayPos = null;
let minDisplayPos = null;

/**
 * Atualiza a visualização do projeto atual.
 */
function updateCurrentProject() {
    const currentProjectTitle = document.getElementById("current-project-title");
    const currentProjectTags = document.getElementById("current-project-tags");
    const currentProjectDescription = document.getElementById("current-project-description");

    const project = loadedProjects[currentProject];

    currentProjectTitle.innerHTML = project.title;
    currentProjectTags.innerHTML = project.tags.reduce((acc, tag) => acc + `<li>${tag}</li>`, "");
    currentProjectDescription.innerHTML = project.description;

    currentProjectContainer.style.opacity = 1;
    const currentProjectDisplayContainer = document.getElementById(`project-display-${currentProject}`);
    currentProjectDisplayContainer.style.opacity = 1;
}

/**
 * Navega para o próximo projeto.
 */
function nextProject() {
    projectsListContainer.scrollTo({
        left: maxDisplayPos + 1,
        behavior: 'smooth'
    });
    hideProjects();
}

/**
 * Navega para o projeto anterior.
 */
function previousProject() {
    projectsListContainer.scrollTo({
        left: minDisplayPos - 1,
        behavior: 'smooth'
    });
    hideProjects();
}

/**
 * Oculta a lista de projetos e mostra apenas o projeto atual.
 */
function hideProjects() {
    currentProjectContainer.style.opacity = 0;

    Array.from(projectsListContainer.children).forEach(child => {
        child.style.opacity = 0.5;
    });
}

/**
 * Ajusta a rolagem do contêiner de projetos para a posição fornecida.
 * @param {number} newPos - A nova posição de rolagem.
 */
function overrideProjectFocus(newPos = defaultDisplayPos) {
    projectsListContainer.scrollLeft = newPos;
}

/**
 * Atualiza as posições de rolagem para navegação entre projetos.
 */
function updateDisplayPositions() {
    const scrollWidth = projectsListContainer.scrollWidth;
    projectSegment = scrollWidth / projectsListContainer.children.length;

    const marginCorrection = 20;
    defaultDisplayPos = projectSegment * 1.5 + marginCorrection;
    maxDisplayPos = projectSegment * 2.5 + marginCorrection;
    minDisplayPos = projectSegment * 0.5 + marginCorrection;
}

/**
 * Carrega as informações do projeto a partir de um arquivo JSON com base no idioma do usuário.
 * @returns {Object|null} - Dados dos projetos ou null em caso de erro.
 */
async function loadInformation() {
    const userLanguage = navigator.language || navigator.userLanguage;
    const fetchLink = userLanguage === "pt-BR" ? "./assets/information-pt-BR.json" : "./assets/information-en-US.json";

    try {
        const response = await fetch(fetchLink);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (err) {
        console.error('Failed to load information:', err);
        return null; // ou lide com o erro conforme necessário
    }
}

/**
 * Configura a lista de habilidades no DOM.
 * @param {Array<string>} skillList - Lista de habilidades.
 * @param {string} type - Tipo de habilidade ('soft' ou 'hard').
 */
function setSkills(skillList, type) {
    const skillsContainer = document.getElementById(`${type}-skills-list`);
    skillList.forEach(skill => {
        const newSkillHTML = `<li class="soft">${skill}</li>`;
        skillsContainer.innerHTML += newSkillHTML;
    });
}

/**
 * Configura a lista de projetos no DOM.
 * @param {Array<Object>} projectsList - Lista de projetos.
 */
function setProjects(projectsList) {
    for (let i = -2; i < projectsList.length - 2; i++) {
        const nextProjectId = i < 0 ? projectsList.length + i : i;
        const project = projectsList[nextProjectId];
        const newProject = (
            `<div id="project-display-${nextProjectId}" class="project">
                <img src="${project.img_src}" alt="${project.title}">
            </div>`
        );

        projectsListContainer.innerHTML += newProject;
    }
}

/**
 * Configura o roadmap (linha do tempo) no DOM.
 * @param {Array<Object>} roadMap - Lista de anos e conquistas.
 */
function setRoadMap(roadMap) {
    const yearsContainer = document.getElementById("years-container");

    roadMap.forEach((year, i) => {
        const achievements = year.achievements.reduce((acc, achievement) => acc + `<li>${achievement}</li>`, "");
        const yearSide = i % 2 === 0 ? "right" : "left";

        const newYear = (
            `<div class="title half year ${yearSide}">
                <h2 class="right ${yearSide}">${year.number}</h2>
                <div class="line ${yearSide}">
                    <hr class="line line-1">
                    <hr class="line line-2">
                    <hr class="line line-3">
                </div>
                <ul>
                    ${achievements}
                </ul>
            </div>`
        );

        yearsContainer.innerHTML += newYear;
    });

    const verticalLineContainer = document.getElementById("vertical-line");
    const lineHeight = roadMap.length * 200 + 100;
    verticalLineContainer.style.width = lineHeight + "px";
    verticalLineContainer.style.top = lineHeight / 2 - 10 + "px";
    yearsContainer.style.height = lineHeight - 50 + "px";
}

/**
 * Inicializa os eventos e configurações do projeto.
 */
function init() {
    projectsListContainer.addEventListener("scroll", (event) => {
        const scrollLeft = projectsListContainer.scrollLeft;

        if (scrollLeft >= maxDisplayPos) {
            projectsListContainer.append(projectsListContainer.children[0]);
            currentProject += 1;
        } else if (scrollLeft <= minDisplayPos) {
            projectsListContainer.insertBefore(projectsListContainer.lastChild, projectsListContainer.firstChild);
            currentProject -= 1;
        } else return;

        const childrenLength = projectsListContainer.children.length;
        if (currentProject >= childrenLength) currentProject = 0;
        else if (currentProject < 0) currentProject = childrenLength - 1;

        updateCurrentProject();
        overrideProjectFocus();
    });

    document.addEventListener("touchend", () => {
        projectsListContainer.scrollTo({
            left: defaultDisplayPos,
            behavior: 'smooth'
        });
    });

    window.addEventListener("resize", () => {
        updateDisplayPositions();
        overrideProjectFocus();
    });
}

/**
 * Função principal que carrega e configura as informações da página.
 */
async function main() {
    const information = await loadInformation();

    if (information) {
        const nameContainer = document.getElementById("personal-name");
        nameContainer.innerHTML = information.name;

        const titlesContainer = document.getElementById("personal-titles");
        titlesContainer.innerHTML = information.titles;

        const biographyContainer = document.getElementById("personal-biography");
        biographyContainer.innerHTML = information.biography;

        setSkills(information.soft_skills, "soft");
        setSkills(information.hard_skills, "hard");

        setProjects(information.projects);
        loadedProjects = information.projects;
        setRoadMap(information.road_map);

        hideProjects();
        updateCurrentProject();

        updateDisplayPositions();
        overrideProjectFocus();

        document.getElementById("main-container").style.visibility = "visible";
    }
}

// Inicializa os eventos e carrega as informações.
init();
main();
