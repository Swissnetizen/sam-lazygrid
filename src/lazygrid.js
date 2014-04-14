(function() {
  "use strict";
  // Create your component here
  // http://x-tags.org/docs
  xtag.register("sam-lazygrid", {
    lifecycle: {
      created: function() {
        this.xtag.scrollFuncX = window.pageXOffset;
        this.xtag.scrollFuncY = window.pageYOffset;
      },
      inserted: function() {},
      removed: function() {
        this.destroy();
      },
      attributeChanged: function() {}
    },
    events: {
      scroll: function () {
        fastdom.read(function () {
          var x = this.xtag,
              diffX = x.scrollFuncX-window.pageXOffset,
              diffY = x.scrollFuncY-window.pageYOffset,
              direction = "";
              
          if (diffX < 0) {
              // Scroll right; will probably be merged with scroll down
          } else if (diffX > 0) {
              // Scroll left; opposite of above
          } else if (diffY < 0) {
              // Scroll down
              direction = "Down";
              locat="bottom";
              directionOpposite = "Up";
              locatOpposite = "top;"
          } else if (diffY>0) {
              // Scroll up
              direction = "Up";
              locat="top";
              directionOpposite = "Down";
              locatOpposite = "bottom;"
          } else return;
          //Haven't rendered anything up or what we have rendered is fully 
          //visible
          if (typeof x.extraRenderRangeUp[0] !== number ||
            this.itemsInViewport(x["extraRenderRange"+direction])) {
            //Set new extrarenderrange
            x["extraRenderRange"+direction] = [x[locat+"Index"], x[locat+"Index"]+x.halfCount];
            //Write
            fastdom.write(function () {
              this.renderItems(x["extraRenderRange"+direction]);
            }.bind(this));
          }
          //Are the items in the opposite location not visible?
          if (!x.itemsInViewport(x[locatOpposite+"Index"])) {
            //If so delete  'em
            fastdom.write(function () {
              this.destroyItems(x[locatOpposite+"Index"], x[locatOpposite+"Index"]+x.halfCount);
            });
          }
        });
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
        var x = this.xtag;
        if (!x.setupItem || !x.count || x.active) return false;
        x.topIndex = undefined;
        x.bottomIndex = undefined;
        x.itemCount = 0;
        x.extraRenderRangeUp = [undefined, undefined];
        x.extraRenderRangeDown = [undefined, undefined];
        x.active = true;
        while (this.itemInViewport(bottomIndex)) {
          this.renderItem();
        }
        x.halfCount = Math.ceil(x.count/2);
        return true;
      },
      //Destroys everything except itself.
      destroy: function () {
        this.destroyItems(0, this.count-1);
      },
      //Renders a single Item
      renderItem: function (index) {
        fastdom.write(function () {
          if (!this.xtag.active || index > this.xtag.count-1 || index < 0) return false;
          var node = this.xtag.setupItem(index);
          //Replace an existing node
          if (this.xtag.bottomIndex >= index <= this.xtag.topIndex) {
            this.destroy(index);
            this.appendBefore(this.getItem(index-1), node);
          } else if (this.xtag.bottomIndex < index) {
            this.append(node);
            this.xtag.bottomIndex = index;
          } else if (this.xtag.topIndex > index) {
            this.prepend(node);
            this.xtag.topIndex = index;
          }
      }.bind(this));
      },
      //Renders multiple Items
      renderItems: function(indexStart, indexEnd) {
        //Allows you to use an array instead of two seperate
        //Arguments
        if (Array.isArray(argument[0])) {
          indexStart = arguments[0][0]; 
          indexEnd = arguments[0][1]
        }
        fastdom.write()
      },

      //Destroys a single Item
      destroyItem: function(index) {
        if (!this.getItem(index) || !this.xtag.active) return false;
        this.removeChild(this.getItem(index))
      },
      //Destroys multiple Items
      destroyItems: function(indexStart, indexEnd) {
        //Allows you to use an array instead of two seperate
        //Arguments
        if (Array.isArray(argument[0])) {
          indexStart = arguments[0][0]; 
          indexEnd = arguments[0][1]
        }
        while (indexStart <= indexEnd) {
          this.destroyItem(indexStart);
          indexStart += 1;
        }
      },
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
        while (indexStart <= indexEnd) {
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
        //Makes next line more leigble
        var inside = this.itemInViewport
        if (inside(indexStart) && inside(indexEnd)) return true;
        // else
        return false;
      }
    },
    mixins: ["prepend"]
  });

}());
