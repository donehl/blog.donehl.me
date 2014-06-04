var data = {};

data.storage = {};

data.storage.setItem = function(key, value) {
  $.ajax({
    type: "POST",
    url: "/data/setItem",
    dataType: "html",
    data: { "key": key, "value": JSON.stringify(value) }
  }).done(function(msg) {
    console.log("Set: " + msg);
  });
}

data.storage.getItem = function(key, callback) {
  $.ajax({
    type: "GET",
    url: "/data/getItem",
    dataType: "json",
    data: { "key": key }
  }).done(function(msg) {
    console.log("Get: " + msg);
    callback(JSON.parse(msg["value"]));
  }).fail(function() {
    console.log("Get Error");
    callback(null);
  });
}

data.save = function(card) {
  data.storage.setItem("card: " + card.uuid, card.getData());
}

data.load = function(uuid, callback) {
  data.storage.getItem("card: " + uuid, function(value) {
    callback(value);
  });
}

data.setList = function(list) {
  data.storage.setItem("list", list); 
}

data.getList = function(callback) {
  data.storage.getItem("list", function(list) {
    callback(list);
  });
}
