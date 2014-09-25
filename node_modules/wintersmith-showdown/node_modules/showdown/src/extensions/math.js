//
//  Math Extension
//

(function(){
    var math = function(converter) {
        return [
          // superscript
          { type: 'output',
            // doesn't work as a regex/replace function for some reason
            filter: function(text) {
              // negative lookahead assertion prevents interference with LaTeX math (ex. `$a^2 + b^2$`)
              return text.replace(/\^(\S*?)\^(?!.*?\$)/g, function(match, text) {
                // standard regex replace was inserting extra forward slashes,
                // used custom function instead
                return '<sup>' + text + '</sup>';
              });
            }
          },
          
          // subscript
          { type: 'output',
            filter: function(text) {
              // negative lookahead assertion prevents interference with LaTeX math (ex. `$a^2 + b^2$`)
              return text.replace(/~(\S*?)~(?!.*\$)/g, '<sub>$1</sub>');
            }
          },
          
          // MathJax
          // TODO: should these be `lang` extensions instead?
          { type: 'output',
            filter: function(text) {
              // match contents between `$`s
              // don't apply in code blocks or when escaped `\$`
              var re = /<p>\$(.+)\$<\/p>/g;
              // only proceed if there's actually math on the page
              if (!re.test(text)) {
                return text;
              }
              // add MathJax script to output
              text += "\n\n<script src='https://c328740.ssl.cf1.rackcdn.com/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>";
              return text.replace(re, function(match, math) {
                // standard regex replace was inserting extra forward slashes,
                // used custom function instead
                return '<p>\\\(' + math + '\\\)</p>';
              });
            }
          }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.math = math; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = math;
}());
