define([
  'underscore', 
  'backbone', 
  'libs/backbone/localstorage', 
  'models/todo_model'
  ], function(_, Backbone, Store, Todo){
	  
	var TodosCollection = Backbone.Collection.extend({
    model: Todo,
    localStorage: new Store("todos"),
    done: function() {  //calculate how much is done
      return this.filter(function(item){ return item.get('done'); });
    },
    undone: function() { //calculate ho much is undone
      return this.without.apply(this, this.done());
    },
    applyFilter: function(term){  
      this.each(function(item){item.applyFilter(term)});
    }

  });
  return new TodosCollection;
});
