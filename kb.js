(function() {
    var BtnCreat = (function() {
        var BtnCreat = function(dir, row, groupNum) {
                return new BtnCreat.fn.init(dir, row, groupNum);
            },
            toString = Object.prototype.toString,
            hasOwn = Object.prototype.hasOwnProperty,
            push = Array.prototype.push,
            slice = Array.prototype.slice,
            trim = String.prototype.trim,
            indexOf = Array.prototype.indexOf,
            btns = { 123: '213' }; //用于存放所有按钮
        BtnCreat.fn = BtnCreat.prototype = {
            constructor: BtnCreat,
            init: function(dir, row, groupNum) {
                this.handlers = {};
                this.dir = { name: '', left: '', right: '', up: '', down: '', tag: '' };
                this.group = [];
                this.groupNum = groupNum || 0;
                if (!(this.row = row)) { //当省略行参数时group中只有一项为this.dir，row参数用于区分单个按钮和自动生成的矩阵按钮。
                    this.group.push(this.dir);
                }
                for (var i in this.dir) {
                    this.dir[i] = dir[i] ? dir[i] : null;
                }
                if (this.dir['name'] != 'null') {
                    btns[this.dir['name']] = this; //循环引用
                    console.log(btns)
                    return this;

                } else {
                    console.error('dir.name是必须的');
                }
            },
            //事件监听部分
            on: function(type, handler) {
                if (typeof this.handlers[type] == "undefined") {
                    this.handlers[type] = [];
                }
                this.handlers[type].push(handler);
                return this;
            },
            trigger: function( /*type(str),data(obj)*/ ) {
                var arr = slice.call(arguments),
                    type, data;
                if (arr.length > 1) {
                    type = arr.pop();
                    data = arr.pop();
                    if (!data.that) {
                        data.that = this;
                    }

                } else {
                    type = arr.pop();
                    data = {};
                    data.that = this;
                }

                if (this.handlers[type] instanceof Array) {
                    var handlers = this.handlers[type];
                    for (var i = 0, len = handlers.length; i < len; i++) {
                        handlers[i](data);
                    }
                }
                return this;
            },
            off: function(type, handler) {
                if (handler) {
                    if (this.handlers[type] instanceof Array) {
                        var handlers = this.handlers[type];
                        for (var i = 0, len = handlers.length; i < len; i++) {
                            if (handlers[i] === handler) {
                                break;
                            }
                        }
                        handlers.splice(i, 1);

                    }
                } else {
                    if (this.handlers[type]) {
                        this.handlers[type] = [];
                    }
                }
                return this;
            },
            //按钮部分
            changeDir: function(dir) {
                for (var i in this.dir) {

                    if (dir[i]) {
                        if (i == 'name') {
                            delete btns[this.dir[i]];
                            this.dir[i] = dir[i];
                            btns[this.dir[i]] = this;
                        } else {
                            this.dir[i] = dir[i];
                        }

                    } //对象是引用型这里更改，this.btns这个对象中对应的对象同时更改
                }
                if (this.row) {
                    this.groupGenerate();
                }
                return this;
            },
            next: function(dir) {
                var state, arr, btn;
                //console.log(dir)
                state = this.group[this.groupNum][dir];
                console.log(state)
                if (state == 0 || state) {
                    arr = BtnCreat.wordDismantle(state)
                    console.log('state:', state)
                    if (arr != -2) {
                        if (arr == -1) {
                            if (this.group[state]) {

                                this.groupNum = parseInt(state);
                                return this;
                            } else if (btn = btns[state]) {
                                this.groupNum = 0;
                                return btn;
                            }
                        } else {
                            btn = btns[arr[0]];

                            btn.groupNum = parseInt(arr[1]);
                            return btn;
                        }

                    }
                }
                return this;
            },
            groupGenerate: function() {

            }

        };
        BtnCreat.fn.init.prototype = BtnCreat.fn;
        BtnCreat.extend = BtnCreat.fn.extend = function() {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && typeof target !== "function") {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (length === i) {
                target = this;
                --i;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (typeof copy === 'object' || (copyIsArray = BtnCreat.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && BtnCreat.isArray(src) ? src : [];

                            } else {
                                clone = src && BtnCreat.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = BtnCreat.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };
        //基础工具方法
        BtnCreat.isArray = function(arr) {
            return toString.call(arr) === '[object Array]';
        };
        BtnCreat.isFunction = function(obj) {
            return toString.call(arr) === '[object Function]';
        };
        BtnCreat.wordDismantle = function(direction) { //字符串分割，用于分割'_'作为分隔符的字符串
            //console.log('direction:',direction);
            if (direction == undefined || direction == null) return -2;
            if (!(/_/.test(direction))) return -1; //纯数字或者纯字母

            return direction.split('_');
        };
        BtnCreat.getChild = function(context, tag) {
            var context = document.getElementById(context);
            var firstChild = context.firstChild;
            var arr = [];
            do {
                if (firstChild.nodeType == 1) arr.push(firstChild)
            } while (firstChild = firstChild.nextSibling)
            if (tag != 'null') {
                tag = tag.toUpperCase();
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].nodeName != tag) {
                        arr.splice(i, 1);
                    }
                }
            }
            return arr;
        }
        return BtnCreat;
    })()
    window.$B = BtnCreat;
})()
