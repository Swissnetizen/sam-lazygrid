(function(){
  xtag.register('sam-lazygrid', {
  	lifecycle: {
  		created: function(){

  		}
  	},
  	events: {
      "scrollwheel": function (data) {
        console.log(data.delta < 0 ? "DOWN V" : (data.delta != 0 ? "UP |^|" : "NONEO") );
      }
    },
  	accessors: {
      "count": {
        get: function () {
          return this.var.count;
        },
        set: function (value) {
          this.var.count = value;
        }
      },
      "itemSetup": {
        get: function () {
          return this.var.itemSetup;
        },
        set: function (value) {
          this.var.itemSetup = value;
        }
      }
    },
  	methods: {
      render: function (topID) {
        if (this.active) this.destroy();
        if (!this.itemSetup || !this.count) return false;
        this.active = true;
        var i;
        this.topID = topID;
        this.bottomID = this.count;
        for (i=topID; i<= this.count; i++) {
          if (!withinViewport(this.createItem(i))) break;
        }
        this.bottomID = i;
        this.maxItems = topID - i;

      },
      createItem: function (i) {
        var node = this.itemSetup(i);
        //I would prefer ID, but then dataset would interpret it as "-i-d"
        //That looked AWFUL.
        node.dataset.lazyGridId = i;
        //Check for topID
        if (this.topID > i) this.topID = i;
        //Check for bottomID
        if (this.bottomID < i) this.bottomID = i;
        this.appendChild(node);
        return node;
      },
      destroy: function () {
        if (!this.active) return false;
        return true;
      }
    }
  });
}());
