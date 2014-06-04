var data = {};

data.storage = {};

data.storage.setItem = function(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

data.storage.getItem = function(key, callback) {
  callback(JSON.parse(window.localStorage.getItem(key)));
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
