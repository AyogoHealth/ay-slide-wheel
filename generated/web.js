/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demo/app-web.ts":
/*!*************************************!*\
  !*** ./demo/app-web.ts + 2 modules ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/slide-wheel/slide-wheel.ts
function SlideWheel(element, onChange, value, enabled = true, min = 0, max = 1000, roundedLine = true, lineThickness = 0.155, lineStartColour = '#45b999', lineMidColour = '#9fc789', lineEndColour = '#fcd679') {
    // The following code was originally based off of
    // code written Copyright 2013 by Anthony Terrien (MIT)
    // https://github.com/aterrien/jQuery-Knob
    let canvas;
    if (element.shadowRoot) {
        canvas = element.shadowRoot.querySelector('canvas');
    }
    else {
        canvas = element.querySelector('canvas');
    }
    const kMin = 0;
    const kMax = 1000;
    // Value ranges from 0 to 1000
    value = ((value - min) / (max - min)) * 1000 || 0;
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'slider');
    element.setAttribute('aria-valuemin', min.toString());
    element.setAttribute('aria-valuemax', max.toString());
    element.setAttribute('aria-valuenow', value.toString());
    var stopper = roundedLine !== false;
    var lineCap = stopper ? 'round' : 'butt';
    var height = 600;
    var width = 600;
    var thickness = lineThickness;
    var fgColor = lineStartColour;
    var fgColorMid = lineMidColour;
    var fgColorEnd = lineEndColour;
    var step = 1;
    var context = canvas.getContext('2d');
    var xpos, ypos;
    var scale = 1; //HDPI/retina scaling removed for now because canvas scale now matches assets and scaling is moved to CSS
    const knob = new Image();
    const knobLoaded = new Promise((res, rej) => {
        knob.src = 'assets/img/slide-wheel/knob.png';
        knob.onload = () => res();
        knob.onerror = (e) => rej(e);
    });
    var bgImg = new Image();
    const bgLoaded = new Promise((res, rej) => {
        bgImg.src = 'assets/img/slide-wheel/slide-rail.png';
        bgImg.onload = () => res();
        bgImg.onerror = (e) => rej(e);
    });
    // finalize canvas with computed width
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    var basePadX = 0;
    var basePadY = 0;
    context.translate(basePadX * scale, basePadY * scale);
    const rect = element.getBoundingClientRect();
    height = rect.height;
    width = rect.width;
    width = width - basePadX;
    height = height - basePadY;
    var PI2 = 2 * Math.PI;
    var xy = canvas.width / 2 * scale;
    var lineWidth = xy * thickness;
    var percentx = 1;
    var percenty = 1;
    var radius = 0;
    var angleOffset = 0;
    var angleArc = 360;
    // deg to rad
    angleOffset = angleOffset * Math.PI / 180;
    angleArc = angleArc * Math.PI / 180;
    // compute start and end angles
    var startAngle = 1.5 * Math.PI + angleOffset;
    var endAngle = 1.5 * Math.PI + angleOffset + angleArc;
    function change(v) {
        const oldval = value | 0;
        const newval = ((max - min) * (v / kMax) + min) | 0;
        value = v;
        if (oldval !== newval) {
            element.setAttribute('aria-valuenow', newval.toString());
            // $scope.$evalAsync(() => {
            //   $ctrl.value = newval;
            // });
            if (onChange) {
                onChange(newval);
            }
        }
    }
    if (value < kMin) {
        change(kMin);
    }
    if (value > kMax) {
        change(kMax);
    }
    function angle(v) {
        return (v - kMin) * angleArc / (kMax - kMin);
    }
    function arc(v) {
        var sa, ea;
        v = angle(v);
        sa = startAngle - 0.00001;
        ea = sa + v + 0.00001;
        return {
            s: sa,
            e: ea,
            d: false
        };
    }
    var drawing = false;
    function draw() {
        var c = context; // context
        var a = arc(value); // Arc
        function clearCanvas() {
            // Store the current transformation matrix
            c.save();
            // Use the identity matrix while clearing the canvas
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.clearRect(0, 0, canvas.width, canvas.height);
            // Restore the transform
            c.restore();
        }
        //Draw the background
        function drawBG() {
            c.save();
            c.setTransform(1, 0, 0, 1, 0, 0);
            c.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            c.restore();
        }
        function drawArc() {
            c.lineWidth = lineWidth;
            c.lineCap = lineCap;
            //Proportional offset left for gradients to make room for stroke cap
            var offset = 0.08;
            var grad1 = c.createLinearGradient(0, 0, 0, canvas.height * scale);
            grad1.addColorStop(0, fgColorEnd);
            grad1.addColorStop(0.8, fgColorMid);
            var grad2 = c.createLinearGradient(0, 0, 0, canvas.height * scale);
            grad2.addColorStop(0, fgColor);
            grad2.addColorStop(0.8, fgColorMid);
            // First we make a clipping region for the left half
            c.save();
            c.beginPath();
            c.rect(0, 0, (1 - offset) * canvas.width / 2 * scale, canvas.height * scale);
            c.clip();
            // Then we draw the left half
            c.strokeStyle = grad1;
            c.beginPath();
            c.arc(xy, xy, radius, a.s, a.e, a.d);
            c.stroke();
            c.restore(); // restore clipping region to default
            // Then we make a clipping region for the right half
            c.save();
            c.beginPath();
            c.rect((1 - offset) * canvas.width / 2 * scale, 0, canvas.width * scale, canvas.height * scale);
            c.clip();
            // Then we draw the right half
            c.strokeStyle = grad2;
            c.beginPath();
            c.arc(xy, xy, radius, a.s, a.e, a.d);
            c.stroke();
            c.restore(); // restore clipping region to default
        }
        //draw the knob
        function drawKnob() {
            var dx = Math.sin(a.e - a.s) * radius - (knob.width / 2) * percentx;
            var dy = -Math.cos(a.e - a.s) * radius - (knob.height / 2) * percenty;
            c.drawImage(knob, xy + dx, xy + dy, knob.width * percentx, knob.height * percenty);
        }
        clearCanvas();
        drawBG();
        drawArc();
        if (enabled !== false) {
            drawKnob();
        }
    }
    function onTouch(evt) {
        if (enabled === false) {
            return;
        }
        var touchMove = function (evt) {
            var adjustment = width / canvas.offsetWidth;
            var v = xy2val(evt.touches[0].pageX * adjustment, evt.touches[0].pageY * adjustment);
            if (v === value) {
                return;
            }
            change(validate(v));
            draw();
        };
        // First touch
        touchMove(evt);
        // Touch events listeners
        document.addEventListener("touchmove", touchMove);
        document.addEventListener("touchend", function touchEnd() {
            document.removeEventListener('touchmove', touchMove);
            document.removeEventListener('touchend', touchEnd);
        });
    }
    function onMouseDown(evt) {
        if (enabled === false) {
            return;
        }
        var mouseMove = function (evt) {
            var adjustment = width / canvas.offsetWidth;
            var v = xy2val(evt.pageX * adjustment, evt.pageY * adjustment);
            if (v === value) {
                return;
            }
            change(validate(v));
            draw();
        };
        // First click
        mouseMove(evt);
        // Mouse events listeners
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        });
    }
    //function _xy
    function updateCoords() {
        var box = canvas.getBoundingClientRect();
        var docElem = document.documentElement;
        var offset = {
            top: box.top + window.pageYOffset - docElem.clientTop,
            left: box.left + window.pageXOffset - docElem.clientLeft
        };
        xpos = offset.left;
        ypos = offset.top;
        width = box.width;
        height = box.height;
    }
    function listen() {
        canvas.addEventListener("mousedown", function (evt) {
            evt.preventDefault();
            updateCoords();
            onMouseDown(evt);
        });
        canvas.addEventListener("touchstart", function (evt) {
            evt.preventDefault();
            updateCoords();
            onTouch(evt);
        });
        element.addEventListener('keydown', function (evt) {
            let val = (value || 0) | 0;
            if (evt.keyCode === 38 || evt.keyCode === 39) {
                // 38 = UP;   39 = RIGHT
                val++;
                if (val > max) {
                    val = max;
                }
                val = ((val - min) / (max - min)) * 1000 + 1;
                if (val > kMax) {
                    val = kMax;
                }
                change(validate(val));
                draw();
                evt.preventDefault();
                evt.stopPropagation();
            }
            else if (evt.keyCode === 37 || evt.keyCode === 40) {
                // 37 = LEFT;  40 = DOWN
                val--;
                if (val < min) {
                    val = min;
                }
                val = ((val - min) / (max - min)) * 1000 - 1;
                if (val < kMin) {
                    val = kMin;
                }
                change(validate(val));
                draw();
                evt.preventDefault();
                evt.stopPropagation();
            }
        });
    }
    function validate(v) {
        var val = (((v < 0) ? -0.5 : 0.5) + (v / step));
        val = val < 0 ? Math.ceil(val) : Math.floor(val);
        val *= step;
        return Math.round(val * 100) / 100;
    }
    function xy2val(x, y) {
        var a, ret;
        a = Math.atan2(x - (xpos + width / 2), -(y - ypos - width / 2)) - angleOffset;
        if (angleArc !== PI2 && (a < 0) && (a > -0.5)) {
            // if isset angleArc option, set to min if .5 under min
            a = 0;
        }
        else if (a < 0) {
            a += PI2;
        }
        ret = (a * (kMax - kMin) / angleArc) + kMin;
        if (stopper) {
            ret = Math.max(Math.min(ret, kMax), kMin);
        }
        // Make the knob not be able to cross the min/max boundary
        // has a side effect that you cant easily tap to change the value
        // when the dial is close to the max/min boundary
        if ((value > kMax * 0.9 && ret <= kMax * 0.1) || (value === kMax && ret <= kMax * 0.8)) {
            ret = kMax;
        }
        else if (value <= kMax * 0.1 && ret > kMax * 0.2) {
            ret = kMin;
        }
        return ret;
    }
    Promise.all([bgLoaded, knobLoaded]).then(function () {
        //figure out some values that are based on bgImg size
        percentx = canvas.width / bgImg.width;
        percenty = canvas.height / bgImg.height;
        radius = xy - lineWidth / 2 - 57 * percentx;
        listen();
        updateCoords();
        draw();
    });
}

;// CONCATENATED MODULE: ./src/web-component/index.ts

class AySlideWheel extends HTMLElement {
    constructor() {
        super();
        var shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = '<canvas class="slide-wheel-canvas"></canvas>';
    }
    connectedCallback() {
        new SlideWheel(this, (val) => {
            this.dispatchEvent(new CustomEvent('onChange', { detail: val }));
        }, parseInt(this.getAttribute('value'), 10), this.getAttribute('enabled') === 'false' ? false : true, parseInt(this.getAttribute('min'), 10), parseInt(this.getAttribute('max'), 10), this.getAttribute('rounded-line') === 'false' ? false : true, parseFloat(this.getAttribute('line-thickness')), this.getAttribute('line-start-colour'), this.getAttribute('line-mid-colour'), this.getAttribute('line-end-colour'));
    }
}
window.customElements.define('ay-slide-wheel', AySlideWheel);

;// CONCATENATED MODULE: ./demo/app-web.ts
/*! Copyright 2020 Ayogo Health Inc. */

document.addEventListener('DOMContentLoaded', () => {
    const elem = document.querySelector('ay-slide-wheel');
    const update = document.querySelector('#currentVal');
    update.textContent = "0";
    elem.addEventListener('onChange', (evt) => {
        update.textContent = evt.detail.toString();
    });
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./demo/app-web.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9naXRodWIvd29ya3NwYWNlL3NyYy9zbGlkZS13aGVlbC9zbGlkZS13aGVlbC50cyIsIi9naXRodWIvd29ya3NwYWNlL3NyYy93ZWItY29tcG9uZW50L2luZGV4LnRzIiwiL2dpdGh1Yi93b3Jrc3BhY2UvZGVtby9hcHAtd2ViLnRzIiwid2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQU8sU0FBUyxVQUFVLENBQUMsT0FBb0IsRUFBRSxRQUFRLEVBQUUsS0FBYSxFQUFFLE9BQU8sR0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFDLENBQUMsRUFBRSxHQUFHLEdBQUMsSUFBSSxFQUFFLFdBQVcsR0FBQyxJQUFJLEVBQ3ZILGFBQWEsR0FBQyxLQUFLLEVBQUUsZUFBZSxHQUFDLFNBQVMsRUFBRSxhQUFhLEdBQUMsU0FBUyxFQUFFLGFBQWEsR0FBQyxTQUFTO0lBQ2hHLGlEQUFpRDtJQUNqRCx1REFBdUQ7SUFDdkQsMENBQTBDO0lBRTFDLElBQUksTUFBeUIsQ0FBQztJQUM5QixJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7UUFDdEIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBc0IsQ0FBQztLQUMxRTtTQUFNO1FBQ0wsTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFzQixDQUFDO0tBQy9EO0lBQ0QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBRWxCLDhCQUE4QjtJQUM5QixLQUFLLEdBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7SUFFcEQsT0FBTyxDQUFDLFlB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LENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQzs7Ozs7OztVQ1hIO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6IndlYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBTbGlkZVdoZWVsKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvbkNoYW5nZSwgdmFsdWU6IG51bWJlciwgZW5hYmxlZD10cnVlLCBtaW49MCwgbWF4PTEwMDAsIHJvdW5kZWRMaW5lPXRydWUsXG4gIGxpbmVUaGlja25lc3M9MC4xNTUsIGxpbmVTdGFydENvbG91cj0nIzQ1Yjk5OScsIGxpbmVNaWRDb2xvdXI9JyM5ZmM3ODknLCBsaW5lRW5kQ29sb3VyPScjZmNkNjc5Jykge1xuICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgd2FzIG9yaWdpbmFsbHkgYmFzZWQgb2ZmIG9mXG4gIC8vIGNvZGUgd3JpdHRlbiBDb3B5cmlnaHQgMjAxMyBieSBBbnRob255IFRlcnJpZW4gKE1JVClcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F0ZXJyaWVuL2pRdWVyeS1Lbm9iXG5cbiAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIGlmIChlbGVtZW50LnNoYWRvd1Jvb3QpIHtcbiAgICBjYW52YXMgPSBlbGVtZW50LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gIH0gZWxzZSB7XG4gICAgY2FudmFzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgfVxuICBjb25zdCBrTWluID0gMDtcbiAgY29uc3Qga01heCA9IDEwMDA7XG5cbiAgLy8gVmFsdWUgcmFuZ2VzIGZyb20gMCB0byAxMDAwXG4gIHZhbHVlICAgPSAoKHZhbHVlIC0gbWluKSAvIChtYXggLSBtaW4pKSAqIDEwMDAgfHwgMDtcblxuICBlbGVtZW50LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdzbGlkZXInKTtcbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCBtaW4udG9TdHJpbmcoKSk7XG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgbWF4LnRvU3RyaW5nKCkpO1xuICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIHZhbHVlLnRvU3RyaW5nKCkpO1xuXG4gIHZhciBzdG9wcGVyID0gcm91bmRlZExpbmUgIT09IGZhbHNlO1xuICB2YXIgbGluZUNhcCA9IHN0b3BwZXIgPyAncm91bmQnIDogJ2J1dHQnO1xuICB2YXIgaGVpZ2h0ID0gNjAwO1xuICB2YXIgd2lkdGggPSA2MDA7XG5cbiAgdmFyIHRoaWNrbmVzcyA9IGxpbmVUaGlja25lc3M7XG5cbiAgdmFyIGZnQ29sb3IgICAgPSBsaW5lU3RhcnRDb2xvdXI7XG4gIHZhciBmZ0NvbG9yTWlkID0gbGluZU1pZENvbG91cjtcbiAgdmFyIGZnQ29sb3JFbmQgPSBsaW5lRW5kQ29sb3VyO1xuICB2YXIgc3RlcCAgICAgPSAxO1xuXG4gIHZhciBjb250ZXh0OmFueSA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gIHZhciB4cG9zLCB5cG9zO1xuXG4gIHZhciBzY2FsZSA9IDE7ICAvL0hEUEkvcmV0aW5hIHNjYWxpbmcgcmVtb3ZlZCBmb3Igbm93IGJlY2F1c2UgY2FudmFzIHNjYWxlIG5vdyBtYXRjaGVzIGFzc2V0cyBhbmQgc2NhbGluZyBpcyBtb3ZlZCB0byBDU1NcblxuICBjb25zdCBrbm9iID0gbmV3IEltYWdlKCk7XG4gIGNvbnN0IGtub2JMb2FkZWQgPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcbiAgICBrbm9iLnNyYyA9ICdhc3NldHMvaW1nL3NsaWRlLXdoZWVsL2tub2IucG5nJztcblxuICAgIGtub2Iub25sb2FkID0gKCkgPT4gcmVzKCk7XG4gICAga25vYi5vbmVycm9yID0gKGUpID0+IHJlaihlKTtcbiAgfSk7XG5cbiAgdmFyIGJnSW1nID0gbmV3IEltYWdlKCk7XG4gIGNvbnN0IGJnTG9hZGVkID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgYmdJbWcuc3JjID0gJ2Fzc2V0cy9pbWcvc2xpZGUtd2hlZWwvc2xpZGUtcmFpbC5wbmcnO1xuXG4gICAgYmdJbWcub25sb2FkID0gKCkgPT4gcmVzKCk7XG4gICAgYmdJbWcub25lcnJvciA9IChlKSA9PiByZWooZSk7XG4gIH0pO1xuXG4gIC8vIGZpbmFsaXplIGNhbnZhcyB3aXRoIGNvbXB1dGVkIHdpZHRoXG4gIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgudG9TdHJpbmcoKSk7XG4gIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGhlaWdodC50b1N0cmluZygpKTtcblxuICBjYW52YXMuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG5cbiAgdmFyIGJhc2VQYWRYID0gMDtcbiAgdmFyIGJhc2VQYWRZID0gMDtcblxuICBjb250ZXh0LnRyYW5zbGF0ZShiYXNlUGFkWCpzY2FsZSwgYmFzZVBhZFkqc2NhbGUpO1xuXG4gIGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBoZWlnaHQgPSByZWN0LmhlaWdodDtcbiAgd2lkdGggPSByZWN0LndpZHRoO1xuXG4gIHdpZHRoID0gd2lkdGggLSBiYXNlUGFkWDtcbiAgaGVpZ2h0ID0gaGVpZ2h0IC0gYmFzZVBhZFk7XG5cbiAgdmFyIFBJMiA9IDIqTWF0aC5QSTtcblxuICB2YXIgeHkgPSBjYW52YXMud2lkdGggLyAyICogc2NhbGU7XG4gIHZhciBsaW5lV2lkdGggPSB4eSAqIHRoaWNrbmVzcztcblxuICB2YXIgcGVyY2VudHggPSAxO1xuICB2YXIgcGVyY2VudHkgPSAxO1xuICB2YXIgcmFkaXVzICAgPSAwO1xuXG4gIHZhciBhbmdsZU9mZnNldCA9IDA7XG4gIHZhciBhbmdsZUFyYyA9IDM2MDtcblxuICAvLyBkZWcgdG8gcmFkXG4gIGFuZ2xlT2Zmc2V0ID0gYW5nbGVPZmZzZXQgKiBNYXRoLlBJIC8gMTgwO1xuICBhbmdsZUFyYyAgICA9IGFuZ2xlQXJjICAgICogTWF0aC5QSSAvIDE4MDtcblxuICAvLyBjb21wdXRlIHN0YXJ0IGFuZCBlbmQgYW5nbGVzXG4gIHZhciBzdGFydEFuZ2xlID0gMS41ICogTWF0aC5QSSArIGFuZ2xlT2Zmc2V0O1xuICB2YXIgZW5kQW5nbGUgICA9IDEuNSAqIE1hdGguUEkgKyBhbmdsZU9mZnNldCArIGFuZ2xlQXJjO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZSh2KSB7XG4gICAgY29uc3Qgb2xkdmFsID0gdmFsdWUgfCAwO1xuICAgIGNvbnN0IG5ld3ZhbCA9ICgobWF4IC0gbWluKSAqICh2IC8ga01heCkgKyBtaW4pIHwgMDtcbiAgICB2YWx1ZSA9IHY7XG5cbiAgICBpZiAob2xkdmFsICE9PSBuZXd2YWwpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgbmV3dmFsLnRvU3RyaW5nKCkpO1xuICAgICAgLy8gJHNjb3BlLiRldmFsQXN5bmMoKCkgPT4ge1xuICAgICAgLy8gICAkY3RybC52YWx1ZSA9IG5ld3ZhbDtcbiAgICAgIC8vIH0pO1xuXG4gICAgICBpZiAob25DaGFuZ2UpIHtcbiAgICAgICAgb25DaGFuZ2UobmV3dmFsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodmFsdWUgPCBrTWluKSB7XG4gICAgY2hhbmdlKGtNaW4pO1xuICB9XG5cbiAgaWYgKHZhbHVlID4ga01heCkge1xuICAgIGNoYW5nZShrTWF4KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFuZ2xlKHYpIHtcbiAgICByZXR1cm4gKHYgLSBrTWluKSAqIGFuZ2xlQXJjIC8gKGtNYXggLSBrTWluKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyYyh2KSB7XG4gICAgdmFyIHNhLCBlYTtcbiAgICB2ID0gYW5nbGUodik7XG5cbiAgICBzYSA9IHN0YXJ0QW5nbGUgLSAwLjAwMDAxO1xuICAgIGVhID0gc2EgKyB2ICsgMC4wMDAwMTtcblxuICAgIHJldHVybiB7XG4gICAgICBzOiBzYSxcbiAgICAgIGU6IGVhLFxuICAgICAgZDogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgdmFyIGRyYXdpbmcgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZHJhdygpIHtcbiAgICB2YXIgYyA9IGNvbnRleHQ7ICAgICAvLyBjb250ZXh0XG4gICAgdmFyIGEgPSBhcmModmFsdWUpOyAgLy8gQXJjXG5cblxuICAgIGZ1bmN0aW9uIGNsZWFyQ2FudmFzKCkge1xuICAgICAgLy8gU3RvcmUgdGhlIGN1cnJlbnQgdHJhbnNmb3JtYXRpb24gbWF0cml4XG4gICAgICBjLnNhdmUoKTtcblxuICAgICAgLy8gVXNlIHRoZSBpZGVudGl0eSBtYXRyaXggd2hpbGUgY2xlYXJpbmcgdGhlIGNhbnZhc1xuICAgICAgYy5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICBjLmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAvLyBSZXN0b3JlIHRoZSB0cmFuc2Zvcm1cbiAgICAgIGMucmVzdG9yZSgpO1xuICAgIH1cblxuICAgIC8vRHJhdyB0aGUgYmFja2dyb3VuZFxuICAgIGZ1bmN0aW9uIGRyYXdCRygpIHtcbiAgICAgIGMuc2F2ZSgpO1xuICAgICAgYy5zZXRUcmFuc2Zvcm0oMSwwLDAsMSwwLDApO1xuICAgICAgYy5kcmF3SW1hZ2UoYmdJbWcsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICBjLnJlc3RvcmUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkcmF3QXJjKCkge1xuICAgICAgYy5saW5lV2lkdGggPSBsaW5lV2lkdGg7XG4gICAgICBjLmxpbmVDYXAgPSBsaW5lQ2FwO1xuXG4gICAgICAvL1Byb3BvcnRpb25hbCBvZmZzZXQgbGVmdCBmb3IgZ3JhZGllbnRzIHRvIG1ha2Ugcm9vbSBmb3Igc3Ryb2tlIGNhcFxuICAgICAgdmFyIG9mZnNldCA9IDAuMDg7XG5cbiAgICAgIHZhciBncmFkMSA9IGMuY3JlYXRlTGluZWFyR3JhZGllbnQoMCwwLDAsY2FudmFzLmhlaWdodCpzY2FsZSk7XG4gICAgICBncmFkMS5hZGRDb2xvclN0b3AoMCwgZmdDb2xvckVuZCk7XG4gICAgICBncmFkMS5hZGRDb2xvclN0b3AoMC44LCBmZ0NvbG9yTWlkKTtcblxuICAgICAgdmFyIGdyYWQyID0gYy5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLDAsMCxjYW52YXMuaGVpZ2h0KnNjYWxlKTtcbiAgICAgIGdyYWQyLmFkZENvbG9yU3RvcCgwLCBmZ0NvbG9yKTtcbiAgICAgIGdyYWQyLmFkZENvbG9yU3RvcCgwLjgsIGZnQ29sb3JNaWQpO1xuXG4gICAgICAvLyBGaXJzdCB3ZSBtYWtlIGEgY2xpcHBpbmcgcmVnaW9uIGZvciB0aGUgbGVmdCBoYWxmXG4gICAgICBjLnNhdmUoKTtcbiAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICBjLnJlY3QoMCwgMCwgKDEtb2Zmc2V0KSpjYW52YXMud2lkdGgvMipzY2FsZSwgY2FudmFzLmhlaWdodCpzY2FsZSk7XG4gICAgICBjLmNsaXAoKTtcblxuICAgICAgLy8gVGhlbiB3ZSBkcmF3IHRoZSBsZWZ0IGhhbGZcbiAgICAgIGMuc3Ryb2tlU3R5bGUgPSBncmFkMTtcbiAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICBjLmFyYyh4eSx4eSxyYWRpdXMsYS5zLGEuZSxhLmQpO1xuICAgICAgYy5zdHJva2UoKTtcblxuICAgICAgYy5yZXN0b3JlKCk7IC8vIHJlc3RvcmUgY2xpcHBpbmcgcmVnaW9uIHRvIGRlZmF1bHRcblxuICAgICAgLy8gVGhlbiB3ZSBtYWtlIGEgY2xpcHBpbmcgcmVnaW9uIGZvciB0aGUgcmlnaHQgaGFsZlxuICAgICAgYy5zYXZlKCk7XG4gICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgYy5yZWN0KCgxLW9mZnNldCkqY2FudmFzLndpZHRoLzIqc2NhbGUsIDAsIGNhbnZhcy53aWR0aCpzY2FsZSwgY2FudmFzLmhlaWdodCpzY2FsZSk7XG4gICAgICBjLmNsaXAoKTtcblxuICAgICAgLy8gVGhlbiB3ZSBkcmF3IHRoZSByaWdodCBoYWxmXG4gICAgICBjLnN0cm9rZVN0eWxlID0gZ3JhZDI7XG5cbiAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICBjLmFyYyh4eSx4eSxyYWRpdXMsYS5zLGEuZSxhLmQpO1xuXG4gICAgICBjLnN0cm9rZSgpO1xuXG4gICAgICBjLnJlc3RvcmUoKTsgLy8gcmVzdG9yZSBjbGlwcGluZyByZWdpb24gdG8gZGVmYXVsdFxuICAgIH1cblxuICAgIC8vZHJhdyB0aGUga25vYlxuICAgIGZ1bmN0aW9uIGRyYXdLbm9iKCkge1xuICAgICAgdmFyIGR4ID0gTWF0aC5zaW4oYS5lIC0gYS5zKSAqIHJhZGl1cyAtIChrbm9iLndpZHRoLzIpKnBlcmNlbnR4O1xuICAgICAgdmFyIGR5ID0gLSBNYXRoLmNvcyhhLmUgLSBhLnMpICogcmFkaXVzIC0gKGtub2IuaGVpZ2h0LzIpKnBlcmNlbnR5O1xuICAgICAgYy5kcmF3SW1hZ2Uoa25vYiwgeHkrZHgsIHh5K2R5LCBrbm9iLndpZHRoKnBlcmNlbnR4LCBrbm9iLmhlaWdodCpwZXJjZW50eSk7XG4gICAgfVxuXG4gICAgY2xlYXJDYW52YXMoKTtcbiAgICBkcmF3QkcoKTtcbiAgICBkcmF3QXJjKCk7XG4gICAgaWYgKGVuYWJsZWQgIT09IGZhbHNlKSB7XG4gICAgICBkcmF3S25vYigpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uVG91Y2goZXZ0KSB7XG4gICAgaWYgKGVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHRvdWNoTW92ZSA9IGZ1bmN0aW9uKGV2dCkge1xuICAgICAgdmFyIGFkanVzdG1lbnQgPSB3aWR0aCAvIGNhbnZhcy5vZmZzZXRXaWR0aDtcbiAgICAgIHZhciB2ID0geHkydmFsKFxuICAgICAgICBldnQudG91Y2hlc1swXS5wYWdlWCAqIGFkanVzdG1lbnQsXG4gICAgICAgIGV2dC50b3VjaGVzWzBdLnBhZ2VZICogYWRqdXN0bWVudFxuICAgICAgKTtcblxuICAgICAgaWYgKHYgPT09IHZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY2hhbmdlKHZhbGlkYXRlKHYpKTtcbiAgICAgIGRyYXcoKTtcbiAgICB9O1xuXG4gICAgLy8gRmlyc3QgdG91Y2hcbiAgICB0b3VjaE1vdmUoZXZ0KTtcblxuICAgIC8vIFRvdWNoIGV2ZW50cyBsaXN0ZW5lcnNcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRvdWNoTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsXG4gICAgICBmdW5jdGlvbiB0b3VjaEVuZCgpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdG91Y2hNb3ZlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0b3VjaEVuZCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTW91c2VEb3duKGV2dCkge1xuICAgIGlmIChlbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtb3VzZU1vdmUgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgYWRqdXN0bWVudCA9IHdpZHRoIC8gY2FudmFzLm9mZnNldFdpZHRoO1xuICAgICAgdmFyIHYgPSB4eTJ2YWwoZXZ0LnBhZ2VYICogYWRqdXN0bWVudCwgZXZ0LnBhZ2VZICogYWRqdXN0bWVudCk7XG5cbiAgICAgIGlmICh2ID09PSB2YWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNoYW5nZSh2YWxpZGF0ZSh2KSk7XG4gICAgICBkcmF3KCk7XG4gICAgfTtcblxuICAgIC8vIEZpcnN0IGNsaWNrXG4gICAgbW91c2VNb3ZlKGV2dCk7XG5cbiAgICAvLyBNb3VzZSBldmVudHMgbGlzdGVuZXJzXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3VzZU1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsXG4gICAgICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcCk7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIC8vZnVuY3Rpb24gX3h5XG4gIGZ1bmN0aW9uIHVwZGF0ZUNvb3JkcygpIHtcbiAgICB2YXIgYm94ICAgICA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB2YXIgZG9jRWxlbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICB2YXIgb2Zmc2V0ICA9IHtcbiAgICAgIHRvcDogYm94LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCAtIGRvY0VsZW0uY2xpZW50VG9wLFxuICAgICAgbGVmdDogYm94LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQgLSBkb2NFbGVtLmNsaWVudExlZnRcbiAgICB9O1xuXG4gICAgeHBvcyA9IG9mZnNldC5sZWZ0O1xuICAgIHlwb3MgPSBvZmZzZXQudG9wO1xuXG4gICAgd2lkdGggPSBib3gud2lkdGg7XG4gICAgaGVpZ2h0ID0gYm94LmhlaWdodDtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB1cGRhdGVDb29yZHMoKTtcbiAgICAgICAgb25Nb3VzZURvd24oZXZ0KTtcbiAgICAgIH1cbiAgICApO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdXBkYXRlQ29vcmRzKCk7XG4gICAgICAgIG9uVG91Y2goZXZ0KTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICBsZXQgdmFsID0gKHZhbHVlIHx8IDApIHwgMDtcblxuICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAzOCB8fCBldnQua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgICAgLy8gMzggPSBVUDsgICAzOSA9IFJJR0hUXG4gICAgICAgIHZhbCsrO1xuICAgICAgICBpZiAodmFsID4gbWF4KSB7XG4gICAgICAgICAgdmFsID0gbWF4O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFsID0gKCh2YWwgLSBtaW4pIC8gKG1heCAtIG1pbikpICogMTAwMCArIDE7XG4gICAgICAgIGlmICh2YWwgPiBrTWF4KSB7XG4gICAgICAgICAgdmFsID0ga01heDtcbiAgICAgICAgfVxuICAgICAgICBjaGFuZ2UodmFsaWRhdGUodmFsKSk7XG4gICAgICAgIGRyYXcoKTtcblxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfSBlbHNlIGlmIChldnQua2V5Q29kZSA9PT0gMzcgfHwgZXZ0LmtleUNvZGUgPT09IDQwKSB7XG4gICAgICAgIC8vIDM3ID0gTEVGVDsgIDQwID0gRE9XTlxuICAgICAgICB2YWwtLTtcbiAgICAgICAgaWYgKHZhbCA8IG1pbikge1xuICAgICAgICAgIHZhbCA9IG1pbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhbCA9ICgodmFsIC0gbWluKSAvIChtYXggLSBtaW4pKSAqIDEwMDAgLSAxO1xuICAgICAgICBpZiAodmFsIDwga01pbikge1xuICAgICAgICAgIHZhbCA9IGtNaW47XG4gICAgICAgIH1cbiAgICAgICAgY2hhbmdlKHZhbGlkYXRlKHZhbCkpO1xuICAgICAgICBkcmF3KCk7XG5cbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHYpIHtcbiAgICB2YXIgdmFsID0gKCgodiA8IDApID8gLTAuNSA6IDAuNSkgKyAodi9zdGVwKSk7XG4gICAgdmFsID0gdmFsIDwgMCA/IE1hdGguY2VpbCh2YWwpIDogTWF0aC5mbG9vcih2YWwpO1xuICAgIHZhbCAqPSBzdGVwO1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbCAqIDEwMCkgLyAxMDA7XG4gIH1cblxuICBmdW5jdGlvbiB4eTJ2YWwoeCwgeSkge1xuICAgIHZhciBhLCByZXQ7XG5cbiAgICBhID0gTWF0aC5hdGFuMihcbiAgICAgIHggLSAoeHBvcyArIHdpZHRoLzIpLFxuICAgICAgLSAoeSAtIHlwb3MgLSB3aWR0aC8yKVxuICAgICkgLSBhbmdsZU9mZnNldDtcblxuICAgIGlmIChhbmdsZUFyYyAhPT0gUEkyICYmIChhIDwgMCkgJiYgKGEgPiAtMC41KSkge1xuICAgICAgLy8gaWYgaXNzZXQgYW5nbGVBcmMgb3B0aW9uLCBzZXQgdG8gbWluIGlmIC41IHVuZGVyIG1pblxuICAgICAgYSA9IDA7XG4gICAgfSBlbHNlIGlmIChhIDwgMCkge1xuICAgICAgYSArPSBQSTI7XG4gICAgfVxuXG4gICAgcmV0ID0gKGEgKiAoa01heCAtIGtNaW4pIC8gYW5nbGVBcmMpICsga01pbjtcblxuICAgIGlmIChzdG9wcGVyKSB7XG4gICAgICByZXQgPSBNYXRoLm1heChNYXRoLm1pbihyZXQsIGtNYXgpLCBrTWluKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIHRoZSBrbm9iIG5vdCBiZSBhYmxlIHRvIGNyb3NzIHRoZSBtaW4vbWF4IGJvdW5kYXJ5XG4gICAgLy8gaGFzIGEgc2lkZSBlZmZlY3QgdGhhdCB5b3UgY2FudCBlYXNpbHkgdGFwIHRvIGNoYW5nZSB0aGUgdmFsdWVcbiAgICAvLyB3aGVuIHRoZSBkaWFsIGlzIGNsb3NlIHRvIHRoZSBtYXgvbWluIGJvdW5kYXJ5XG4gICAgaWYgKCAodmFsdWUgPiBrTWF4KjAuOSAmJiByZXQgPD0ga01heCowLjEpIHx8ICh2YWx1ZSA9PT0ga01heCAmJiByZXQgPD0ga01heCowLjgpICkge1xuICAgICAgcmV0ID0ga01heDtcbiAgICB9IGVsc2UgaWYgKHZhbHVlIDw9IGtNYXgqMC4xICYmIHJldCA+IGtNYXgqMC4yKSB7XG4gICAgICByZXQgPSBrTWluO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICBQcm9taXNlLmFsbChbYmdMb2FkZWQsIGtub2JMb2FkZWRdKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIC8vZmlndXJlIG91dCBzb21lIHZhbHVlcyB0aGF0IGFyZSBiYXNlZCBvbiBiZ0ltZyBzaXplXG4gICAgcGVyY2VudHggPSBjYW52YXMud2lkdGggLyBiZ0ltZy53aWR0aDtcbiAgICBwZXJjZW50eSA9IGNhbnZhcy5oZWlnaHQgLyBiZ0ltZy5oZWlnaHQ7XG5cbiAgICByYWRpdXMgICAgPSB4eSAtIGxpbmVXaWR0aCAvIDIgLSA1NypwZXJjZW50eDtcblxuICAgIGxpc3RlbigpO1xuICAgIHVwZGF0ZUNvb3JkcygpO1xuICAgIGRyYXcoKTtcbiAgfSk7XG5cbn1cbiIsImltcG9ydCB7U2xpZGVXaGVlbH0gZnJvbSAnLi4vc2xpZGUtd2hlZWwvc2xpZGUtd2hlZWwnO1xuXG5leHBvcnQgY2xhc3MgQXlTbGlkZVdoZWVsIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHZhciBzaGFkb3dSb290ID0gdGhpcy5hdHRhY2hTaGFkb3coe21vZGU6ICdvcGVuJ30pO1xuICAgIHNoYWRvd1Jvb3QuaW5uZXJIVE1MID0gJzxjYW52YXMgY2xhc3M9XCJzbGlkZS13aGVlbC1jYW52YXNcIj48L2NhbnZhcz4nO1xuICB9XG5cbiAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgbmV3IFNsaWRlV2hlZWwoXG4gICAgICB0aGlzLFxuICAgICAgKHZhbCkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdvbkNoYW5nZScsIHtkZXRhaWw6IHZhbH0pKTtcbiAgICAgIH0sXG4gICAgICBwYXJzZUludCh0aGlzLmdldEF0dHJpYnV0ZSgndmFsdWUnKSwgMTApLFxuICAgICAgdGhpcy5nZXRBdHRyaWJ1dGUoJ2VuYWJsZWQnKSA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgIHBhcnNlSW50KHRoaXMuZ2V0QXR0cmlidXRlKCdtaW4nKSwgMTApLFxuICAgICAgcGFyc2VJbnQodGhpcy5nZXRBdHRyaWJ1dGUoJ21heCcpLCAxMCksXG4gICAgICB0aGlzLmdldEF0dHJpYnV0ZSgncm91bmRlZC1saW5lJykgPT09ICdmYWxzZScgPyBmYWxzZSA6IHRydWUsXG4gICAgICBwYXJzZUZsb2F0KHRoaXMuZ2V0QXR0cmlidXRlKCdsaW5lLXRoaWNrbmVzcycpKSxcbiAgICAgIHRoaXMuZ2V0QXR0cmlidXRlKCdsaW5lLXN0YXJ0LWNvbG91cicpLFxuICAgICAgdGhpcy5nZXRBdHRyaWJ1dGUoJ2xpbmUtbWlkLWNvbG91cicpLFxuICAgICAgdGhpcy5nZXRBdHRyaWJ1dGUoJ2xpbmUtZW5kLWNvbG91cicpXG4gICAgKTtcbiAgfVxufVxuXG53aW5kb3cuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdheS1zbGlkZS13aGVlbCcsIEF5U2xpZGVXaGVlbCk7XG4iLCIvKiEgQ29weXJpZ2h0IDIwMjAgQXlvZ28gSGVhbHRoIEluYy4gKi9cblxuaW1wb3J0ICcuLi9zcmMvd2ViLWNvbXBvbmVudCc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdheS1zbGlkZS13aGVlbCcpO1xuICBjb25zdCB1cGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY3VycmVudFZhbCcpO1xuICB1cGRhdGUudGV4dENvbnRlbnQgPSBcIjBcIjtcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdvbkNoYW5nZScsIChldnQ6IEN1c3RvbUV2ZW50KSA9PiB7XG4gICAgdXBkYXRlLnRleHRDb250ZW50ID0gZXZ0LmRldGFpbC50b1N0cmluZygpO1xuICB9KTtcbn0pO1xuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9kZW1vL2FwcC13ZWIudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9