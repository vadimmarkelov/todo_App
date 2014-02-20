define([ // main page of App
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
      "click button.createTodo":  "createTodo",   //save ToDo by button
      "keypress #new-todo-text": "updateOnEnter", //save ToDo by ENTER
      "keyup .search": "searchType", //live update of filter
      "change .search": "searchChange", 
      "keyup #new-todo-text": "updateOnType", //to enable/disable ADD button if empty string
      "focus #new-todo-text": "onNewFocus" //to update Router in case of focus come to main input field
    },

    countersTemplate: _.template(CountersTemplate), //precompile template for main counter (progress indicator)

    initialize: function() {
      _.bindAll(this, 'addOne', 'renderCounters', 'updateOnType', 'updateOnEnter','prepareForNewTodo','searchType','searchChange','searchTermDisplay');
      this.input = this.$("#new-todo-text");
      Todos.bind('add',this.addOne);
      Todos.bind('all',this.renderCounters);
      
      Todos.fetch();  //get all items from data storage
    },

    searchTermDisplay: function(term){ //display search term on UI in case land to search mode by direct URL
      this.$(".search").val(term);
    },

    searchChange: function(){
      var searchTerm=$.trim(this.$(".search").val()); //clear search term from trash
      Todos.applyFilter(searchTerm);
      if(searchTerm!='') 
        Router.navigate('search/'+searchTerm, {replace: true});
      else 
        Router.navigate(''); //user is leaving Searh state and go to Main state
    },

    searchType: _.debounce(function(){  //do search only after timeout, prevent performance issues in case of to rapid typing
      var searchTerm=$.trim(this.$(".search").val());
      Todos.applyFilter(searchTerm);
      if(searchTerm!='') 
        Router.navigate('search/'+searchTerm, {replace: true});
      else 
        Router.navigate('');
    }, 500),

    updateOnType: function() {  //enable/disable Add button if text is empty
        this.$("button.createTodo").prop('disabled',($.trim(this.input.val())==''));
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

    addOne: function(todo) { //put one item to the DOM
      var view = new TodoView({model: todo});
      this.$("#todos").prepend(view.render().el);
      Router.navigate('');
    },

    onNewFocus: function() { //Main state of App initiated by focus to main input field
      Router.navigate('');
    },

    prepareForNewTodo: function(){  //clear input after creation of new ToDo item
      this.$("#new-todo-text").focus();
    },

    createTodo: function() {
      var newTodo= new Todo({
        id: _.uniqueId(), //TODO: this ID should be replaced by proper source (can create cdata onsistency issues) !!!!
        content: $.trim(this.input.val()),
        done:    false
      });
      Todos.add(newTodo);
      Todos.sync("create", newTodo, {success: function(){}}); //save item to data storage
      this.input.val('');
    },

  });
  return PageView;

});
