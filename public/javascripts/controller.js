// Specify the input form
var inputForm = document.getElementById("speakData");

function initMeSpeak() {
    meSpeak.loadConfig("mespeak_config.json");
    meSpeak.loadVoice("voices/en/en.json");
}

function initSpeechForm() {
    // Create submit event for input form
    inputForm.onsubmit = function(event) {
        event.preventDefault();
        // Get form elements
        var text = inputForm.elements["text"];
        var amplitude = inputForm.elements["amplitude"];
        var wordgap = inputForm.elements["wordgap"];
        var pitch = inputForm.elements["pitch"];
        var speed = inputForm.elements["speed"];
        var variant = inputForm.elements["variant"];
        // Call meSpeak
        meSpeak.speak(
            text.value,
            { amplitude: amplitude.value,
                wordgap: wordgap.value,
                pitch: pitch.value,
                speed: speed.value,
                variant: variant.options[variant.selectedIndex].value
            }
        );

    } // End submit
}

function sayThing(text, voice, variant, pitch, speed, amplitude, wordgap) {
    loadVoice(voice);
    meSpeak.speak(
        text,
        { amplitude: 100,
            wordgap: 0,
            pitch: pitch,
            speed: speed,
            variant: variant
        }
    );
}

function loadVoice(id) {
  var fname="voices/"+id+".json";
  meSpeak.loadVoice(fname, voiceLoaded);
}

function voiceLoaded(success, message) {
  if (success) {
    //alert("Voice loaded: "+message+".");
  }
  else {
    alert("Failed to load a voice: "+message);
  }
}
