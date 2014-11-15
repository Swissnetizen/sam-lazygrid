(function(){
  "use strict";
  var onScrollDown = function () {
    //If the bottom half of the items aren't visible, then return.
    if (!this.inViewport(Math.round(this.bottomId - this.maxItems / 2))) return;
    this.renderItems(this.bottomId+1, this.bottomId+this.maxItems);
    //Destroy All elements not in viewport
    if (!this.inViewport(this.topId)) {
      this.destroyItems(this.topId, this.bottomId, true, true);
    }
  };
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
          fastdom.read(onScrollDown.bind(this));;
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
          if (value < 0 || value > this.count) {
            console.warn("Ignored attempt to set topId value because it was out of bounds"); }
          this.var.topId = value;
        }
      },
      "bottomId": {
        get: function () {
          return this.var.bottomId;
        },
        set: function (value) {
          if (value < 0 || value > this.count) {
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
      //Also takes condition and callback
      renderItem: function (i, fresh, callback) {
        if (!this.active || i > this.count || i < 0) return false;
        fastdom.read(function () {
          var that = this.that;
          // if (this.oldChildren[i]) this.appendChild
          var node = that.itemSetup(i);
          node.dataset.lazyGridId = i;
          //Check for topId
          if (that.topId > i) this.topId = i;
          //Check for bottomId
          if (that.bottomId < i) that.bottomId = i;
          fastdom.write(function () {
            that.appendChild(node);
            return this.cb(i);
          //More parameters
          }.bind({that: this, cb: this.callback, i: i}));
        //Parameters
        }.bind({that: this, i: i, callback: callback, fresh: fresh}));
      },
      renderItems: function (topId, bottomId, stopWhenOutOfViewport, fresh) {
        if (!this.active || this.bottomId > this.count || this.topId < 0) return false;
        this.renderItem(topId, fresh, function (i) {
          fastdom.read(function () {
          //Referencing the element's this
            var that = this.that;
            if (i === this.bottomId) return;
            if (this.stopWhenOutOfViewport && !that.inViewport(i)) return false;
            that.renderItems(i+1, this.bottomId, this.stopWhenOutOfViewport, this.fresh);
          }.bind(this));
        }.bind({that: this, bottomId: bottomId, stopWhenOutOfViewport: stopWhenOutOfViewport, fresh: fresh}));
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
      destroyItem: function (i) {
        if (!this.active) return false;
        if (i < 0 || i > this.count) return;
        fastdom.read(function () {
          //Define variables
          var that = this.that,
              i = this.i,
              node = that.getItem(i);
          //Errorchecking
          if (node === null) throw "Cannot destroy item which is NULL"
          that.log("destroy №" + i);
          //Actually Destroys
          fastdom.write(function () {
            that.removeChild(node);
          }.bind(this));
          //Set top/bottom id
          if (i === that.topId) that.topId += 1;
          if (i === that.bottomId) that.bottomId -= 1;
        }.bind({that: this, i:i}));
      },
      //Destroy Items, takes top, bottom and stop in viewport
      destroyItems: function (topId, bottomId, stopWhenInViewport) {
        if (!this.active || topId) return false;
        var i;
        this.log("start destroying")
        for (i=topId; i<= bottomId; i++) {
          fastdom.read(function () {
            var that = this.that;
            if (this.stopWhenInViewport && that.inViewport(this.i)) return i;
            that.log("DESTROY ITEM № " + i);
            that.destroyItem(i);
          }.bind({that: this, i: i, stopWhenInViewport: stopWhenInViewport}));
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
