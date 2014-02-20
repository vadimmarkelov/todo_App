define([
  'jquery',
  'underscore',
  'backbone',
  'collections/todo_list',
  'views/page'
  ], function($, _, Backbone, Todos, PageView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'todo/:id': 'showTodo',     //this is to set focus to one of the items in list
      'search/:term': 'doSearch', //this one for search on list of items
      '*actions': 'defaultAction' 
    }
  });
  
  var initialize = function(){

    var pageView = new PageView();
    var app_router = new AppRouter();
  
    app_router.on('route:showTodo', function(id){
        var item=Todos.find(function(item){return item.get("id")==id;}); //search for item by ID
        if(item){
          item.view.putFocus(); //focus user attention to one of items
        }
    });

    app_router.on('route:doSearch', function(searchTerm){
      Todos.applyFilter(searchTerm);            //make some of items visible according to the filter
      pageView.searchTermDisplay(searchTerm);   //in case user land to the App by search URL - display search term
    });

    app_router.on('route:defaultAction', function (actions) {
        pageView.prepareForNewTodo(); //put focus to main input field
    });

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});
