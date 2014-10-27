(function(){
  "use strict";
  xtag.register('sam-lazygrid', {
  	lifecycle: {
  		created: function(){
        this.var = {};
  		}
  	},
  	events: {
      //On scroll
      "scrollwheel": function (data) {
        console.log("scroll")
        //"Down"
        if (data.delta < 0) {
          xtag.fireEvent(this, "scrollDown");
        }
      },
      "scrollDown": function () {
         //If the bottom half of the items aren't visible, then return.
         if (!this.inViewport(Math.round(this.bottomId - this.maxItems / 2))) return;
         requestAnimationFrame( function () {
           this.renderItems(this.bottomId+1, this.bottomId+this.maxItems);
         }.bind(this) );
         //Destroy All elements not in viewport
         if (!this.inViewport(this.topId)) {
           this.destroyItems(this.topId, this.bottomId, true, true);
         }
      }
    },
  	accessors: {
      //Maximum № of items.
      "count": {
        attribute: {number: true}
      },
      //Function to prepare items.
      "itemSetup": {
        get: function () {
          return this.var.itemSetup;
        },
        set: function (value) {
          this.var.itemSetup = value;
        }
      },
      //After N views, rerender the item.[ !⃝ 0 < n ]
      "rerenderAfter": {
        attribute: {number: true},
        set: function (value) {
          return value <= 0 ? 1 : value;
        }
      },
      "topId": {
        get: function () {
          return this.var.topId;
        },
        set: function (value) {
          if ((value < 0 || value > this.count) && this.verbose) {
            console.warn("Ignored attempt to set topId value because it was out of bounds"); }
          this.var.topId = value;
        }
      },
      "bottomId": {
        get: function () {
          return this.var.bottomId;
        },
        set: function (value) {
          if ((value < 0 || value > this.count) && this.verbose) {
            console.warn("Ignored attempt to set bottomId value because it was out of bounds"); }
          this.var.bottomId = value;
        }
      },
      //Enables error logging and stuff
      "verbose": {
        attribute: {boolean: true}
      }
    },
  	methods: {
      render: function (topId) {
        if (this.active) return false;
        if (!this.itemSetup || !this.count) return false;
        this.active = true;
        var i;
        //Define
        this.topId = topId;
        //Begin intial rendering.
        this.bottomId = this.renderItems(topId, this.count, true, true);
        //Define maximum items on the screen
        this.maxItems = this.bottomId - topId;
        return true;
        this.oldChildren = {};
      },
      //Takes item№ and wheater or not to render from scratch or reuse the old one.
      renderItem: function (i, fresh, animFrame) {
        if (!this.active) return false;
        if (i > this.count || i < 0) return false;
        // if (this.oldChildren[i]) this.appendChild
        var node = this.itemSetup(i);
        //I would prefer ID, but then dataset would interpret it as "-i-d"
        //That looked AWFUL.
        //I'm also using Id because of convention.
        node.dataset.lazyGridId = i;
        //Check for topId
        if (this.topId > i) this.topId = i;
        //Check for bottomId
        if (this.bottomId < i) {
          this.bottomId = i;
          this.topId += 1;
        }
        //With animation frame
        if (animFrame) {
          requestAnimationFrame(function () {
            this.appendChild(node);
          }.bind(this));
        }
        //Without animationFrame
        this.appendChild(node);
      },
      renderItems: function (topId, bottomId, stopWhenOutOfViewport, animFrame) {
        if (!this.active) return false;
        var i, node;
        for (i=topId; i<= bottomId; i++) {
          this.renderItem(i, false, animFrame);
          if (stopWhenOutOfViewport && !this.inViewport(i)) return i;
        }
        return true;
      },
      //Returns if in viewport, accepts item№
      inViewport: function (i) {
        if (!this.active) return undefined;
        var node = this.getItem(i);
        if (!node) return false;
        return withinViewport(node);
      },
      //Returns an item from the item №
      getItem: function (i) {
        if (!this.active) return false;
        return this.querySelector('[data-lazy-grid-id="'+i+'"]');
      },
      destroyItem: function (i, animFrame) {
        if (!this.active) return false;
        var node = this.getItem(i);
        //Errorchecking
        if (node === null) this.error("Cannot destroy item which is NULL", true);
        this.log("destroy №" + i)
        //With anim frame
        if (animFrame) {
          requestAnimationFrame(function () {
            this.removeChild(node);
          }.bind(this));
          //Without animframe
        } else {
          this.removeChild(node);
        }
        //Set top/bottom id
        if (i === this.topId) this.topId += 1;
        if (i === this.bottomId) this.bottomId -= 1;
      },
      destroyItems: function (topId, bottomId, stopWhenInViewport, animFrame) {
        if (!this.active) return false;
        var i;
        this.log("start destroying")
        for (i=topId; i<= bottomId; i++) {
          if (stopWhenInViewport && this.inViewport(i)) return i;
          this.log("DESTROY ITEM № " + i);
          this.destroyItem(i, animFrame);
        }
      },
      error: function (e, thro) {
        if (!this.verbose) return false;
        if (thro) throw e;
        console.warn(e);
        return true;
      },
      log: function (log) {
        if (!this.verbose) return;
        console.log(log);
      },
      //Destroys the grid
      destroy: function () {
        if (!this.active) return false;
        return true;
      }
    }
  });
}());
