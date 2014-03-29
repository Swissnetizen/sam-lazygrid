(function(){  
  "use strict";
  // Create your component here
  // http://x-tags.org/docs
  
  xtag.register('sam-lazygrid', {
    lifecycle: {
      created: function() {},
      inserted: function() {},
      removed: function() {},
      attributeChanged: function() {}
    }, 
    events: { 
      scroll: function () {
      }
    },
    accessors: {
      "setupItem": {
        get: function () {
          return this.xtag.setupItem;
        },
        set: function (value) {
          this.xtag.setupItem = value;
        }
      },
      "count": {
        get: function () {
          return this.xtag.count;
        },
        set: function (value) {
          this.xtag.count = value;
        }
      }
    }, 
    methods: {
      //Starts rendering the list.
      render: function () {
        if (!setupItem || !count) return false;
        this.xtag.topItem = undefined;
        this.xtag.bottomItem = undefined;
        this.xtag.itemCount = 0;
        this.xtag.upRender = undefined;
        this.xtag.downRender = undefined;
        this.xtag.active = true;
      },
      //Renders a single Item
      renderItem: function () {
        if (!this.active) return false;
      },
      //Renders multiple Items
      renderItems: function () {
      },
      destroyItem: function () {
      },
      //Destroys multiple Items
      destroyItems: function () {
      }
      //Returns a single Item
      getItem: function (index) {
        return this.querySelector("[data-index="+index+"]");
      },
      //Returns multiple Items as an array
      //Not sure why you'd need this
      // arrayOfItems[1] vs this.getItem(20)
      //It's just here to replicate the experience of 
      //the other xxxxxItem functions having a 
      //doppleganger for multiple items.
      getItems: function (indexStart, indexEnd) {
        var array = [],
        i = 0;
        while(indexStart !== indexEnd+1) {
          array[i] = this.getItem(indexStart);
          indexStart++;
          i++;
        }
        return array;
      },
    }
  });

}());
