"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var berial_1 = require("berial");
berial_1.options.bridgeEvent = function (shadowRoot) {
    var define = Object.defineProperty;
    var fromNode = shadowRoot, toNode = shadowRoot.host;
    BRIDGE_EVENT_NAMES.map(function (eventName) {
        fromNode.addEventListener(eventName, function (fromEvent) {
            fromEvent.stopPropagation();
            var Event = fromEvent.constructor;
            // @ts-ignore
            var toEvent = new Event(eventName, __assign(__assign({}, fromEvent), { bubbles: true, cancelable: true, composed: true }));
            var _a = fromEvent, _b = _a.path, path = _b === void 0 ? [] : _b, _c = _a.target, target = _c === void 0 ? path[0] : _c, _d = _a.srcElement, srcElement = _d === void 0 ? path[0] : _d, _e = _a.toElement, toElement = _e === void 0 ? path[0] : _e, preventDefault = _a.preventDefault;
            define(toEvent, 'path', { get: function () { return path; } });
            define(toEvent, 'target', { get: function () { return target; } });
            define(toEvent, 'srcElement', { get: function () { return srcElement; } });
            define(toEvent, 'toElement', { get: function () { return toElement; } });
            define(toEvent, 'preventDefault', {
                value: function () {
                    preventDefault.call(fromEvent);
                    return preventDefault.call(toEvent);
                }
            });
            toNode.dispatchEvent(toEvent);
        });
    });
};
var BRIDGE_EVENT_NAMES = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'blur',
    'change',
    'click',
    'close',
    'contextmenu',
    'doubleclick',
    'error',
    'focus',
    'gotpointercapture',
    'input',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadend',
    'loadstart',
    'lostpointercapture',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointermove',
    'pointerout',
    'pointerover',
    'pointerup',
    'reset',
    'resize',
    'scroll',
    'select',
    'selectionchange',
    'selectstart',
    'submit',
    'touchcancel',
    'touchmove',
    'touchstart',
    'transitioncancel',
    'transitionend',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'dragstart',
    'drop',
    'focusout'
];
