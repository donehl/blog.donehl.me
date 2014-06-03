var Card = function() {
  this.element_ = $("<div>", { contentEditable: "true", class: "card", text: "new card" });
  this.expanded_ = false;

  this.element().on("keypress", $.proxy(this.onKeyPress, this));
};

Card.prototype.onKeyPress = function(event) {
  if(event.which == 13 && this.canExpand()) {
    this.expand();
    event.preventDefault();
  }
}

Card.prototype.element = function() {
  return this.element_;
};

Card.prototype.expanded = function() {
  return this.expanded_;
}

Card.prototype.cardName = function() {
  var matchArray = this.element().text().match(/^~(\w+)$/);
  return matchArray && matchArray[1];
}

Card.prototype.canExpand = function() {
  return !this.expanded() && this.cardName();
};

Card.prototype.expand = function() {
  var cardName = this.cardName();
  var element = this.element();
  element.attr("contentEditable", "false");
  element.empty();
  element.append($("<div>", {  class: "card-caption", text: "expanded card: " + cardName }));

  var fields = this.getFieldSuggestions();
  console.log(fields);
  $.each(fields, function(index, field) {
    console.log(field);
    var fieldElement = $("<div>", { class: "field", text: field });
    var valueElement = $("<div>", { class: "value" });
    var valueCard = new Card();
    valueElement.append(valueCard.element());
    element.append(fieldElement);
    element.append(valueElement);
  });
}

Card.prototype.getFieldSuggestions = function(name) {
  return ["title", "date", "text"];
}

$(document).ready(function() {
  $("#add-card-button").on("click", function(event) {
    var newCard = new Card();
    $("#cards").append(newCard.element());
  });
});

