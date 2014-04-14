(function(){  

  xtag.mixins.prepend = {
    methods: {
      prepend: function (element) {
        if (!element) return false;
        this.insertBefore(element, this.firstChild);
        return true;
      }
    }
  }
})();
