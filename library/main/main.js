(function(exports) {
'use strict';
var App = function() {
  this.snapper = new window.Snap({
    element: document.getElementById('content')
  });
};
window.app = new App();
})(window);
