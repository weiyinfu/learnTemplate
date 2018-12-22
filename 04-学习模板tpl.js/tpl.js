(function (global, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function') {
        define(factory);
    } else {
        global.tpl = factory();
    }
})(this, function () {
    return {
        html: function (tpl, data) {
            return this.func(tpl)(data);
        },
        func: function (tpl) {
            var js = this._compile(tpl);
            return new Function('D', "var _h='';function _w(s){ _h+=s;}" + js + "return _h;");
        },
        serv: function (tplurl, data, callBack) {
            var _this = this;
            this.ajax(tplurl, function (tplHtml) {
                var html = _this.html(tplHtml, data);
                callBack(html, tplHtml, data);
            });
        },
        render: function (nodes, finish) {
            if (Object.prototype.toString.call(nodes) == '[object Function]') {
                finish = nodes;
                nodes = null;
            }
            var scripts = nodes || document.getElementsByTagName("script");
            this._finish = finish;
            var tpls = [],
                len = scripts.length;
            for (var i = 0; i < len; i++) {
                if (nodes || (scripts[i].getAttribute("type") == "tpl" && scripts[i].getAttribute("norender") === null)) {
                    tpls.push(scripts[i]);
                }
            }
            this._total = len = tpls.length;
            this._curr = 0;
            for (var i = 0; i < len; i++) {
                var temp = tpls[i];
                this._renderOne(temp);
            }
        },
        escapeHTML: function (str) {
            return str.toString().replace(/[<>&"]/g, function (c) {
                return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c];
            });
        },
        ajax: function (url, callback) {
            var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    callback(req.responseText);
                }
            }
            try {
                req.open("GET", url, true);
                req.send();
            } catch (e) {
            }
        },
        _xssfunc: 'tpl.escapeHTML',
        _compile: function (tpl) {
            var result = '',
                lines = tpl.split('\n'),
                len = lines.length,
                i = -1,
                first;
            while (++i < len) {
                var line = lines[i];
                line = line.replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1');
                first = line.charAt(0);
                if (first == '<' || first == '@') {
                    result += this._parseLine(line);
                } else if (first == '!' && line.charAt(1) == '!') {
                    result += "_w('" + line.substr(2) + "');";
                } else if (first == '!') {
                    result += this._parseLine(line.substr(1));
                } else {
                    result += line;
                }
            }
            return result;
        },
        _parseLine: function (line) {
            var _this = this;
            return "_w('" + line.replace(/'/g, "\\'").replace(/@(\{.+?\}|[\w\.\[\]\(\)\!]+)/g, function (match, exp, index, source) {
                exp = exp.replace(/\\'/g, "'");
                if (source.charAt(index - 1) == '\\') {
                    return "@" + exp;
                }
                if (exp.charAt(0) == '{') {
                    exp = exp.substr(1, exp.length - 2);
                }
                if (exp.charAt(exp.length - 1) == '!') {
                    exp = exp.substr(0, exp.length - 1);
                    return "'+(" + exp + ") + '";
                } else {
                    return "'+ " + _this._xssfunc + "(" + exp + ") + '";
                }
            }) + "');";
        },
        _setToDom: function (node, tplHtml, data) {
            var wrap = document.createElement(/MSIE \d\.0/.test(navigator.userAgent) ? "div" : "table");
            var parent = node.parentNode,
                childs = wrap.childNodes;
            wrap.innerHTML = this.func(tplHtml)(data);
            while (childs.length != 0) {
                parent.insertBefore(childs[0], node);
            }
        },
        _total: 0,
        _curr: 0,
        _finishCall: function () {
            this._curr++;
            if (this._curr == this._total) {
                if (this._finish) {
                    this._finish(this._total);
                }
            }
        },
        _finish: function () {
        },
        _renderOne: function (node) {
            var _this = this;
            var dataurl = node.getAttribute("data-data-url");
            var tplUrl = node.getAttribute("data-tpl-url");
            if (tplUrl) {
                if (dataurl) {
                    this.ajax(dataurl, function (jsonStr) {
                        var json = JSON.parse(jsonStr);
                        _this.ajax(tplUrl, function (tplHtml) {
                            _this._setToDom(node, tplHtml, json);
                            _this._finishCall();
                        });
                    });
                } else {
                    _this.ajax(tplUrl, function (tplHtml) {
                        _this._setToDom(node, tplHtml, {});
                        _this._finishCall();
                    });
                }
            } else {
                if (dataurl) {
                    _this.ajax(dataurl, function (jsonStr) {
                        var json = JSON.parse(jsonStr);
                        _this._setToDom(node, node.innerHTML, json);
                        _this._finishCall();
                    });
                } else {
                    _this._setToDom(node, node.innerHTML, {});
                    _this._finishCall();
                }
            }
        }
    }
});
