// TODO:
//   * Add first and last few keys on piano (not complete octaves -
//       will require rolling random number once, then converting that to octave/note, 
//       if note probability distribution is to remain even.)
//   * Display piano keys
//   * Add toggles for different instruments?

// JS strict mode for habit hygiene (MUST be first statement in file)
'use strict';

// notes must have corresponding files
var possibleNotesCMajorScale = ["C", "D", "E", "F", "G", "A", "B", ];
var possibleNotesChromaticScale = ["C", "D", "Db", "E", "Eb", "F", "G", "A", "Ab", "B", "Bb", ];
var possibleNotes = possibleNotesCMajorScale; // default
var possibleOctaves = ["4", ];
var currentAudioElement;
var state = 'ready-for-new-note'; // functional programming is 4 turds

// initial click is necessary to bypass anti-autoplay protections
document.onclick = handleClick;
// Handle click by advancing the process as expected for each state
function handleClick() {
	// if there are no active octaves, tell the user to select some and reset the program state
	if (possibleOctaves.length == 0) {
		document.getElementById("display-element").innerText = "👆";
		state = 'ready-for-new-note';
		return;
	}

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
			// include octave name if more than one is selected
			if (possibleOctaves.length > 1)
				document.getElementById("display-element").innerText += ' (' + getOctaveNumberFromPath(currentAudioElement.src) + ')';
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
	// pick new notes and octaves at random, rerolling if both duplicates of the last
	var lastNote = (currentAudioElement === undefined) ? 'none' : getNoteNameFromPath(currentAudioElement.src);
	var lastOctave = (currentAudioElement === undefined) ? 'none' : getOctaveNumberFromPath(currentAudioElement.src);
	var newNote;
	var newOctave;
	do {
		newNote = possibleNotes[Math.floor(Math.random()*possibleNotes.length)];
		newOctave = possibleOctaves[Math.floor(Math.random()*possibleOctaves.length)];
	}
	while ((newNote == lastNote) && (newOctave == lastOctave));
	// get its corresponding audio element
	currentAudioElement = getAudioElementFor(newOctave, newNote);
	// play it from the beginning
	currentAudioElement.currentTime = 0.0;
	currentAudioElement.play();
	// advance program state
	state = 'ready-for-note-name-display';
}

// Get the note's name cleanly, from the given path, without its extension
function getNoteNameFromPath(path) {
	// return path.slice(path.lastIndexOf("/")+1, path.lastIndexOf("."));
	var filename = path.slice(path.lastIndexOf("/")+1, path.lastIndexOf("."));
	var note = filename.slice(filename.lastIndexOf("-")+1);
	return note;
}

// Get the octave's number cleanly, from the given path
function getOctaveNumberFromPath(path) {
	var filename = path.slice(path.lastIndexOf("/")+1, path.lastIndexOf("."));
	var octave = filename.slice(0,filename.lastIndexOf("-"));
	return octave;
}

// Return an audio element for the given note, whether one already exists or not
function getAudioElementFor(octave, note) {
	// get the element if it already exists
	var thisAudioElement = document.getElementById('audioElementForNote-'+note);
	// if the element does not already exist, create it, attach it, and return it
	if (thisAudioElement === null) {
		// create and initialize new audio element for this note 
		thisAudioElement = document.createElement('audio');
		thisAudioElement.setAttribute('id', 'audioElementForNote-'+note);
		thisAudioElement.setAttribute('src', `audio/note/piano/${octave}-${note}.mp3`);
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

// Add/remove octave from list of possible octaves
function updateSelectedOctave(event) {
	// if it's selected & not in the list of possibilities, add it
	var caller = event.target;
	var octaveNumber = caller.id[caller.id.length-1];
	if (caller.checked && !possibleOctaves.includes(octaveNumber))
		possibleOctaves.push(octaveNumber);
	// if it's not selected and it's in the list, remove it
	else if (possibleOctaves.includes(octaveNumber))
		possibleOctaves.splice(possibleOctaves.indexOf(octaveNumber), 1);

	// if no possible octaves remain, handle that
	if(possibleOctaves.length <= 0)
		handleClick();
	
	event.stopPropagation(); // kill the click event here
}
// Attach this handler to the elements (we need the event, to stop propagation,
//   so it cannot be assigned inline in the HTML's "onclick="")
document.getElementById("octave-1").addEventListener("click", updateSelectedOctave);
document.getElementById("octave-2").addEventListener("click", updateSelectedOctave);
document.getElementById("octave-3").addEventListener("click", updateSelectedOctave);
document.getElementById("octave-4").addEventListener("click", updateSelectedOctave);
document.getElementById("octave-5").addEventListener("click", updateSelectedOctave);
document.getElementById("octave-6").addEventListener("click", updateSelectedOctave);
document.getElementById("octave-7").addEventListener("click", updateSelectedOctave);
