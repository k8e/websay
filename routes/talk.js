var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('talk', { title: 'Talk page', input: req.query.t, rate: req.query.r, pitch: req.query.p, voice: req.query.v, });
});

module.exports = router;
