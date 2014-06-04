var uuid = function() {
  var d = Date.now();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
};

var Card = function(opt_data) {
  this.fields = [];
  this.values = [];
  this.element = $("<div>", { contentEditable: "true", class: "card panel panel-default" });

  if(opt_data) {
    this.uuid = opt_data.uuid;
    this.expanded = opt_data.expanded;
    if(this.expanded) {
      this.element.attr("contentEditable", "false");
      this.cardName = opt_data.cardName;
      this.generateList(opt_data.cardName, opt_data.fields, opt_data.values);
    } else {
      this.element.html(opt_data.content);
    }
  } else {
    this.uuid = uuid();
    this.expanded = false;
    this.element.html("new card");
    data.save(this);
  }
  
  this.element.on("keypress", $.proxy(this.onKeyPress, this));
  this.element.on("paste cut drop keypress input textInput", $.proxy(this.onValueChange, this));
};

Card.prototype.generateList = function(cardName, fields, opt_values) {
  this.element.append($("<div>", { class: "panel-heading", text: cardName }));
  var listElement = $("<dl>", { class: "dl-horizontal card-content" });
  for(var i = 0; i < fields.length; i++) {
    var valueCard = new Card(opt_values && data.load(opt_values[i].uuid));

    var fieldElement = $("<dt>", { class: "field", text: fields[i], contentEditable: "true" });
    var valueElement = $("<dd>", { class: "value" });
    valueElement.append(valueCard.element);
    listElement.append(fieldElement);
    listElement.append(valueElement);

    this.fields.push(fieldElement);
    this.values.push(valueCard);

    var card = this;
    fieldElement.on("paste cut drop keypress input textInput", function(event) {
      data.save(card);
    });
  }
  this.element.append(listElement);
}

Card.prototype.onKeyPress = function(event) {
  if(event.which == 13 && this.canExpand()) {
    this.expand();
    data.save(this);
    event.preventDefault();
  }
};

Card.prototype.onValueChange = function(event) {
  if(!this.expanded) {
    data.save(this);
  }
};

Card.prototype.getCardNameFromContent = function() {
  var matchArray = this.element.text().match(/^~(\w+)$/);
  return matchArray && matchArray[1];
};

Card.prototype.canExpand = function() {
  return !this.expanded && this.getCardNameFromContent();
};

Card.prototype.expand = function() {
  this.expanded = true;
  var card = this;
  var element = this.element;
  card.cardName = card.getCardNameFromContent();
  element.attr("contentEditable", "false");
  element.empty();

  var fields = this.getFieldSuggestions();
  this.generateList(card.cardName, fields);
};

Card.prototype.getData = function() {
  var card = this;
  var data = {
    uuid: card.uuid,
    expanded: card.expanded,
    fields: [],
    values: []
  };
  if(this.expanded) {
    data.cardName = card.cardName;
    for(var i=0; i<card.fields.length; i++) {
      data.fields.push(card.fields[i].text());
      data.values.push({ uuid: card.values[i].uuid });
    }
  } else {
    data.content = card.element.html();
  }
  return data;
};

$(document).ready(function() {
  console.log(data.list());

  $.each(data.list(), function(index, uuid) {
    var cardData = data.load(uuid)
    var newCard = new Card(cardData);
    $("#cards").append(newCard.element);
  });

  $("#add-card-button").on("click", function(event) {
    var newCard = new Card();
    data.list(newCard.uuid);
    $("#cards").append(newCard.element);
  });
});

// Testing methods.

Card.prototype.getFieldSuggestions = function(name) {
  return ["title", "date", "text"];
};
