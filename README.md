🧠 Think Twice: A Chrome Extension for Productivity
"Think Twice" is a browser extension designed to help you stay focused by blocking distracting websites. When you try to visit a site on your blocklist, a screen pops up and encourages you to switch to a productive task instead.

The Problem
In the age of endless scrolling and notifications, it's easy to lose focus. A quick check on a social media site can turn into an hour of lost productivity. This extension acts as a pattern interrupt, giving you a moment to pause and "think twice" before you scroll.

 Key Features
 Custom Website Blocking: Choose from a list of common distracting sites or add any custom domain to your personal blocklist.

 Task Management: Create a simple to-do list with priorities (High, Medium, Low) and optional links.

 Productive Redirection: When you visit a blocked site, an overlay appears with a dropdown of your tasks, encouraging you to redirect your focus to something productive.

 Gentle Override: You're still in control. The overlay includes an "I'll be careful" button to proceed to the site if you really need to.

 Simple & Clean UI: An easy-to-use interface that doesn't get in your way.

 How It Works
Add Your Tasks: Click the extension icon to open the popup. Add the productive tasks you want to work on. You can add links (like to a Google Doc or a PDF) and set a priority.

Configure Your Blocklist: Go to the options page to select common distracting websites or add your own.

Browse: When you navigate to a blocked site, the "Think Twice" overlay will appear.

Redirect or Skip: Either select a task to be redirected to its link, or choose to continue to the distracting site.

Installation
To install this extension locally for development or personal use:

Download or clone this repository to your local machine.

Open Google Chrome and navigate to chrome://extensions.

Turn on "Developer mode" in the top-right corner.

Click the "Load unpacked" button.

Select the folder where you saved the project files.

The "Think Twice" extension will now be active in your browser!

Project Files Overview
manifest.json: The core file that defines the extension's properties and permissions.

popup.html / popup.js: Manages the main popup window for adding and viewing tasks.

options.html / options.js: Controls the settings page for managing the blocklist.

content.js: This script runs on web pages to check if they are on the blocklist and to inject the overlay.

background.js: A service worker that initializes the extension's storage on installation.

styles.css: Contains all the styling for the popup, options page, and the blocking overlay.

icons/: Contains the extension's icons.
