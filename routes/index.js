var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Live Code Edit'
  });
});

module.exports = router;
