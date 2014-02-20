define([ //one item in the list
  'jquery', 
  'underscore', 
  'backbone',
  'text!templates/todo.html'
  ], function($, _, Backbone, todoTemplate){

  var Router= new Backbone.Router;

  var TodoView = Backbone.View.extend({
    template: _.template(todoTemplate),
    events: {
      "click .check"                   : "toggleDone",
      "click button.removeButton"      : "clear",
      "keypress .todo-input-text"      : "updateOnType", //used to live update data storage
      "focusout .todo-input-text"      : "updateOnFocusOut", //used to set Router path
      "focus .todo-input-text"         : "focusin" //used to set Router path
    },

    initialize: function() {
      _.bindAll(this, 'render', 'onDoneChange','onVisibleChange');
      this.model.bind('change:done', this.onDoneChange);        //we can redraw item in case user is interacting with checkbox (not applicable for text fields)
      this.model.bind('change:visible', this.onVisibleChange);  //used by Filter
      this.model.set('visible',true); //attribute "visible" should be reset to true after get from data storage
      this.model.view = this;
    },

    onVisibleChange: function(){
      this.render();
    },

    onDoneChange: function(){
      this.render();
      if(!this.model.get('done')) this.input.focus(); //if user have put item to undone state then he may be want to update text description also. We will help and put focus to the field
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.input = this.$('.todo-input-text');
      this.input.val(this.model.get('content'));
      return this;
    },

    putFocus: function() {
      this.input.focus();
    },

    toggleDone: function() {
      Router.navigate(''); //there is no focus on any test field - set empty path
      this.model.toggle();
    },

    updateOnType: _.debounce(function(e) {          //put some timeout to prevent data storage from very frequent update operations
      var updateData={content: this.input.val()};
      this.model.set(updateData);
    }, 1000),

    updateOnFocusOut: function(e) {     //immediate save after text filed has lost focus
      var updateData={content: this.input.val()};
      this.model.set(updateData);
    },

    focusin: function() {
      Router.navigate('todo/' + this.model.get("id"));  //update path to represent current focus in App
    },

    clear: function() { //remove button has been clicked
      this.model.clear(); //remove model from collection
      Router.navigate(''); //update path to represent new state of App
    },

    remove: function() {
      $(this.el).remove(); //remove element from screen
    },

  });
  return TodoView;
});
