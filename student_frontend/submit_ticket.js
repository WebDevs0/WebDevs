

// Where server.js is running
const API_URL = "http://localhost:5001";

// ---------- Building list for the search box ----------
// To add a building, add a line here. "group" shows in small text next to the name.
const BUILDINGS = [
    { name: "Willis Library", group: "Library" },
    { name: "Sycamore Hall", group: "Academic" },
    { name: "Sycamore Library", group: "Library" },
    { name: "General Academic Building (GAB)", group: "Academic" },
    { name: "Gateway Center", group: "Academic" },
    { name: "Sage Hall", group: "Academic" },
    { name: "Chilton Hall", group: "Academic" },
    { name: "Art Building", group: "Academic" },
    { name: "Music Building", group: "Academic" },
    { name: "Radio, TV, Film & Performing Arts", group: "Academic" },
    { name: "Auditorium Building", group: "Academic" },
    { name: "Bain Hall", group: "Academic" },
    { name: "Business Leadership Building (BLB)", group: "Academic" },
    { name: "Chemistry Building", group: "Academic" },
    { name: "Curry Hall", group: "Academic" },
    { name: "Dance and Theater", group: "Academic" },
    { name: "Environmental Science Building (ENV)", group: "Academic" },
    { name: "Hickory Hall", group: "Academic" },
    { name: "Hurley Administration Building", group: "Academic" },
    { name: "Language Building", group: "Academic" },
    { name: "Life Sciences Complex", group: "Academic" },
    { name: "Marquis Hall", group: "Academic" },
    { name: "Matthews Hall", group: "Academic" },
    { name: "Physics Building", group: "Academic" },
    { name: "Science Research Building", group: "Academic" },
    { name: "Terrill Hall", group: "Academic" },
    { name: "Wooten Hall", group: "Academic" },
    { name: "University Union", group: "Student services" },
    { name: "Eagle Student Services Center", group: "Student services" },
    { name: "Pohl Recreation Center", group: "Student services" },
    { name: "Welcome Center", group: "Student services" },
    { name: "Coliseum", group: "Student services" },
    { name: "Bruce Hall", group: "Residence hall" },
    { name: "Clark Hall", group: "Residence hall" },
    { name: "Crumley Hall", group: "Residence hall" },
    { name: "Honors Hall", group: "Residence hall" },
    { name: "Joe Greene Hall", group: "Residence hall" },
    { name: "Kerr Hall", group: "Residence hall" },
    { name: "Legends Hall", group: "Residence hall" },
    { name: "Maple Street Hall", group: "Residence hall" },
    { name: "McConnell Hall", group: "Residence hall" },
    { name: "Mozart Square Hall", group: "Residence hall" },
    { name: "Rawlins Hall", group: "Residence hall" },
    { name: "Santa Fe Square Hall", group: "Residence hall" },
    { name: "Traditions Hall", group: "Residence hall" },
    { name: "Victory Hall", group: "Residence hall" },
    { name: "West Hall", group: "Residence hall" },
    { name: "Discovery Park", group: "Discovery Park" },
    { name: "Discovery Park Annex", group: "Discovery Park" },
    { name: "Frisco Landing", group: "UNT Frisco" },
    { name: "Inspire Park", group: "UNT Frisco" },
    { name: "Collin Higher Education Center", group: "Other" },
];

// ---------- Page elements ----------
const form = document.getElementById("ticket-form");
const confirmation = document.getElementById("confirmation");
const progressLabel = document.getElementById("progress-label");
const locationBox = document.getElementById("location");
const buildingFields = document.getElementById("building-fields");
const deviceFields = document.getElementById("device-fields");
const generalCategories = document.getElementById("general-categories");
const physicalCategories = document.getElementById("physical-categories");
const step2Intro = document.getElementById("step-2-intro");
const formError = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");

let currentStep = 1;

// Returns the value of the picked radio in a group, or "" if none
function getChecked(name) {
    const picked = document.querySelector(`input[name="${name}"]:checked`);
    return picked ? picked.value : "";
}

// Returns the picked category radio for the current problem type
function getCategoryInput() {
    const groupName = getChecked("issue-type") === "physical" ? "physical-category" : "general-category";
    return document.querySelector(`input[name="${groupName}"]:checked`);
}

// ---------- Show or hide fields based on what's picked ----------
function updateFields() {
    const issueType = getChecked("issue-type");
    const where = getChecked("where");
    // Continue only shows once a problem card is picked
    document.getElementById("step-1-continue").hidden = issueType === "";

    // Location only shows for physical issues
    locationBox.hidden = issueType !== "physical";
    buildingFields.hidden = where !== "building";
    deviceFields.hidden = where !== "device";

    // Step 2 shows the categories that match the problem type
    generalCategories.hidden = issueType === "physical";
    physicalCategories.hidden = issueType !== "physical";

    if (issueType === "physical") {
        step2Intro.textContent = "Physical issues go to the IT group that manages that building or device.";
    } else {
        step2Intro.textContent = "General issues go to UIT, the main campus IT help desk.";
    }
}

form.addEventListener("change", function (event) {
    if (event.target.name === "issue-type" || event.target.name === "where") {
        updateFields();
    }
    if (event.target.name === "issue-type") {
        showError("issue-type-error", false);
    }
});

// ---------- Error messages ----------
function showError(errorId, show) {
    document.getElementById(errorId).hidden = !show;
}

function markField(fieldId, bad) {
    document.getElementById(fieldId).setAttribute("aria-invalid", bad ? "true" : "false");
    showError(`${fieldId}-error`, bad);
}

// Checks one step; returns true if it's ready to move on
function validateStep(step) {
    let firstBad = null;

    function check(isBad, fieldId, errorId) {
        if (fieldId) {
            markField(fieldId, isBad);
        } else {
            showError(errorId, isBad);
        }
        if (isBad && !firstBad) {
            firstBad = fieldId
                ? document.getElementById(fieldId)
                : document.querySelector(`#${errorId}`).closest("fieldset").querySelector("input");
        }
    }

    if (step === 1) {
        const issueType = getChecked("issue-type");
        const where = getChecked("where");
        check(issueType === "", null, "issue-type-error");

        const needsBuilding = issueType === "physical" && where === "building";
        const needsCheckout = issueType === "physical" && where === "device";
        check(needsBuilding && !matchBuilding(buildingInput.value), "building");
        check(needsCheckout && document.getElementById("checkout-place").value === "", "checkout-place");
    }

    if (step === 2) {
        const visibleCategories = getChecked("issue-type") === "physical" ? physicalCategories : generalCategories;
        const noCategory = !getCategoryInput();
        showError("category-error", noCategory);
        if (noCategory && !firstBad) {
            firstBad = visibleCategories.querySelector("input");
        }

        check(document.getElementById("title").value.trim() === "", "title");
        check(document.getElementById("description").value.trim() === "", "description");
    }

    // Move the cursor to the first thing that needs fixing
    if (firstBad) {
        firstBad.focus();
        return false;
    }
    return true;
}

// ---------- Moving between steps ----------
function showStep(step) {
    currentStep = step;

    [1, 2, 3].forEach(function (n) {
        document.getElementById(`step-${n}`).hidden = n !== step;
        document.querySelector(`[data-bar="${n}"]`).classList.toggle("is-done", n <= step);
    });

    progressLabel.textContent = `Step ${step} of 3`;

    if (step === 3) {
        fillReview();
    }

    // Move focus to the new step's heading so screen readers announce it
    document.getElementById(`step-${step}-heading`).focus();
}

document.querySelectorAll("[data-go]").forEach(function (button) {
    button.addEventListener("click", function () {
        const target = Number(button.dataset.go);

        // Only check the current step when moving forward
        if (target > currentStep && !validateStep(currentStep)) {
            return;
        }
        formError.hidden = true;
        showStep(target);
    });
});

// ---------- Review screen ----------
function buildLocationText() {
    if (getChecked("issue-type") !== "physical") {
        return "";
    }

    if (getChecked("where") === "building") {
        const room = document.getElementById("room").value.trim();
        return `${buildingInput.value}${room ? `, Room ${room}` : ""}`;
    }

    const place = document.getElementById("checkout-place").value;
    const tag = document.getElementById("device-tag").value.trim();
    return `Device checked out from ${place}${tag ? `, Tag ${tag}` : ""}`;
}

function getCategoryLabel() {
    const input = getCategoryInput();
    return input ? input.closest("label").querySelector(".choice-title").textContent : "";
}

function fillReview() {
    const isPhysical = getChecked("issue-type") === "physical";

    document.getElementById("review-type").textContent = isPhysical ? "Physical issue" : "General issue";
    document.getElementById("review-location").textContent = buildLocationText();
    document.getElementById("review-category").textContent = getCategoryLabel();
    document.getElementById("review-title").textContent = document.getElementById("title").value.trim();
    document.getElementById("review-description").textContent = document.getElementById("description").value.trim();

    // Location row only for physical issues
    document.querySelectorAll(".review-location").forEach(function (row) {
        row.hidden = !isPhysical;
    });
}

// ---------- Building search box ----------
const buildingInput = document.getElementById("building");
const buildingOptions = document.getElementById("building-options");
let matches = [];
let activeIndex = -1;

// Finds a building whose name exactly matches what's typed (any capitalization)
function matchBuilding(text) {
    const typed = text.trim().toLowerCase();
    return BUILDINGS.find(function (b) {
        return b.name.toLowerCase() === typed;
    });
}

// Buildings where any word starts with what's typed. "syc" finds Sycamore Hall,
// "lib" finds Willis Library. Names that start with it are listed first.
function findMatches(text) {
    const typed = text.trim().toLowerCase();
    if (typed === "") {
        return BUILDINGS.slice();
    }

    const startsName = [];
    const startsWord = [];

    BUILDINGS.forEach(function (b) {
        const name = b.name.toLowerCase();
        if (name.startsWith(typed)) {
            startsName.push(b);
        } else if (name.split(/[\s(,&]+/).some(function (word) { return word.startsWith(typed); })) {
            startsWord.push(b);
        }
    });

    return startsName.concat(startsWord);
}

function renderList() {
    buildingOptions.innerHTML = "";

    if (matches.length === 0) {
        const empty = document.createElement("li");
        empty.className = "combo-empty";
        empty.textContent = "No buildings match. Check the spelling.";
        buildingOptions.appendChild(empty);
    }

    matches.forEach(function (b, i) {
        const li = document.createElement("li");
        li.id = `building-option-${i}`;
        li.className = "combo-option";
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
        if (i === activeIndex) {
            li.classList.add("is-active");
        }

        const name = document.createElement("span");
        name.textContent = b.name;
        const group = document.createElement("span");
        group.className = "combo-group";
        group.textContent = b.group;
        li.append(name, group);

        // mousedown (not click) so the box doesn't lose focus first
        li.addEventListener("mousedown", function (event) {
            event.preventDefault();
            chooseBuilding(b);
        });

        buildingOptions.appendChild(li);
    });

    if (activeIndex >= 0) {
        buildingInput.setAttribute("aria-activedescendant", `building-option-${activeIndex}`);
        document.getElementById(`building-option-${activeIndex}`).scrollIntoView({ block: "nearest" });
    } else {
        buildingInput.removeAttribute("aria-activedescendant");
    }
}

function openList() {
    matches = findMatches(buildingInput.value);
    activeIndex = -1;
    renderList();
    buildingOptions.hidden = false;
    buildingInput.setAttribute("aria-expanded", "true");
}

function closeList() {
    buildingOptions.hidden = true;
    buildingInput.setAttribute("aria-expanded", "false");
    buildingInput.removeAttribute("aria-activedescendant");
    activeIndex = -1;
}

function chooseBuilding(b) {
    buildingInput.value = b.name;
    markField("building", false);
    closeList();
}

buildingInput.addEventListener("input", openList);
buildingInput.addEventListener("focus", openList);
buildingInput.addEventListener("click", openList);

buildingInput.addEventListener("keydown", function (event) {
    const isOpen = !buildingOptions.hidden;

    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!isOpen) {
            openList();
        }
        activeIndex = Math.min(activeIndex + 1, matches.length - 1);
        renderList();
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderList();
    } else if (event.key === "Enter") {
        // Enter picks the highlighted building (or the only match) instead of submitting
        event.preventDefault();
        if (isOpen && activeIndex >= 0) {
            chooseBuilding(matches[activeIndex]);
        } else if (isOpen && matches.length === 1) {
            chooseBuilding(matches[0]);
        }
    } else if (event.key === "Escape") {
        closeList();
    }
});

// Close the list when leaving the box, and fix capitalization if it matches a building
buildingInput.addEventListener("blur", function () {
    const found = matchBuilding(buildingInput.value);
    if (found) {
        buildingInput.value = found.name;
    }
    closeList();
});

// ---------- Category values the server accepts ----------
// Until the backend adds "wifi" and "printing", those are sent in a way the server accepts.
let serverCategories = null;

async function loadServerCategories() {
    try {
        const res = await fetch(`${API_URL}/api/ticket-options`);
        const data = await res.json();
        serverCategories = data.categories;
    } catch (err) {
        serverCategories = null;
    }
}

function toServerCategory(value) {
    if (!serverCategories || serverCategories.includes(value)) {
        return value;
    }
    if (value === "wifi" && serverCategories.includes("network")) {
        return "network";
    }
    return "other";
}

// ---------- Submit ----------
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Pressing Enter on steps 1 or 2 acts like Continue, not submit
    if (currentStep !== 3) {
        document.querySelector(`#step-${currentStep} [data-go="${currentStep + 1}"]`).click();
        return;
    }

    formError.hidden = true;

    const category = getCategoryInput().value;
    const serverCategory = toServerCategory(category);
    const locationText = buildLocationText();
    const description = document.getElementById("description").value.trim();

    // The backend has no location field yet, so location goes at the top of the description.
    // If the server didn't know the category and it was sent as "other", the real one is written there too.
    const extraLines = [];
    if (locationText) {
        extraLines.push(`Location: ${locationText}`);
    }
    if (serverCategory === "other" && category !== "other") {
        extraLines.push(`Category: ${getCategoryLabel()}`);
    }

    const ticket = {
        title: document.getElementById("title").value.trim(),
        description: extraLines.length ? `${extraLines.join("\n")}\n\n${description}` : description,
        category: serverCategory,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
        const res = await fetch(`${API_URL}/api/tickets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticket),
        });
        const data = await res.json();

        if (!res.ok) {
            formError.textContent = data.error || "Your ticket couldn't be saved. Go back, check your answers, and try again.";
            formError.hidden = false;
            return;
        }

        // Success: hide the form and show the ticket number
        document.getElementById("ticket-number").textContent = `TIC-${String(data.id).padStart(4, "0")}`;
        form.hidden = true;
        confirmation.hidden = false;
        confirmation.querySelector("h2").setAttribute("tabindex", "-1");
        confirmation.querySelector("h2").focus();
    } catch (err) {
        formError.textContent = "Couldn't reach the server. Your answers are still here, so try again in a moment.";
        formError.hidden = false;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit ticket";
    }
});

// Start a fresh ticket after one is submitted
document.getElementById("new-ticket-btn").addEventListener("click", function () {
    form.reset();
    updateFields();
    confirmation.hidden = true;
    form.hidden = false;
    showStep(1);
});

// ---------- Start ----------
loadServerCategories();
updateFields();