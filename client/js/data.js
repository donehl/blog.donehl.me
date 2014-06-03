var data = {};

data.storage = {};

data.storage.setItem = function(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

data.storage.getItem = function(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

data.save = function(card) {
  console.log(card.getData());
  data.storage.setItem("card: " + card.uuid, card.getData());
}

data.load = function(uuid) {
  return data.storage.getItem("card: " + uuid);
}

data.list = function(opt_uuid) {
  var list = data.storage.getItem("list") || [];
  if(opt_uuid) {
    list.push(opt_uuid);
    data.storage.setItem("list", list);
  } else {
    return list;
  }
}
