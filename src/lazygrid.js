(function() {
  "use strict";
  // Create your component here
  // http://x-tags.org/docs

  xtag.register('sam-lazygrid', {
    lifecycle: {
      created: function() {},
      inserted: function() {},
      removed: function() {
        this.destroy();
      },
      attributeChanged: function() {}
    },
    events: {
      scroll: function() {}
    },
    accessors: {
      "setupItem": {
        get: function() {
          return this.xtag.setupItem;
        },
        set: function(value) {
          this.xtag.setupItem = value;
        }
      },
      "count": {
        get: function() {
          return this.xtag.count;
        },
        set: function(value) {
          this.xtag.count = value;
        }
      }
    },
    methods: {
      //Starts rendering the list.
      render: function(top) {
        if (!setupItem || !count) return false;
        this.xtag.topIndex = undefined;
        this.xtag.bottomIndex = undefined;
        this.xtag.itemCount = 0;
        this.xtag.extraRenderRangeUp = [undefined, undefined];
        this.xtag.extraRenderRangeDown = [undefined, undefined];
        this.xtag.active = true;
        while (this.itemInViewport(bottomIndex)) {

        }
      },
      destroy: function () {
        this.destroyItems(0, this.count-1);
      }
      //Renders a single Item
      renderItem: function(index) {
        if (!this.active) return false;
      },
      //Renders multiple Items
      renderItems: function(indexStart, indexEnd) {},
      //Destroys a single Item
      destroyItem: function(index) {},
      //Destroys multiple Items
      destroyItems: function(indexStart, indexEnd) {}
      //Returns a single Item
      getItem: function(index) {
        return this.querySelector("[data-index=" + index + "]");
      },
      //Returns multiple Items as an array
      //Not sure why you'd need this
      // arrayOfItems[1] vs this.getItem(20)
      //It's just here to replicate the experience of 
      //the other xxxxxItem functions having a 
      //doppleganger for multiple items.
      getItems: function(indexStart, indexEnd) {
        var array = [],
          i = 0;
        while (indexStart == < indexEnd) {
          array[i] = this.getItem(indexStart);
          indexStart++;
          i++;
        }
        return array;
      },
      itemInViewport: function(index) {
        var rect = el.getBoundingClientRect();
        return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
          rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
      },
      itemsInViewport: function(indexStart, indexEnd) {
        var result;
        while (indexStart == < indexEnd) {
          if (this.itemInViewport(indexStart)) return true;

        }
        return false;
      }
    },
    mixins: ["prepend"]
  });

}());
