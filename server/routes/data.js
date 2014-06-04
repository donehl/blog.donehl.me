var express = require('express');
var nano = require('nano')('http://localhost:5984');
var router = express.Router();
var carddb = nano.use('carddb');

carddb.update = function(obj, key, callback) {
  var db = this;
  db.get(key, function (error, existing) { 
    if(!error) obj._rev = existing._rev;
    console.log(obj);
    db.insert(obj, key, callback);
  });
};

router.post('/setItem', function(req, res) {
  var key = req.param("key");
  var value = req.param("value");
  carddb.update({"value": value}, key, function(error) {
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
