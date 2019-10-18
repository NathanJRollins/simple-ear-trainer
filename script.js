// TODO:
//   * Add toggles for which octaves to include
//   * Display piano keys
//   * Cache notes (if not browser's job?)
//   * Add toggles for different instruments

// JS strict mode for habit hygiene (MUST be first statement in file)
'use strict';

var audioElement = document.getElementById('audio-element');
audioElement.volume = 0.75;

// notes must have corresponding files
var possibleNotesCMajorScale = ["C", "D", "E", "F", "G", "A", "B", ];
var possibleNotesChromaticScale = ["C", "D", "Db", "E", "Eb", "F", "G", "A", "Ab", "B", "Bb", ];
var possibleNotes = possibleNotesCMajorScale;
var state = 'ready-for-new-note'; // functional programming is 4 turds

// initial click is necessary to bypass anti-autoplay protections
document.onclick = handleClick;

// Handle click by advancing the process as expected for each state
function handleClick() {
	switch(state) {
		// program init or end of loop - kick it off (/again)
		case 'ready-for-new-note':
			playNewNote();
			break;
		// note has begun playing
		case 'ready-for-note-name-display':
			// display note name & advance program state
			document.getElementById("display-element").innerText = getNoteNameFromPath(audioElement.src);
			state = 'ready-for-new-note';
			break;
		default:
			// idk what happened, start the process over
			console.log("encountered unexpected state; started over with new note");
			playNewNote();
	} 
}

// play a new note at random
function playNewNote() {
	// clear note name display
	document.getElementById("display-element").innerText = "🎵";
	// pick a new note at random
	rollNewNote();
	// play it
	audioElement.load();
	audioElement.play();
	// advance program state
	state = 'ready-for-note-name-display';
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