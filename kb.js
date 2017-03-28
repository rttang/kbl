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
            class2type = {},
            btns = {}; //用于存放所有按钮
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
            each: function(callback, args) {
                return BtnCreat.each(this, callback, args);
            },


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

            // extend BtnCreat itself if only one argument is passed
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
        BtnCreat.extend({
            isArray: function(arr) {
                return BtnCreat.type(obj) === "function";
            },
            isFunction: function(arr) {
                return BtnCreat.type(obj) === "array";
            },
            // A crude way of determining if an object is a window
            isWindow: function(obj) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            },
            type: function(obj) {
                return obj == null ?
                    String(obj) :
                    class2type[toString.call(obj)] || "object";
            },
            wordDismantle: function(direction) { //字符串分割，用于分割'_'作为分隔符的字符串
                //console.log('direction:',direction);
                if (direction == undefined || direction == null) return -2;
                if (!(/_/.test(direction))) return -1; //纯数字或者纯字母

                return direction.split('_');
            },
            isPlainObject: function(obj) {
                // Must be an Object.
                // Because of IE, we also have to check the presence of the constructor property.
                // Make sure that DOM nodes and window objects don't pass through, as well
                if (!obj || BtnCreat.type(obj) !== "object" || obj.nodeType || BtnCreat.isWindow(obj)) {
                    return false;
                }

                try {
                    // Not own constructor property must be Object
                    if (obj.constructor &&
                        !hasOwn.call(obj, "constructor") &&
                        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                        return false;
                    }
                } catch (e) {
                    // IE8,9 Will throw exceptions on certain host objects #9897
                    return false;
                }

                // Own properties are enumerated firstly, so to speed up,
                // if last one is own, then all properties are own.

                var key;
                for (key in obj) {}

                return key === undefined || hasOwn.call(obj, key);
            },
            getChild: function(context, tag) {
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
            },
            each: function(object, callback, args) {
                var name, i = 0,
                    length = object.length,
                    isObj = length === undefined || BtnCreat.isFunction(object);

                if (args) {
                    if (isObj) {
                        for (name in object) {
                            if (callback.apply(object[name], args) === false) {
                                break;
                            }
                        }
                    } else {
                        for (; i < length;) {
                            if (callback.apply(object[i++], args) === false) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if (isObj) {
                        for (name in object) {
                            if (callback.call(object[name], name, object[name]) === false) {
                                break;
                            }
                        }
                    } else {
                        for (; i < length;) {
                            if (callback.call(object[i], i, object[i++]) === false) {
                                break;
                            }
                        }
                    }
                }

                return object;
            },
        });
        BtnCreat.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });
        //按钮部分
        BtnCreat.fn.extend({
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
            groupGenerate: function(pageDir) {
                var
                    ulName = this.dir['name'],
                    groupRule = this.dir,
                    row = this.row,
                    that = this,
                    liNum, column, tag, num;
                tag = this.dir['tag'];
                num = this.dir['num'];

                if (tag) {
                    //在由js生成的html模板中，问题
                    liNum = BtnCreat.getChild(ulName,tag).length;
                } else if (num) {
                    liNum = parseInt(num);
                } else {
                    liNum =BtnCreat.getChild(ulName,'li').length;
                    //console.log('liNum',liNum)
                }

                //这个地方有待于优化
                column = Math.ceil(liNum / row); //循环变量

                for (var i = 0; i < row; i++) { //行
                    (function(_i) {

                        for (var j = 0; j < column; j++) { //列
                            //这个写入里面的原因是，引用类型每次修改他的副本一起就被修改了。。
                            var btnRule = {
                                    'left': null,
                                    'right': null,
                                    'up': null,
                                    'down': null
                                },
                                btnIndex;

                            btnIndex = _i * column + j;
                            ////console.log('i*column',[i*column]);
                            if (btnIndex < liNum) { //判断方向，向左减一向右加一，向上减列数，向下加列数
                                btnRule['left'] = (btnIndex - 1) >= _i * column ? ((btnIndex - 1)) : groupRule['left'];
                                btnRule['right'] = ((btnIndex + 1) >= 0 && (btnIndex + 1) < column * (_i + 1)) ? ((btnIndex + 1)) : groupRule['right'];
                                btnRule['up'] = (btnIndex - column) >= 0 ? ((btnIndex - column)) : groupRule['up'];
                                btnRule['down'] = (btnIndex + column) < liNum ? (btnIndex + column) : groupRule['down'];
                                if ('vertical' === pageDir) {

                                } else if ('row' === pageDir) {
                                    if (j === 0) {
                                        //缺翻页判断万一那个按钮是不显示
                                        // btnRule['pageLeft'] = btnIndex + column - 1;
                                        btnRule['pageLeft'] = column - 1;
                                    } else if (j === (column - 1)) {
                                        //btnRule['pageRight'] = btnIndex - column + 1;
                                        btnRule['pageRight'] = 0;
                                    }
                                    if (1 == column) {
                                        btnRule['pageRight'] = 0;
                                    }

                                } else if ('rowVertical' === pageDir) {

                                }
                                ////console.log('right',btnRule['right']);
                                //将生成的按钮存到数组里

                                that.group[btnIndex] = btnRule;
                            }
                        }
                    })(i)
                }
                return this;
            },
        })
        return BtnCreat;
    })()
    window.$B = BtnCreat;
})()
