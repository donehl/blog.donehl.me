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

  if(opt_data) {
    this.uuid = opt_data.uuid;
    this.expanded = opt_data.expanded;
    if(this.expanded) {
      this.cardName = opt_data.cardName;
      this.element = $("<div>", { contentEditable: "false", class: "card", text: "expanded card: " + opt_data.cardName });
      for(var i = 0; i < opt_data.fields.length; i++) {
        var cardData = data.load(opt_data.values[i].uuid);
        var valueCard = new Card(cardData);

        var fieldElement = $("<div>", { class: "field", text: opt_data.fields[i], contentEditable: "true" });
        var valueElement = $("<div>", { class: "value" });
        valueElement.append(valueCard.element);
        this.element.append(fieldElement);
        this.element.append(valueElement);

        this.fields.push(fieldElement);
        this.values.push(valueCard);

        var card = this;
        fieldElement.on("paste cut drop keypress input textInput", function(event) {
          data.save(card);
        });
      }
    } else {
      this.element = $("<div>", { contentEditable: "true", class: "card", text: opt_data.content });
      this.cardName = null;
    }
  } else {
    this.uuid = uuid();
    this.element = $("<div>", { contentEditable: "true", class: "card", text: "new card" });
    this.expanded = false;
    this.fields = [];
    this.values = [];
    this.cardName = null;
    data.save(this);
  }

  this.element.on("keypress", $.proxy(this.onKeyPress, this));
  this.element.on("paste cut drop keypress input textInput", $.proxy(this.onValueChange, this));
};

Card.prototype.onKeyPress = function(event) {
  if(event.which == 13 && this.canExpand()) {
    this.expand();
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
  element.append($("<div>", {  class: "card-caption", text: "expanded card: " + card.cardName }));

  var fields = this.getFieldSuggestions();
  $.each(fields, function(index, field) {
    var fieldElement = $("<div>", { class: "field", text: field, contentEditable: "true" });
    var valueElement = $("<div>", { class: "value" });
    var valueCard = new Card();
    valueElement.append(valueCard.element);
    element.append(fieldElement);
    element.append(valueElement);
    card.fields.push(fieldElement);
    card.values.push(valueCard);

    fieldElement.on("paste cut drop keypress input textInput", function(event) {
      data.save(card);
    });
  });
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
