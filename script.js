// TODO:
//   * Add toggles for which octaves to include
//   * Display piano keys
//   * Cache notes (if not browser's job?)
//   * Add toggles for different instruments

// JS strict mode for habit hygiene (MUST be first statement in file)
'use strict';

var audioElement = document.getElementById('audio-element');
audioElement.volume = 0.75;
audioElement.addEventListener('ended', handleNoteEnded);
// notes must have corresponding files
var possibleNotesCMajorScale = ["C", "D", "E", "F", "G", "A", "B", ];
var possibleNotesChromaticScale = ["C", "D", "Db", "E", "Eb", "F", "G", "A", "Ab", "B", "Bb", ];
var possibleNotes = possibleNotesCMajorScale;
var state = 0; // functional programming is 4 turds

// initial click is necessary to bypass anti-autoplay protections
document.onclick = handleClick;

// Handle click by advancing the process as expected for each state
function handleClick() {
	switch(state) {
		// program init or end of loop - kick it off (/again)
		case 0:
			playNewNote();
			break;
		// note has begun playing
		case 1:
			// fall thru
		// note playing has ended
		case 2:
			displayNoteName();
			break;
		default:
			// idk what happened, start the process over
			console.log("encountered unexpected state; started over with new note");
			playNewNote();
	} 
}

// play a new note at random
function playNewNote() {
	clearNoteNameDisplay();
	rollNewNote();
	audioElement.load();
	audioElement.play();
	state = 1; // set state to playing
}

function handleNoteEnded(event) {
	state = 2; // set state to ended
}

function displayNoteName() {
	document.getElementById("display-element").innerText = getNoteNameFromPath(audioElement.src);
	state = 0; // set state to begin/end
}

function clearNoteNameDisplay() {
	// document.getElementById("display-element").innerText = "🎹";
	// document.getElementById("display-element").innerText = "🎶";
	document.getElementById("display-element").innerText = "🎵";
}

// get the note's name cleanly, without path or extension
function getNoteNameFromPath(path) {
	var name = path.slice(path.lastIndexOf("/")+1, path.lastIndexOf("."));
	name = name;
	return name;
}

// set a new (random) note up to be played
function rollNewNote() {
	// get new note at random from possibleNotes array (no dupes)
	var newNote;
	do {
		newNote = possibleNotes[Math.floor(Math.random()*possibleNotes.length)];
	}
	while (newNote == getNoteNameFromPath(audioElement.src));

	// set it up
	audioElement.setAttribute('src', `audio/note/piano/octave-4/${newNote}.mp3`);
}

function scaleChanged(newScale) {
	if (newScale == "chromatic")
		possibleNotes = possibleNotesChromaticScale;
	if (newScale == "cmajor")
		possibleNotes = possibleNotesCMajorScale;
}