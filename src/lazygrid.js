(function() {
  "use strict";
  // Create your component here
  // http://x-tags.org/docs
  xtag.register('sam-lazygrid', {
    lifecycle: {
      created: function() {
        this.xtag.scrollFuncX= window.pageXOffset;
        this.xtag.scrollFuncY= window.pageYOffset;
      },
      inserted: function() {},
      removed: function() {
        this.destroy();
      },
      attributeChanged: function() {}
    },
    events: {
      scroll: function () {
        var diffX=this.xtag.scrollFuncX-window.pageXOffset;
        var diffY=this.xtag.scrollFuncY-window.pageYOffset;
        if( diffX<0 ) {
            // Scroll right
        } else if( diffX>0 ) {
            // Scroll left
        } else if( diffY<0 ) {
            // Scroll down
        } else if( diffY>0 ) {
            // Scroll up
        } else return;
        
      }
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
        var x = this.xtag
        x.topIndex = undefined;
        x.bottomIndex = undefined;
        x.itemCount = 0;
        x.extraRenderRangeUp = [undefined, undefined];
        x.extraRenderRangeDown = [undefined, undefined];
        x.active = true;
        fastdom.write(function() {
          while (this.itemInViewport(bottomIndex)) {
            this.renderItem();
          }
          x.extraItems = Math.floor(x.count/4);
        }.bind(this));
      },
      //Destroys everything except itself.
      destroy: function () {
        this.destroyItems(0, this.count-1);
      }
      //Renders a single Item
      renderItem: function(index) {
        if (!this.active) return false;
        fastdom.write(function () {
          
        }.bind(this))
      },
      //Renders multiple Items
      renderItems: function(indexStart, indexEnd) {
        //Allows you to use an array instead of two seperate
        //Arguments
        if (Array.isArray(argument[0])) {
          indexStart = arguments[0][0]; 
          indexEnd = arguments[0][1]
        }
      },

      //Destroys a single Item
      destroyItem: function(index) {},
      //Destroys multiple Items
      destroyItems: function(indexStart, indexEnd) {
        //Allows you to use an array instead of two seperate
        //Arguments
        if (Array.isArray(argument[0])) {
          indexStart = arguments[0][0]; 
          indexEnd = arguments[0][1]
        }
      }
      
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
        //Allows you to use an array instead of two seperate
        //Arguments
        if (Array.isArray(argument[0])) {
          indexStart = arguments[0][0]; 
          indexEnd = arguments[0][1]
        }
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
        //Allows you to use an array instead of two seperate
        //Arguments
        if (Array.isArray(argument[0])) {
          indexStart = arguments[0][0]; 
          indexEnd = arguments[0][1]
        }
        var result;
        while (indexStart ==< indexEnd) {
          if (this.itemInViewport(indexStart)) return true;

        }
        return false;
      }
    },
    mixins: ["prepend"]
  });

}());
