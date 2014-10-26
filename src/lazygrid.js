(function(){
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
        //"Down" If the 3rd quartile items are visible, then render more.
        if (data.delta < 0 &&
            this.inViewport(Math.round(this.bottomId - this.maxItems / 4))) {
          console.log("RERENDER");
          this.renderItems(this.bottomId+1, this.bottomId+this.maxItems);
        }
      }
    },
  	accessors: {
      //Maximum № of items.
      "count": {
        get: function () {
          return this.var.count;
        },
        set: function (value) {
          this.var.count = value;
        }
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
      //After N views, rerender the item.
      "rerenderAfter": function () {
        accessor:
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
        this.bottomId = this.renderItems(topId, this.count, true);
        //Define maximum items on the screen
        this.maxItems = this.bottomId - topId;
        return true;
        this.oldChildren = {};
      },
      //Takes item№ and wheater or not to render from scratch or reuse the old one.
      renderItem: function (i, fresh) {
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
        this.appendChild(node);
        return node;
      },
      renderItems: function (topId, bottomId, stopWhenOutOfViewport) {
        if (!this.active) return false;
        var i, node;
        for (i=topId; i<= bottomId; i++) {
          node = this.renderItem(i);
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
      destroyItem: function (i) {
        this.oldChildren[i] = this.removeChild(this.getItem(i));
      },
      //Destroys the grid
      destroy: function () {
        if (!this.active) return false;
        return true;
      }
    }
  });
}());
