let _pathName = window.location.pathname;
let _knowledgeIndex = 0;
let _todayDate = new Date();
let _birthdayDate = "2009-03-03";
let _numberOfLoadedRepositories = 999;
let _numberOfShownRepositories = 999;
let _customProjects = [
    {
        "Title": "Azure Devops Effort Tracker",
        "Description": "🕙 A desktop application to track the effort of your work items in azure devops.",
        "Language": "C# - Avalonia",
        "Link": ""
    },
    {
        "Title": "SynRadio",
        "Description": "🖥️ An internet radio station that is available on various media.",
        "Language": "TS | JS | HTML | CSS",
        "Link": "https://www.synradio.de/"
    },
    {
        "Title": "SynHost",
        "Description": "❓ A support system integrating various platforms and media to offer employees a unified overview.",
        "Language": "TS | JS",
        "Link": "https://www.synhost.de/"
    }];

if (_pathName.endsWith("/IMPRINT/index.html") || _pathName.endsWith("/IMPRINT/")) {
    ReplaceCurrentYearPlaceholder();
} else {
    LoadHomepage();
}

function LoadHomepage() {
    ReplacePlaceholders();
    LoadGithubProjects();
    KnowledgeCarousel();
}

function ReplacePlaceholders() {
    document.getElementById("loading-text").innerHTML = "Projekte werden geladen!";

    ReplaceAgePlaceholder();
    ReplaceCurrentYearPlaceholder();
}

function ReplaceAgePlaceholder() {
    let birthDate = new Date(_birthdayDate);
    let diffTime = Math.abs(_todayDate - birthDate);
    let diffTimeInYearsCalculation = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    let tempAge = diffTimeInYearsCalculation.toFixed(1)
    let age = tempAge % 1 === 0 ? diffTimeInYearsCalculation.toFixed(0) : diffTimeInYearsCalculation.toFixed(1);
    document.body.innerHTML = document.body.innerHTML.replace("%AGE%", age);
}

function ReplaceCurrentYearPlaceholder() {
    let fullCurrentYear = _todayDate.getFullYear().toString();
    document.body.innerHTML = document.body.innerHTML.replace("%CURRENT_YEAR%", fullCurrentYear);
}

function KnowledgeCarousel() {
    let bioContainer = document.getElementsByClassName("bio")[0];
    let rawListItems = bioContainer.getElementsByTagName("div");
    bioContainer.style = "display: grid !important;";

    for (let i = 1; i < rawListItems.length; i++) {
        rawListItems[i].style = "display: none;";
    }

    _knowledgeIndex++;

    if (_knowledgeIndex > rawListItems.length || _knowledgeIndex === 1) {
        _knowledgeIndex = 2
    }

    rawListItems[_knowledgeIndex - 1].style.display = "block";

    setTimeout(KnowledgeCarousel, 1000);
}

function LoadGithubProjects() {
    const sortOnKey = (key, descending) => {
        return (a, b) => {
            a = a[key];
            b = b[key];
            return descending ? b - a : a - b;
        };
    }

    fetch(`https://api.github.com/users/fraujulian/repos?per_page=${_numberOfLoadedRepositories}`)
        .then((rawResponse) => rawResponse.json())
        .then((allProjects) => {
            allProjects = allProjects.sort(sortOnKey("stargazers_count", true));

            let projectsDiv = document.getElementById("github_projects");
            projectsDiv.innerHTML = "";
            projectsDiv.classList = "";

            for (let i = 0; i < _customProjects.length; i++) {
                let currentProjectDiv = document.createElement("div");
                currentProjectDiv.classList = "card hoverable";

                currentProjectDiv.innerHTML = `
                    <div class="media">
                        <div class="media-body">
                            <a href="${_customProjects[i].Link}">
                                <strong class="d-block text-gray-dark">${_customProjects[i].Title}</strong>
                            </a>
                            <div class="stars">
                                ${_customProjects[i].Language}
                            </div>
                        </div>
                        <p>${_customProjects[i].Description}</p>
                    </div>
                    `;

                projectsDiv.appendChild(currentProjectDiv);
            }

            for (let currentProjectIndex = 0; currentProjectIndex < _numberOfShownRepositories; currentProjectIndex++) {
                let currentProjectDiv = document.createElement("div");
                currentProjectDiv.classList = "card hoverable";

                let currentProject = allProjects[currentProjectIndex];

                if (currentProject === undefined || currentProject.fork === true) return;
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
                                <a id="projectReadmeModalDiv-Close" style="float: right; cursor: pointer;">❌</a>
                                <a href="${currentProject.html_url}">Visit on GitHub</a>
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
        });
}

let longBioText = document.getElementsByClassName("long-bio-text")[0];
let isLongBioTextShown = false;

document.getElementById("short-bio-text").onclick = function () {
    let leftArrow = document.getElementById("left-arrow");
    let rightArrow = document.getElementById("right-arrow");

    isLongBioTextShown = !isLongBioTextShown;

    if (isLongBioTextShown) {
        longBioText.classList.remove("hidden");
        leftArrow.classList.remove("fa-arrow-right");
        leftArrow.classList.add("fa-arrow-down");
        rightArrow.classList.remove("fa-arrow-left");
        rightArrow.classList.add("fa-arrow-down");
        leftArrow.style.position = "relative";
        rightArrow.style.position = "relative";
        FadeIn(longBioText);
    } else {
        longBioText.classList.add("hidden");
        leftArrow.classList.remove("fa-arrow-down");
        leftArrow.classList.add("fa-arrow-right");
        rightArrow.classList.remove("fa-arrow-down");
        rightArrow.classList.add("fa-arrow-left");
        leftArrow.style.position = "relative";
        rightArrow.style.position = "relative";
        FadeOut(longBioText);
    }
};

longBioText.onclick = function (mouseClick) {
    if (mouseClick.target === longBioText) {
        longBioText.classList.add("hidden");
        document.body.style.opacity = 1.0.toString();
    }
};

function FadeOut(element) {
    let transparency = 1;
    const interval = setInterval(() => {
        if (transparency <= 0.1) {
            clearInterval(interval)
            element.style.display = 'none';
            return;
        }

        transparency *= 0.9;
        ApplyTransparency(element, transparency);
    }, 5);
}

function FadeIn(element) {
    let transparency = 0.1;
    element.style.display = 'block';
    const interval = setInterval(() => {
        if (transparency >= 1) {
            clearInterval(interval);
            ApplyTransparency(element, 1);
            return;
        }

        transparency *= 1.1;
        ApplyTransparency(element, transparency);
    }, 5);
}

function ApplyTransparency(element, transparency) {
    element.style.opacity = transparency;
    element.style.filter = `alpha(opacity=${Math.round(transparency * 100)})`;
}
