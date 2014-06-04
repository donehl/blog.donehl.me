var express = require('express');
var nano = require('nano')('http://localhost:5984');
var router = express.Router();
var carddb = nano.use('carddb');

/* POST data. */
router.get('/setItem', function(req, res) {
  var key = req.query.key;
  var value = req.query.value;
  carddb.insert({"value": value}, key, function(error) {
    if(error) {
      res.send(error.message, error['status-code']);
    } else {
      res.send("ok", 200);
    }
  });
});

router.get('/getItem', function(req, res) {
  var key = req.query.key;
  carddb.get(key, function(error, value) {
    if(error) {
      res.send(500);
    } else {
      res.send(value);
    }
  });
});

module.exports = router;
