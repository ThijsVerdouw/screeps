'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Transcrypt'ed from Python, 2023-07-12 11:24:46
var __name__ = 'org.transcrypt.__runtime__';

function __nest__ (headObject, tailNames, value) {
    var current = headObject;
    if (tailNames != '') {
        var tailChain = tailNames.split ('.');
        var firstNewIndex = tailChain.length;
        for (var index = 0; index < tailChain.length; index++) {
            if (!current.hasOwnProperty (tailChain [index])) {
                firstNewIndex = index;
                break;
            }
            current = current [tailChain [index]];
        }
        for (var index = firstNewIndex; index < tailChain.length; index++) {
            current [tailChain [index]] = {};
            current = current [tailChain [index]];
        }
    }
    for (let attrib of Object.getOwnPropertyNames (value)) {
        Object.defineProperty (current, attrib, {
            get () {return value [attrib];},
            enumerable: true,
            configurable: true
        });
    }
}function __get__ (self, func, quotedFuncName) {
    if (self) {
        if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {
            if (quotedFuncName) {
                Object.defineProperty (self, quotedFuncName, {
                    value: function () {
                        var args = [] .slice.apply (arguments);
                        return func.apply (null, [self] .concat (args));
                    },
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            return function () {
                var args = [] .slice.apply (arguments);
                return func.apply (null, [self] .concat (args));
            };
        }
        else {
            return func;
        }
    }
    else {
        return func;
    }
}var py_metatype = {
    __name__: 'type',
    __bases__: [],
    __new__: function (meta, name, bases, attribs) {
        var cls = function () {
            var args = [] .slice.apply (arguments);
            return cls.__new__ (args);
        };
        for (var index = bases.length - 1; index >= 0; index--) {
            var base = bases [index];
            for (var attrib in base) {
                var descrip = Object.getOwnPropertyDescriptor (base, attrib);
                if (descrip == null) {
                    continue;
                }
                Object.defineProperty (cls, attrib, descrip);
            }
            for (let symbol of Object.getOwnPropertySymbols (base)) {
                let descrip = Object.getOwnPropertyDescriptor (base, symbol);
                Object.defineProperty (cls, symbol, descrip);
            }
        }
        cls.__metaclass__ = meta;
        cls.__name__ = name.startsWith ('py_') ? name.slice (3) : name;
        cls.__bases__ = bases;
        for (var attrib in attribs) {
            var descrip = Object.getOwnPropertyDescriptor (attribs, attrib);
            Object.defineProperty (cls, attrib, descrip);
        }
        for (let symbol of Object.getOwnPropertySymbols (attribs)) {
            let descrip = Object.getOwnPropertyDescriptor (attribs, symbol);
            Object.defineProperty (cls, symbol, descrip);
        }
        return cls;
    }
};
py_metatype.__metaclass__ = py_metatype;
var object = {
    __init__: function (self) {},
    __metaclass__: py_metatype,
    __name__: 'object',
    __bases__: [],
    __new__: function (args) {
        var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
        if ('__getattr__' in this || '__setattr__' in this) {
            instance = new Proxy (instance, {
                get: function (target, name) {
                    let result = target [name];
                    if (result == undefined) {
                        return target.__getattr__ (name);
                    }
                    else {
                        return result;
                    }
                },
                set: function (target, name, value) {
                    try {
                        target.__setattr__ (name, value);
                    }
                    catch (exception) {
                        target [name] = value;
                    }
                    return true;
                }
            });
        }
        this.__init__.apply (null, [instance] .concat (args));
        return instance;
    }
};
function __class__ (name, bases, attribs, meta) {
    if (meta === undefined) {
        meta = bases [0] .__metaclass__;
    }
    return meta.__new__ (meta, name, bases, attribs);
}function __kwargtrans__ (anObject) {
    anObject.__kwargtrans__ = null;
    anObject.constructor = Object;
    return anObject;
}
function __setproperty__ (anObject, name, descriptor) {
    if (!anObject.hasOwnProperty (name)) {
        Object.defineProperty (anObject, name, descriptor);
    }
}
function __specialattrib__ (attrib) {
    return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
}function len (anObject) {
    if (anObject === undefined || anObject === null) {
        return 0;
    }
    if (anObject.__len__ instanceof Function) {
        return anObject.__len__ ();
    }
    if (anObject.length !== undefined) {
        return anObject.length;
    }
    var length = 0;
    for (var attr in anObject) {
        if (!__specialattrib__ (attr)) {
            length++;
        }
    }
    return length;
}function int (any, radix) {
    if (any === false) {
        return 0;
    } else if (any === true) {
        return 1;
    } else {
        var number = parseInt(any, radix);
        if (isNaN (number)) {
            if (radix == undefined) {
                radix = 10;
            }
            throw ValueError('invalid literal for int() with base ' + radix + ': ' + any, new Error());
        }
        return number;
    }
}int.__name__ = 'int';
int.__bases__ = [object];
function repr (anObject) {
    if (anObject == null) {
        return 'None';
    }
    switch (typeof anObject) {
        case "undefined":
            return 'None';
        case "boolean":
            if (anObject) {
                return "True"
            } else {
                return "False";
            }
        case "number":
        case "string":
        case "symbol":
            return String (anObject);
        case "function":
            try {
                return String (anObject);
            } catch (e) {
                return "<function " + anObject.name + ">"
            }
    }
    if (anObject.__repr__) {
        return anObject.__repr__ ();
    } else if (anObject.__str__) {
        return anObject.__str__ ();
    } else {
        try {
            if (anObject.constructor == Object) {
                var result = '{';
                var comma = false;
                for (var attrib in anObject) {
                    if (!__specialattrib__ (attrib)) {
                        if (attrib.isnumeric ()) {
                            var attribRepr = attrib;
                        }
                        else {
                            var attribRepr = '\'' + attrib + '\'';
                        }
                        if (comma) {
                            result += ', ';
                        }
                        else {
                            comma = true;
                        }
                        result += attribRepr + ': ' + repr (anObject [attrib]);
                    }
                }
                result += '}';
                return result;
            }
            else {
                return String(anObject);
            }
        }
        catch (exception) {
            return '<object of type: ' + typeof anObject + '>';
        }
    }
}function __PyIterator__ (iterable) {
    this.iterable = iterable;
    this.index = 0;
}
__PyIterator__.prototype.__next__ = function() {
    if (this.index < this.iterable.length) {
        return this.iterable [this.index++];
    }
    else {
        throw StopIteration (new Error ());
    }
};
function list (iterable) {
    let instance = iterable ? Array.from (iterable) : [];
    return instance;
}
Array.prototype.__class__ = list;
list.__name__ = 'list';
list.__bases__ = [object];
Array.prototype.__iter__ = function () {return new __PyIterator__ (this);};
Array.prototype.__getslice__ = function (start, stop, step) {
    if (start < 0) {
        start = this.length + start;
    }
    if (stop == null) {
        stop = this.length;
    }
    else if (stop < 0) {
        stop = this.length + stop;
    }
    else if (stop > this.length) {
        stop = this.length;
    }
    if (step == 1) {
        return Array.prototype.slice.call(this, start, stop);
    }
    let result = list ([]);
    for (let index = start; index < stop; index += step) {
        result.push (this [index]);
    }
    return result;
};
Array.prototype.__setslice__ = function (start, stop, step, source) {
    if (start < 0) {
        start = this.length + start;
    }
    if (stop == null) {
        stop = this.length;
    }
    else if (stop < 0) {
        stop = this.length + stop;
    }
    if (step == null) {
        Array.prototype.splice.apply (this, [start, stop - start] .concat (source));
    }
    else {
        let sourceIndex = 0;
        for (let targetIndex = start; targetIndex < stop; targetIndex += step) {
            this [targetIndex] = source [sourceIndex++];
        }
    }
};
Array.prototype.__repr__ = function () {
    if (this.__class__ == set && !this.length) {
        return 'set()';
    }
    let result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';
    for (let index = 0; index < this.length; index++) {
        if (index) {
            result += ', ';
        }
        result += repr (this [index]);
    }
    if (this.__class__ == tuple && this.length == 1) {
        result += ',';
    }
    result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';    return result;
};
Array.prototype.__str__ = Array.prototype.__repr__;
Array.prototype.append = function (element) {
    this.push (element);
};
Array.prototype.py_clear = function () {
    this.length = 0;
};
Array.prototype.extend = function (aList) {
    this.push.apply (this, aList);
};
Array.prototype.insert = function (index, element) {
    this.splice (index, 0, element);
};
Array.prototype.remove = function (element) {
    let index = this.indexOf (element);
    if (index == -1) {
        throw ValueError ("list.remove(x): x not in list", new Error ());
    }
    this.splice (index, 1);
};
Array.prototype.index = function (element) {
    return this.indexOf (element);
};
Array.prototype.py_pop = function (index) {
    if (index == undefined) {
        return this.pop ();
    }
    else {
        return this.splice (index, 1) [0];
    }
};
Array.prototype.py_sort = function () {
    __sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));
};
Array.prototype.__add__ = function (aList) {
    return list (this.concat (aList));
};
Array.prototype.__mul__ = function (scalar) {
    let result = this;
    for (let i = 1; i < scalar; i++) {
        result = result.concat (this);
    }
    return result;
};
Array.prototype.__rmul__ = Array.prototype.__mul__;
function tuple (iterable) {
    let instance = iterable ? [] .slice.apply (iterable) : [];
    instance.__class__ = tuple;
    return instance;
}
tuple.__name__ = 'tuple';
tuple.__bases__ = [object];
function set (iterable) {
    let instance = [];
    if (iterable) {
        for (let index = 0; index < iterable.length; index++) {
            instance.add (iterable [index]);
        }
    }
    instance.__class__ = set;
    return instance;
}
set.__name__ = 'set';
set.__bases__ = [object];
Array.prototype.__bindexOf__ = function (element) {
    element += '';
    let mindex = 0;
    let maxdex = this.length - 1;
    while (mindex <= maxdex) {
        let index = (mindex + maxdex) / 2 | 0;
        let middle = this [index] + '';
        if (middle < element) {
            mindex = index + 1;
        }
        else if (middle > element) {
            maxdex = index - 1;
        }
        else {
            return index;
        }
    }
    return -1;
};
Array.prototype.add = function (element) {
    if (this.indexOf (element) == -1) {
        this.push (element);
    }
};
Array.prototype.discard = function (element) {
    var index = this.indexOf (element);
    if (index != -1) {
        this.splice (index, 1);
    }
};
Array.prototype.isdisjoint = function (other) {
    this.sort ();
    for (let i = 0; i < other.length; i++) {
        if (this.__bindexOf__ (other [i]) != -1) {
            return false;
        }
    }
    return true;
};
Array.prototype.issuperset = function (other) {
    this.sort ();
    for (let i = 0; i < other.length; i++) {
        if (this.__bindexOf__ (other [i]) == -1) {
            return false;
        }
    }
    return true;
};
Array.prototype.issubset = function (other) {
    return set (other.slice ()) .issuperset (this);
};
Array.prototype.union = function (other) {
    let result = set (this.slice () .sort ());
    for (let i = 0; i < other.length; i++) {
        if (result.__bindexOf__ (other [i]) == -1) {
            result.push (other [i]);
        }
    }
    return result;
};
Array.prototype.intersection = function (other) {
    this.sort ();
    let result = set ();
    for (let i = 0; i < other.length; i++) {
        if (this.__bindexOf__ (other [i]) != -1) {
            result.push (other [i]);
        }
    }
    return result;
};
Array.prototype.difference = function (other) {
    let sother = set (other.slice () .sort ());
    let result = set ();
    for (let i = 0; i < this.length; i++) {
        if (sother.__bindexOf__ (this [i]) == -1) {
            result.push (this [i]);
        }
    }
    return result;
};
Array.prototype.symmetric_difference = function (other) {
    return this.union (other) .difference (this.intersection (other));
};
Array.prototype.py_update = function () {
    let updated = [] .concat.apply (this.slice (), arguments) .sort ();
    this.py_clear ();
    for (let i = 0; i < updated.length; i++) {
        if (updated [i] != updated [i - 1]) {
            this.push (updated [i]);
        }
    }
};
Array.prototype.__eq__ = function (other) {
    if (this.length != other.length) {
        return false;
    }
    if (this.__class__ == set) {
        this.sort ();
        other.sort ();
    }
    for (let i = 0; i < this.length; i++) {
        if (this [i] != other [i]) {
            return false;
        }
    }
    return true;
};
Array.prototype.__ne__ = function (other) {
    return !this.__eq__ (other);
};
Array.prototype.__le__ = function (other) {
    if (this.__class__ == set) {
        return this.issubset (other);
    }
    else {
        for (let i = 0; i < this.length; i++) {
            if (this [i] > other [i]) {
                return false;
            }
            else if (this [i] < other [i]) {
                return true;
            }
        }
        return true;
    }
};
Array.prototype.__ge__ = function (other) {
    if (this.__class__ == set) {
        return this.issuperset (other);
    }
    else {
        for (let i = 0; i < this.length; i++) {
            if (this [i] < other [i]) {
                return false;
            }
            else if (this [i] > other [i]) {
                return true;
            }
        }
        return true;
    }
};
Array.prototype.__lt__ = function (other) {
    return (
        this.__class__ == set ?
        this.issubset (other) && !this.issuperset (other) :
        !this.__ge__ (other)
    );
};
Array.prototype.__gt__ = function (other) {
    return (
        this.__class__ == set ?
        this.issuperset (other) && !this.issubset (other) :
        !this.__le__ (other)
    );
};
Uint8Array.prototype.__add__ = function (aBytes) {
    let result = new Uint8Array (this.length + aBytes.length);
    result.set (this);
    result.set (aBytes, this.length);
    return result;
};
Uint8Array.prototype.__mul__ = function (scalar) {
    let result = new Uint8Array (scalar * this.length);
    for (let i = 0; i < scalar; i++) {
        result.set (this, i * this.length);
    }
    return result;
};
Uint8Array.prototype.__rmul__ = Uint8Array.prototype.__mul__;
function str (stringable) {
    if (stringable === null || typeof stringable === 'undefined') {
        return 'None';
    } else if (stringable.__str__) {
        return stringable.__str__ ();
    } else {
        return repr (stringable);
    }
}String.prototype.__class__ = str;
str.__name__ = 'str';
str.__bases__ = [object];
String.prototype.__iter__ = function () {new __PyIterator__ (this);};
String.prototype.__repr__ = function () {
    return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .py_replace ('\t', '\\t') .py_replace ('\n', '\\n');
};
String.prototype.__str__ = function () {
    return this;
};
String.prototype.capitalize = function () {
    return this.charAt (0).toUpperCase () + this.slice (1);
};
String.prototype.endswith = function (suffix) {
    if (suffix instanceof Array) {
        for (var i=0;i<suffix.length;i++) {
            if (this.slice (-suffix[i].length) == suffix[i])
                return true;
        }
    } else
        return suffix == '' || this.slice (-suffix.length) == suffix;
    return false;
};
String.prototype.find = function (sub, start) {
    return this.indexOf (sub, start);
};
String.prototype.__getslice__ = function (start, stop, step) {
    if (start < 0) {
        start = this.length + start;
    }
    if (stop == null) {
        stop = this.length;
    }
    else if (stop < 0) {
        stop = this.length + stop;
    }
    var result = '';
    if (step == 1) {
        result = this.substring (start, stop);
    }
    else {
        for (var index = start; index < stop; index += step) {
            result = result.concat (this.charAt(index));
        }
    }
    return result;
};
__setproperty__ (String.prototype, 'format', {
    get: function () {return __get__ (this, function (self) {
        var args = tuple ([] .slice.apply (arguments).slice (1));
        var autoIndex = 0;
        return self.replace (/\{(\w*)\}/g, function (match, key) {
            if (key == '') {
                key = autoIndex++;
            }
            if (key == +key) {
                return args [key] === undefined ? match : str (args [key]);
            }
            else {
                for (var index = 0; index < args.length; index++) {
                    if (typeof args [index] == 'object' && args [index][key] !== undefined) {
                        return str (args [index][key]);
                    }
                }
                return match;
            }
        });
    });},
    enumerable: true
});
String.prototype.isalnum = function () {
    return /^[0-9a-zA-Z]{1,}$/.test(this)
};
String.prototype.isalpha = function () {
    return /^[a-zA-Z]{1,}$/.test(this)
};
String.prototype.isdecimal = function () {
    return /^[0-9]{1,}$/.test(this)
};
String.prototype.isdigit = function () {
    return this.isdecimal()
};
String.prototype.islower = function () {
    return /^[a-z]{1,}$/.test(this)
};
String.prototype.isupper = function () {
    return /^[A-Z]{1,}$/.test(this)
};
String.prototype.isspace = function () {
    return /^[\s]{1,}$/.test(this)
};
String.prototype.isnumeric = function () {
    return !isNaN (parseFloat (this)) && isFinite (this);
};
String.prototype.join = function (strings) {
    strings = Array.from (strings);
    return strings.join (this);
};
String.prototype.lower = function () {
    return this.toLowerCase ();
};
String.prototype.py_replace = function (old, aNew, maxreplace) {
    return this.split (old, maxreplace) .join (aNew);
};
String.prototype.lstrip = function () {
    return this.replace (/^\s*/g, '');
};
String.prototype.rfind = function (sub, start) {
    return this.lastIndexOf (sub, start);
};
String.prototype.rsplit = function (sep, maxsplit) {
    if (sep == undefined || sep == null) {
        sep = /\s+/;
        var stripped = this.strip ();
    }
    else {
        var stripped = this;
    }
    if (maxsplit == undefined || maxsplit == -1) {
        return stripped.split (sep);
    }
    else {
        var result = stripped.split (sep);
        if (maxsplit < result.length) {
            var maxrsplit = result.length - maxsplit;
            return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
        }
        else {
            return result;
        }
    }
};
String.prototype.rstrip = function () {
    return this.replace (/\s*$/g, '');
};
String.prototype.py_split = function (sep, maxsplit) {
    if (sep == undefined || sep == null) {
        sep = /\s+/;
        var stripped = this.strip ();
    }
    else {
        var stripped = this;
    }
    if (maxsplit == undefined || maxsplit == -1) {
        return stripped.split (sep);
    }
    else {
        var result = stripped.split (sep);
        if (maxsplit < result.length) {
            return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
        }
        else {
            return result;
        }
    }
};
String.prototype.startswith = function (prefix) {
    if (prefix instanceof Array) {
        for (var i=0;i<prefix.length;i++) {
            if (this.indexOf (prefix [i]) == 0)
                return true;
        }
    } else
        return this.indexOf (prefix) == 0;
    return false;
};
String.prototype.strip = function () {
    return this.trim ();
};
String.prototype.upper = function () {
    return this.toUpperCase ();
};
String.prototype.__mul__ = function (scalar) {
    var result = '';
    for (var i = 0; i < scalar; i++) {
        result = result + this;
    }
    return result;
};
String.prototype.__rmul__ = String.prototype.__mul__;
function __setdoc__ (docString) {
    this.__doc__ = docString;
    return this;
}
__setproperty__ (Function.prototype, '__setdoc__', {value: __setdoc__, enumerable: false});
var BaseException =  __class__ ('BaseException', [object], {
	__module__: __name__,
});
var Exception =  __class__ ('Exception', [BaseException], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		var kwargs = {};
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
					}
				}
				delete kwargs.__kwargtrans__;
			}
			var args = [].slice.apply (arguments).slice (1, __ilastarg0__ + 1);
		}
		else {
			var args = [];
		}
		self.__args__ = args;
		if (kwargs.error != null) {
			self.stack = kwargs.error.stack;
		}
		else if (Error) {
			self.stack = new Error ().stack;
		}
		else {
			self.stack = 'No stack trace available';
		}
	});},
	get __repr__ () {return __get__ (this, function (self) {
		if (len (self.__args__) > 1) {
			return '{}{}'.format (self.__class__.__name__, repr (tuple (self.__args__)));
		}
		else if (len (self.__args__)) {
			return '{}({})'.format (self.__class__.__name__, repr (self.__args__ [0]));
		}
		else {
			return '{}()'.format (self.__class__.__name__);
		}
	});},
	get __str__ () {return __get__ (this, function (self) {
		if (len (self.__args__) > 1) {
			return str (tuple (self.__args__));
		}
		else if (len (self.__args__)) {
			return str (self.__args__ [0]);
		}
		else {
			return '';
		}
	});}
});
__class__ ('IterableError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, error) {
		Exception.__init__ (self, "Can't iterate over non-iterable", __kwargtrans__ ({error: error}));
	});}
});
var StopIteration =  __class__ ('StopIteration', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, error) {
		Exception.__init__ (self, 'Iterator exhausted', __kwargtrans__ ({error: error}));
	});}
});
var ValueError =  __class__ ('ValueError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
__class__ ('KeyError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
__class__ ('AssertionError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		if (message) {
			Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
		}
		else {
			Exception.__init__ (self, __kwargtrans__ ({error: error}));
		}
	});}
});
__class__ ('NotImplementedError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
__class__ ('IndexError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
__class__ ('AttributeError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
__class__ ('py_TypeError', [Exception], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, message, error) {
		Exception.__init__ (self, message, __kwargtrans__ ({error: error}));
	});}
});
var Warning =  __class__ ('Warning', [Exception], {
	__module__: __name__,
});
__class__ ('UserWarning', [Warning], {
	__module__: __name__,
});
__class__ ('DeprecationWarning', [Warning], {
	__module__: __name__,
});
__class__ ('RuntimeWarning', [Warning], {
	__module__: __name__,
});
var __sort__ = function (iterable, key, reverse) {
	if (typeof key == 'undefined' || (key != null && key.hasOwnProperty ("__kwargtrans__"))) {		var key = null;
	}	if (typeof reverse == 'undefined' || (reverse != null && reverse.hasOwnProperty ("__kwargtrans__"))) {		var reverse = false;
	}	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
					case 'key': var key = __allkwargs0__ [__attrib0__]; break;
					case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
				}
			}
		}
	}
	if (key) {
		iterable.sort ((function __lambda__ (a, b) {
			if (arguments.length) {
				var __ilastarg0__ = arguments.length - 1;
				if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
					var __allkwargs0__ = arguments [__ilastarg0__--];
					for (var __attrib0__ in __allkwargs0__) {
						switch (__attrib0__) {
							case 'a': var a = __allkwargs0__ [__attrib0__]; break;
							case 'b': var b = __allkwargs0__ [__attrib0__]; break;
						}
					}
				}
			}
			return (key (a) > key (b) ? 1 : -(1));
		}));
	}
	else {
		iterable.sort ();
	}
	if (reverse) {
		iterable.reverse ();
	}
};
var __Terminal__ =  __class__ ('__Terminal__', [object], {
	__module__: __name__,
	get print () {return __get__ (this, function (self) {
		var sep = ' ';
		if (arguments.length) {
			var __ilastarg0__ = arguments.length - 1;
			if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
				var __allkwargs0__ = arguments [__ilastarg0__--];
				for (var __attrib0__ in __allkwargs0__) {
					switch (__attrib0__) {
						case 'self': var self = __allkwargs0__ [__attrib0__]; break;
						case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
					}
				}
			}
			var args = [].slice.apply (arguments).slice (1, __ilastarg0__ + 1);
		}
		else {
			var args = [];
		}
		var length = len (args);
		if (length < 1) {
			console.log ();
		}
		else if (length == 1) {
			console.log (args [0]);
		}
		else {
			console.log (sep.join ((function () {
				var __accu0__ = [];
				for (var arg of args) {
					__accu0__.append (str (arg));
				}
				return __accu0__;
			}) ()));
		}
	});}
});
var __terminal__ = __Terminal__ ();
var print = __terminal__.print;
__terminal__.input;

// Transcrypt'ed from Python, 2023-07-12 11:24:47
var DetermineGamePhase = function (location) {
	if (location.memory.GamePhase == null) {
		location.memory.GamePhase = 'Debug';
		location.memory.minersPerAccessPoint = 0;
	}
	else if (location.energyCapacityAvailable < 2000) {
		location.memory.GamePhase = 'GameStart';
		location.memory.minersPerAccessPoint = 2;
	}
	else {
		location.memory.GamePhase = 'ReadyToRumble';
		location.memory.minersPerAccessPoint = 1;
	}
};
var ManageRoom = function (location) {
	if (location.memory.GamePhase == 'GameStart') {
		if (len (location.find (FIND_CONSTRUCTION_SITES)) == 0) {
			location.createConstructionSite (20, 19, STRUCTURE_EXTENSION);
		}
	}
	else if (location.memory.GamePhase == 'ReadyToRumble') {
		if (len (location.find (FIND_CONSTRUCTION_SITES)) == 0) {
			location.createConstructionSite (10, 15, STRUCTURE_CONTAINER);
		}
	}
	else {
		print ('GamePhase unclear.');
	}
};
var RoomEnergyIdentifier = function (location) {
	var sources = location.find (FIND_SOURCES);
	location.memory.sourceNr = len (sources);
	var listForSourceData = [];
	var terrain = location.getTerrain ();
	for (var source of sources) {
		var x = source.pos.x;
		var y = source.pos.y;
		var accessPoints = 0;
		var totalAccesPoints = 0;
		for (var xChange = 0; xChange < 3; xChange++) {
			var newX = (x - xChange) + 1;
			for (var yChange = 0; yChange < 3; yChange++) {
				var newY = (y - yChange) + 1;
				if (terrain.get (newX, newY) == 0) {
					var accessPoints = accessPoints + 1;
				}
			}
		}
		var totalAccesPoints = totalAccesPoints + accessPoints;
		listForSourceData.append ([source, accessPoints]);
	}
	location.memory.totalAccesPoints = totalAccesPoints;
	location.memory.sourceAccessability = listForSourceData;
};
var identifyHarvestersNeeded = function (location) {
	if (location.memory.GamePhase == 'PlaceHolder') {
		location.memory.requiredHarvesters = location.memory.totalAccesPoints * 2;
	}
	else if (location.memory.GamePhase == 'GameStart') {
		location.memory.requiredHarvesters = location.memory.totalAccesPoints * 2;
	}
	else if (location.memory.GamePhase == 'ReadyToRumble') {
		location.memory.requiredHarvesters = location.memory.totalAccesPoints * 1;
	}
	else {
		location.memory.requiredHarvesters = 4;
	}
};
var assignSameRoomSource = function (location) {
	for (var i = 0; i < len (location.memory.sourceAccessability); i++) {
		var source = location.memory.sourceAccessability [i] [0];
		var requiredCreeps = location.memory.sourceAccessability [i] [1] * location.memory.minersPerAccessPoint;
		var num_creeps = len (location.find (FIND_CREEPS).filter ((function __lambda__ (c) {
			return c.memory.source == source.id && len (c.memory.source) > 0;
		})));
		print ('Source: ', (((str (source.id) + ', requiredCreeps: ') + str (requiredCreeps)) + ' num_creeps ') + str (num_creeps));
		for (var creepboi of location.find (FIND_CREEPS)) {
			print (creepboi, creepboi.memory.source);
		}
		if (num_creeps < requiredCreeps && requiredCreeps > -(1)) {
			print ('assigned source id: ', str (source.id));
			return source.id;
		}
	}
};

var __module_Strategy__ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DetermineGamePhase: DetermineGamePhase,
    ManageRoom: ManageRoom,
    RoomEnergyIdentifier: RoomEnergyIdentifier,
    identifyHarvestersNeeded: identifyHarvestersNeeded,
    assignSameRoomSource: assignSameRoomSource
});

// Transcrypt'ed from Python, 2023-07-12 11:24:47
var Strategy$1 = {};
__nest__ (Strategy$1, '', __module_Strategy__);
var run_harvester = function (creep) {
	if (creep.memory.filling && _.sum (creep.carry) >= creep.carryCapacity) {
		creep.memory.filling = false;
	}
	else if (!(creep.memory.filling) && creep.carry.energy <= 0) {
		creep.memory.filling = true;
		creep.memory.job = 'Mine';
		delete creep.memory.target;
	}
	if (creep.memory.filling) {
		if (creep.memory.source) {
			var source = Game.getObjectById (creep.memory.source);
		}
		else {
			creep.memory.source = Strategy$1.assignSameRoomSource (creep.room);
		}
		if (creep.pos.isNearTo (source)) {
			var result = creep.harvest (source);
			if (result != OK) {
				print ('[{}] Unknown result from creep.harvest({}): {}'.format (creep.name, source, result));
			}
		}
		else {
			creep.moveTo (source);
		}
	}
	else {
		if (len (creep.memory.target) > 0) {
			var target = Game.getObjectById (creep.memory.target);
		}
		else if (creep.room.memory.GamePhase == 'GameStart') {
			var target = _ (creep.room.find (FIND_STRUCTURES)).filter ((function __lambda__ (s) {
				return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity;
			})).sample ();
			if (len (target) > 0) {
				creep.memory.target = target.id;
				print (target.id, target.id == targetb);
				creep.memory.job = 'Replenish';
			}
			else if (len (creep.room.find (FIND_CONSTRUCTION_SITES)) > 0) {
				var target = _ (creep.room.find (FIND_CONSTRUCTION_SITES)).filter ((function __lambda__ (s) {
					return s.structureType != STRUCTURE_SPAWN && s.progress > -(1);
				})).sample ();
				creep.memory.target = target.id;
				creep.memory.job = 'Build';
			}
			else {
				creep.memory.target = creep.room.controller.id;
				creep.memory.job = 'Upgrade';
			}
		}
		if (creep.memory.job == 'Upgrade') {
			var is_close = creep.pos.inRangeTo (target, 3);
		}
		else {
			var is_close = creep.pos.isNearTo (target);
		}
		if (is_close) {
			if (target.energyCapacity) {
				var result = creep.transfer (target, RESOURCE_ENERGY);
				if (target.energy >= target.energyCapacity || creep.carry <= 0) {
					delete creep.memory.target;
				}
				else if ((result in [-(7), -(10)])) {
					print ('[{}] Unknown result from creep.transfer({}, {}): {}'.format (creep.name, target, RESOURCE_ENERGY, result));
				}
			}
			else if (target.structureType == 'controller') {
				var result = creep.upgradeController (target);
				if (result != OK) {
					print ('[{}] Unknown result from creep.upgradeController({}): {}'.format (creep.name, target, result));
				}
				if (!(creep.pos.inRangeTo (target, 2))) {
					creep.moveTo (target);
				}
			}
			else {
				var result = creep.build (target);
			}
		}
		else {
			var result = creep.moveTo (target);
			if (result == -(7)) {
				print (('Creep - ' + str (creep.name)) + ' attempted to path to an invalid target. Removing memory.');
				print ((((('Creep - ' + str (creep.name)) + ' target was: ') + str (creep.memory.target)) + ' and role ') + str (creep.memory.job));
				delete creep.memory.target;
			}
		}
	}
};
var create_max_work = function (room_capacity) {
	var modules = [];
	if (room_capacity == 300) {
		var modules = [WORK, WORK, CARRY, MOVE];
	}
	var room_capacity = room_capacity - 150;
	for (var i = 0; i < int (room_capacity / 100); i++) {
		modules.append (WORK);
	}
	modules.append (CARRY);
	modules.append (MOVE);
	modules.append (MOVE);
	return modules;
};
var create_balanced = function (room_capacity) {
	var modules = [];
	if (room_capacity == 300) {
		var modules = [WORK, WORK, CARRY, MOVE];
	}
	var full_sets = int (room_capacity / 200);
	for (var i = 0; i < int (room_capacity / 200); i++) {
		modules.append (WORK);
		modules.append (CARRY);
		modules.append (MOVE);
	}
	if (room_capacity - full_sets * 200 >= 100) {
		modules.append (CARRY);
		modules.append (MOVE);
	}
	modules.py_sort ();
	return modules;
};

var __module_harvester__ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    run_harvester: run_harvester,
    create_max_work: create_max_work,
    create_balanced: create_balanced
});

// Transcrypt'ed from Python, 2023-07-12 11:24:47
var Strategy = {};
var harvester = {};
__nest__ (Strategy, '', __module_Strategy__);
__nest__ (harvester, '', __module_harvester__);
var main = function () {
	for (var location of Object.keys (Game.rooms)) {
		Strategy.DetermineGamePhase (Game.rooms [location]);
		Strategy.ManageRoom (Game.rooms [location]);
		Strategy.RoomEnergyIdentifier (Game.rooms [location]);
		Strategy.identifyHarvestersNeeded (Game.rooms [location]);
	}
	for (var name of Object.keys (Game.creeps)) {
		var creep = Game.creeps [name];
		harvester.run_harvester (creep);
	}
	for (var name of Object.keys (Game.spawns)) {
		var spawn = Game.spawns [name];
		if (!(spawn.spawning)) {
			var num_creeps = _.sum (Game.creeps, (function __lambda__ (c) {
				return c.pos.roomName == spawn.pos.roomName;
			}));
			if (num_creeps < spawn.room.memory.requiredHarvesters) {
				if (spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
					var creep_name = 'Harvester_' + str (Game.time);
					var optimal_harvester = harvester.create_balanced (spawn.room.energyCapacityAvailable);
					print ('Spawning operation status: ', spawn.spawnCreep (optimal_harvester, creep_name));
					print ('for creep: ', optimal_harvester, creep_name);
				}
				else if (num_creeps == 0) {
					var creep_name = 'Harvester_' + str (Game.time);
					var optimal_harvester = [WORK, WORK, CARRY, MOVE];
					print ('Spawning operation status: ', spawn.spawnCreep (optimal_harvester, creep_name));
					print ('for creep: ', optimal_harvester, creep_name);
				}
			}
		}
	}
};
module.exports.loop = main;

exports.main = main;
