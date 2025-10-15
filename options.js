// --- Code that runs as soon as the options page opens ---
document.addEventListener('DOMContentLoaded', loadMySettings);
document.getElementById('addCustomBtn').addEventListener('click', addCustomSite);
document.getElementById('saveBtn').addEventListener('click', saveAllSettings);

/**
 * Gets saved settings from Chrome and updates the page.
 */
function loadMySettings() {
  chrome.storage.local.get(['blockedSites', 'customSites'], function(data) {
    const blockedSites = data.blockedSites || [];
    const customSites = data.customSites || [];

    // Go through all the checkboxes on the page
    document.querySelectorAll('.site-checkbox').forEach(function(checkbox) {
      // If the checkbox's value (e.g., "youtube.com") is in our saved list, check it
      if (blockedSites.includes(checkbox.value)) {
        checkbox.checked = true;
      }
    });
    
    // Display the list of custom-added sites
    displayCustomSites(customSites);
  });
}

/**
 * Shows the list of custom sites on the page.
 */
function displayCustomSites(customSites) {
  const listElement = document.getElementById('customSitesList');
  listElement.innerHTML = ''; // Clear the old list

  customSites.forEach(function(site) {
    const item = document.createElement('div');
    item.className = 'custom-site-item';
    item.innerHTML = `<span>${site}</span>`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-delete';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = function() {
      removeCustomSite(site);
    };

    item.appendChild(removeBtn);
    listElement.appendChild(item);
  });
}

/**
 * Adds a new site from the input box to the custom list.
 */
function addCustomSite() {
  const input = document.getElementById('customSite');
  const newSite = input.value.trim();

  if (newSite === '') {
    alert('Please enter a website domain.');
    return;
  }

  chrome.storage.local.get(['customSites'], function(data) {
    const customSites = data.customSites || [];
    customSites.push(newSite);
    chrome.storage.local.set({ customSites: customSites }, function() {
      input.value = ''; // Clear the input box
      displayCustomSites(customSites); // Refresh the list
    });
  });
}

/**
 * Removes a site from the custom list.
 */
function removeCustomSite(siteToRemove) {
  chrome.storage.local.get(['customSites'], function(data) {
    let customSites = data.customSites || [];
    // This creates a new list containing every site EXCEPT the one we want to remove
    const updatedSites = customSites.filter(site => site !== siteToRemove);
    chrome.storage.local.set({ customSites: updatedSites }, function() {
      displayCustomSites(updatedSites); // Refresh the list
    });
  });
}

/**
 * Saves all the checkbox and custom site settings.
 */
function saveAllSettings() {
  // Get all the sites from the checked boxes
  const checkedSites = [];
  document.querySelectorAll('.site-checkbox:checked').forEach(function(checkbox) {
    checkedSites.push(checkbox.value);
  });

  // Get all the sites from the custom list
  chrome.storage.local.get(['customSites'], function(data) {
    const customSites = data.customSites || [];
    
    // Combine both lists into one master blocklist
    const allBlockedSites = [...checkedSites, ...customSites];
    
    // Save the master list
    chrome.storage.local.set({ blockedSites: allBlockedSites }, function() {
      // Show a "Saved!" message for 2 seconds
      const status = document.getElementById('status');
      status.textContent = 'Settings saved successfully!';
      status.classList.add('show');
      setTimeout(function() {
        status.classList.remove('show');
      }, 2000);
    });
  });
}