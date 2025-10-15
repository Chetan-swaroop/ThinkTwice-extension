/**
 * Checks two things:
 * 1. Is the current website on the user's blocklist?
 * 2. Does the user have at least one task to work on?
 * If both are true, it shows the blocking overlay.
 */
function checkPage() {
  // Ask Chrome for the blocklist AND the task list at the same time
  chrome.storage.local.get(["blockedSites", "tasks"], function (data) {
    const blockedSites = data.blockedSites || [];
    const tasks = data.tasks || [];
    const currentWebsite = window.location.hostname;

    let isThisSiteBlocked = false;

    // Loop through every site in the blocklist
    for (let i = 0; i < blockedSites.length; i++) {
      const blockedSite = blockedSites[i];
      // Check if the current website's address contains the blocked site's name
      // (e.g., "music.youtube.com" contains "youtube.com")
      if (currentWebsite.includes(blockedSite)) {
        isThisSiteBlocked = true;
        break; // Found a match, no need to keep looking
      }
    }

    // The final decision:
    // Show the overlay ONLY if the site is blocked AND there is at least one task.
    if (isThisSiteBlocked && tasks.length > 0) {
      showBlockingOverlay(tasks);
    }
  });
}

/**
 * Creates and shows the "Think Twice!" overlay on the page.
 */
function showBlockingOverlay(tasks) {
  // Create the main dark background div
  const overlay = document.createElement("div");
  overlay.className = "think-twice-overlay";

  // Build the list of tasks for the dropdown menu
  let taskOptionsHTML = '<option value="">-- Select a task --</option>';
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const link = task.link || "https://pomofocus.io/"; // If no link, go to Google
    taskOptionsHTML += `<option value="${link}">${task.name}</option>`;
  }

  // Create the white popup box with all its content
  overlay.innerHTML = `
    <div class="overlay-content">
      <h1>🧠 Think Twice!</h1>
      <p>What would you like to work on instead?</p>
      <select class="overlay-select" id="taskSelect">${taskOptionsHTML}</select>
      <div class="overlay-buttons">
        <button class="overlay-btn overlay-btn-primary" id="goBtn">Go to Task</button>
        <button class="overlay-btn overlay-btn-secondary" id="skipBtn">Skip for now</button>
      </div>
    </div>
  `;

  // Add the entire overlay to the webpage
  document.body.appendChild(overlay);

  // Stop the background page from scrolling
  document.body.style.overflow = "hidden";

  // --- Make the buttons in the overlay work ---

  // Go to Task button
  document.getElementById("goBtn").onclick = function () {
    const dropdown = document.getElementById("taskSelect");
    const chosenURL = dropdown.value;
    if (chosenURL) {
      window.location.href = chosenURL; // Redirect the page
    } else {
      alert("Please select a task from the list.");
    }
  };

  // Skip button
  document.getElementById("skipBtn").onclick = function () {
    overlay.remove(); // Remove the overlay from the page
    document.body.style.overflow = "auto"; // Allow scrolling again
  };
}

// Run the check as soon as this script loads on the page
checkPage();
