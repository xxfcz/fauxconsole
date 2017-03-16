/*! fauxconsole originally by by Chris Heilmann (http://wait-till-i.com);
 * forked by Charles Sanquer (https://github.com/csanquer/fauxconsole);
 * re-written by Roland Hummel (https://github.com/defaude/fauxconsole).
 */
(function (window) {
    // for use of callee in IEContentLoaded()
    // "use strict"; // mostly for me and my IDE :)

    var consoleName = 'console';   // use a name other than 'console' for the convenience of debugging

    // --- some tools ---
    function createElement(tagName, attributes, innerHTML) {
        var element = document.createElement(tagName);
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                element[attr] = attributes[attr];
            }
        }
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        return element;
    }

    /*!
     * contentloaded.js
     *
     * Author: Diego Perini (diego.perini at gmail.com)
     * Summary: cross-browser wrapper for DOMContentLoaded
     * Updated: 20101020
     * License: MIT
     * Version: 1.2
     *
     * URL:
     * http://javascript.nwbox.com/ContentLoaded/
     * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
     *
     */

    // @win window reference
    // @fn function reference
    function contentLoaded(win, fn) {

        var done = false, top = true,

            doc = win.document, root = doc.documentElement,

            add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
            rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
            pre = doc.addEventListener ? '' : 'on',

            init = function (e) {
                if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                if (!done && (done = true)) fn.call(win, e.type || e);
            },

            poll = function () {
                try {
                    root.doScroll('left');
                } catch (e) {
                    setTimeout(poll, 50);
                    return;
                }
                init('poll');
            };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
            if (doc.createEventObject && root.doScroll) {
                try {
                    top = !win.frameElement;
                } catch (e) {
                }
                if (top) poll();
            }
            doc[add](pre + 'DOMContentLoaded', init, false);
            doc[add](pre + 'readystatechange', init, false);
            win[add](pre + 'load', init, false);
        }

    }

    function setup() {
        var consoleDiv, consoleContent;

        //check existence of console
        if (typeof window[consoleName] === 'undefined' || typeof window[consoleName].log === 'undefined') {
            consoleDiv = createElement('div', { className: 'fauxconsole' });

            consoleDiv.appendChild(createElement('a', { href: 'javascript:' + consoleName + '.hide()' }, 'hide'));
            consoleDiv.appendChild(createElement('a', { href: 'javascript:' + consoleName + '.show()' }, 'show'));
            consoleDiv.appendChild(createElement('a', { href: 'javascript:' + consoleName + '.clear()' }, 'clear'));

            consoleContent = createElement('pre');
            consoleDiv.appendChild(consoleContent);

            (document.body || document.documentElement).appendChild(consoleDiv);
            // hide();

            window[consoleName] = {
                show: function show() {
                    consoleDiv.style.display = 'block';
                },
                hide: function hide() {
                    consoleDiv.style.display = 'none';
                },
                clear: function clear() {
                    consoleContent.innerHTML = '';
                },
                log: function log() {
                    for (var i = 0, l = arguments.length; i < l; ++i) {
                        consoleContent.innerHTML += '<br/><br/>' + arguments[i];
                    }
                    this.show();
                }

            };
        }

        if (typeof window[consoleName].debug === 'undefined') {
            window[consoleName].debug = window[consoleName].log;
        }

        if (typeof window[consoleName].info === 'undefined') {
            window[consoleName].info = window[consoleName].log;
        }

        if (typeof window[consoleName].warn === 'undefined') {
            window[consoleName].warn = window[consoleName].log;
        }

        if (typeof window[consoleName].error === 'undefined') {
            window[consoleName].error = window[consoleName].log;
        }

        if (typeof window[consoleName].assert === 'undefined') {
            window[consoleName].assert = function assert() {
                if (!arguments[0]) {
                    if (arguments[1]) {
                        window[consoleName].log(arguments[1]);
                    } else {
                        window[consoleName].log('Assertion failed');
                    }
                }
            };
        }

        if (typeof window[consoleName].show === 'undefined') {
            window[consoleName].show = function () {};
        }

        if (typeof window[consoleName].hide === 'undefined') {
            window[consoleName].hide = function () {};
        }

        if (typeof window[consoleName].clear === 'undefined') {
            window[consoleName].clear = function () {};
        }
    }

    contentLoaded(window, setup);
}(window));
