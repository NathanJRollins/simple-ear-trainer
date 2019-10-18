// TODO:
//   * Add toggles for which octaves to include
//   * Display piano keys
//   * Add toggles for different instruments

// JS strict mode for habit hygiene (MUST be first statement in file)
'use strict';

// notes must have corresponding files
var possibleNotesCMajorScale = ["C", "D", "E", "F", "G", "A", "B", ];
var possibleNotesChromaticScale = ["C", "D", "Db", "E", "Eb", "F", "G", "A", "Ab", "B", "Bb", ];
var possibleNotes = possibleNotesCMajorScale; // default
var currentAudioElement;
var state = 'ready-for-new-note'; // functional programming is 4 turds

// initial click is necessary to bypass anti-autoplay protections
document.onclick = handleClick;

// Handle click by advancing the process as expected for each state
function handleClick() {
	// Ensure the functionally-active scale is visually selected (useful for first-run)
	document.getElementById('scale-cmajor').checked = (possibleNotes == possibleNotesCMajorScale);
	document.getElementById('scale-chromatic').checked = (possibleNotes == possibleNotesChromaticScale);

	// React to click depending on program state
	switch(state) {
		// program init or end of loop - kick it off (/again)
		case 'ready-for-new-note':
			playNewNote();
			break;
		// note has begun playing
		case 'ready-for-note-name-display':
			// display note name & advance program state
			document.getElementById("display-element").innerText = getNoteNameFromPath(currentAudioElement.src);
			state = 'ready-for-new-note';
			break;
		default:
			// idk what happened, start the process over
			console.log("encountered unexpected state; started over with new note");
			playNewNote();
	} 
}

// Play a new note at random
function playNewNote() {
	// clear note name display
	document.getElementById("display-element").innerText = "🎵";
	// pick a new note at random
	var newNote = getNewRandomNoteName();
	// get its corresponding audio element
	currentAudioElement = getAudioElementFor(newNote);
	// play it from the beginning
	currentAudioElement.currentTime = 0.0;
	currentAudioElement.play();
	// advance program state
	state = 'ready-for-note-name-display';
}

// Get the note's name cleanly, without path or extension
function getNoteNameFromPath(path) {
	var name = path.slice(path.lastIndexOf("/")+1, path.lastIndexOf("."));
	name = name;
	return name;
}

// Set a new (random) note up to be played
function getNewRandomNoteName() {
	// determine which note was played last so we don't repeat it
	var lastNote = (currentAudioElement === undefined) ? 'none' : getNoteNameFromPath(currentAudioElement.src) ;

	// get new note at random from possibleNotes array (no dupes)
	var newNote;
	do {
		newNote = possibleNotes[Math.floor(Math.random()*possibleNotes.length)];
	}
	while (newNote == lastNote); // no dupes
	return newNote;
}

// Return an audio element for the given note, whether one already exists or not
function getAudioElementFor(note) {
	// get the element if it already exists
	var thisAudioElement = document.getElementById('audioElementForNote-'+note);
	// if the element does not already exist, create it, attach it, and return it
	if (thisAudioElement === null) {
		// create and initialize new audio element for this note 
		thisAudioElement = document.createElement('audio');
		thisAudioElement.setAttribute('id', 'audioElementForNote-'+note);
		thisAudioElement.setAttribute('src', `audio/note/piano/octave-4/${note}.mp3`);
		thisAudioElement.load();
	}
	return thisAudioElement;
}

function scaleChanged(newScale) {
	if (newScale == "chromatic")
		possibleNotes = possibleNotesChromaticScale;
	if (newScale == "cmajor")
		possibleNotes = possibleNotesCMajorScale;
}