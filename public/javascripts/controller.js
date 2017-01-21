// Specify the input form
var inputForm = document.getElementById("speakData");
// Form fields 
var formFields = ['text', 'amplitude', 'wordgap', 'pitch', 'speed'];
variantSelect = document.getElementById('variantSelect'),
voiceSelect = document.getElementById('voiceSelect');
// Name of talk page
var talkPage = "talk";

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
            text.value, {
                amplitude: amplitude.value,
                wordgap: wordgap.value,
                pitch: pitch.value,
                speed: speed.value,
                variant: variant.options[variant.selectedIndex].value
            }
        );
    } // End submit

    // Add eventListeners for updating share link
    for (i = 0, l = formFields.length; i < l; i++) {
        inputForm.elements[formFields[i]].addEventListener('change', updateShareUrl, false);
    }
    variantSelect.addEventListener('change', updateShareUrl, false);
    voiceSelect.addEventListener('change', updateShareUrl, false);
    // finally, inject a link with current values into the page
    updateShareUrl();
}

function updateShareUrl() {
    var params = new Array();  
    // Get values from input form
    var index, numFields, field;
    for (index = 0, numFields = formFields.length; index < numFields; index++) {
        field = formFields[index];
        params.push(field + '=' + encodeURIComponent(inputForm.elements[field].value));
    }
    // Get variant
    if (variantSelect.selectedIndex >= 0) params.push('variant=' + variantSelect.options[variantSelect.selectedIndex].value);
    // Get current voice or default to 'en/en'
    var v;
    if (voiceSelect.selectedIndex >= 0) v = voiceSelect.options[voiceSelect.selectedIndex].value;
    if (!v) v = meSpeak.getDefaultVoice() || 'en/en';
    params.push('voice=' + encodeURIComponent(v));
    params.push('auto=true');
    // Assemble the url 
    var url, el;
    url = talkPage + '?' + params.join('&');
    document.getElementById("btn_share").href = window.location.href + url;
    url = url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
    el = document.getElementById('linkdisplay');
    if (el) el.innerHTML = 'Share URL: <pre>' + window.location.href + url + '</pre>';
}

/* meSpeak functions */

function sayThing(text, voice, variant, pitch, speed, amplitude, wordgap) {
    loadVoice(voice);
    meSpeak.speak(
        text, {
            amplitude: 100,
            wordgap: 0,
            pitch: pitch,
            speed: speed,
            variant: variant
        }
    );
}

function loadVoice(id) {
    var fname = "voices/" + id + ".json";
    meSpeak.loadVoice(fname, voiceLoaded);
}

function voiceLoaded(success, message) {
    if (success) {
        //alert("Voice loaded: "+message+".");
    } else {
        alert("Error: (Failed to load voice) " + message);
    }
}