define(['underscore', 'backbone'], function(_, Backbone) {
  var TodoModel = Backbone.Model.extend({

    defaults: {
      id: null,
      content: "",
      done: false,
      visible: true
    },

    initialize: function() {
      this.on('change', this.updateStorage);
    },

    toggle: function() {
      this.set({done: !this.get("done")});
    },

    updateStorage: function(){
      this.collection.sync("update", this, {success: function(){}});
    },

    applyFilter: function(term){
      this.set('visible',(this.get('content').indexOf(term)>-1 || term=='')?true:false)
    },

    clear: function() {
      this.view.remove();
      this.destroy();
    }

  });
  return TodoModel;
});
