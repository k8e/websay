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
        var variant_val = variant.options[variant.selectedIndex].value;

        if (variant_val == "sam") {
            // Call SAM
            sam(text.value);
        } else {
            // Call meSpeak
            meSpeak.speak(
                text.value, {
                    amplitude: amplitude.value,
                    wordgap: wordgap.value,
                    pitch: pitch.value,
                    speed: speed.value,
                    variant: variant_val
                }
            );
        }
    } // End submit

    // Add eventListeners for updating share link
    for (i = 0, l = formFields.length; i < l; i++) {
        inputForm.elements[formFields[i]].addEventListener('change', updateShareUrl, false);
    }
    variantSelect.addEventListener('change', updateShareUrl, false);
    voiceSelect.addEventListener('change', updateShareUrl, false);
    variantSelect.addEventListener('change', checkForOptionsAvailable, false);
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

/* SAM */

function PlayWebkit(context, audiobuffer)
{
	var source = context.createBufferSource();
	var soundBuffer = context.createBuffer(1, audiobuffer.length, 22050);
	var buffer = soundBuffer.getChannelData(0);
	for(var i=0; i<audiobuffer.length; i++) buffer[i] = audiobuffer[i];
	source.buffer = soundBuffer;
	source.connect(context.destination);
	source.start(0);	
}

function PlayMozilla(context, audiobuffer)
{
	var written = context.mozWriteAudio(audiobuffer);
	var diff = audiobuffer.length - written;
	if (diff <= 0) return;
	var buffer = new Float32Array(diff);
	for(var i = 0; i<diff; i++) buffer[i] = audiobuffer[i+written];
	window.setTimeout(function(){PlayMozilla(context, buffer)}, 500);
}


function PlayBuffer(audiobuffer)
{
	if (typeof AudioContext !== "undefined") 
	{
       	PlayWebkit(new AudioContext(), audiobuffer);	
	} else 
	if (typeof webkitAudioContext !== "undefined") 
	{
		PlayWebkit(new webkitAudioContext(), audiobuffer);
	} else if (typeof Audio !== "undefined")
	{
		var context = new Audio();
		context.mozSetup(1, 22050);
		PlayMozilla(context, audiobuffer);
	}
}

function sam(text)
{
	var input = text;
	while (input.length < 256) input += " ";
	var ptr = allocate(intArrayFromString(input), 'i8', ALLOC_STACK);
	_TextToPhonemes(ptr);
	//alert(Pointer_stringify(ptr));
	_SetInput(ptr);
	_Code39771();

	var bufferlength = Math.floor(_GetBufferLength()/50);
	var bufferptr = _GetBuffer();

	audiobuffer = new Float32Array(bufferlength);

	for(var i=0; i<bufferlength; i++)
		audiobuffer[i] = ((getValue(bufferptr+i, 'i8')&0xFF)-128)/256;
	PlayBuffer(audiobuffer);
}

/* Temporary option disablers for certain voices */

function checkForOptionsAvailable() {
    var variant = inputForm.elements["variant"]
    variant = variant.options[variant.selectedIndex].value;
    if (variant != "sam") { // Sorry, SAM
        enableOptions();
    }
    else {
        disableOptions();
    }
}

function enableOptions() {
    inputForm.elements["pitch"].disabled = false;
    inputForm.elements["speed"].disabled = false;
}

function disableOptions() {
    inputForm.elements["pitch"].disabled = true;
    inputForm.elements["speed"].disabled = true;
}