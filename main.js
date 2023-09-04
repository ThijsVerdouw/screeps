'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Transcrypt'ed from Python, 2023-09-04 13:26:16
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
}function __t__ (target) {
    return (
        target === undefined || target === null ? false :
        ['boolean', 'number'] .indexOf (typeof target) >= 0 ? target :
        target.__bool__ instanceof Function ? (target.__bool__ () ? target : false) :
        target.__len__ instanceof Function ?  (target.__len__ () !== 0 ? target : false) :
        target instanceof Function ? target :
        len (target) !== 0 ? target :
        false
    );
}
function float (any) {
    if (any == 'inf') {
        return Infinity;
    }
    else if (any == '-inf') {
        return -Infinity;
    }
    else if (any == 'nan') {
        return NaN;
    }
    else if (isNaN (parseFloat (any))) {
        if (any === false) {
            return 0;
        }
        else if (any === true) {
            return 1;
        }
        else {
            throw ValueError ("could not convert string to float: '" + str(any) + "'", new Error ());
        }
    }
    else {
        return +any;
    }
}float.__name__ = 'float';
float.__bases__ = [object];
function int (any, radix) {
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
function bool (any) {
    return !!__t__ (any);
}bool.__name__ = 'bool';
bool.__bases__ = [int];
function py_typeof (anObject) {
    var aType = typeof anObject;
    if (aType == 'object') {
        try {
            return '__class__' in anObject ? anObject.__class__ : object;
        }
        catch (exception) {
            return aType;
        }
    }
    else {
        return (
            aType == 'boolean' ? bool :
            aType == 'string' ? str :
            aType == 'number' ? (anObject % 1 == 0 ? int : float) :
            null
        );
    }
}function issubclass (aClass, classinfo) {
    if (classinfo instanceof Array) {
        for (let aClass2 of classinfo) {
            if (issubclass (aClass, aClass2)) {
                return true;
            }
        }
        return false;
    }
    try {
        var aClass2 = aClass;
        if (aClass2 == classinfo) {
            return true;
        }
        else {
            var bases = [].slice.call (aClass2.__bases__);
            while (bases.length) {
                aClass2 = bases.shift ();
                if (aClass2 == classinfo) {
                    return true;
                }
                if (aClass2.__bases__.length) {
                    bases = [].slice.call (aClass2.__bases__).concat (bases);
                }
            }
            return false;
        }
    }
    catch (exception) {
        return aClass == classinfo || classinfo == object;
    }
}function isinstance (anObject, classinfo) {
    try {
        return '__class__' in anObject ? issubclass (anObject.__class__, classinfo) : issubclass (py_typeof (anObject), classinfo);
    }
    catch (exception) {
        return issubclass (py_typeof (anObject), classinfo);
    }
}function repr (anObject) {
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
}function min (nrOrSeq) {
    return arguments.length == 1 ? Math.min (...nrOrSeq) : Math.min (...arguments);
}function round (number, ndigits) {
    if (ndigits) {
        var scale = Math.pow (10, ndigits);
        number *= scale;
    }
    var rounded = Math.round (number);
    if (rounded - number == 0.5 && rounded % 2) {
        rounded -= 1;
    }
    if (ndigits) {
        rounded /= scale;
    }
    return rounded;
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
			return '{}({})'.format (self.__class__.__name__, repr (self.__args__[0]));
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
			return str (self.__args__[0]);
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
			console.log (args[0]);
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

// Transcrypt'ed from Python, 2023-09-04 13:26:16
var IdentifyThreats = function (location) {
	if (len (location.controller) > 0) {
		if (location.controller.my) {
			var hostiles = location.find (FIND_HOSTILE_CREEPS);
			if (len (hostiles) > 0) {
				location.memory.FightMode = true;
				var staticDefenses = location.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
					return s.structureType == STRUCTURE_TOWER;
				}));
				if (len (staticDefenses) > 0) {
					for (var tower of staticDefenses) {
						tower.attack (tower.pos.findClosestByRange (hostiles));
					}
				}
				else {
					location.controller.activateSafeMode ();
					// pass;
				}
			}
			else {
				location.memory.FightMode = false;
			}
		}
	}
};

var __module_combat__ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IdentifyThreats: IdentifyThreats
});

// Transcrypt'ed from Python, 2023-09-04 13:26:16
var SpawnCreep = function (spawn, name, modules, Memory) {
	if (spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
		spawn.spawnCreep (modules, name, __kwargtrans__ ({memory: Memory}));
		print ('Spawning operation status: ', spawn.spawnCreep (modules, name, __kwargtrans__ ({memory: Memory})));
		print ('for creep: ', modules, name);
	}
};
var SpawnJackOfAllTrades = function (spawn) {
	var creep_name = 'Jack_' + str (Game.time);
	var modules = create_balanced (spawn.room.energyCapacityAvailable);
	var Memory = {['designation']: 'JackOfAllTrades'};
	SpawnCreep (spawn, creep_name, modules, Memory);
};
var SpawnScout = function (spawn) {
	if (spawn.room.energyAvailable >= 50) {
		var creep_name = 'Franz_' + str (Game.time);
		var modules = [MOVE];
		var result = spawn.spawnCreep (spawn, modules, creep_name, __kwargtrans__ ({memory: {['designation']: 'Gefreiter'}}));
		print ('Spawning operation status: ', result);
		print ('for creep: ', modules, creep_name);
		if (result == 0) {
			spawn.room.memory.scoutNeeded = false;
		}
	}
};
var SpawnBuilder = function (spawn) {
	var creep_name = 'Bob_' + str (Game.time);
	if (spawn.room.memory.GamePhase < 3) {
		var modules = create_balanced (prevent_stupid_amount_of_extions_breaking_everything (spawn.room.energyCapacityAvailable));
	}
	else {
		var modules = create_balanced (limit_midgame_creeps (spawn.room.energyCapacityAvailable));
	}
	var Memory = {['designation']: 'Builder'};
	SpawnCreep (spawn, creep_name, modules, Memory);
};
var SpawnTransporter = function (spawn) {
	var creep_name = 'Transporter_' + str (Game.time);
	if (spawn.room.memory.GamePhase < 3) {
		var modules = create_transporter (spawn.room.energyCapacityAvailable);
	}
	else {
		var modules = create_midgame_transporter (spawn.room.energyCapacityAvailable);
	}
	var Memory = {['designation']: 'Transporter'};
	SpawnCreep (spawn, creep_name, modules, Memory);
};
var SpawnMiner = function (spawn) {
	var creep_name = 'Simon_' + str (Game.time);
	if (spawn.room.memory.GamePhase < 3) {
		var modules = create_miner (spawn.room.energyCapacityAvailable);
	}
	else {
		var modules = create_midgame_miner (spawn.room.energyCapacityAvailable);
	}
	var Memory = {['designation']: 'Miner'};
	SpawnCreep (spawn, creep_name, modules, Memory);
};
var SpawnReichsprotektor = function (spawn) {
	var creep_name = 'Konstantin_' + str (Game.time);
	var modules = create_miner (spawn.room.energyCapacityAvailable);
	var Memory = {['designation']: 'Reichsprotektor'};
	SpawnCreep (spawn, creep_name, modules, Memory);
};
var prevent_stupid_amount_of_extions_breaking_everything = function (room_capacity) {
	if (room_capacity >= 700) {
		return 700;
	}
	else {
		return room_capacity;
	}
};
var limit_midgame_creeps = function (room_capacity) {
	if (room_capacity >= 1100) {
		return 1100;
	}
	else {
		return room_capacity;
	}
};
var create_midgame_transporter = function (room_capacity) {
	var modules = [];
	var room_capacity = limit_midgame_creeps (room_capacity);
	var full_sets = int (room_capacity / 150);
	for (var i = 0; i < full_sets; i++) {
		modules.append (CARRY);
		modules.append (CARRY);
		modules.append (MOVE);
	}
	if (room_capacity - full_sets * 150 == 100) {
		modules.append (MOVE);
		modules.append (CARRY);
	}
	modules.py_sort ();
	return modules;
};
var create_transporter = function (room_capacity) {
	var room_capacity = prevent_stupid_amount_of_extions_breaking_everything (room_capacity);
	var modules = [];
	if (room_capacity == 300) {
		var modules = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
	}
	else {
		int (room_capacity / 100);
		for (var i = 0; i < int (room_capacity / 100); i++) {
			modules.append (CARRY);
			modules.append (MOVE);
		}
	}
	modules.py_sort ();
	return modules;
};
var create_midgame_miner = function (room_capacity) {
	var modules = [];
	var room_capacity = room_capacity - 100;
	var full_sets = min (int (room_capacity / 100), 6);
	for (var i = 0; i < full_sets; i++) {
		modules.append (WORK);
	}
	modules.append (CARRY);
	modules.append (MOVE);
	modules.py_sort ();
	return modules;
};
var create_miner = function (room_capacity) {
	var modules = [];
	var room_capacity = prevent_stupid_amount_of_extions_breaking_everything (room_capacity);
	if (room_capacity == 300) {
		var modules = [WORK, WORK, CARRY, MOVE];
	}
	else {
		var full_sets = int (room_capacity / 300);
		for (var i = 0; i < int (room_capacity / 300); i++) {
			modules.append (WORK);
			modules.append (WORK);
			modules.append (CARRY);
			modules.append (MOVE);
		}
		if (room_capacity - full_sets * 300 >= 200) {
			modules.append (WORK);
			modules.append (MOVE);
			modules.append (CARRY);
		}
	}
	modules.py_sort ();
	return modules;
};
var create_balanced = function (room_capacity) {
	var modules = [];
	if (room_capacity == 300) {
		var modules = [WORK, CARRY, CARRY, MOVE, MOVE];
	}
	else {
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
	}
	modules.py_sort ();
	return modules;
};

var __module_SpawnManager__ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SpawnCreep: SpawnCreep,
    SpawnJackOfAllTrades: SpawnJackOfAllTrades,
    SpawnScout: SpawnScout,
    SpawnBuilder: SpawnBuilder,
    SpawnTransporter: SpawnTransporter,
    SpawnMiner: SpawnMiner,
    SpawnReichsprotektor: SpawnReichsprotektor,
    prevent_stupid_amount_of_extions_breaking_everything: prevent_stupid_amount_of_extions_breaking_everything,
    limit_midgame_creeps: limit_midgame_creeps,
    create_midgame_transporter: create_midgame_transporter,
    create_transporter: create_transporter,
    create_midgame_miner: create_midgame_miner,
    create_miner: create_miner,
    create_balanced: create_balanced
});

// Transcrypt'ed from Python, 2023-09-04 13:26:16
var ExpansionManager = function (location, scouts) {
	if (location.memory.expanding == true) {
		if (len (scouts) == 0) {
			location.memory.scoutNeeded = true;
			print (('Initiated expansionmanager for room: ' + str (location)) + '. Requested scout.');
		}
	}
};
var MoveToTargetRoom = function (creep, targetRoom) {
	print ((('Attempting to move creep: ' + str (creep)) + ' to room: ') + str (targetRoom));
	if (creep.memory.route == undefined) {
		print ('Creep tried to move to a different room without having a route');
		var route = Game.map.findRoute (creep.room, targetRoom);
		print (('route = ' + str (route)) + str (len (route)));
		creep.memory.route = route;
		creep.memory.exit = 0;
	}
	else if (len (creep.memory.route) == 1) {
		print ('pathing to thing');
		var target = creep.pos.findClosestByRange (creep.memory.route[0].exit);
		var result = creep.moveTo (target);
		if (result == -(7)) {
			print ('Scout wanted to move to an invalid target: ' + str (creep));
		}
	}
	else if (creep.room == creep.memory.route[creep.memory.exit]) {
		creep.memory.exit = creep.memory.exit + 1;
		print ('Now heading to room ' + route[creep.memory.exit].room);
	}
	else {
		var target = creep.pos.findClosestByRange (route[creep.memory.exit].exit);
		creep.moveTo (target);
	}
};
var scout = function (creep) {
	var targetRoom = 'W6N8';
	if (creep.room.name != targetRoom) {
		MoveToTargetRoom (creep, targetRoom);
	}
	else {
		var target = Game.getObjectById (creep.room.controller.id);
		if (creep.pos.isNearTo (target) == false) {
			creep.moveTo (target);
		}
	}
};
var crusadeToUnclaimedController = function (creep) {
	// pass;
};

var __module_Expansion__ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ExpansionManager: ExpansionManager,
    MoveToTargetRoom: MoveToTargetRoom,
    scout: scout,
    crusadeToUnclaimedController: crusadeToUnclaimedController
});

// Transcrypt'ed from Python, 2023-09-04 13:26:17
var DetermineGamePhase = function (location) {
	var controllers = len (location.controller);
	var extensions = len (location.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
		return s.structureType == STRUCTURE_EXTENSION;
	})));
	var containers = len (location.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
		return s.structureType == STRUCTURE_CONTAINER;
	})));
	if (controllers > 0) {
		if (!(location.controller.my)) {
			location.memory.GamePhase = 0;
			location.memory.building = false;
		}
		else if (location.controller.level < 2) {
			location.memory.GamePhase = 1;
			location.memory.minersPerAccessPoint = 1;
			location.memory.expanding = false;
			location.memory.remoteMining = false;
			location.memory.scoutNeeded = false;
			location.memory.TransportersPerAccesPoint = 2;
			location.memory.transportersNeeded = location.memory.TransportersPerAccesPoint * location.memory.totalAccesPoints;
			location.memory.MaxHarversPerSource = 2;
		}
		else if (extensions < 5 || containers <= 2) {
			location.memory.GamePhase = 2;
			location.memory.minersPerAccessPoint = 1;
			location.memory.expanding = false;
			location.memory.remoteMining = false;
			location.memory.scoutNeeded = false;
			location.memory.TransportersPerAccesPoint = 2;
			location.memory.transportersNeeded = location.memory.TransportersPerAccesPoint * location.memory.totalAccesPoints;
			location.memory.MaxHarversPerSource = 2;
		}
		else if (containers >= len (location.memory.listForSourceData) + 2 && extensions <= 8) {
			location.memory.GamePhase = 3;
			location.memory.MaxHarversPerSource = 1;
		}
		else if (extensions > 8 && extensions <= 41 && containers >= len (location.memory.listForSourceData) + 2) {
			location.memory.GamePhase = 4;
			location.memory.MaxHarversPerSource = 1;
			location.memory.expanding = false;
			location.memory.scoutNeeded = false;
			location.memory.remoteMining = true;
			if (extensions > 16) {
				location.memory.TransportersPerAccesPoint = 1;
			}
			else {
				location.memory.TransportersPerAccesPoint = 1.5;
			}
			location.memory.transportersNeeded = int (location.memory.TransportersPerAccesPoint * location.memory.totalAccesPoints);
		}
		else if (extensions > 42) {
			location.memory.GamePhase = 5;
		}
		else if (containers >= len (location.memory.listForSourceData) + 2) {
			location.memory.GamePhase = 3;
			location.memory.MaxHarversPerSource = 1;
		}
		else {
			location.memory.GamePhase = -(420);
		}
	}
	else {
		location.memory.GamePhase = -(1);
		location.memory.building = false;
	}
	if (location.memory.GamePhase > 0) {
		location.memory.requiredHarvesters = location.memory.minersPerAccessPoint * location.memory.totalAccesPoints;
	}
};
var IsRoomBuilding = function (location) {
	if (len (location.controller) > 0) {
		if (location.controller.my) {
			if (len (location.find (FIND_CONSTRUCTION_SITES)) > 0) {
				location.memory.building = true;
			}
			else {
				location.memory.building = false;
			}
		}
		else {
			location.memory.building = false;
		}
	}
	else {
		location.memory.building = false;
	}
};
var ConstructRoom = function (location) {
	// pass;
};
var RoomEnergyIdentifier = function (location) {
	var sources = location.find (FIND_SOURCES);
	location.memory.sourceNr = len (sources);
	var listForSourceData = [];
	var terrain = location.getTerrain ();
	var totalAccesPoints = 0;
	for (var source of sources) {
		var x = source.pos.x;
		var y = source.pos.y;
		var accessPoints = 0;
		for (var xChange = 0; xChange < 3; xChange++) {
			var newX = (x - xChange) + 1;
			for (var yChange = 0; yChange < 3; yChange++) {
				var newY = (y - yChange) + 1;
				if (terrain.get (newX, newY) == 0 || terrain.get (newX, newY) == 2) {
					var accessPoints = min (accessPoints + 1, location.memory.MaxHarversPerSource);
				}
			}
		}
		var totalAccesPoints = totalAccesPoints + accessPoints;
		listForSourceData.append ([source.id, accessPoints]);
	}
	location.memory.totalAccesPoints = totalAccesPoints;
	location.memory.sourceAccessability = listForSourceData;
};
var IdentifyMinionsNeeded = function (location) {
	if (location.memory.building) {
		if (round (location.memory.totalAccesPoints / 1.5) < 0) {
			location.memory.buildersNeeded = 1;
		}
		else {
			location.memory.buildersNeeded = round (location.memory.requiredHarvesters / 1.5);
		}
	}
	else if (len (location.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
		return s.hits < s.hitsMax * 0.8;
	}))) > 0) {
		location.memory.buildersNeeded = 1;
	}
	else {
		location.memory.buildersNeeded = 0;
	}
	if (location.memory.building) {
		location.memory.upgradersNeeded = 1;
	}
	else {
		location.memory.upgradersNeeded = int (location.memory.requiredHarvesters * 2);
	}
};
var assignSameRoomSource = function (location) {
	for (var i = 0; i < len (location.memory.sourceAccessability); i++) {
		var source = Game.getObjectById (location.memory.sourceAccessability[i][0]);
		var requiredCreeps = min (2, location.memory.sourceAccessability[i][1]) * location.memory.minersPerAccessPoint;
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
var assignSameRoomPickupPoint = function (location) {
	print ('attemping to assign source for location');
	for (var i = 0; i < len (location.memory.sourceAccessability); i++) {
		var source = Game.getObjectById (location.memory.sourceAccessability[i][0]);
		var requiredCreeps = min (location.memory.MaxHarversPerSource, location.memory.sourceAccessability[i][1]) * location.memory.TransportersPerAccesPoint;
		var num_creeps = len (location.find (FIND_CREEPS).filter ((function __lambda__ (c) {
			return c.memory.PickupPoint == source.id && len (c.memory.PickupPoint) > 0;
		})));
		print ('Source: ', (((str (source.id) + ', requiredCreeps: ') + str (requiredCreeps)) + ' num_creeps ') + str (num_creeps));
		for (var creepboi of location.find (FIND_CREEPS)) {
			print (creepboi, creepboi.memory.PickupPoint);
		}
		if (num_creeps < requiredCreeps && requiredCreeps > -(1)) {
			print ('assigned source id: ', str (source.id));
			return source.id;
		}
	}
};
var GetClosestContainer = function (containers, target, acceptableDistance) {
	for (var container of containers) {
		if (container.pos.inRangeTo (target, acceptableDistance)) {
			var result = container.id;
		}
	}
	if (result == null) {
		print ('Error in allocating source for: ' + str (target.name));
	}
	return result;
};
var AllocateContainers = function (location) {
	var containers = location.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
		return s.structureType == STRUCTURE_CONTAINER;
	}));
	if (len (containers) >= 2 + len (location.memory.sourceNr)) {
		var sourceContainers = [];
		for (var i = 0; i < len (location.memory.sourceAccessability); i++) {
			var source = Game.getObjectById (location.memory.sourceAccessability[i][0]);
			sourceContainers.append (GetClosestContainer (containers, source, 2));
		}
		location.memory.sourceContainers = sourceContainers;
		location.memory.controllerContainer = GetClosestContainer (containers, location.controller, 3);
		var spawn = location.find (FIND_MY_SPAWNS);
		if (len (spawn) > 0) {
			var spawn = spawn[0];
		}
		else {
			print ('Error in finding spawn');
		}
		location.memory.spawnContainer = GetClosestContainer (containers, spawn, 1);
	}
};

var __module_Strategy__ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DetermineGamePhase: DetermineGamePhase,
    IsRoomBuilding: IsRoomBuilding,
    ConstructRoom: ConstructRoom,
    RoomEnergyIdentifier: RoomEnergyIdentifier,
    IdentifyMinionsNeeded: IdentifyMinionsNeeded,
    assignSameRoomSource: assignSameRoomSource,
    assignSameRoomPickupPoint: assignSameRoomPickupPoint,
    GetClosestContainer: GetClosestContainer,
    AllocateContainers: AllocateContainers
});

// Transcrypt'ed from Python, 2023-09-04 13:26:17
var Strategy$1 = {};
__nest__ (Strategy$1, '', __module_Strategy__);
var CollectEnergyIfneeded = function (creep) {
	if (creep.memory.filling && _.sum (creep.carry) >= creep.carryCapacity) {
		creep.memory.filling = false;
	}
	else if (!(creep.memory.filling) && creep.carry.energy <= 0) {
		creep.memory.filling = true;
		delete creep.memory.target;
		delete creep.memory.job;
	}
};
var Mine = function (creep) {
	if (creep.memory.source) {
		var source = Game.getObjectById (creep.memory.source);
	}
	else {
		creep.memory.source = Strategy$1.assignSameRoomSource (creep.room);
	}
	if (creep.pos.isNearTo (source)) {
		var result = creep.harvest (source);
		if (result != OK && result != -(6)) {
			print ('[{}] Unknown result from creep.harvest({}): {}'.format (creep.name, source, result));
		}
	}
	else {
		creep.moveTo (source);
	}
};
var FindRefillTarget = function (creep) {
	var towers = creep.room.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
		return s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity;
	}));
	var structs = creep.room.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
		return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.energy < s.energyCapacity;
	}));
	if (len (towers) > 0) {
		var structs = towers;
	}
	if (len (structs) > 0) {
		try {
			var a = creep.pos.findClosestByPath (structs).id;
			creep.memory.target = a;
			var target = Game.getObjectById (a);
			creep.memory.job = 'Replenish';
			return true;
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				print ('No path to target for creep: ', creep.name);
				return false;
			}
			else {
				throw __except0__;
			}
		}
	}
	else {
		return false;
	}
};
var FindBuildTarget = function (creep) {
	var structs = creep.room.find (FIND_CONSTRUCTION_SITES);
	if (structs != null && creep.pos.findClosestByPath (structs) != null) {
		var a = creep.pos.findClosestByPath (structs).id;
		creep.memory.target = a;
		Game.getObjectById (a);
		creep.memory.job = 'Build';
		return true;
	}
	else {
		print ('No path to target for creep: ', creep.name);
		return false;
	}
};
var FindUpgradeTarget = function (creep) {
	creep.memory.target = creep.room.controller.id;
	var target = Game.getObjectById (creep.room.controller.id);
	creep.memory.job = 'Upgrade';
	Upgrade (creep, target);
};
var setTarget_JackOfAllTrades = function (creep) {
	if (len (creep.memory.target) > 0) {
		Game.getObjectById (creep.memory.target);
	}
	else if (FindRefillTarget (creep)) ;
	else if (FindBuildTarget (creep)) ;
	else {
		FindUpgradeTarget (creep);
	}
};
var CreepMove = function (creep, target) {
	var result = creep.moveTo (target);
	if (result == -(7)) {
		print (('Creep - ' + str (creep.name)) + ' attempted to path to an invalid target. Removing memory.');
		print ((((('Creep - ' + str (creep.name)) + ' target was: ') + str (creep.memory.target)) + ' and role ') + str (creep.memory.job));
		delete creep.memory.target;
	}
};
var Replenish = function (creep, target) {
	var amountToBeDeposited = _.sum (creep.carry);
	var roomAvailable = target.store.getFreeCapacity;
	var amountToBeDeposited = min (amountToBeDeposited, roomAvailable);
	var result = creep.transfer (target, RESOURCE_ENERGY, amountToBeDeposited);
	if (result == -(7) || result == -(10)) {
		print ('[{}] Unknown result from creep.transfer({}, {}): {}'.format (creep.name, target, RESOURCE_ENERGY, result));
		delete creep.memory.target;
	}
	else {
		delete creep.memory.target;
	}
};
var Build = function (creep, target) {
	var result = creep.build (target);
	if (result == -(7)) {
		print (('Builder ' + str (creep)) + ' tried to build an invalid target');
		delete creep.memory.target;
	}
};
var Repair = function (creep, target) {
	var result = creep.repair (target);
	if (result == -(7)) {
		print (('Builder ' + str (creep)) + ' tried to repair an invalid target');
		delete creep.memory.target;
	}
	else if (target.hits > target.hitsMax * 0.99) {
		delete creep.memory.target;
	}
};
var Upgrade = function (creep, target) {
	var result = creep.upgradeController (target);
	if (result != OK) {
		print ('[{}] Unknown result from creep.upgradeController({}): {}'.format (creep.name, target, result));
	}
	if (!(creep.pos.inRangeTo (target, 2))) {
		creep.moveTo (target);
	}
};
var JackOfAllTrades = function (creep) {
	CollectEnergyIfneeded (creep);
	if (creep.memory.filling) {
		Mine (creep);
	}
	else if (len (creep.memory.target) > 0) {
		var target = Game.getObjectById (creep.memory.target);
		if (target == null) {
			delete creep.memory.target;
		}
		else {
			if (creep.memory.job == 'Upgrade' || creep.memory.job == 'Build') {
				var is_close = creep.pos.inRangeTo (target, 3);
			}
			else {
				var is_close = creep.pos.isNearTo (target);
			}
			if (is_close) {
				if (creep.memory.job == 'Replenish') {
					Replenish (creep, target);
				}
				else if (creep.memory.job == 'Build') {
					Build (creep, target);
				}
				else {
					Upgrade (creep, target);
				}
			}
			else {
				CreepMove (creep, target);
			}
		}
	}
	else {
		setTarget_JackOfAllTrades (creep);
	}
};
var collectFromLogisticsBoi = function (creep) {
	if (creep.room.memory.building && creep.memory.designation != 'Reichsprotektor') {
		if (len (creep.memory.spawn) > 0) {
			var dropoffPoint = Game.getObjectById (creep.memory.spawn);
		}
		else {
			for (var name of Object.keys (Game.spawns)) {
				var spawn = Game.spawns[name];
				if (spawn.room.name == creep.room.name) {
					creep.memory.spawn = spawn.id;
					var dropoffPoint = spawn;
				}
			}
		}
		var appropriateDistance = 2;
	}
	else {
		var dropoffPoint = creep.room.controller;
		var appropriateDistance = 4;
	}
	if (creep.pos.inRangeTo (dropoffPoint, appropriateDistance)) {
		creep.memory.AwaitingRefill = true;
		creep.room.memory.builderAwaitingRefill = true;
	}
	else {
		CreepMove (creep, dropoffPoint);
	}
};
var FindRepairTarget = function (creep) {
	var structs = creep.room.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
		return s.hits < s.hitsMax * 0.8;
	}));
	if (len (structs) > 0) {
		try {
			var a = creep.pos.findClosestByPath (structs).id;
			creep.memory.target = a;
			creep.memory.job = 'Repair';
			return true;
		}
		catch (__except0__) {
			if (isinstance (__except0__, Exception)) {
				print ('No path to target for creep: ', creep.name);
				return false;
			}
			else {
				throw __except0__;
			}
		}
	}
};
var setTarget_Builder = function (creep) {
	if (len (creep.memory.target) > 0) {
		Game.getObjectById (creep.memory.target);
	}
	else if (FindBuildTarget (creep)) ;
	else if (FindRepairTarget (creep)) ;
	else {
		FindUpgradeTarget (creep);
	}
};
var Run_Builder = function (creep) {
	CollectEnergyIfneeded (creep);
	if (creep.memory.filling) {
		collectFromLogisticsBoi (creep);
	}
	else if (len (creep.memory.target) > 0) {
		var target = Game.getObjectById (creep.memory.target);
		if (target === null) {
			delete creep.memory.target;
		}
		if (creep.memory.AwaitingRefill) {
			creep.memory.AwaitingRefill = false;
		}
		if (creep.pos.inRangeTo (target, 3)) {
			if (creep.memory.job == 'Build') {
				Build (creep, target);
			}
			else if (creep.memory.job == 'Repair') {
				Repair (creep, target);
			}
			else {
				Upgrade (creep, target);
			}
		}
		else {
			CreepMove (creep, target);
		}
	}
	else {
		setTarget_Builder (creep);
	}
};
var Run_Builder_midgame = function (creep) {
	CollectEnergyIfneeded (creep);
	if (creep.memory.filling) {
		if (creep.memory.WithdrawTarget == null) {
			creep.memory.WithdrawTarget = creep.room.memory.controllerContainer;
			collectFromSourceContainer (creep);
		}
		else {
			collectFromSourceContainer (creep);
		}
	}
	else if (len (creep.memory.target) > 0) {
		var target = Game.getObjectById (creep.memory.target);
		if (target === null) {
			delete creep.memory.target;
		}
		if (creep.memory.AwaitingRefill) {
			creep.memory.AwaitingRefill = false;
		}
		if (creep.pos.inRangeTo (target, 3)) {
			if (creep.memory.job == 'Build') {
				Build (creep, target);
			}
			else if (creep.memory.job == 'Repair') {
				Repair (creep, target);
			}
			else {
				Upgrade (creep, target);
			}
		}
		else {
			CreepMove (creep, target);
		}
	}
	else {
		setTarget_Builder (creep);
	}
};
var CollectFromMiner = function (creep) {
	if (len (creep.memory.PickupPoint) > 0) {
		var PickupPoint = Game.getObjectById (creep.memory.PickupPoint);
	}
	else {
		creep.memory.PickupPoint = Strategy$1.assignSameRoomPickupPoint (creep.room);
		creep.memory.WaitForMiner = false;
	}
	if (creep.memory.WaitForMiner == true) {
		if (len (creep.memory.Miners) < 1) {
			creep.memory.WaitForMiner = false;
		}
		for (var miner of creep.memory.Miners) {
			if (Game.creeps[miner] == null || len (creep.memory.Miners) < 1) {
				creep.memory.WaitForMiner = false;
			}
			else if (_.sum (Game.creeps[miner].carry) >= Game.creeps[miner].carryCapacity) {
				creep.memory.target = Game.creeps[miner].id;
				creep.memory.WaitForMiner = false;
				Game.creeps[miner].memory.target = creep.id;
				break;
			}
		}
	}
	else if (PickupPoint == null) ;
	else if (creep.pos.inRangeTo (PickupPoint, 2)) {
		creep.memory.WaitForMiner = true;
		creep.memory.Miners = [];
		var SameSourceMiners = creep.room.find (FIND_CREEPS).filter ((function __lambda__ (c) {
			return c.memory.source == PickupPoint.id && len (c.memory.source) > 0;
		}));
		for (var miner of SameSourceMiners) {
			creep.memory.Miners.append (miner.name);
		}
	}
	else {
		creep.moveTo (PickupPoint);
		creep.memory.WaitForMiner = false;
	}
	if (len (creep.memory.target) > 0) {
		var target = Game.getObjectById (creep.memory.target);
		if (target == null) {
			delete creep.memory.target;
		}
		else if (creep.pos.isNearTo (target) == false) {
			CreepMove (creep, target);
		}
		else if (_.sum (target.carry) < target.carryCapacity) {
			creep.memory.WaitForMiner = false;
			delete creep.memory.target;
		}
		else {
			target.memory.target = creep.id;
			creep.memory.WaitForMiner = true;
		}
	}
};
var TransferEnergyToWaitingTarget = function (creep) {
	var target = Game.getObjectById (creep.memory.target);
	if (target.memory.AwaitingRefill == false) {
		delete creep.memory.target;
	}
	else if (!(creep.pos.isNearTo (target))) {
		CreepMove (creep, target);
	}
	else {
		var result = creep.transfer (target, RESOURCE_ENERGY, _.sum (creep.carry));
		if (result == 0) {
			if (target.designation == 'Builder') {
				if (len (creep.room.find (FIND_CREEPS).filter ((function __lambda__ (c) {
					return c.memory.AwaitingRefill == true;
				}))) == 0) {
					creep.room.memory.builderAwaitingRefill = false;
				}
			}
			delete creep.memory.target;
			target.memory.AwaitingRefill == false;
		}
		else if (result == -(8)) {
			var result = creep.transfer (target, RESOURCE_ENERGY, target.carryCapacity - _.sum (target.carry));
			if (target.designation == 'Builder') {
				if (len (creep.room.find (FIND_CREEPS).filter ((function __lambda__ (c) {
					return c.memory.AwaitingRefill == true;
				}))) == 0) {
					creep.room.memory.builderAwaitingRefill = false;
				}
			}
			delete creep.memory.target;
			target.memory.AwaitingRefill == false;
		}
	}
};
var DistributeEnergy = function (creep) {
	if (creep.room.memory.building) {
		if (len (creep.memory.spawn) > 0) {
			var dropoffPoint = Game.getObjectById (creep.memory.spawn);
		}
		else {
			for (var name of Object.keys (Game.spawns)) {
				var spawn = Game.spawns[name];
				if (spawn.room.name == creep.room.name) {
					creep.memory.spawn = spawn.id;
					var dropoffPoint = spawn;
				}
			}
		}
		var appropriateDistance = 2;
	}
	else {
		var dropoffPoint = creep.room.controller;
		var appropriateDistance = 4;
	}
	if (len (creep.memory.target) > 0) {
		if (Game.getObjectById (creep.memory.target) == null) {
			delete creep.memory.target;
		}
		else {
			TransferEnergyToWaitingTarget (creep);
		}
	}
	else if (!(creep.pos.inRangeTo (dropoffPoint, appropriateDistance))) {
		creep.moveTo (dropoffPoint);
	}
	else if (creep.room.memory.builderAwaitingRefill == true) {
		var target = creep.room.find (FIND_CREEPS).filter ((function __lambda__ (c) {
			return c.memory.AwaitingRefill == true;
		}));
		if (len (target) < 1) {
			creep.room.memory.builderAwaitingRefill = false;
		}
		else {
			var target = creep.pos.findClosestByPath (target);
			creep.memory.target = target.id;
			TransferEnergyToWaitingTarget (creep);
		}
	}
	else {
		delete creep.memory.job;
	}
};
var GiveEnergyToReichsprotector = function (creep) {
	// pass;
};
var SetHaulerJob = function (creep) {
	if (FindRefillTarget (creep)) {
		creep.memory.job = 'Replenish';
	}
	else {
		creep.memory.job = 'Transfer';
	}
};
var Run_Hauler = function (creep) {
	CollectEnergyIfneeded (creep);
	if (creep.memory.filling) {
		CollectFromMiner (creep);
	}
	else if (len (creep.memory.job) > 0) {
		if (creep.memory.job == 'Replenish') {
			if (len (creep.memory.target) > 0) {
				var target = Game.getObjectById (creep.memory.target);
				if (creep.pos.isNearTo (target)) {
					Replenish (creep, target);
				}
				else {
					CreepMove (creep, target);
				}
			}
			else if (FindRefillTarget (creep)) ;
			else {
				delete creep.memory.job;
			}
		}
		else if (creep.memory.job == 'Transfer') {
			DistributeEnergy (creep);
		}
	}
	else {
		SetHaulerJob (creep);
		creep.memory.WaitForMiner = false;
	}
};
var WithdrawFromContainer = function (creep, target) {
	var amountToBeWithdrawn = creep.carryCapacity - _.sum (creep.carry);
	var energyAvailable = target.store.getUsedCapacity (RESOURCE_ENERGY);
	var amountToBeWithdrawn = min (amountToBeWithdrawn, energyAvailable);
	if (amountToBeWithdrawn == 0) {
		delete creep.memory.WithdrawTarget;
	}
	else {
		var result = creep.withdraw (target, RESOURCE_ENERGY, amountToBeWithdrawn);
		if (result == 0) {
			delete creep.memory.WithdrawTarget;
		}
		else if (result < -(5)) {
			print (((((creep.name + ' Failed to withdrawn energy from ') + str (target.id)) + str (result)) + ' , contained this much energy: ') + str (energyAvailable));
			delete creep.memory.WithdrawTarget;
		}
	}
};
var collectFromSourceContainer = function (creep) {
	if (creep.memory.WithdrawTarget == null) {
		for (var i of creep.room.memory.sourceContainers) {
			var container = Game.getObjectById (i);
			if (container == null) ;
			else if (container.store.getUsedCapacity (RESOURCE_ENERGY) >= creep.carryCapacity) {
				creep.memory.WithdrawTarget = container.id;
				break;
			}
		}
	}
	var target = Game.getObjectById (creep.memory.WithdrawTarget);
	if (target == null) {
		delete creep.memory.WithdrawTarget;
	}
	else if (!(creep.pos.isNearTo (target))) {
		CreepMove (creep, target);
		if (creep.pos.isNearTo (target)) {
			WithdrawFromContainer (creep, target);
		}
	}
	else {
		WithdrawFromContainer (creep, target);
	}
};
var PickDropoffContainer = function (creep) {
	if (creep.memory.target == null) {
		var container = Game.getObjectById (creep.room.memory.spawnContainer);
		if (container.store.getFreeCapacity (RESOURCE_ENERGY) <= 0) {
			var container = Game.getObjectById (creep.room.memory.controllerContainer);
			if (container.store.getFreeCapacity (RESOURCE_ENERGY) <= 0) ;
			else {
				creep.memory.target = container.id;
				if (!(creep.pos.isNearTo (container))) {
					CreepMove (creep, container);
				}
				else {
					Replenish (creep, target);
				}
			}
		}
		else {
			creep.memory.target = container.id;
			if (!(creep.pos.isNearTo (container))) {
				CreepMove (creep, container);
			}
			else {
				Replenish (creep, target);
			}
		}
	}
};
var DepositIntoContainer = function (creep, target) {
	if (creep.pos.isNearTo (target)) {
		Replenish (creep, target);
	}
	else {
		CreepMove (creep, target);
		if (creep.pos.isNearTo (target)) {
			Replenish (creep, target);
		}
	}
};
var SetHaulerJobMidgame = function (creep) {
	if (FindRefillTarget (creep)) {
		creep.memory.job = 'Replenish';
	}
	else {
		creep.memory.job = 'ContainerRefill';
	}
};
var Run_Hauler_midgame = function (creep) {
	CollectEnergyIfneeded (creep);
	if (creep.memory.filling) {
		collectFromSourceContainer (creep);
	}
	else if (len (creep.memory.job) > 0) {
		if (creep.memory.job == 'Replenish') {
			if (len (creep.memory.target) > 0) {
				var target = Game.getObjectById (creep.memory.target);
				if (creep.pos.isNearTo (target)) {
					Replenish (creep, target);
				}
				else {
					CreepMove (creep, target);
				}
			}
			else if (FindRefillTarget (creep)) ;
			else {
				delete creep.memory.job;
			}
		}
		else if (creep.memory.job == 'ContainerRefill') {
			if (len (creep.memory.target) > 0) {
				var target = Game.getObjectById (creep.memory.target);
				DepositIntoContainer (creep, target);
			}
			else if (PickDropoffContainer (creep)) ;
			else {
				delete creep.memory.job;
			}
		}
		else {
			delete creep.memory.job;
		}
	}
	else {
		SetHaulerJobMidgame (creep);
	}
};
var transferEnergyToHauler = function (creep, target) {
	if (target == null) {
		print (str (creep.name) + ' attempted to transfer energy to a nonexisting creep.');
		delete creep.memory.target;
	}
	else if (creep.pos.isNearTo (target)) {
		var result = creep.transfer (target, RESOURCE_ENERGY, _.sum (creep.carry));
		if (result == -(8)) {
			var result = creep.transfer (target, RESOURCE_ENERGY, target.carryCapacity - _.sum (target.carry));
			creep.memory.filling = true;
			Mine (creep);
			if (result != 0) {
				print ((((str (creep.name) + ' attempted to transfer energy to ') + str (target)) + str (result)) + str (target.carryCapacity - _.sum (target.carry)));
			}
			else {
				delete target.memory.target;
				delete creep.memory.target;
				target.memory.WaitForMiner = false;
				creep.memory.filling = true;
				Mine (creep);
			}
		}
		else if (result != 0) {
			print ((((str (creep.name) + ' attempted to transfer energy to ') + str (target)) + str (result)) + str (_.sum (creep.carry)));
		}
		else {
			delete target.memory.target;
			delete creep.memory.target;
			target.memory.WaitForMiner = false;
			Mine (creep);
		}
	}
};
var MinerIdentifyContainer = function (creep) {
	if (creep.pos.isNearTo (Game.getObjectById (creep.memory.source))) {
		var containers = creep.room.find (FIND_STRUCTURES).filter ((function __lambda__ (s) {
			return s.structureType == STRUCTURE_CONTAINER;
		}));
		creep.memory.target = creep.pos.findClosestByPath (containers).id;
		if (creep.memory.target == null) {
			print ('No containers could be found for this creep: ' + str (creep.name));
		}
	}
	else {
		CreepMove (creep, Game.getObjectById (creep.memory.source));
	}
};
var MinerTransferToContainer = function (creep) {
	if (creep.memory.target == null) {
		MinerIdentifyContainer (creep);
	}
	else {
		var target = Game.getObjectById (creep.memory.target);
		Replenish (creep, target);
	}
};
var run_miner_midgame = function (creep) {
	if (_.sum (creep.carry) != creep.carryCapacity) {
		Mine (creep);
	}
	if (_.sum (creep.carry) > 0) {
		MinerTransferToContainer (creep);
	}
};
var Run_miner = function (creep) {
	if (_.sum (creep.carry) >= creep.carryCapacity) {
		creep.memory.filling = false;
	}
	else {
		creep.memory.filling = true;
	}
	if (creep.memory.filling) {
		Mine (creep);
	}
	else if (len (creep.memory.target) > 0) {
		var target = Game.getObjectById (creep.memory.target);
		transferEnergyToHauler (creep, target);
	}
	else ;
};
var Run_Reichsprotektor = function (creep) {
	if (_.sum (creep.carry) >= 1) {
		creep.memory.filling = false;
	}
	else {
		creep.memory.filling = true;
	}
	if (creep.memory.filling) {
		collectFromLogisticsBoi (creep);
	}
	else if (len (creep.memory.target) > 0) {
		var target = Game.getObjectById (creep.memory.target);
		if (creep.memory.AwaitingRefill) {
			creep.memory.AwaitingRefill = false;
		}
		if (creep.pos.inRangeTo (target, 3)) {
			Upgrade (creep, target);
		}
		else {
			CreepMove (creep, target);
		}
	}
	else {
		creep.memory.target = creep.room.controller.id;
	}
};
var Run_Reichsprotektor_midgame = function (creep) {
	if (_.sum (creep.carry) >= 1) {
		creep.memory.filling = false;
	}
	else {
		creep.memory.filling = true;
	}
	if (creep.memory.filling) {
		if (creep.memory.WithdrawTarget == null) {
			creep.memory.WithdrawTarget = creep.room.memory.controllerContainer;
			collectFromSourceContainer (creep);
		}
		else {
			collectFromSourceContainer (creep);
		}
	}
	else if (len (creep.memory.target) > 0) {
		var target = Game.getObjectById (creep.memory.target);
		if (creep.memory.AwaitingRefill) {
			creep.memory.AwaitingRefill = false;
		}
		if (creep.pos.inRangeTo (target, 3)) {
			Upgrade (creep, target);
		}
		else {
			CreepMove (creep, target);
		}
	}
	else {
		creep.memory.target = creep.room.controller.id;
	}
};

var __module_harvester__ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CollectEnergyIfneeded: CollectEnergyIfneeded,
    Mine: Mine,
    FindRefillTarget: FindRefillTarget,
    FindBuildTarget: FindBuildTarget,
    FindUpgradeTarget: FindUpgradeTarget,
    setTarget_JackOfAllTrades: setTarget_JackOfAllTrades,
    CreepMove: CreepMove,
    Replenish: Replenish,
    Build: Build,
    Repair: Repair,
    Upgrade: Upgrade,
    JackOfAllTrades: JackOfAllTrades,
    collectFromLogisticsBoi: collectFromLogisticsBoi,
    FindRepairTarget: FindRepairTarget,
    setTarget_Builder: setTarget_Builder,
    Run_Builder: Run_Builder,
    Run_Builder_midgame: Run_Builder_midgame,
    CollectFromMiner: CollectFromMiner,
    TransferEnergyToWaitingTarget: TransferEnergyToWaitingTarget,
    DistributeEnergy: DistributeEnergy,
    GiveEnergyToReichsprotector: GiveEnergyToReichsprotector,
    SetHaulerJob: SetHaulerJob,
    Run_Hauler: Run_Hauler,
    WithdrawFromContainer: WithdrawFromContainer,
    collectFromSourceContainer: collectFromSourceContainer,
    PickDropoffContainer: PickDropoffContainer,
    DepositIntoContainer: DepositIntoContainer,
    SetHaulerJobMidgame: SetHaulerJobMidgame,
    Run_Hauler_midgame: Run_Hauler_midgame,
    transferEnergyToHauler: transferEnergyToHauler,
    MinerIdentifyContainer: MinerIdentifyContainer,
    MinerTransferToContainer: MinerTransferToContainer,
    run_miner_midgame: run_miner_midgame,
    Run_miner: Run_miner,
    Run_Reichsprotektor: Run_Reichsprotektor,
    Run_Reichsprotektor_midgame: Run_Reichsprotektor_midgame
});

// Transcrypt'ed from Python, 2023-09-04 13:26:16
var Expansion = {};
var SpawnManager = {};
var Strategy = {};
var combat = {};
var harvester = {};
__nest__ (combat, '', __module_combat__);
__nest__ (SpawnManager, '', __module_SpawnManager__);
__nest__ (Expansion, '', __module_Expansion__);
__nest__ (Strategy, '', __module_Strategy__);
__nest__ (harvester, '', __module_harvester__);
var main = function () {
	var Schutzstaffel = {['JackOfAllTrades']: [], ['Builder']: [], ['Miner']: [], ['Transporter']: [], ['Reichsprotektor']: [], ['Gefreiter']: [], ['Templar']: []};
	for (var name of Object.keys (Game.creeps)) {
		var creep = Game.creeps[name];
		Schutzstaffel[creep.memory.designation].append (creep);
	}

  for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
	var totalReichsprotektors = len (Schutzstaffel['Reichsprotektor']);
	var totalTransporters = len (Schutzstaffel['Transporter']);
	var totalBuilders = len (Schutzstaffel['Builder']);
	var totalJacks = len (Schutzstaffel['JackOfAllTrades']);
	var totalMiners = len (Schutzstaffel['Miner']);
	var totalGefreiters = len (Schutzstaffel['Gefreiter']);
	for (var location of Object.keys (Game.rooms)) {
		Strategy.IsRoomBuilding (Game.rooms[location]);
		combat.IdentifyThreats (Game.rooms[location]);
		Strategy.DetermineGamePhase (Game.rooms[location]);
		Strategy.ConstructRoom (Game.rooms[location]);
		Strategy.RoomEnergyIdentifier (Game.rooms[location]);
		Expansion.ExpansionManager (Game.rooms[location], Schutzstaffel['Gefreiter']);
		Strategy.AllocateContainers (Game.rooms[location]);
	}
	try {
		if (totalJacks > 0) {
			for (var creep of Schutzstaffel['JackOfAllTrades']) {
				harvester.JackOfAllTrades (creep);
			}
		}
		if (totalBuilders > 0) {
			for (var creep of Schutzstaffel['Builder']) {
				if (creep.room.memory.GamePhase > 2) {
					harvester.Run_Builder_midgame (creep);
				}
				else {
					harvester.Run_Builder (creep);
				}
			}
		}
		if (totalMiners > 0 && totalTransporters > 0) {
			for (var creep of Schutzstaffel['Miner']) {
				if (creep.room.memory.GamePhase > 2) {
					harvester.run_miner_midgame (creep);
				}
				else {
					harvester.Run_miner (creep);
				}
			}
		}
		else if (totalMiners > 0) {
			for (var creep of Schutzstaffel['Miner']) {
				harvester.JackOfAllTrades (creep);
			}
		}
		if (totalTransporters > 0) {
			for (var creep of Schutzstaffel['Transporter']) {
				if (creep.room.memory.GamePhase > 2) {
					harvester.Run_Hauler_midgame (creep);
				}
				else {
					harvester.Run_Hauler (creep);
				}
			}
		}
		if (totalGefreiters > 0) {
			for (var creep of Schutzstaffel['Gefreiter']) {
				Expansion.scout (creep);
			}
		}
		if (totalReichsprotektors > 0) {
			for (var creep of Schutzstaffel['Reichsprotektor']) {
				if (creep.room.memory.GamePhase > 2) {
					harvester.Run_Reichsprotektor_midgame (creep);
				}
				else {
					harvester.Run_Reichsprotektor (creep);
				}
			}
		}
	}
	catch (__except0__) {
		if (isinstance (__except0__, Exception)) {
			var e = __except0__;
			print ('Error while running harvesters: ' + str (e));
		}
		else {
			throw __except0__;
		}
	}
	try {
		for (var name of Object.keys (Game.spawns)) {
			var spawn = Game.spawns[name];
			if (!(spawn.spawning)) {
				if (totalJacks + totalMiners == 0) {
					var creep_name = 'Emergency_' + str (Game.time);
					var modules = [WORK, WORK, CARRY, MOVE];
					print ('Emergency spawn triggered!! ', spawn.spawnCreep (modules, creep_name, __kwargtrans__ ({memory: {['designation']: 'JackOfAllTrades'}})));
					print ('for creep: ', modules, creep_name);
				}
				if (spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
					Strategy.IdentifyMinionsNeeded (spawn.room);
					if (totalMiners == 0) {
						SpawnManager.SpawnMiner (spawn);
					}
					else if (totalTransporters == 0) {
						SpawnManager.SpawnTransporter (spawn);
					}
					else if (totalMiners < spawn.room.memory.requiredHarvesters) {
						if (totalTransporters < totalMiners * 0.5 && totalTransporters < spawn.room.memory.transportersNeeded) {
							SpawnManager.SpawnTransporter (spawn);
						}
						else {
							SpawnManager.SpawnMiner (spawn);
						}
					}
					else if (totalTransporters < spawn.room.memory.transportersNeeded) {
						SpawnManager.SpawnTransporter (spawn);
					}
					else if (totalBuilders < spawn.room.memory.buildersNeeded) {
						SpawnManager.SpawnBuilder (spawn);
					}
					else if (totalReichsprotektors < spawn.room.memory.upgradersNeeded) {
						SpawnManager.SpawnReichsprotektor (spawn);
					}
				}
				if (spawn.room.memory.scoutNeeded == true) {
					SpawnManager.SpawnScout (spawn);
				}
			}
		}
	}
	catch (__except0__) {
		if (isinstance (__except0__, Exception)) {
			var e = __except0__;
			print ('Error while handling spawns: ' + str (e));
		}
		else {
			throw __except0__;
		}
	}
};
module.exports.loop = main;

exports.main = main;
