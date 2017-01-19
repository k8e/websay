var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var qText = req.query.text;
    var qVoice = req.query.voice;
    var qVariant = req.query.variant;
    var qPitch = req.query.pitch;
    var qSpeed = req.query.speed;
    var qAmp = req.query.amplitude;
    var qGap = req.query.wordgap;

    if (!qPitch)
        qPitch = 50;
    if (!qSpeed)
        qSpeed = 175;
    if (!qAmp)
        qAmp = 100;
    if (!qGap)
        qGap = 0;

    console.log("SHARE (" + req.ip + ") : \t\"" + qText + "\"");
    res.render('talk', {
        title: 'WebSay',
        text: qText,
        voice: qVoice,
        variant: qVariant,
        pitch: qPitch,
        speed: qSpeed,
        amplitude: qAmp,
        wordgap: qGap});
});

module.exports = router;
