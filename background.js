// This function runs only ONCE, when the user first installs the extension.
chrome.runtime.onInstalled.addListener(function() {

  // Its job is to create empty lists in storage,
  // so the other scripts don't crash if they try to read a list that doesn't exist yet.

  chrome.storage.local.set({
    tasks: [],
    blockedSites: [],
    customSites: []
  });

  console.log("Think Twice extension has been installed and set up!");
});