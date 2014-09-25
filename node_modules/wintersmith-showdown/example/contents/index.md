---
title: Wintersmith Showdown
template: index.jade
showdownExtensions: ['github', 'table', 'math', 'smartypants', 'footnotes']
---

Headers
-------

As shown above. _In TextMate, use = or - followed by tab to automatically fill in underlines._


Emphasis
--------

This is **bold** and this is _italic_.


Links
-----

This is a simple inline link <http://jnordberg.github.com/wintersmith/> (extra?), [regular inline link](http://nodejs.org), and [another with alt text](http://coffeescript.org "Coffeescript"). Also, a [reference style][my_reference_link] link and implicit reference link to [Daring Fireball][]. Finally, here's a [local link](/about/).

[my_reference_link]: http://johnmacfarlane.net/pandoc/README.html "Pandoc: a universal document converter"
[Daring Fireball]: http://daringfireball.net/


Block Quotes
------------

> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elementum eleifend nunc, in hendrerit metus pretium ac. Mauris a erat velit. Fusce sapien velit, elementum a fermentum nec, sollicitudin a metus.


Lists
-----

Unordered list:

- item 1
- item 2
	- nested item 1
- item 3
    - nested item 2

Ordered list:

1. Ordered list item
2. Ordered list item
3. Ordered list item


Code
----

Inline code `import urllib2` using backticks.

Fenced code with optional language identifier (extra):

```javascript
// example
math = {
  root: Math.sqrt,
  square: square,
  cube: function(x) {
    return x * square(x);
  }
};
```


Images
------
![with optional caption](http://wintersmith.io/images/wintersmith.svg "Wintersmith logo")

A ![resize icon][resize_icon] reference style image with alt text.

[resize_icon]: https://github.com/favicon.ico "GitHub"


Horizontal Rule
---------------

---


Strikethrough (extra)
---------------------

This text has been ~~stricken from the document~~ removed.


Footnotes (extra)
-----------------

Here's some text with a footnote.[^fn1] And here's a pandoc-style inline footnote.^[All the text is right here.] Finally, a named footnote.[^namednote]

[^namednote]: This one even comes before fn1 in plain text, but shows up in the right order in HTML.

[^fn1]: And that's the footnote.


Tables (showdown-extended)
---------------

Showdown Tables:

| Col 1   | Col 2                                              |
|======== |====================================================|
|**bold** | Value                                              |
| Plain   | Other _value_                                      |


Another Table:

| Col 3   | Col 4                                              |
|======== |====================================================|
| data 1  | data 2                                             |

Cross-References (showdown-extended)
-------------------------

See the [Code](#code) section.


Math, etc. (showdown-extended)
-------------

TeX math:

$c = \sqrt{ a^2 + b^2 }$

$\int_{-\infty}^{\infty} \frac{1}{x} \, dx$

$f(x) = \sum_{n = 0}^{\infty} \alpha_n x^n$

$x_{1,2}=\frac{-b\pm\sqrt{\color{Red}b^2-4ac}}{2a}$

$\hat a  \bar b  \vec c  x'  \dot{x}  \ddot{x}$


Superscript/subscript:
H~2~O is a liquid. 2^10^ is 1024.


Smart characters (smartypants/showdown-extended):
--------------------------------------

1. Smart quotes: "This is in quotations." This isn't. 'But this is this,' and here's an apostrophe.
2. Elipsis: ...
3. Em dash: ---
4. En dash: --
