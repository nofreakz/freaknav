FreakNav
========

Keyboard Navigation for links

## Live Demo
You can see the script running <a href="http://allanesquina.github.io/FreakNav/" target="_blank">here</a>.

## Installation
To use the Freak Nav, add to your project the freaknav.js.
```
<script src="lib/freaknav.js"></script>
```
## Usage
You just need to instantiate the object

__JAVASCRIPT__
```
var nav = new freakNav();
```
__HOTKEYS__

You can also navigate using hotkeys. To use this feature, you just need to put data-hotkey attribute to any page's link
```
<a href="#" data-hotkey="r">My link with hotkey "R"</a>

```
__NOTE__: The elements need to be loaded first, to ensure this, use: 

```
window.onload = function() {
    var nav = new freakNav();
}
```
