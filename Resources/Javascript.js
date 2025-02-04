let _todayDate = new Date();

if (window.location.pathname.endsWith("index.html")) {
    LoadHomepage();
} else {
    ReplaceCurrentYearPlaceholder();
}

function LoadHomepage() {
    ReplacePlaceholders();
    LoadGithubProjects(999, 16);
}

function ReplacePlaceholders() {
    document.getElementById("loading-text").innerHTML = "Projekte werden geladen!";

    ReplaceAgePlaceholder();
    ReplaceCurrentYearPlaceholder();
}

function ReplaceAgePlaceholder() {
    let birthDate = new Date('2009-03-03');
    let diffTime = Math.abs(_todayDate - birthDate);
    let diffTimeInYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    let age = diffTimeInYears.toFixed(1);
    document.body.innerHTML = document.body.innerHTML.replace("%AGE%", age);
}

function ReplaceCurrentYearPlaceholder() {
    let fullCurrentYear = _todayDate.getFullYear();
    document.body.innerHTML = document.body.innerHTML.replace("%CURRENT_YEAR%", fullCurrentYear);
}

function LoadGithubProjects(numberOfLoadedRepositories, numberOfShownRepositories) {
    const sortOnKey = (key, descending) => {
        return (a, b) => {
            a = a[key];
            b = b[key];
            return descending ? b - a : a - b;
        };
    }

    fetch(`https://api.github.com/users/fraujulian/repos?per_page=${numberOfLoadedRepositories}`)
        .then((rawResponse) => rawResponse.json())
        .then((allProjects) => {
            allProjects = allProjects.sort(sortOnKey("stargazers_count", true));

            let projectsDiv = document.getElementById("github_projects");
            projectsDiv.innerHTML = "";
            projectsDiv.classList = "";

            for (let currentProjectIndex = 0; currentProjectIndex < numberOfShownRepositories; currentProjectIndex++) {
                let currentProjectDiv = document.createElement("div");
                currentProjectDiv.classList = "card hoverable";

                let currentProject = allProjects[currentProjectIndex];

                if (currentProject !== undefined &&
                    currentProject.fork !== true) {
                    if (currentProject.description == null) currentProject.description = "";
                    if (currentProject.language == null) currentProject.language = "";

                    currentProject.name = currentProject.name
                        .replaceAll("_", " ")
                        .replaceAll("-", " ");

                    currentProjectDiv.innerHTML = `
                    <div class="media">
                        <div class="media-body">
                            <a href="${currentProject.html_url}">
                                <strong class="d-block text-gray-dark">${currentProject.name}</strong>
                            </a>
                            <div class="stars">
                                ${currentProject.language}
                                <i class="far fa-star stargazers"></i>${currentProject.stargazers_count}
                            </div>
                        </div>
                        <p>${currentProject.description}</p>
                    </div>
                    `;

                    fetch(`https://raw.githubusercontent.com/${currentProject.full_name}/${currentProject.default_branch}/README.md`)
                        .then((rawResponse) => rawResponse.text())
                        .then((readmeText) => {
                            let markdownToHtmlConverter = new showdown.Converter();
                            let readmeInHtml = markdownToHtmlConverter.makeHtml(readmeText);

                            let projectReadmeModalDiv = document.createElement("div");
                            projectReadmeModalDiv.classList = "modal github-modal hidden";

                            projectReadmeModalDiv.innerHTML = `
                            <div class="card">
                                <a onclick="" id="projectReadmeModalDiv-Close" style="float: right"> ❌</a>
                                <a href="${currentProject.html_url}"> Visit on GitHub</a>
                                <br>
                                <br>
                                ${readmeInHtml}
                            </div>
                            `;

                            currentProjectDiv.onclick = function () {
                                projectReadmeModalDiv.classList.remove("hidden");
                                document.body.scrollTop = 0;
                                document.documentElement.scrollTop = 0;
                                document.body.style.opacity = 0.2.toString();
                            }

                            projectReadmeModalDiv.onclick = function (mouseClick) {
                                if (mouseClick.target === projectReadmeModalDiv ||
                                    mouseClick.target === document.getElementById("projectReadmeModalDiv-Close")) {
                                    projectReadmeModalDiv.classList.add("hidden");
                                    document.body.style.opacity = 1.0.toString();
                                }
                            }

                            document
                                .getElementsByTagName("html")[0]
                                .appendChild(projectReadmeModalDiv);
                        });

                    projectsDiv.appendChild(currentProjectDiv);
                }
            }
        });
}

let _shortBioTextButton = document.getElementById("short-bio-text");
let _longBioText = document.getElementsByClassName("long-bio-text")[0];
let _isLongBioTextShown = true;

_shortBioTextButton.onclick = function () {
    let leftArrow = document.getElementById("left-arrow");
    let rightArrow = document.getElementById("right-arrow");

    if (_isLongBioTextShown) {
        _longBioText.classList.remove("hidden");
        leftArrow.classList.remove("fa-arrow-right");
        leftArrow.classList.add("fa-arrow-down");
        rightArrow.classList.remove("fa-arrow-left");
        rightArrow.classList.add("fa-arrow-down");
        leftArrow.style.position = "relative";
        rightArrow.style.position = "relative";
        FadeOut(_longBioText);
    } else {
        _longBioText.classList.add("hidden");
        leftArrow.classList.remove("fa-arrow-down");
        leftArrow.classList.add("fa-arrow-right");
        rightArrow.classList.remove("fa-arrow-down");
        rightArrow.classList.add("fa-arrow-left");
        leftArrow.style.position = "relative";
        rightArrow.style.position = "relative";
        FadeIn(_longBioText);
    }

    _isLongBioTextShown = !_isLongBioTextShown;
};

_longBioText.onclick = function (mouseClick) {
    if (mouseClick.target === _longBioText) {
        _longBioText.classList.add("hidden");
        document.body.style.opacity = 1.0.toString();
    }
};

function FadeOut(element) {
    let currentOpacity = 1;
    const fadeInterval = setInterval(() => {
        if (currentOpacity <= 0.1) {
            clearInterval(fadeInterval);
            element.style.display = 'none';
            return;
        }

        setElementOpacity(element, currentOpacity);
        currentOpacity *= 0.9;
    }, 5);
}

function FadeIn(element) {
    let currentOpacity = 0.1;
    element.style.display = 'block';
    const fadeInterval = setInterval(() => {
        if (currentOpacity >= 1) {
            clearInterval(fadeInterval);
            return;
        }

        setElementOpacity(element, currentOpacity);
        currentOpacity *= 1.1;
    }, 5);
}

function setElementOpacity(element, opacity) {
    const opacityPercentage = opacity * 100;
    element.style.opacity = opacity;
    element.style.filter = `alpha(opacity=${opacityPercentage})`;
}
