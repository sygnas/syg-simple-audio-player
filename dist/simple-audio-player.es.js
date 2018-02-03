function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

var assign = _core.Object.assign;

var assign$2 = createCommonjsModule(function (module) {
module.exports = { "default": assign, __esModule: true };
});

var _Object$assign = unwrapExports(assign$2);

var classCallCheck = createCommonjsModule(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$2 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty, __esModule: true };
});

unwrapExports(defineProperty$2);

var createClass = createCommonjsModule(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

function unwrapExports$1 (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global$2 = createCommonjsModule$1(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core$2 = createCommonjsModule$1(function (module) {
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _core_1$1 = _core$2.version;

var _aFunction$2 = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx$2 = function (fn, that, length) {
  _aFunction$2(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject$2 = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject$2 = function (it) {
  if (!_isObject$2(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails$2 = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors$2 = !_fails$2(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$2 = _global$2.document;
// typeof document.createElement is 'object' in old IE
var is$1 = _isObject$2(document$2) && _isObject$2(document$2.createElement);
var _domCreate$2 = function (it) {
  return is$1 ? document$2.createElement(it) : {};
};

var _ie8DomDefine$2 = !_descriptors$2 && !_fails$2(function () {
  return Object.defineProperty(_domCreate$2('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive$2 = function (it, S) {
  if (!_isObject$2(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject$2(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$1 = Object.defineProperty;

var f$3 = _descriptors$2 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject$2(O);
  P = _toPrimitive$2(P, true);
  _anObject$2(Attributes);
  if (_ie8DomDefine$2) try {
    return dP$1(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp$2 = {
	f: f$3
};

var _propertyDesc$2 = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide$2 = _descriptors$2 ? function (object, key, value) {
  return _objectDp$2.f(object, key, _propertyDesc$2(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE$1 = 'prototype';

var $export$2 = function (type, name, source) {
  var IS_FORCED = type & $export$2.F;
  var IS_GLOBAL = type & $export$2.G;
  var IS_STATIC = type & $export$2.S;
  var IS_PROTO = type & $export$2.P;
  var IS_BIND = type & $export$2.B;
  var IS_WRAP = type & $export$2.W;
  var exports = IS_GLOBAL ? _core$2 : _core$2[name] || (_core$2[name] = {});
  var expProto = exports[PROTOTYPE$1];
  var target = IS_GLOBAL ? _global$2 : IS_STATIC ? _global$2[name] : (_global$2[name] || {})[PROTOTYPE$1];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx$2(out, _global$2)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE$1] = C[PROTOTYPE$1];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx$2(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export$2.R && expProto && !expProto[key]) _hide$2(expProto, key, out);
    }
  }
};
// type bitmap
$export$2.F = 1;   // forced
$export$2.G = 2;   // global
$export$2.S = 4;   // static
$export$2.P = 8;   // proto
$export$2.B = 16;  // bind
$export$2.W = 32;  // wrap
$export$2.U = 64;  // safe
$export$2.R = 128; // real proto method for `library`
var _export$2 = $export$2;

var hasOwnProperty$1 = {}.hasOwnProperty;
var _has$2 = function (it, key) {
  return hasOwnProperty$1.call(it, key);
};

var toString$1 = {}.toString;

var _cof$2 = function (it) {
  return toString$1.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject$2 = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof$2(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined$2 = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject$2 = function (it) {
  return _iobject$2(_defined$2(it));
};

// 7.1.4 ToInteger
var ceil$1 = Math.ceil;
var floor$1 = Math.floor;
var _toInteger$2 = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor$1 : ceil$1)(it);
};

// 7.1.15 ToLength

var min$2 = Math.min;
var _toLength$2 = function (it) {
  return it > 0 ? min$2(_toInteger$2(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max$1 = Math.max;
var min$1$1 = Math.min;
var _toAbsoluteIndex$2 = function (index, length) {
  index = _toInteger$2(index);
  return index < 0 ? max$1(index + length, 0) : min$1$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes$2 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject$2($this);
    var length = _toLength$2(O.length);
    var index = _toAbsoluteIndex$2(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED$1 = '__core-js_shared__';
var store$1 = _global$2[SHARED$1] || (_global$2[SHARED$1] = {});
var _shared$2 = function (key) {
  return store$1[key] || (store$1[key] = {});
};

var id$1 = 0;
var px$1 = Math.random();
var _uid$2 = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + px$1).toString(36));
};

var shared$1 = _shared$2('keys');

var _sharedKey$2 = function (key) {
  return shared$1[key] || (shared$1[key] = _uid$2(key));
};

var arrayIndexOf$1 = _arrayIncludes$2(false);
var IE_PROTO$1 = _sharedKey$2('IE_PROTO');

var _objectKeysInternal$2 = function (object, names) {
  var O = _toIobject$2(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO$1) _has$2(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has$2(O, key = names[i++])) {
    ~arrayIndexOf$1(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys$2 = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys$2 = Object.keys || function keys(O) {
  return _objectKeysInternal$2(O, _enumBugKeys$2);
};

var f$1$1 = Object.getOwnPropertySymbols;

var _objectGops$2 = {
	f: f$1$1
};

var f$2$1 = {}.propertyIsEnumerable;

var _objectPie$2 = {
	f: f$2$1
};

// 7.1.13 ToObject(argument)

var _toObject$2 = function (it) {
  return Object(_defined$2(it));
};

// 19.1.2.1 Object.assign(target, source, ...)





var $assign$1 = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign$2 = !$assign$1 || _fails$2(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign$1({}, A)[S] != 7 || Object.keys($assign$1({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject$2(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops$2.f;
  var isEnum = _objectPie$2.f;
  while (aLen > index) {
    var S = _iobject$2(arguments[index++]);
    var keys = getSymbols ? _objectKeys$2(S).concat(getSymbols(S)) : _objectKeys$2(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign$1;

// 19.1.3.1 Object.assign(target, source)


_export$2(_export$2.S + _export$2.F, 'Object', { assign: _objectAssign$2 });

var assign$3 = _core$2.Object.assign;

var assign$2$1 = createCommonjsModule$1(function (module) {
module.exports = { "default": assign$3, __esModule: true };
});

var _Object$assign$1 = unwrapExports$1(assign$2$1);

var classCallCheck$1 = createCommonjsModule$1(function (module, exports) {
exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck$1 = unwrapExports$1(classCallCheck$1);

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export$2(_export$2.S + _export$2.F * !_descriptors$2, 'Object', { defineProperty: _objectDp$2.f });

var $Object$1 = _core$2.Object;
var defineProperty$4 = function defineProperty(it, key, desc) {
  return $Object$1.defineProperty(it, key, desc);
};

var defineProperty$2$1 = createCommonjsModule$1(function (module) {
module.exports = { "default": defineProperty$4, __esModule: true };
});

unwrapExports$1(defineProperty$2$1);

var createClass$1 = createCommonjsModule$1(function (module, exports) {
exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty$2$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass$1 = unwrapExports$1(createClass$1);

/**
 * HDSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
function is_can_play_hds(audio) {
  return audio.canPlayType('application/f4m+xml') === 'maybe';
}

/**
 * HLSを再生できるか
 * @param {Audio} audio
 * @return {Boolean} true : OK / false / NG
 */
function is_can_play_hls(audio) {
  return audio.canPlayType('application/vnd.apple.mpegURL') === 'maybe';
}

/** ************
 * MediaSourceExtensionに対応しているか
 * @return {Boolean} true : OK / false / NG
 */
/* eslint no-void:["off"] */

function is_support_mse() {
  var hasWebKit = window.WebKitMediaSource !== null && window.WebKitMediaSource !== void 0;
  var hasMediaSource = window.MediaSource !== null && window.MediaSource !== void 0;
  return hasWebKit || hasMediaSource;
}

/**
 * ユーザー環境をチェックして、HDS / HLS / dash.js のソースを HTML5 Audio にセットする
 * MPEG-DASHを使う場合は dash.js が必要。
 *
 *
 * @author   Hiroshi Fukuda <info.sygnas@gmail.com>
 * @license  MIT
 */

/* globals dashjs */

var _class = function () {
  /**
   * コンストラクタ
   * @param {Object} config インスタンス設定。this.defaults 参照
   */
  function _class(config) {
    _classCallCheck$1(this, _class);

    // オーディオソースのタイプ定数
    this.TYPE_HDS = 'hds';
    this.TYPE_HLS = 'hls';
    this.TYPE_MSE = 'mse';
    this.TYPE_FILE = 'file';

    // デフォルト設定
    var defaults = {
      hds: {
        protcol: 'http://',
        playlist: '/manifest.f4m'
      },
      hls: {
        protcol: 'http://',
        playlist: '/playlist.m3u8'
      },
      mse: {
        protcol: 'http://',
        playlist: '/manifest.mpd',
        autoplay: false
      }
    };
    // 設定反映
    this.opt = _Object$assign$1(defaults, config);

    this.audio = new Audio(); // HTML5 Audio
    this.dash_player = null; // dash.js のインスタンス
    this.is_support_hds = false; // HDSを再生できるか
    this.is_support_hls = false; // HLSを再生できるか
    this.is_support_mse = false; // MedisSourceExtensionに対応しているか
    this.now_type = null; // ソースとして設定されたタイプ。TYPE_HDS ... TYPE_FILE などが入る

    this.$_check_support_result = null; // check_support() の実行結果
  }

  /**
   * サポート環境チェック
   * @return {Boolean} true: チェック完了 / false: 対象外環境
   */


  _createClass$1(_class, [{
    key: 'check_support',
    value: function check_support() {
      // すでに実行していたらその結果を返す
      if (this.$_check_support_result !== null) return this.$_check_support_result;

      try {
        this.is_support_hds = is_can_play_hds(this.audio); // HDSを再生できるか
        this.is_support_hls = is_can_play_hls(this.audio); // HLSを再生できるか
        this.is_support_mse = is_support_mse(this.audio); // MedisSourceExtensionに対応しているか
      } catch (e) {
        this.$_check_support_result = false;
        return false;
      }
      this.$_check_support_result = true;
      return true;
    }

    /**
     * オーディオソースを渡してHTML5 Audioにセットする
     * @param {String} url
     * mp3/ogg など非ストリーミングの場合はファイルのURL。
     * ストリーミングの場合は http://{この部分}//manifest.f4m をベースURLとして渡す
     * @param {String} type
     * タイプを指定したい時は TYPE_HDS などを渡す。
     * 非ストリーミングの場合は TYPE_FILE を必ず渡す。
     */

  }, {
    key: 'set_src',
    value: function set_src(url) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (type === this.TYPE_FILE) {
        return this.$_set_src_file(url);
      } else if (type === this.TYPE_HLS) {
        return this.$_set_src_hls(url);
      } else if (type === this.TYPE_HDS) {
        return this.$_set_src_hds(url);
      } else if (type === this.TYPE_MSE) {
        return this.$_set_src_mse(url);
      } else if (this.is_support_hls) {
        return this.$_set_src_hls(url);
      } else if (this.is_support_hds) {
        return this.$_set_src_hds(url);
      } else if (this.is_support_mse) {
        return this.$_set_src_mse(url);
      }
      return false;
    }

    /**
     * private
     */

    /**
     * 非ストリーミングでセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_file',
    value: function $_set_src_file(url) {
      this.audio.src = url;
      this.now_type = this.TYPE_FILE;
      return true;
    }
    /**
     * HLS形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_hls',
    value: function $_set_src_hls(url) {
      if (!this.is_support_hls) return false;

      this.audio.src = this.opt.hls.protcol + url + this.opt.hls.playlist;
      this.now_type = this.TYPE_HLS;
      return true;
    }
    /**
     * HDS形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_hds',
    value: function $_set_src_hds(url) {
      if (!this.is_support_hds) return false;

      this.audio.src = this.opt.hds.protcol + url + this.opt.hds.playlist;
      this.now_type = this.TYPE_HDS;
      return true;
    }
    /**
     * MSE形式でセットする
     * @param {String} url
     */

  }, {
    key: '$_set_src_mse',
    value: function $_set_src_mse(url) {
      if (!this.is_support_mse) return false;

      // dash.js を使う
      this.now_type = this.TYPE_MSE;
      var src = this.opt.mse.protcol + url + this.opt.mse.playlist;

      if (this.dash_player === null) {
        this.dash_player = dashjs.MediaPlayer().create();
        this.dash_player.initialize(this.audio, src, this.opt.mse.autoplay);
      } else {
        this.dash_player.attachSource(src);
      }
      return true;
    }
  }]);

  return _class;
}();

/**
 * オーディオ再生・停止だけを管理するボタン
 *
 * @author   Hiroshi Fukuda <info.sygnas@gmail.com>
 * @license  MIT
 */

var _class$1 = function () {
  /**
   * コンストラクタ
   * @param {Object} config インスタンス設定。this.defaults 参照
   */
  function _class$$1(target, audio, config) {
    _classCallCheck(this, _class$$1);

    // ターゲットボタンの data-audio-status属性に入れる状態
    this.STATE_PLAY = 'play';
    this.STATE_PAUSE = 'pause';
    this.STATE_STOP = 'stop';

    // デフォルト設定
    var defaults = {
      // オーディオソースを指定する属性
      attr_src: 'data-audio-src',
      // 状態を格納する属性
      attr_status: 'data-audio-status',
      // ソースのタイプを指定する属性 {file / hds / hls / mse}
      attr_type: 'data-audio-type',

      // 以下、syg-audio-src の設定
      hds: {
        protcol: 'http://',
        playlist: '/manifest.f4m'
      },
      hls: {
        protcol: 'http://',
        playlist: '/playlist.m3u8'
      },
      mse: {
        protcol: 'http://',
        playlist: '/manifest.mpd',
        autoplay: false
      }
    };
    // 設定反映
    this.opt = _Object$assign(defaults, config);

    // 再生中か
    this.is_playing = false;
    // 現在再生中のボタンエレメント
    this.now_playing_btn = null;
    // ボタンエレメント
    this.targets = document.querySelectorAll(target);
    // オーディオソース
    this.audio_src = new _class({
      hds: this.opt.hds,
      hls: this.opt.hls,
      mse: this.opt.mse
    });
    // イベント設定
    this.$_init_event();
  }

  /**
   * 停止
   */


  _createClass(_class$$1, [{
    key: 'stop',
    value: function stop() {
      this.$_stop();
    }

    /**
     * private
     */

    /**
     * イベント設定
     */

  }, {
    key: '$_init_event',
    value: function $_init_event() {
      var _this = this;

      // ボタンのイベント
      get_node_array(this.targets).forEach(function (elm) {
        elm.addEventListener('click', _this.$_on_btn_click.bind(_this));
      });
      // 再生終了イベント
      this.audio_src.audio.addEventListener('ended', this.$_stop.bind(this));
    }

    /**
     * ボタンをクリックした
     * @param {Event} ev クリックイベント
     */

  }, {
    key: '$_on_btn_click',
    value: function $_on_btn_click(ev) {
      ev.preventDefault();

      // now_playing_btn とクリックされたボタンが同一なら一時停止
      if (ev.target === this.now_playing_btn) {
        this.$_pause(ev.target);
      } else {
        this.$_play_new(ev.target);
      }
    }

    /**
     * 停止
     */

  }, {
    key: '$_stop',
    value: function $_stop() {
      this.audio_src.audio.pause();
      this.audio_src.audio.currentTime = 0;
      // ステータスを変更
      this.$_change_state(this.STATE_STOP, this.now_playing_btn);
      // 再生中ボタンの変更
      this.now_playing_btn = null;
    }

    /**
     * 一時停止・再開
     * @param {HTMLElement} target クリックしたボタン
     */

  }, {
    key: '$_pause',
    value: function $_pause(target) {
      if (this.is_playing) {
        this.audio_src.audio.pause();
        this.$_change_state(this.STATE_PAUSE, target);
      } else {
        this.audio_src.audio.play();
        this.$_change_state(this.STATE_PLAY, target);
      }
    }

    /**
     * 再生
     * @param {HTMLElement} target クリックしたボタン
     */

  }, {
    key: '$_play_new',
    value: function $_play_new(target) {
      var opt = this.opt;
      var audio_src = this.audio_src;

      // 既に再生していたら止める
      if (this.now_playing_btn) {
        audio_src.audio.pause();
        this.$_change_state(this.STATE_STOP, this.now_playing_btn);
      }

      // オーディオソースURL
      var url = target.getAttribute(opt.attr_src);
      // ソースタイプ
      var type = target.getAttribute(opt.attr_type);

      // ・data-audio-type属性が file だったら非ストリーミング
      // ・上記属性が null で、サポート環境チェックが問題なければ
      //   ストリーミング種別自動判定
      // ・hds / hls / mse を指定したストリーミング
      // ・それ以外はエラー
      if (type === audio_src.TYPE_FILE) {
        audio_src.set_src(url, audio_src.TYPE_FILE);
      } else if (type === null && this.audio_src.check_support()) {
        audio_src.set_src(url);
      } else if (type === audio_src.TYPE_HDS || type === audio_src.TYPE_HLS || type === audio_src.TYPE_MSE) {
        audio_src.set_src(url, type);
      } else {
        var err = new Error();
        err.message = 'not supported type.';
        throw err;
      }

      // ソースをロードして再生
      audio_src.audio.load();
      audio_src.audio.play();

      // 再生中ボタンの変更
      this.now_playing_btn = target;
      // ステータスを変更
      this.$_change_state(this.STATE_PLAY, target);
    }

    /**
     * 任意のエレメントのステータスを変更
     * @param {String} state ステータス。this.STATE_PLAY などが入る
     * @param {HTMLElement} elm 対象となるボタン
     */

  }, {
    key: '$_change_state',
    value: function $_change_state(state, elm) {
      if (state === this.STATE_PLAY) {
        this.is_playing = true;
      } else if (state === this.STATE_PAUSE || state === this.STATE_STOP) {
        this.is_playing = false;
      }

      if (elm) {
        elm.setAttribute(this.opt.attr_status, state);
      }
    }
  }]);

  return _class$$1;
}();

function get_node_array(node_list) {
  return Array.prototype.slice.call(node_list, 0);
}

export default _class$1;
