define([
  'jquery',
  'underscore',
  'backbone',
  'collections/todo_list',
  'views/page'
  ], function($, _, Backbone, Todos, PageView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      'todo/:id': 'showTodo',
      'search/:term': 'doSearch',
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){

    var pageView = new PageView();
    var app_router = new AppRouter();
  
    app_router.on('route:showTodo', function(id){
        var item=Todos.find(function(item){return item.get("id")==id;});
        if(item){
          item.view.putFocus();
        }
    });

    app_router.on('route:doSearch', function(searchTerm){
      Todos.applyFilter(searchTerm);
      pageView.searchTermDisplay(searchTerm);
    });

    app_router.on('route:defaultAction', function (actions) {
        pageView.prepareForNewTodo();
    });

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});
