;(function(wdw, doc) {
    'use strict';

    var _plugin = "freakNav",
        defaults = {},
        keyMap = {48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",81:"q",87:"w",69:"e",82:"r",84:"t",89:"y",85:"u",73:"i",79:"o",80:"p",65:"a",83:"s",68:"d",70:"f",71:"g",72:"h",74:"j",75:"k",76:"l",90:"z",88:"x",67:"c",86:"v",66:"b",78:"n",77:"m"};

    function Plugin() {
        this.init();
    }

    Plugin.prototype = {
        targetElement: document,
        currentPosition: -1,
        prePosition: 0,
        totalItens: 0,
        navElements: {},
        currentObj: {},
        nextObj: {},
        init: function() {
            this.loadCss();
            this.getElement();
            this.getAllNavElements();
            this.totalItens = this.navElements.length;
            this.currentObj = this.navElements[0];
            this.addClass(this.currentObj, 'el_selected');

            var self = this;
            doc.onkeydown = function(e) {
                self.onKeyDown(e);
            };
        },
        loadCss: function() {
            var styleElem = document.createElement('style'),
                css = null,
                head = document.getElementsByTagName('head')[0];

            styleElem.type = 'text/css';
            css = '.el_selected {color: #000 !important; background: #FFA500 !important;}';

            if (styleElem.styleSheet) {
                styleElem.styleSheet.cssText = css;
            } else {
                styleElem.appendChild(document.createTextNode(css));
            }

            head.appendChild(styleElem);
        },
        hasClass: function(obj, cssClass) {
            return obj.className.match(cssClass);
        },
        addClass: function(obj, cssClass) {
            obj.className += ' ' + cssClass;
        },
        removeClass: function(obj, cssClass) {
            obj.className = obj.className.replace(cssClass, '');
        },
        onKeyDown: function(e) {
            window.scrollTo(0,0);

            // arrows
            if(!keyMap[e.keyCode]){
                switch (e.keyCode) {
                    // up
                    case 38:
                        this.removeClass(this.currentObj, 'el_selected');
                        this.currentObj = this.findNextItem('up');
                        this.addClass(this.currentObj, 'el_selected');
                    break;

                    // down
                    case 40:
                        this.removeClass(this.currentObj, 'el_selected');
                        this.currentObj = this.findNextItem('down');
                        this.addClass(this.currentObj, 'el_selected');
                    break;

                    // left
                    case 37:
                        this.removeClass(this.currentObj, 'el_selected');
                        this.currentObj = this.findNextItem('left');
                        this.addClass(this.currentObj, 'el_selected');
                    break;

                    // right
                    case 39:
                        this.removeClass(this.currentObj, 'el_selected');
                        this.currentObj = this.findNextItem('right');
                        this.addClass(this.currentObj, 'el_selected');
                    break;

                    // enter
                    case 13:
                        window.open(this.currentObj.href);
                    break;
                }
            // hotkeys (numbers and letters)
            } else {
                this.removeClass(this.currentObj, 'el_selected');
                this.currentObj = this.findHotkeyItem(e.keyCode);
                this.addClass(this.currentObj, 'el_selected');
            }

            //console.dir(e);
        },
        getAllNavElements: function() {
            var tempOffset = null,
                i = null;

            this.navElements = Array.prototype.slice.call(this.targetElement.getElementsByTagName('a'));
            i = this.navElements.length;

            while (i--) {
                tempOffset = this.getOffset(this.navElements[i]);
                this.navElements[i].initTop = tempOffset.top;
                //this.navElements[i].initialLeft = tempOffset.left;
            }

            this.navElements.sort(function(a,b) {return a.initTop-b.initTop})
        },
        getElement: function() {
            this.targetElement = document.body;
        },
        filterNavElements: function(way) {
            var i = this.totalItens,
                currentObjOffset = this.getOffset(this.currentObj),
                arrTemp = [],
                tempOffset = null;

            switch (way) {
                case 'up':
                    while (i--) {
                        tempOffset = this.getOffset(this.navElements[i]);
                        if (tempOffset.top < currentObjOffset.top) {
                            arrTemp.push(this.navElements[i]);
                        }
                    }
                break;

                case 'down':
                    while (i--) {
                        tempOffset = this.getOffset(this.navElements[i]);
                        if (tempOffset.top > (currentObjOffset.top + 2)) {
                            arrTemp.push(this.navElements[i]);
                        }
                    }
                break;

                case 'left':
                    while (i--) {
                        tempOffset = this.getOffset(this.navElements[i]);
                        if (tempOffset.left < currentObjOffset.left)    {
                            arrTemp.push(this.navElements[i]);
                        }
                    }
                break;

                case 'right':
                    while (i--) {
                        tempOffset = this.getOffset(this.navElements[i]);
                        if (tempOffset.left > (currentObjOffset.left + 2))    {
                            arrTemp.push(this.navElements[i]);
                        }
                    }
                break;
            }

            return arrTemp;
        },
        calculateDistance: function(navElements) {
            if (navElements.length == 0) {
                return this.currentObj;
            }

            var i = navElements.length,
                currentObjOffset = this.getOffset(this.currentObj),
                aux = [],
                tempOffset = null,
                sideA = null,
                sideB = null;

            while (i--) {
                tempOffset = this.getOffset(navElements[i]);
                sideA = currentObjOffset.top - tempOffset.top;
                sideB = currentObjOffset.left - tempOffset.left;
                sideA = (sideA < 0) ? sideA * -1: sideA;
                sideB = (sideB < 0) ? sideB * -1: sideB;
                navElements[i].offsetDistance = this.findHypotenuse(sideA, sideB);
            }

            navElements.sort(function(a,b) {return a.offsetDistance-b.offsetDistance});
            return navElements[0];
        },
        findNextItem: function(way) {
            var tempNavElements = this.filterNavElements(way);
            return this.calculateDistance(tempNavElements);
        },
        findHotkeyItem: function(keycode){
            var hotkeyElements = document.getElementsByTagName('a'),
                i = hotkeyElements.length,
                hotkeyElement = this.currentObj;

            while(i--) {
                if(hotkeyElements[i].hasAttribute('data-hotkey') && hotkeyElements[i].getAttribute('data-hotkey') === keyMap[keycode]){
                    hotkeyElement = hotkeyElements[i];
                    break;
                }
            }
            
            return hotkeyElement;
        },
        getOffset: function(obj) {
            var ol = 0,
                ot = 0,
                height = obj.offsetHeight,
                width = obj.offsetWidth;

          if (obj.offsetParent) {
            do {
              ol += obj.offsetLeft;
              ot += obj.offsetTop;
            } while (obj = obj.offsetParent);
          }

          return {
              left: ol,
              top: ot,
              width: width,
              height: height
          };
        },
        findHypotenuse: function(A, B) {
            var sideA = Math.pow(A, 2),
                sideB = Math.pow(B, 2),
                hypotenuse = null;

                hypotenuse = sideA + sideB;
                //Raiz Quadrada
                hypotenuse = Math.sqrt(hypotenuse);
                return hypotenuse;
        }
    }

    wdw[_plugin] = Plugin;
})(window, document);

window.onload = function() {
    var nav = new freakNav();
}