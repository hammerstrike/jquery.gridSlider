(function () { var j = false; window.JQClass = function () { }; JQClass.classes = {}; JQClass.extend = function extender(f) { var g = this.prototype; j = true; var h = new this(); j = false; for (var i in f) { h[i] = typeof f[i] == 'function' && typeof g[i] == 'function' ? (function (d, e) { return function () { var b = this._super; this._super = function (a) { return g[d].apply(this, a || []) }; var c = e.apply(this, arguments); this._super = b; return c } })(i, f[i]) : f[i] } function JQClass() { if (!j && this._init) { this._init.apply(this, arguments) } } JQClass.prototype = h; JQClass.prototype.constructor = JQClass; JQClass.extend = extender; return JQClass } })(); (function ($) { JQClass.classes.JQPlugin = JQClass.extend({ name: 'plugin', defaultOptions: {}, regionalOptions: {}, _getters: [], _getMarker: function () { return 'is-' + this.name }, _init: function () { $.extend(this.defaultOptions, (this.regionalOptions && this.regionalOptions['']) || {}); var c = camelCase(this.name); $[c] = this; $.fn[c] = function (a) { var b = Array.prototype.slice.call(arguments, 1); if ($[c]._isNotChained(a, b)) { return $[c][a].apply($[c], [this[0]].concat(b)) } return this.each(function () { if (typeof a === 'string') { if (a[0] === '_' || !$[c][a]) { throw 'Unknown method: ' + a; } $[c][a].apply($[c], [this].concat(b)) } else { $[c]._attach(this, a) } }) } }, setDefaults: function (a) { $.extend(this.defaultOptions, a || {}) }, _isNotChained: function (a, b) { if (a === 'option' && (b.length === 0 || (b.length === 1 && typeof b[0] === 'string'))) { return true } return $.inArray(a, this._getters) > -1 }, _attach: function (a, b) { a = $(a); if (a.hasClass(this._getMarker())) { return } a.addClass(this._getMarker()); b = $.extend({}, this.defaultOptions, this._getMetadata(a), b || {}); var c = $.extend({ name: this.name, elem: a, options: b }, this._instSettings(a, b)); a.data(this.name, c); this._postAttach(a, c); this.option(a, b) }, _instSettings: function (a, b) { return {} }, _postAttach: function (a, b) { }, _getMetadata: function (d) { try { var f = d.data(this.name.toLowerCase()) || ''; f = f.replace(/'/g, '"'); f = f.replace(/([a-zA-Z0-9]+):/g, function (a, b, i) { var c = f.substring(0, i).match(/"/g); return (!c || c.length % 2 === 0 ? '"' + b + '":' : b + ':') }); f = $.parseJSON('{' + f + '}'); for (var g in f) { var h = f[g]; if (typeof h === 'string' && h.match(/^new Date\((.*)\)$/)) { f[g] = eval(h) } } return f } catch (e) { return {} } }, _getInst: function (a) { return $(a).data(this.name) || {} }, option: function (a, b, c) { a = $(a); var d = a.data(this.name); if (!b || (typeof b === 'string' && c == null)) { var e = (d || {}).options; return (e && b ? e[b] : e) } if (!a.hasClass(this._getMarker())) { return } var e = b || {}; if (typeof b === 'string') { e = {}; e[b] = c } this._optionsChanged(a, d, e); $.extend(d.options, e) }, _optionsChanged: function (a, b, c) { }, destroy: function (a) { a = $(a); if (!a.hasClass(this._getMarker())) { return } this._preDestroy(a, this._getInst(a)); a.removeData(this.name).removeClass(this._getMarker()) }, _preDestroy: function (a, b) { } }); function camelCase(c) { return c.replace(/-([a-z])/g, function (a, b) { return b.toUpperCase() }) } $.JQPlugin = { createPlugin: function (a, b) { if (typeof a === 'object') { b = a; a = 'JQPlugin' } a = camelCase(a); var c = camelCase(b.name); JQClass.classes[c] = JQClass.classes[a].extend(b); new JQClass.classes[c]() } } })(jQuery);
(function ($) { var U = 'imagecube'; var V = 0; var W = 1; var X = 2; var Y = 3; $.JQPlugin.createPlugin({ name: U, defaultOptions: { direction: 'random', randomSelection: ['up', 'down', 'left', 'right'], speed: 2000, easing: 'linear', repeat: true, pause: 2000, selection: 'forward', shading: true, opacity: 0.8, imagePath: '', full3D: true, segments: 20, reduction: 30, expansion: 10, lineHeight: [0.0, 1.25], letterSpacing: [-0.4, 0.0], beforeRotate: null, afterRotate: null }, _getters: ['current', 'next'], _instSettings: function (a, b) { return { _position: a.css('position') } }, _postAttach: function (b, c) { b.css({ position: 'relative' }).children().each(function () { var a = $(this); a.data(U, { display: a.css('display'), width: a.css('width'), height: a.css('height'), position: a.css('position'), lineHeight: a.css('lineHeight'), letterSpacing: a.css('letterSpacing') }).css({ display: 'block', width: b.css('width'), height: b.css('height'), position: 'absolute', lineHeight: c.options.lineHeight[1], letterSpacing: c.options.letterSpacing[1] }) }).not(':first').hide(); this._prepareRotation(b) }, _optionsChanged: function (a, b, c) { $.extend(b.options, c); this._prepareRotation(a) }, _prepareRotation: function (b) { b = $(b); b.children('.imageCubeShading,.imageCubeFrom,.imageCubeTo').remove(); var c = this._getInst(b[0]); c.current = b.children(':visible')[0]; c.current = (c.current ? c.current : b.children(':first')[0]); var d = function (a) { return (!a.length ? a : a.filter(':eq(' + Math.floor(Math.random() * a.length) + ')')) }; c.next = (c.options.selection == 'random' ? d(b.children(':hidden')) : (c.options.selection == 'backward' ? $(c.current).prev() : $(c.current).next())); c.next = (c.next.length ? c.next : (c.options.selection == 'random' ? c.current : (c.options.selection == 'backward' ? b.children(':last') : b.children(':first'))))[0]; if (c.options.repeat && !c._timer) { var e = this; c._timer = setTimeout(function () { e.rotate(b) }, c.options.pause) } }, rotate: function (a, b, c) { a = $(a); if (!a.hasClass(this._getMarker())) { return } if (typeof b == 'function') { c = b; b = null } this.stop(a, true); var d = this._getInst(a[0]); if (b != null) { b = (typeof b == 'number' ? a.children(':eq(' + b + ')') : $(b)); if (a.children().filter(function () { return this === b[0] }).length > 0) { d.next = b } } var e = [d.current, d.next]; if ($.isFunction(d.options.beforeRotate)) { d.options.beforeRotate.apply(a[0], e) } var f = {}; f[U] = 1.0; a.attr(U, 0.0).stop(true, true).animate(f, d.options.speed, d.options.easing, function () { if ($.isFunction(d.options.afterRotate)) { d.options.afterRotate.apply(a[0], e) } if (c) { c.apply(a[0]) } }) }, current: function (a) { a = $(a); return (a.hasClass(this._getMarker()) ? this._getInst(a[0]).current : null) }, next: function (a) { a = $(a); return (a.hasClass(this._getMarker()) ? this._getInst(a[0]).next : null) }, stop: function (a, b) { a = $(a); if (!a.hasClass(this._getMarker())) { return } var c = this._getInst(a[0]); if (c._timer) { clearTimeout(c._timer); c._timer = null } if (!b) { c.options.repeat = false } }, next: function (a) { this.option(a, { repeat: true }) }, _preDestroy: function (b, c) { this.stop(b); var c = this._getInst(b[0]); b.stop().css({ position: c._position }).children('.imageCubeShading,.imageCubeFrom,.imageCubeTo').remove(); b.children().each(function () { var a = $(this); a.css(a.data(U)).removeData(U) }).show() }, _prepareAnimation: function (d) { d = $(d); var e = this._getInst(d[0]); var f = { left: 0, top: 0 }; d.parents().each(function () { var a = $(this); if (a.css('position') == 'fixed') { f.left -= a.offset().left; f.top -= a.offset().top; return false } }); var g = { width: d.width(), height: d.height() }; var h = (e.options.direction != 'random' ? e.options.direction : e.options.randomSelection[Math.floor(Math.random() * e.options.randomSelection.length)]); h = Math.max(0, $.inArray(h, ['up', 'down', 'left', 'right'])); e._curDirection = h; var j = (h == V || h == W); var k = (h == X || h == Y); var l = (h == V || h == X); var m = (l ? 0 : e.options.opacity); var n = $(e.current); var o = $(e.next); var q = []; var r = function (p) { var b = [0, 0, 0, 0]; if (p.css('border') != undefined) { $.each(['Left', 'Right', 'Top', 'Bottom'], function (i, a) { b[i] = p.css('border' + a + 'Width'); b[i] = parseFloat({ thin: 1, medium: 3, thick: 5 }[b[i]] || b[i]) }) } return b }; q[0] = r(n); q[1] = r(o); var s = []; s[0] = [parseFloat(n.css('padding-left')), parseFloat(n.css('padding-right')), parseFloat(n.css('padding-top')), parseFloat(n.css('padding-bottom'))]; s[1] = [parseFloat(o.css('padding-left')), parseFloat(o.css('padding-right')), parseFloat(o.css('padding-top')), parseFloat(o.css('padding-bottom'))]; var t = []; t[0] = ($.support.boxModel ? [q[0][0] + q[0][1] + s[0][0] + s[0][1], q[0][2] + q[0][3] + s[0][2] + s[0][3]] : [0, 0]); t[1] = ($.support.boxModel ? [q[1][0] + q[1][1] + s[1][0] + s[1][1], q[1][2] + q[1][3] + s[1][2] + s[1][3]] : [0, 0]); var u = []; u[0] = { elem: n[0], props: { left: { next: f.left, end: f.left + (h == Y ? g.width : 0), units: 'px' }, width: { next: g.width - t[0][0], end: (j ? g.width - t[0][0] : 0), units: 'px' }, top: { next: f.top, end: f.top + (h == W ? g.height : 0), units: 'px' }, height: { next: g.height - t[0][1], end: (j ? 0 : g.height - t[0][1]), units: 'px' }, paddingLeft: { next: s[0][0], end: (k ? 0 : s[0][0]), units: 'px' }, paddingRight: { next: s[0][1], end: (k ? 0 : s[0][1]), units: 'px' }, paddingTop: { next: s[0][2], end: (j ? 0 : s[0][2]), units: 'px' }, paddingBottom: { next: s[0][3], end: (j ? 0 : s[0][3]), units: 'px' }, borderLeftWidth: { next: q[0][0], end: (k ? 0 : q[0][0]), units: 'px' }, borderRightWidth: { next: q[0][1], end: (k ? 0 : q[0][1]), units: 'px' }, borderTopWidth: { next: q[0][2], end: (j ? 0 : q[0][2]), units: 'px' }, borderBottomWidth: { next: q[0][3], end: (j ? 0 : q[0][3]), units: 'px' }, lineHeight: { next: e.options.lineHeight[1], end: (j ? e.options.lineHeight[0] : e.options.lineHeight[1]), units: 'em' }, letterSpacing: { next: e.options.letterSpacing[1], end: (j ? e.options.letterSpacing[1] : e.options.letterSpacing[0]), units: 'em' } } }; u[1] = { elem: o[0], props: { left: { next: f.left + (h == X ? g.width : 0), end: f.left, units: 'px' }, width: { next: (j ? g.width - t[1][0] : 0), end: g.width - t[1][0], units: 'px' }, top: { next: f.top + (h == V ? g.height : 0), end: f.top, units: 'px' }, height: { next: (j ? 0 : g.height - t[1][1]), end: g.height - t[1][1], units: 'px' }, paddingLeft: { next: (k ? 0 : s[1][0]), end: s[1][0], units: 'px' }, paddingRight: { next: (k ? 0 : s[1][1]), end: s[1][1], units: 'px' }, paddingTop: { next: (j ? 0 : s[1][2]), end: s[1][2], units: 'px' }, paddingBottom: { next: (j ? 0 : s[1][3]), end: s[1][3], units: 'px' }, borderLeftWidth: { next: (k ? 0 : q[1][0]), end: q[1][0], units: 'px' }, borderRightWidth: { next: (k ? 0 : q[1][1]), end: q[1][1], units: 'px' }, borderTopWidth: { next: (j ? 0 : q[1][2]), end: q[1][2], units: 'px' }, borderBottomWidth: { next: (j ? 0 : q[1][3]), end: q[1][3], units: 'px' }, lineHeight: { next: (j ? e.options.lineHeight[0] : e.options.lineHeight[1]), end: e.options.lineHeight[1], units: 'em' }, letterSpacing: { next: (j ? e.options.letterSpacing[1] : e.options.letterSpacing[0]), end: e.options.letterSpacing[1], units: 'em' } } }; if (e.options.shading) { var v = function (a, b, c) { return { left: { next: a.left.next, end: a.left.end, units: 'px' }, width: { next: a.width.next, end: a.width.end, units: 'px' }, top: { next: a.top.next, end: a.top.end, units: 'px' }, height: { next: a.height.next, end: a.height.end, units: 'px' }, paddingLeft: { next: a.paddingLeft.next + a.borderLeftWidth.next, end: a.paddingLeft.end + a.borderLeftWidth.end, units: 'px' }, paddingRight: { next: a.paddingRight.next + a.borderRightWidth.next, end: a.paddingRight.end + a.borderRightWidth.end, units: 'px' }, paddingTop: { next: a.paddingTop.next + a.borderTopWidth.next, end: a.paddingTop.end + a.borderTopWidth.end, units: 'px' }, paddingBottom: { next: a.paddingBottom.next + a.borderBottomWidth.next, end: a.paddingBottom.end + a.borderBottomWidth.end, units: 'px' }, opacity: { next: b, end: c, units: '' } } }; u[2] = { elem: $((!$.support.opacity ? '<img src="' + e.options.imagePath + 'imageCubeHigh.png"' : '<div') + ' class="imageCubeShading" style="background-color: white; opacity: ' + m + '; z-index: 10; position: absolute;"' + (!$.support.opacity ? '/>' : '></div>'))[0], props: v(u[l ? 0 : 1].props, m, e.options.opacity - m) }; u[3] = { elem: $((!$.support.opacity ? '<img src="' + e.options.imagePath + 'imageCubeShad.png"' : '<div') + ' class="imageCubeShading" style="background-color: black; opacity: ' + (e.options.opacity - m) + '; z-index: 10; position: absolute;"' + (!$.support.opacity ? '/>' : '></div>'))[0], props: v(u[l ? 1 : 0].props, e.options.opacity - m, m) } } if (e.options.full3D) { for (var i = 0; i < e.options.segments; i++) { d.append(n.clone().addClass('imageCubeFrom').css({ display: 'block', position: 'absolute', overflow: 'hidden' })); if (e.options.shading) { d.append($(u[l ? 2 : 3].elem).clone()) } } for (var i = 0; i < e.options.segments; i++) { d.append(o.clone().addClass('imageCubeTo').css({ display: 'block', position: 'absolute', width: 0, overflow: 'hidden' })); if (e.options.shading) { d.append($(u[l ? 3 : 2].elem).clone()) } } n.hide(); o.css({ width: g.width - t[1][0], height: g.height - t[1][1] }) } else { var w = function (a) { return { left: a.left.next + 'px', width: a.width.next + 'px', top: a.top.next + 'px', height: a.height.next + 'px', lineHeight: a.lineHeight.next + 'em', padding: a.paddingTop.next + 'px ' + a.paddingRight.next + 'px ' + a.paddingBottom.next + 'px ' + a.paddingLeft.next + 'px', borderLeftWidth: a.borderLeftWidth.next + 'px', borderRightWidth: a.borderRightWidth.next + 'px', borderTopWidth: a.borderTopWidth.next + 'px', borderBottomWidth: a.borderBottomWidth.next + 'px', letterSpacing: a.letterSpacing.next + 'em', overflow: 'hidden' } }; n.css(w(u[0].props)); o.css(w(u[1].props)).show(); if (e.options.shading) { d.append(u[2].elem).append(u[3].elem) } } for (var i = 0; i < u.length; i++) { for (var x in u[i].props) { var y = u[i].props[x]; y.diff = y.end - y.next } } return u }, _drawFull3D: function (G, H, I) { G = $(G); var J = G.data(U); if (!J.options.full3D) { return false } var K = J._curDirection; var L = (K == V || K == W); var M = (K == V || K == X); var N = G.width(); var O = G.height(); if (N == 0 || O == 0) { return true } var P = (1 - H) * (L ? O : N); var Q = J.options.segments; var R = J.options.expansion * (1 - Math.abs(2 * P - (L ? O : N)) / (L ? O : N)); var S = J.options.reduction - (J.options.reduction * P / (L ? O : N)); var T = function (a, b, c, d, e, f, g, k, l, m, n, o) { var p = [d - b, f - k]; var w = Math.max(p[0], p[1]); var q = [l - c, g - e]; var h = Math.max(q[0], q[1]); var r = (L ? (p[0] - p[1]) / (Q - 1) / 2 : w / Q); var s = (L ? h / Q : (q[0] - q[1]) / (Q - 1) / 2); var t = n.paddingLeft[o] + n.paddingRight[o] + n.borderLeftWidth[o] + n.borderRightWidth[o]; var u = n.paddingTop[o] + n.paddingBottom[o] + n.borderTopWidth[o] + n.borderBottomWidth[o]; var v = Math.round(b); var x = Math.round(c); var y = v; var z = x; var i = 0; for (var j = 0; j < G[0].childNodes.length; j++) { var A = G[0].childNodes[j]; if (A.className != a) { continue } var B = Math.round(b + (i + 1) * r); var C = Math.round(c + (i + 1) * s); var D = p[0] - (L ? 2 * i * r : 0); var E = q[0] - (L ? 0 : 2 * i * s); A.style.left = (L ? y : b) + 'px'; A.style.top = (L ? c : z) + 'px'; A.style.width = Math.max(0, D - t) + 'px'; A.style.height = Math.max(0, E - u) + 'px'; A.style.letterSpacing = (L ? D / w * (J.options.letterSpacing[1] - J.options.letterSpacing[0]) + J.options.letterSpacing[0] : H * n.letterSpacing.diff + n.letterSpacing.next) + n.letterSpacing.units; A.style.lineHeight = (!L ? E / h * (J.options.lineHeight[1] - J.options.lineHeight[0]) + J.options.lineHeight[0] : H * n.lineHeight.diff + n.lineHeight.next) + n.lineHeight.units; A.style.clip = 'rect(' + (!L ? 'auto' : (z - x) + 'px') + ',' + (L ? 'auto' : (B - v) + 'px') + ',' + (!L ? 'auto' : (C - x) + 'px') + ',' + (L ? 'auto' : (y - v) + 'px') + ')'; if (J.options.shading) { var F = A.nextSibling; F.style.left = y + 'px'; F.style.top = z + 'px'; F.style.width = (L ? p[0] - 2 * i * r : B - y) + 'px'; F.style.height = (L ? C - z : q[0] - 2 * i * s) + 'px'; F.style.opacity = m; if (!$.support.opacity) { F.style.filter = 'alpha(opacity=' + (m * 100) + ')' } } y = B; z = C; i++ } }; T('imageCubeFrom', [S, -R, 0, N - P][K], [0, O - P, S, -R][K], [N - S, N + R, P, N][K], [0, O - P, -R, S][K], [N + R, N - S, P, N][K], [P, O, O + R, O - S][K], [-R, S, 0, N - P][K], [P, O, O - S, O + R][K], (!J.options.shading ? 0 : (M ? H : 1 - H) * I[2].props.opacity.diff + I[2].props.opacity.next), I[0].props, 'next'); T('imageCubeTo', [-R, J.options.reduction - S, P, 0][K], [P, 0, -R, J.options.reduction - S][K], [N + R, N - (J.options.reduction - S), N, N - P][K], [P, 0, J.options.reduction - S, -R][K], [N - (J.options.reduction - S), N + R, N, N - P][K], [O, O - P, O - (J.options.reduction - S), O + R][K], [J.options.reduction - S, -R, P, 0][K], [O, O - P, O + R, O - (J.options.reduction - S)][K], (!J.options.shading ? 0 : (M ? H : 1 - H) * I[3].props.opacity.diff + I[3].props.opacity.next), I[1].props, 'end'); return true } }); $.fx.step[U] = function (a) { if (!a.stepProps) { a.next = 0.0; a.end = 1.0; a.stepProps = $.imagecube._prepareAnimation(a.elem); var b = a.stepProps[0].elem; a.saveCSS = { borderLeftWidth: b.style.borderLeftWidth, borderRightWidth: b.style.borderRightWidth, borderTopWidth: b.style.borderTopWidth, borderBottomWidth: b.style.borderBottomWidth, padding: b.style.padding } } if (!$.imagecube._drawFull3D(a.elem, a.pos, a.stepProps)) { for (var i = 0; i < a.stepProps.length; i++) { var c = a.stepProps[i]; for (var d in c.props) { var e = c.props[d]; c.elem.style[d] = (a.pos * e.diff + e.next) + e.units; if (!$.support.opacity && d == 'opacity') { c.elem.style.filter = 'alpha(opacity=' + ((a.pos * e.diff + e.next) * 100) + ')' } } } } if (a.pos == 1) { $(a.stepProps[0].elem).hide().css(a.saveCSS); $(a.stepProps[1].elem).show(); $.imagecube._prepareRotation(a.elem) } } })(jQuery);

(function ($) {
    $.fn.gridSlider = function (options) {
        var index = 0,
            next = -1,
            prev,
            rowClasses = new Array(),
            rowList= '',
            dfd = $.Deferred();
        //Class
        function GridSlider(options) {
            this.pattern = options.pattern;
            this.images = options.images;
            this.length = options.images.length;
            this.height = options.height;
            this.width = options.width;
            this.cols = options.cols;
            this.rows = options.rows;
        }

        //initailize
        GridSlider.prototype.init = function () {

            $.imagecube.setDefaults({ speed: 1000, pause: 2000, shading: true, direction: 'left' });           
            $grid.html('');
            var i, j;
            for (i = 1; i <= (this.rows) ; i++) {
                $grid.append('<div class="grid_row"></div>');
                var colClasses = new Array();
                for (j = 1; j <= (this.cols) ; j++) {
                    $($grid.find('.grid_row')[i - 1]).append('<div class="grid-col col_' + i + j + '"></div>');
                    colClasses.push('.col_' + i + j);
                }
                rowClasses.push(colClasses);
                rowList = rowClasses.join(',');
            }

            $('.grid_row .grid-col').css({ 'width': this.width, 'height': this.height });

            $grid.find('.grid-col').animate({ opacity: '0' }, 0);
            prev = (gso.rows) - 2;            
        };
          
        //Create Pattern       
      
        GridSlider.prototype.nextPattern = function (_nextRow, _lastRow,next) {            

            for (var i = 0 ; i < (rowClasses[next].length) ; i++) {
                $(rowClasses[next][i]).html('<img src="' + this.setImages() + '"/><img src="' + this.setImages() + '"/>');
                $($(rowClasses[next][i] + ' img')[0]).hide(0);
            }

            $(_nextRow).animate({ opacity: '1' }, 1000);
            setTimeout(function () {
                for (var i = 0 ; i < (rowClasses[next].length) ; i++) {
                    //console.log(rowClasses[next]);
                   $(rowClasses[next][i]).imagecube('next');                }
            }, 1000);
            setTimeout(function () { $(_lastRow).animate({ opacity: '0' }, 1000) }, 1500);
        }

        GridSlider.prototype.setImages = function() {            
            index++;
            if(index >(this.length-1) )
            {
                index = 0;
            }
            return this.images[index];

        }

        //Pattern Call
        GridSlider.prototype.patternCall = function () {           
            $(rowList).imagecube();
            $(rowList).imagecube('stop');           

            if (next < (gso.rows)-1 ) {
                next++;               
            }
            else {
                next = 0;              
            }

            if (prev < (rowClasses.length)-1) {
                prev++;
            } else {
                prev = 0;
            }                      
            
            var _nextRow = rowClasses[next].join(','),          
                _prevRow = rowClasses[prev].join(',');

            gso.nextPattern(_nextRow, _prevRow,next);
            
        }

        //next Point
        var $grid = $(this);
        console.log($grid);
        var defaults = {
            pattern: '3x3',
            cols: 3,
            rows:3,
            height: '150px',
            width: '270px'
        };
        var options = $.extend({}, defaults, options);
        var gso = new GridSlider(options);
        var totalCells = (Number(options.rows) * Number(options.cols));
        
        dfd
            .done(gso.init())
            .done(function () {
                //init complete
            })
            .done(setTimeout(function () { gso.patternCall() }, 100))
            .done(function () {
                //1st call
            })
            .done(setInterval(gso.patternCall, 4500));
        dfd.resolve();
    };
})(jQuery);
