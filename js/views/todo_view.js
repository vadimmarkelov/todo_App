define([
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
      "keypress .todo-input-text"      : "updateOnType",
      "focusout .todo-input-text"      : "updateOnFocusOut",
      "focus .todo-input-text"         : "focusin"
    },

    initialize: function() {
      _.bindAll(this, 'render', 'onDoneChange','onVisibleChange');
      this.model.bind('change:done', this.onDoneChange);
      this.model.bind('change:visible', this.onVisibleChange);
      this.model.set('visible',true);
      this.model.view = this;
    },

    onVisibleChange: function(){
      this.render();
    },

    onDoneChange: function(){
      this.render();
      if(!this.model.get('done')) this.input.focus();
    },

    render: function() {
      //if(!this.model) return;
      $(this.el).html(this.template(this.model.toJSON()));
      this.input = this.$('.todo-input-text');
      this.input.val(this.model.get('content'));
      return this;
    },

    putFocus: function() {
      this.input.focus();
    },

    toggleDone: function() {
      Router.navigate('');
      this.model.toggle();
    },

    updateOnType: _.debounce(function(e) {
      var updateData={content: this.input.val()};
      this.model.set(updateData);
    }, 1000),

    updateOnFocusOut: function(e) {
      var updateData={content: this.input.val()};
      this.model.set(updateData);
    },

    focusin: function() {
      Router.navigate('todo/' + this.model.get("id"));
    },

    clear: function() {
      this.model.clear();
      Router.navigate('');
    },

    remove: function() {
      $(this.el).remove();
    },

  });
  return TodoView;
});
