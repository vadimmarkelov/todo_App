define([
  'jquery',
  'underscore', 
  'backbone',
  'collections/todo_list',
  'models/todo_model',
  'views/todo_view',
  'text!templates/counters.html'
  ], function($, _, Backbone, Todos, Todo, TodoView, CountersTemplate){
  
  var Router= new Backbone.Router;
  
  var PageView = Backbone.View.extend({

    el: $("#todoapp"),

    events: {
      "click button.createTodo":  "createTodo",
      "keypress #new-todo-text": "updateOnEnter",
      "keyup .search": "searchType",
      "keyup #new-todo-text": "updateOnType",
      "focus #new-todo-text": "onNewFocus"
    },

    countersTemplate: _.template(CountersTemplate),

    initialize: function() {
      _.bindAll(this, 'addOne', 'renderCounters', 'updateOnType', 'updateOnEnter','prepareForNewTodo','searchType','searchTermDisplay');
      this.input = this.$("#new-todo-text");
      Todos.bind('add',this.addOne);
      Todos.bind('all',this.renderCounters);
      
      Todos.fetch();
    },

    searchTermDisplay: function(term){
      this.$(".search").val(term);
    },

    searchType: _.debounce(function(){
      var searchTerm=$.trim(this.$(".search").val());
      if(searchTerm!='') 
        Router.navigate('search/'+searchTerm, {trigger: true});
      else { 
        Todos.applyFilter('');
        Router.navigate('');
      }
    }, 500),

    updateOnType: function() {
      if($.trim(this.input.val())=='')
        this.$("button.createTodo").prop('disabled',true);
      else
        this.$("button.createTodo").prop('disabled',false);
    },

    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.createTodo();
    },

    renderCounters: function() {
      this.$('.counters').html(this.countersTemplate({
        done:   Todos.done().length,
        undone: Todos.undone().length
      }));
    },

    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todos").prepend(view.render().el);
      Router.navigate('');
    },

    onNewFocus: function() {
      Router.navigate('');
    },

    prepareForNewTodo: function(){
      this.$("#new-todo-text").focus();
    },

    createTodo: function() {
      var newTodo= new Todo({
        id: _.uniqueId(),
        content: this.input.val(),
        done:    false
      });
      Todos.add(newTodo);
      Todos.sync("create", newTodo, {success: function(){}});
      this.input.val('');
    },

  });
  return PageView;

});
