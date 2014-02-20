define(['underscore', 'backbone'], function(_, Backbone) {
  var TodoModel = Backbone.Model.extend({

    defaults: {
      id: null,
      content: "",
      done: false,
      visible: true //used by Filter
    },

    initialize: function() {
      this.on('change', this.updateStorage);
    },

    toggle: function() {
      this.set({done: !this.get("done")});
    },

    updateStorage: function(){
      this.collection.sync("update", this, {success: function(){}});  //save to data storage on update
    },

    applyFilter: function(term){
      this.set('visible',(this.get('content').indexOf(term)>-1 || term=='')?true:false); //filter rule
    },

    clear: function() { 
      this.view.remove(); //remove from DOM
      this.destroy(); //remove from collection (and data storage)
    }

  });
  return TodoModel;
});
