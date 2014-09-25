//
//  Smartypants Extension
//

(function(){
    // load typogr.js 
    if (typeof typogr == 'undefined' && typeof require !== 'undefined') {
      typogr = require('typogr');
    };
    var smartypants = function(converter) {        
        return [
          { type: 'output',
            filter: function(text) {
              // don't run if text is empty
              if (text.length) {
                text = typogr(text).chain().amp().smartypants().value();
              }
              return text;
            }
          }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.smartypants = smartypants; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = smartypants;
}());
