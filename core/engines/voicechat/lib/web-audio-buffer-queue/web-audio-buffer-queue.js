! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self), t.webAudioBufferQueue = e()
    }
}(function() {
    return function e(t, r, n) {
        function i(s, a) {
            if (!r[s]) {
                if (!t[s]) {
                    var u = "function" == typeof require && require;
                    if (!a && u) return u(s, !0);
                    if (o) return o(s, !0);
                    var f = new Error("Cannot find module '" + s + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var h = r[s] = {
                    exports: {}
                };
                t[s][0].call(h.exports, function(e) {
                    var r = t[s][1][e];
                    return i(r ? r : e)
                }, h, h.exports, e, t, r, n)
            }
            return r[s].exports
        }
        for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) i(n[s]);
        return i
    }({
        1: [function(e, t, r) {}, {}],
        2: [function(e, t, r) {
            (function(t) {
                "use strict";

                function n() {
                    function e() {}
                    try {
                        var t = new Uint8Array(1);
                        return t.foo = function() {
                            return 42
                        }, t.constructor = e, 42 === t.foo() && t.constructor === e && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength
                    } catch (r) {
                        return !1
                    }
                }

                function i() {
                    return o.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                }

                function o(e) {
                    return this instanceof o ? (o.TYPED_ARRAY_SUPPORT || (this.length = 0, this.parent = void 0), "number" == typeof e ? s(this, e) : "string" == typeof e ? a(this, e, arguments.length > 1 ? arguments[1] : "utf8") : u(this, e)) : arguments.length > 1 ? new o(e, arguments[1]) : new o(e)
                }

                function s(e, t) {
                    if (e = g(e, t < 0 ? 0 : 0 | w(t)), !o.TYPED_ARRAY_SUPPORT)
                        for (var r = 0; r < t; r++) e[r] = 0;
                    return e
                }

                function a(e, t, r) {
                    "string" == typeof r && "" !== r || (r = "utf8");
                    var n = 0 | v(t, r);
                    return e = g(e, n), e.write(t, r), e
                }

                function u(e, t) {
                    if (o.isBuffer(t)) return f(e, t);
                    if (G(t)) return h(e, t);
                    if (null == t) throw new TypeError("must start with number, buffer, array or string");
                    if ("undefined" != typeof ArrayBuffer) {
                        if (t.buffer instanceof ArrayBuffer) return c(e, t);
                        if (t instanceof ArrayBuffer) return l(e, t)
                    }
                    return t.length ? d(e, t) : p(e, t)
                }

                function f(e, t) {
                    var r = 0 | w(t.length);
                    return e = g(e, r), t.copy(e, 0, 0, r), e
                }

                function h(e, t) {
                    var r = 0 | w(t.length);
                    e = g(e, r);
                    for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
                    return e
                }

                function c(e, t) {
                    var r = 0 | w(t.length);
                    e = g(e, r);
                    for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
                    return e
                }

                function l(e, t) {
                    return o.TYPED_ARRAY_SUPPORT ? (t.byteLength, e = o._augment(new Uint8Array(t))) : e = c(e, new Uint8Array(t)), e
                }

                function d(e, t) {
                    var r = 0 | w(t.length);
                    e = g(e, r);
                    for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
                    return e
                }

                function p(e, t) {
                    var r, n = 0;
                    "Buffer" === t.type && G(t.data) && (r = t.data, n = 0 | w(r.length)), e = g(e, n);
                    for (var i = 0; i < n; i += 1) e[i] = 255 & r[i];
                    return e
                }

                function g(e, t) {
                    o.TYPED_ARRAY_SUPPORT ? (e = o._augment(new Uint8Array(t)), e.__proto__ = o.prototype) : (e.length = t, e._isBuffer = !0);
                    var r = 0 !== t && t <= o.poolSize >>> 1;
                    return r && (e.parent = K), e
                }

                function w(e) {
                    if (e >= i()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i().toString(16) + " bytes");
                    return 0 | e
                }

                function b(e, t) {
                    if (!(this instanceof b)) return new b(e, t);
                    var r = new o(e, t);
                    return delete r.parent, r
                }

                function v(e, t) {
                    "string" != typeof e && (e = "" + e);
                    var r = e.length;
                    if (0 === r) return 0;
                    for (var n = !1;;) switch (t) {
                        case "ascii":
                        case "binary":
                        case "raw":
                        case "raws":
                            return r;
                        case "utf8":
                        case "utf-8":
                            return q(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return 2 * r;
                        case "hex":
                            return r >>> 1;
                        case "base64":
                            return J(e).length;
                        default:
                            if (n) return q(e).length;
                            t = ("" + t).toLowerCase(), n = !0
                    }
                }

                function y(e, t, r) {
                    var n = !1;
                    if (t = 0 | t, r = void 0 === r || r === 1 / 0 ? this.length : 0 | r, e || (e = "utf8"), t < 0 && (t = 0), r > this.length && (r = this.length), r <= t) return "";
                    for (;;) switch (e) {
                        case "hex":
                            return I(this, t, r);
                        case "utf8":
                        case "utf-8":
                            return B(this, t, r);
                        case "ascii":
                            return k(this, t, r);
                        case "binary":
                            return T(this, t, r);
                        case "base64":
                            return R(this, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return j(this, t, r);
                        default:
                            if (n) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase(), n = !0
                    }
                }

                function _(e, t, r, n) {
                    r = Number(r) || 0;
                    var i = e.length - r;
                    n ? (n = Number(n), n > i && (n = i)) : n = i;
                    var o = t.length;
                    if (o % 2 !== 0) throw new Error("Invalid hex string");
                    n > o / 2 && (n = o / 2);
                    for (var s = 0; s < n; s++) {
                        var a = parseInt(t.substr(2 * s, 2), 16);
                        if (isNaN(a)) throw new Error("Invalid hex string");
                        e[r + s] = a
                    }
                    return s
                }

                function m(e, t, r, n) {
                    return X(q(t, e.length - r), e, r, n)
                }

                function E(e, t, r, n) {
                    return X(z(t), e, r, n)
                }

                function A(e, t, r, n) {
                    return E(e, t, r, n)
                }

                function L(e, t, r, n) {
                    return X(J(t), e, r, n)
                }

                function S(e, t, r, n) {
                    return X(H(t, e.length - r), e, r, n)
                }

                function R(e, t, r) {
                    return 0 === t && r === e.length ? Q.fromByteArray(e) : Q.fromByteArray(e.slice(t, r))
                }

                function B(e, t, r) {
                    r = Math.min(e.length, r);
                    for (var n = [], i = t; i < r;) {
                        var o = e[i],
                            s = null,
                            a = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
                        if (i + a <= r) {
                            var u, f, h, c;
                            switch (a) {
                                case 1:
                                    o < 128 && (s = o);
                                    break;
                                case 2:
                                    u = e[i + 1], 128 === (192 & u) && (c = (31 & o) << 6 | 63 & u, c > 127 && (s = c));
                                    break;
                                case 3:
                                    u = e[i + 1], f = e[i + 2], 128 === (192 & u) && 128 === (192 & f) && (c = (15 & o) << 12 | (63 & u) << 6 | 63 & f, c > 2047 && (c < 55296 || c > 57343) && (s = c));
                                    break;
                                case 4:
                                    u = e[i + 1], f = e[i + 2], h = e[i + 3], 128 === (192 & u) && 128 === (192 & f) && 128 === (192 & h) && (c = (15 & o) << 18 | (63 & u) << 12 | (63 & f) << 6 | 63 & h, c > 65535 && c < 1114112 && (s = c))
                            }
                        }
                        null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, n.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s), n.push(s), i += a
                    }
                    return x(n)
                }

                function x(e) {
                    var t = e.length;
                    if (t <= V) return String.fromCharCode.apply(String, e);
                    for (var r = "", n = 0; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += V));
                    return r
                }

                function k(e, t, r) {
                    var n = "";
                    r = Math.min(e.length, r);
                    for (var i = t; i < r; i++) n += String.fromCharCode(127 & e[i]);
                    return n
                }

                function T(e, t, r) {
                    var n = "";
                    r = Math.min(e.length, r);
                    for (var i = t; i < r; i++) n += String.fromCharCode(e[i]);
                    return n
                }

                function I(e, t, r) {
                    var n = e.length;
                    (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
                    for (var i = "", o = t; o < r; o++) i += W(e[o]);
                    return i
                }

                function j(e, t, r) {
                    for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                    return i
                }

                function M(e, t, r) {
                    if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                    if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
                }

                function U(e, t, r, n, i, s) {
                    if (!o.isBuffer(e)) throw new TypeError("buffer must be a Buffer instance");
                    if (t > i || t < s) throw new RangeError("value is out of bounds");
                    if (r + n > e.length) throw new RangeError("index out of range")
                }

                function P(e, t, r, n) {
                    t < 0 && (t = 65535 + t + 1);
                    for (var i = 0, o = Math.min(e.length - r, 2); i < o; i++) e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i)
                }

                function O(e, t, r, n) {
                    t < 0 && (t = 4294967295 + t + 1);
                    for (var i = 0, o = Math.min(e.length - r, 4); i < o; i++) e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255
                }

                function C(e, t, r, n, i, o) {
                    if (t > i || t < o) throw new RangeError("value is out of bounds");
                    if (r + n > e.length) throw new RangeError("index out of range");
                    if (r < 0) throw new RangeError("index out of range")
                }

                function D(e, t, r, n, i) {
                    return i || C(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38), Z.write(e, t, r, n, 23, 4), r + 4
                }

                function Y(e, t, r, n, i) {
                    return i || C(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308), Z.write(e, t, r, n, 52, 8), r + 8
                }

                function N(e) {
                    if (e = F(e).replace(ee, ""), e.length < 2) return "";
                    for (; e.length % 4 !== 0;) e += "=";
                    return e
                }

                function F(e) {
                    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
                }

                function W(e) {
                    return e < 16 ? "0" + e.toString(16) : e.toString(16)
                }

                function q(e, t) {
                    t = t || 1 / 0;
                    for (var r, n = e.length, i = null, o = [], s = 0; s < n; s++) {
                        if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
                            if (!i) {
                                if (r > 56319) {
                                    (t -= 3) > -1 && o.push(239, 191, 189);
                                    continue
                                }
                                if (s + 1 === n) {
                                    (t -= 3) > -1 && o.push(239, 191, 189);
                                    continue
                                }
                                i = r;
                                continue
                            }
                            if (r < 56320) {
                                (t -= 3) > -1 && o.push(239, 191, 189), i = r;
                                continue
                            }
                            r = (i - 55296 << 10 | r - 56320) + 65536
                        } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                        if (i = null, r < 128) {
                            if ((t -= 1) < 0) break;
                            o.push(r)
                        } else if (r < 2048) {
                            if ((t -= 2) < 0) break;
                            o.push(r >> 6 | 192, 63 & r | 128)
                        } else if (r < 65536) {
                            if ((t -= 3) < 0) break;
                            o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                        } else {
                            if (!(r < 1114112)) throw new Error("Invalid code point");
                            if ((t -= 4) < 0) break;
                            o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                        }
                    }
                    return o
                }

                function z(e) {
                    for (var t = [], r = 0; r < e.length; r++) t.push(255 & e.charCodeAt(r));
                    return t
                }

                function H(e, t) {
                    for (var r, n, i, o = [], s = 0; s < e.length && !((t -= 2) < 0); s++) r = e.charCodeAt(s), n = r >> 8, i = r % 256, o.push(i), o.push(n);
                    return o
                }

                function J(e) {
                    return Q.toByteArray(N(e))
                }

                function X(e, t, r, n) {
                    for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); i++) t[i + r] = e[i];
                    return i
                }
                var Q = e("base64-js"),
                    Z = e("ieee754"),
                    G = e("isarray");
                r.Buffer = o, r.SlowBuffer = b, r.INSPECT_MAX_BYTES = 50, o.poolSize = 8192;
                var K = {};
                o.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : n(), o.TYPED_ARRAY_SUPPORT ? (o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array) : (o.prototype.length = void 0, o.prototype.parent = void 0), o.isBuffer = function(e) {
                    return !(null == e || !e._isBuffer)
                }, o.compare = function(e, t) {
                    if (!o.isBuffer(e) || !o.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                    if (e === t) return 0;
                    for (var r = e.length, n = t.length, i = 0, s = Math.min(r, n); i < s && e[i] === t[i];) ++i;
                    return i !== s && (r = e[i], n = t[i]), r < n ? -1 : n < r ? 1 : 0
                }, o.isEncoding = function(e) {
                    switch (String(e).toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "binary":
                        case "base64":
                        case "raw":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return !0;
                        default:
                            return !1
                    }
                }, o.concat = function(e, t) {
                    if (!G(e)) throw new TypeError("list argument must be an Array of Buffers.");
                    if (0 === e.length) return new o(0);
                    var r;
                    if (void 0 === t)
                        for (t = 0, r = 0; r < e.length; r++) t += e[r].length;
                    var n = new o(t),
                        i = 0;
                    for (r = 0; r < e.length; r++) {
                        var s = e[r];
                        s.copy(n, i), i += s.length
                    }
                    return n
                }, o.byteLength = v, o.prototype.toString = function() {
                    var e = 0 | this.length;
                    return 0 === e ? "" : 0 === arguments.length ? B(this, 0, e) : y.apply(this, arguments)
                }, o.prototype.equals = function(e) {
                    if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e || 0 === o.compare(this, e)
                }, o.prototype.inspect = function() {
                    var e = "",
                        t = r.INSPECT_MAX_BYTES;
                    return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
                }, o.prototype.compare = function(e) {
                    if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                    return this === e ? 0 : o.compare(this, e)
                }, o.prototype.indexOf = function(e, t) {
                    function r(e, t, r) {
                        for (var n = -1, i = 0; r + i < e.length; i++)
                            if (e[r + i] === t[n === -1 ? 0 : i - n]) {
                                if (n === -1 && (n = i), i - n + 1 === t.length) return r + n
                            } else n = -1;
                        return -1
                    }
                    if (t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t >>= 0, 0 === this.length) return -1;
                    if (t >= this.length) return -1;
                    if (t < 0 && (t = Math.max(this.length + t, 0)), "string" == typeof e) return 0 === e.length ? -1 : String.prototype.indexOf.call(this, e, t);
                    if (o.isBuffer(e)) return r(this, e, t);
                    if ("number" == typeof e) return o.TYPED_ARRAY_SUPPORT && "function" === Uint8Array.prototype.indexOf ? Uint8Array.prototype.indexOf.call(this, e, t) : r(this, [e], t);
                    throw new TypeError("val must be string, number or Buffer")
                }, o.prototype.get = function(e) {
                    return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e)
                }, o.prototype.set = function(e, t) {
                    return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t)
                }, o.prototype.write = function(e, t, r, n) {
                    if (void 0 === t) n = "utf8", r = this.length, t = 0;
                    else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
                    else if (isFinite(t)) t = 0 | t, isFinite(r) ? (r = 0 | r, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
                    else {
                        var i = n;
                        n = t, t = 0 | r, r = i
                    }
                    var o = this.length - t;
                    if ((void 0 === r || r > o) && (r = o), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("attempt to write outside buffer bounds");
                    n || (n = "utf8");
                    for (var s = !1;;) switch (n) {
                        case "hex":
                            return _(this, e, t, r);
                        case "utf8":
                        case "utf-8":
                            return m(this, e, t, r);
                        case "ascii":
                            return E(this, e, t, r);
                        case "binary":
                            return A(this, e, t, r);
                        case "base64":
                            return L(this, e, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return S(this, e, t, r);
                        default:
                            if (s) throw new TypeError("Unknown encoding: " + n);
                            n = ("" + n).toLowerCase(), s = !0
                    }
                }, o.prototype.toJSON = function() {
                    return {
                        type: "Buffer",
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                };
                var V = 4096;
                o.prototype.slice = function(e, t) {
                    var r = this.length;
                    e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r, e < 0 && (e = 0)) : e > r && (e = r), t < 0 ? (t += r, t < 0 && (t = 0)) : t > r && (t = r), t < e && (t = e);
                    var n;
                    if (o.TYPED_ARRAY_SUPPORT) n = o._augment(this.subarray(e, t));
                    else {
                        var i = t - e;
                        n = new o(i, (void 0));
                        for (var s = 0; s < i; s++) n[s] = this[s + e]
                    }
                    return n.length && (n.parent = this.parent || this), n
                }, o.prototype.readUIntLE = function(e, t, r) {
                    e = 0 | e, t = 0 | t, r || M(e, t, this.length);
                    for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                    return n
                }, o.prototype.readUIntBE = function(e, t, r) {
                    e = 0 | e, t = 0 | t, r || M(e, t, this.length);
                    for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) n += this[e + --t] * i;
                    return n
                }, o.prototype.readUInt8 = function(e, t) {
                    return t || M(e, 1, this.length), this[e]
                }, o.prototype.readUInt16LE = function(e, t) {
                    return t || M(e, 2, this.length), this[e] | this[e + 1] << 8
                }, o.prototype.readUInt16BE = function(e, t) {
                    return t || M(e, 2, this.length), this[e] << 8 | this[e + 1]
                }, o.prototype.readUInt32LE = function(e, t) {
                    return t || M(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                }, o.prototype.readUInt32BE = function(e, t) {
                    return t || M(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                }, o.prototype.readIntLE = function(e, t, r) {
                    e = 0 | e, t = 0 | t, r || M(e, t, this.length);
                    for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                    return i *= 128, n >= i && (n -= Math.pow(2, 8 * t)), n
                }, o.prototype.readIntBE = function(e, t, r) {
                    e = 0 | e, t = 0 | t, r || M(e, t, this.length);
                    for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256);) o += this[e + --n] * i;
                    return i *= 128, o >= i && (o -= Math.pow(2, 8 * t)), o
                }, o.prototype.readInt8 = function(e, t) {
                    return t || M(e, 1, this.length), 128 & this[e] ? (255 - this[e] + 1) * -1 : this[e]
                }, o.prototype.readInt16LE = function(e, t) {
                    t || M(e, 2, this.length);
                    var r = this[e] | this[e + 1] << 8;
                    return 32768 & r ? 4294901760 | r : r
                }, o.prototype.readInt16BE = function(e, t) {
                    t || M(e, 2, this.length);
                    var r = this[e + 1] | this[e] << 8;
                    return 32768 & r ? 4294901760 | r : r
                }, o.prototype.readInt32LE = function(e, t) {
                    return t || M(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                }, o.prototype.readInt32BE = function(e, t) {
                    return t || M(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                }, o.prototype.readFloatLE = function(e, t) {
                    return t || M(e, 4, this.length), Z.read(this, e, !0, 23, 4)
                }, o.prototype.readFloatBE = function(e, t) {
                    return t || M(e, 4, this.length), Z.read(this, e, !1, 23, 4)
                }, o.prototype.readDoubleLE = function(e, t) {
                    return t || M(e, 8, this.length), Z.read(this, e, !0, 52, 8)
                }, o.prototype.readDoubleBE = function(e, t) {
                    return t || M(e, 8, this.length), Z.read(this, e, !1, 52, 8)
                }, o.prototype.writeUIntLE = function(e, t, r, n) {
                    e = +e, t = 0 | t, r = 0 | r, n || U(this, e, t, r, Math.pow(2, 8 * r), 0);
                    var i = 1,
                        o = 0;
                    for (this[t] = 255 & e; ++o < r && (i *= 256);) this[t + o] = e / i & 255;
                    return t + r
                }, o.prototype.writeUIntBE = function(e, t, r, n) {
                    e = +e, t = 0 | t, r = 0 | r, n || U(this, e, t, r, Math.pow(2, 8 * r), 0);
                    var i = r - 1,
                        o = 1;
                    for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) this[t + i] = e / o & 255;
                    return t + r
                }, o.prototype.writeUInt8 = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 1, 255, 0), o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
                }, o.prototype.writeUInt16LE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 2, 65535, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : P(this, e, t, !0), t + 2
                }, o.prototype.writeUInt16BE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 2, 65535, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : P(this, e, t, !1), t + 2
                }, o.prototype.writeUInt32LE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 4, 4294967295, 0), o.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : O(this, e, t, !0), t + 4
                }, o.prototype.writeUInt32BE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 4, 4294967295, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : O(this, e, t, !1), t + 4
                }, o.prototype.writeIntLE = function(e, t, r, n) {
                    if (e = +e, t = 0 | t, !n) {
                        var i = Math.pow(2, 8 * r - 1);
                        U(this, e, t, r, i - 1, -i)
                    }
                    var o = 0,
                        s = 1,
                        a = e < 0 ? 1 : 0;
                    for (this[t] = 255 & e; ++o < r && (s *= 256);) this[t + o] = (e / s >> 0) - a & 255;
                    return t + r
                }, o.prototype.writeIntBE = function(e, t, r, n) {
                    if (e = +e, t = 0 | t, !n) {
                        var i = Math.pow(2, 8 * r - 1);
                        U(this, e, t, r, i - 1, -i)
                    }
                    var o = r - 1,
                        s = 1,
                        a = e < 0 ? 1 : 0;
                    for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) this[t + o] = (e / s >> 0) - a & 255;
                    return t + r
                }, o.prototype.writeInt8 = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 1, 127, -128), o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                }, o.prototype.writeInt16LE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 2, 32767, -32768), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : P(this, e, t, !0), t + 2
                }, o.prototype.writeInt16BE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 2, 32767, -32768), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : P(this, e, t, !1), t + 2
                }, o.prototype.writeInt32LE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 4, 2147483647, -2147483648), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : O(this, e, t, !0), t + 4
                }, o.prototype.writeInt32BE = function(e, t, r) {
                    return e = +e, t = 0 | t, r || U(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : O(this, e, t, !1), t + 4
                }, o.prototype.writeFloatLE = function(e, t, r) {
                    return D(this, e, t, !0, r)
                }, o.prototype.writeFloatBE = function(e, t, r) {
                    return D(this, e, t, !1, r)
                }, o.prototype.writeDoubleLE = function(e, t, r) {
                    return Y(this, e, t, !0, r)
                }, o.prototype.writeDoubleBE = function(e, t, r) {
                    return Y(this, e, t, !1, r)
                }, o.prototype.copy = function(e, t, r, n) {
                    if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
                    if (0 === e.length || 0 === this.length) return 0;
                    if (t < 0) throw new RangeError("targetStart out of bounds");
                    if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                    if (n < 0) throw new RangeError("sourceEnd out of bounds");
                    n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
                    var i, s = n - r;
                    if (this === e && r < t && t < n)
                        for (i = s - 1; i >= 0; i--) e[i + t] = this[i + r];
                    else if (s < 1e3 || !o.TYPED_ARRAY_SUPPORT)
                        for (i = 0; i < s; i++) e[i + t] = this[i + r];
                    else e._set(this.subarray(r, r + s), t);
                    return s
                }, o.prototype.fill = function(e, t, r) {
                    if (e || (e = 0), t || (t = 0), r || (r = this.length), r < t) throw new RangeError("end < start");
                    if (r !== t && 0 !== this.length) {
                        if (t < 0 || t >= this.length) throw new RangeError("start out of bounds");
                        if (r < 0 || r > this.length) throw new RangeError("end out of bounds");
                        var n;
                        if ("number" == typeof e)
                            for (n = t; n < r; n++) this[n] = e;
                        else {
                            var i = q(e.toString()),
                                o = i.length;
                            for (n = t; n < r; n++) this[n] = i[n % o]
                        }
                        return this
                    }
                }, o.prototype.toArrayBuffer = function() {
                    if ("undefined" != typeof Uint8Array) {
                        if (o.TYPED_ARRAY_SUPPORT) return new o(this).buffer;
                        for (var e = new Uint8Array(this.length), t = 0, r = e.length; t < r; t += 1) e[t] = this[t];
                        return e.buffer
                    }
                    throw new TypeError("Buffer.toArrayBuffer not supported in this browser")
                };
                var $ = o.prototype;
                o._augment = function(e) {
                    return e.constructor = o, e._isBuffer = !0, e._set = e.set, e.get = $.get, e.set = $.set, e.write = $.write, e.toString = $.toString, e.toLocaleString = $.toString, e.toJSON = $.toJSON, e.equals = $.equals, e.compare = $.compare, e.indexOf = $.indexOf, e.copy = $.copy, e.slice = $.slice, e.readUIntLE = $.readUIntLE, e.readUIntBE = $.readUIntBE, e.readUInt8 = $.readUInt8, e.readUInt16LE = $.readUInt16LE, e.readUInt16BE = $.readUInt16BE, e.readUInt32LE = $.readUInt32LE, e.readUInt32BE = $.readUInt32BE, e.readIntLE = $.readIntLE, e.readIntBE = $.readIntBE, e.readInt8 = $.readInt8, e.readInt16LE = $.readInt16LE, e.readInt16BE = $.readInt16BE, e.readInt32LE = $.readInt32LE, e.readInt32BE = $.readInt32BE, e.readFloatLE = $.readFloatLE, e.readFloatBE = $.readFloatBE, e.readDoubleLE = $.readDoubleLE, e.readDoubleBE = $.readDoubleBE, e.writeUInt8 = $.writeUInt8, e.writeUIntLE = $.writeUIntLE, e.writeUIntBE = $.writeUIntBE, e.writeUInt16LE = $.writeUInt16LE, e.writeUInt16BE = $.writeUInt16BE, e.writeUInt32LE = $.writeUInt32LE, e.writeUInt32BE = $.writeUInt32BE, e.writeIntLE = $.writeIntLE, e.writeIntBE = $.writeIntBE, e.writeInt8 = $.writeInt8, e.writeInt16LE = $.writeInt16LE, e.writeInt16BE = $.writeInt16BE, e.writeInt32LE = $.writeInt32LE, e.writeInt32BE = $.writeInt32BE, e.writeFloatLE = $.writeFloatLE, e.writeFloatBE = $.writeFloatBE, e.writeDoubleLE = $.writeDoubleLE, e.writeDoubleBE = $.writeDoubleBE, e.fill = $.fill, e.inspect = $.inspect, e.toArrayBuffer = $.toArrayBuffer, e
                };
                var ee = /[^+\/0-9A-Za-z-_]/g
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "base64-js": 3,
            ieee754: 4,
            isarray: 5
        }],
        3: [function(e, t, r) {
            var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            ! function(e) {
                "use strict";

                function t(e) {
                    var t = e.charCodeAt(0);
                    return t === s || t === c ? 62 : t === a || t === l ? 63 : t < u ? -1 : t < u + 10 ? t - u + 26 + 26 : t < h + 26 ? t - h : t < f + 26 ? t - f + 26 : void 0
                }

                function r(e) {
                    function r(e) {
                        f[c++] = e
                    }
                    var n, i, s, a, u, f;
                    if (e.length % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
                    var h = e.length;
                    u = "=" === e.charAt(h - 2) ? 2 : "=" === e.charAt(h - 1) ? 1 : 0, f = new o(3 * e.length / 4 - u), s = u > 0 ? e.length - 4 : e.length;
                    var c = 0;
                    for (n = 0, i = 0; n < s; n += 4, i += 3) a = t(e.charAt(n)) << 18 | t(e.charAt(n + 1)) << 12 | t(e.charAt(n + 2)) << 6 | t(e.charAt(n + 3)), r((16711680 & a) >> 16), r((65280 & a) >> 8), r(255 & a);
                    return 2 === u ? (a = t(e.charAt(n)) << 2 | t(e.charAt(n + 1)) >> 4, r(255 & a)) : 1 === u && (a = t(e.charAt(n)) << 10 | t(e.charAt(n + 1)) << 4 | t(e.charAt(n + 2)) >> 2, r(a >> 8 & 255), r(255 & a)), f
                }

                function i(e) {
                    function t(e) {
                        return n.charAt(e)
                    }

                    function r(e) {
                        return t(e >> 18 & 63) + t(e >> 12 & 63) + t(e >> 6 & 63) + t(63 & e)
                    }
                    var i, o, s, a = e.length % 3,
                        u = "";
                    for (i = 0, s = e.length - a; i < s; i += 3) o = (e[i] << 16) + (e[i + 1] << 8) + e[i + 2], u += r(o);
                    switch (a) {
                        case 1:
                            o = e[e.length - 1], u += t(o >> 2), u += t(o << 4 & 63), u += "==";
                            break;
                        case 2:
                            o = (e[e.length - 2] << 8) + e[e.length - 1], u += t(o >> 10), u += t(o >> 4 & 63), u += t(o << 2 & 63), u += "="
                    }
                    return u
                }
                var o = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                    s = "+".charCodeAt(0),
                    a = "/".charCodeAt(0),
                    u = "0".charCodeAt(0),
                    f = "a".charCodeAt(0),
                    h = "A".charCodeAt(0),
                    c = "-".charCodeAt(0),
                    l = "_".charCodeAt(0);
                e.toByteArray = r, e.fromByteArray = i
            }("undefined" == typeof r ? this.base64js = {} : r)
        }, {}],
        4: [function(e, t, r) {
            r.read = function(e, t, r, n, i) {
                var o, s, a = 8 * i - n - 1,
                    u = (1 << a) - 1,
                    f = u >> 1,
                    h = -7,
                    c = r ? i - 1 : 0,
                    l = r ? -1 : 1,
                    d = e[t + c];
                for (c += l, o = d & (1 << -h) - 1, d >>= -h, h += a; h > 0; o = 256 * o + e[t + c], c += l, h -= 8);
                for (s = o & (1 << -h) - 1, o >>= -h, h += n; h > 0; s = 256 * s + e[t + c], c += l, h -= 8);
                if (0 === o) o = 1 - f;
                else {
                    if (o === u) return s ? NaN : (d ? -1 : 1) * (1 / 0);
                    s += Math.pow(2, n), o -= f
                }
                return (d ? -1 : 1) * s * Math.pow(2, o - n)
            }, r.write = function(e, t, r, n, i, o) {
                var s, a, u, f = 8 * o - i - 1,
                    h = (1 << f) - 1,
                    c = h >> 1,
                    l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    d = n ? 0 : o - 1,
                    p = n ? 1 : -1,
                    g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = h) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), t += s + c >= 1 ? l / u : l * Math.pow(2, 1 - c), t * u >= 2 && (s++, u /= 2), s + c >= h ? (a = 0, s = h) : s + c >= 1 ? (a = (t * u - 1) * Math.pow(2, i), s += c) : (a = t * Math.pow(2, c - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + d] = 255 & a, d += p, a /= 256, i -= 8);
                for (s = s << i | a, f += i; f > 0; e[r + d] = 255 & s, d += p, s /= 256, f -= 8);
                e[r + d - p] |= 128 * g
            }
        }, {}],
        5: [function(e, t, r) {
            var n = {}.toString;
            t.exports = Array.isArray || function(e) {
                return "[object Array]" == n.call(e)
            }
        }, {}],
        6: [function(e, t, r) {
            function n() {
                this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
            }

            function i(e) {
                return "function" == typeof e
            }

            function o(e) {
                return "number" == typeof e
            }

            function s(e) {
                return "object" == typeof e && null !== e
            }

            function a(e) {
                return void 0 === e
            }
            t.exports = n, n.EventEmitter = n, n.prototype._events = void 0, n.prototype._maxListeners = void 0, n.defaultMaxListeners = 10, n.prototype.setMaxListeners = function(e) {
                if (!o(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
                return this._maxListeners = e, this
            }, n.prototype.emit = function(e) {
                var t, r, n, o, u, f;
                if (this._events || (this._events = {}), "error" === e && (!this._events.error || s(this._events.error) && !this._events.error.length)) {
                    if (t = arguments[1], t instanceof Error) throw t;
                    throw TypeError('Uncaught, unspecified "error" event.')
                }
                if (r = this._events[e], a(r)) return !1;
                if (i(r)) switch (arguments.length) {
                    case 1:
                        r.call(this);
                        break;
                    case 2:
                        r.call(this, arguments[1]);
                        break;
                    case 3:
                        r.call(this, arguments[1], arguments[2]);
                        break;
                    default:
                        for (n = arguments.length, o = new Array(n - 1), u = 1; u < n; u++) o[u - 1] = arguments[u];
                        r.apply(this, o)
                } else if (s(r)) {
                    for (n = arguments.length, o = new Array(n - 1), u = 1; u < n; u++) o[u - 1] = arguments[u];
                    for (f = r.slice(), n = f.length, u = 0; u < n; u++) f[u].apply(this, o)
                }
                return !0
            }, n.prototype.addListener = function(e, t) {
                var r;
                if (!i(t)) throw TypeError("listener must be a function");
                if (this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, i(t.listener) ? t.listener : t), this._events[e] ? s(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, s(this._events[e]) && !this._events[e].warned) {
                    var r;
                    r = a(this._maxListeners) ? n.defaultMaxListeners : this._maxListeners, r && r > 0 && this._events[e].length > r && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace())
                }
                return this
            }, n.prototype.on = n.prototype.addListener, n.prototype.once = function(e, t) {
                function r() {
                    this.removeListener(e, r), n || (n = !0, t.apply(this, arguments))
                }
                if (!i(t)) throw TypeError("listener must be a function");
                var n = !1;
                return r.listener = t, this.on(e, r), this
            }, n.prototype.removeListener = function(e, t) {
                var r, n, o, a;
                if (!i(t)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[e]) return this;
                if (r = this._events[e], o = r.length, n = -1, r === t || i(r.listener) && r.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
                else if (s(r)) {
                    for (a = o; a-- > 0;)
                        if (r[a] === t || r[a].listener && r[a].listener === t) {
                            n = a;
                            break
                        }
                    if (n < 0) return this;
                    1 === r.length ? (r.length = 0, delete this._events[e]) : r.splice(n, 1), this._events.removeListener && this.emit("removeListener", e, t)
                }
                return this
            }, n.prototype.removeAllListeners = function(e) {
                var t, r;
                if (!this._events) return this;
                if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
                if (0 === arguments.length) {
                    for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                    return this.removeAllListeners("removeListener"), this._events = {}, this
                }
                if (r = this._events[e], i(r)) this.removeListener(e, r);
                else
                    for (; r.length;) this.removeListener(e, r[r.length - 1]);
                return delete this._events[e], this
            }, n.prototype.listeners = function(e) {
                var t;
                return t = this._events && this._events[e] ? i(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
            }, n.listenerCount = function(e, t) {
                var r;
                return r = e._events && e._events[t] ? i(e._events[t]) ? 1 : e._events[t].length : 0
            }
        }, {}],
        7: [function(e, t, r) {
            "function" == typeof Object.create ? t.exports = function(e, t) {
                e.super_ = t, e.prototype = Object.create(t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                })
            } : t.exports = function(e, t) {
                e.super_ = t;
                var r = function() {};
                r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
            }
        }, {}],
        8: [function(e, t, r) {
            function n(e) {
                return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
            }

            function i(e) {
                return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
            }
            t.exports = function(e) {
                return null != e && (n(e) || i(e) || !!e._isBuffer)
            }
        }, {}],
        9: [function(e, t, r) {
            t.exports = Array.isArray || function(e) {
                return "[object Array]" == Object.prototype.toString.call(e)
            }
        }, {}],
        10: [function(e, t, r) {
            function n() {}
            var i = t.exports = {};
            i.nextTick = function() {
                var e = "undefined" != typeof window && window.setImmediate,
                    t = "undefined" != typeof window && window.MutationObserver,
                    r = "undefined" != typeof window && window.postMessage && window.addEventListener;
                if (e) return function(e) {
                    return window.setImmediate(e)
                };
                var n = [];
                if (t) {
                    var i = document.createElement("div"),
                        o = new MutationObserver(function() {
                            var e = n.slice();
                            n.length = 0, e.forEach(function(e) {
                                e()
                            })
                        });
                    return o.observe(i, {
                            attributes: !0
                        }),
                        function(e) {
                            n.length || i.setAttribute("yes", "no"), n.push(e)
                        }
                }
                return r ? (window.addEventListener("message", function(e) {
                    var t = e.source;
                    if ((t === window || null === t) && "process-tick" === e.data && (e.stopPropagation(), n.length > 0)) {
                        var r = n.shift();
                        r()
                    }
                }, !0), function(e) {
                    n.push(e), window.postMessage("process-tick", "*")
                }) : function(e) {
                    setTimeout(e, 0)
                }
            }(), i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.on = n, i.addListener = n, i.once = n, i.off = n, i.removeListener = n, i.removeAllListeners = n, i.emit = n, i.binding = function(e) {
                throw new Error("process.binding is not supported")
            }, i.cwd = function() {
                return "/"
            }, i.chdir = function(e) {
                throw new Error("process.chdir is not supported")
            }
        }, {}],
        11: [function(e, t, r) {
            t.exports = e("./lib/_stream_duplex.js")
        }, {
            "./lib/_stream_duplex.js": 12
        }],
        12: [function(e, t, r) {
            (function(r) {
                function n(e) {
                    return this instanceof n ? (u.call(this, e), f.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), void this.once("end", i)) : new n(e)
                }

                function i() {
                    this.allowHalfOpen || this._writableState.ended || r.nextTick(this.end.bind(this))
                }

                function o(e, t) {
                    for (var r = 0, n = e.length; r < n; r++) t(e[r], r)
                }
                t.exports = n;
                var s = Object.keys || function(e) {
                        var t = [];
                        for (var r in e) t.push(r);
                        return t
                    },
                    a = e("core-util-is");
                a.inherits = e("inherits");
                var u = e("./_stream_readable"),
                    f = e("./_stream_writable");
                a.inherits(n, u), o(s(f.prototype), function(e) {
                    n.prototype[e] || (n.prototype[e] = f.prototype[e])
                })
            }).call(this, e("_process"))
        }, {
            "./_stream_readable": 14,
            "./_stream_writable": 16,
            _process: 10,
            "core-util-is": 17,
            inherits: 7
        }],
        13: [function(e, t, r) {
            function n(e) {
                return this instanceof n ? void i.call(this, e) : new n(e)
            }
            t.exports = n;
            var i = e("./_stream_transform"),
                o = e("core-util-is");
            o.inherits = e("inherits"), o.inherits(n, i), n.prototype._transform = function(e, t, r) {
                r(null, e)
            }
        }, {
            "./_stream_transform": 15,
            "core-util-is": 17,
            inherits: 7
        }],
        14: [function(e, t, r) {
            (function(r) {
                function n(t, r) {
                    var n = e("./_stream_duplex");
                    t = t || {};
                    var i = t.highWaterMark,
                        o = t.objectMode ? 16 : 16384;
                    this.highWaterMark = i || 0 === i ? i : o, this.highWaterMark = ~~this.highWaterMark, this.buffer = [], this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.objectMode = !!t.objectMode, r instanceof n && (this.objectMode = this.objectMode || !!t.readableObjectMode), this.defaultEncoding = t.defaultEncoding || "utf8", this.ranOut = !1, this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (x || (x = e("string_decoder/").StringDecoder), this.decoder = new x(t.encoding), this.encoding = t.encoding)
                }

                function i(t) {
                    e("./_stream_duplex");
                    return this instanceof i ? (this._readableState = new n(t, this), this.readable = !0, void R.call(this)) : new i(t)
                }

                function o(e, t, r, n, i) {
                    var o = f(t, r);
                    if (o) e.emit("error", o);
                    else if (B.isNullOrUndefined(r)) t.reading = !1, t.ended || h(e, t);
                    else if (t.objectMode || r && r.length > 0)
                        if (t.ended && !i) {
                            var a = new Error("stream.push() after EOF");
                            e.emit("error", a)
                        } else if (t.endEmitted && i) {
                        var a = new Error("stream.unshift() after end event");
                        e.emit("error", a)
                    } else !t.decoder || i || n || (r = t.decoder.write(r)), i || (t.reading = !1), t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && c(e)), d(e, t);
                    else i || (t.reading = !1);
                    return s(t)
                }

                function s(e) {
                    return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length)
                }

                function a(e) {
                    if (e >= T) e = T;
                    else {
                        e--;
                        for (var t = 1; t < 32; t <<= 1) e |= e >> t;
                        e++
                    }
                    return e
                }

                function u(e, t) {
                    return 0 === t.length && t.ended ? 0 : t.objectMode ? 0 === e ? 0 : 1 : isNaN(e) || B.isNull(e) ? t.flowing && t.buffer.length ? t.buffer[0].length : t.length : e <= 0 ? 0 : (e > t.highWaterMark && (t.highWaterMark = a(e)), e > t.length ? t.ended ? t.length : (t.needReadable = !0, 0) : e)
                }

                function f(e, t) {
                    var r = null;
                    return B.isBuffer(t) || B.isString(t) || B.isNullOrUndefined(t) || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk")), r
                }

                function h(e, t) {
                    if (t.decoder && !t.ended) {
                        var r = t.decoder.end();
                        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length)
                    }
                    t.ended = !0, c(e)
                }

                function c(e) {
                    var t = e._readableState;
                    t.needReadable = !1, t.emittedReadable || (k("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? r.nextTick(function() {
                        l(e)
                    }) : l(e))
                }

                function l(e) {
                    k("emit readable"), e.emit("readable"), v(e)
                }

                function d(e, t) {
                    t.readingMore || (t.readingMore = !0, r.nextTick(function() {
                        p(e, t)
                    }))
                }

                function p(e, t) {
                    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (k("maybeReadMore read 0"), e.read(0), r !== t.length);) r = t.length;
                    t.readingMore = !1
                }

                function g(e) {
                    return function() {
                        var t = e._readableState;
                        k("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && S.listenerCount(e, "data") && (t.flowing = !0, v(e))
                    }
                }

                function w(e, t) {
                    t.resumeScheduled || (t.resumeScheduled = !0, r.nextTick(function() {
                        b(e, t)
                    }))
                }

                function b(e, t) {
                    t.resumeScheduled = !1, e.emit("resume"), v(e), t.flowing && !t.reading && e.read(0)
                }

                function v(e) {
                    var t = e._readableState;
                    if (k("flow", t.flowing), t.flowing)
                        do var r = e.read(); while (null !== r && t.flowing)
                }

                function y(e, t) {
                    var r, n = t.buffer,
                        i = t.length,
                        o = !!t.decoder,
                        s = !!t.objectMode;
                    if (0 === n.length) return null;
                    if (0 === i) r = null;
                    else if (s) r = n.shift();
                    else if (!e || e >= i) r = o ? n.join("") : L.concat(n, i), n.length = 0;
                    else if (e < n[0].length) {
                        var a = n[0];
                        r = a.slice(0, e), n[0] = a.slice(e)
                    } else if (e === n[0].length) r = n.shift();
                    else {
                        r = o ? "" : new L(e);
                        for (var u = 0, f = 0, h = n.length; f < h && u < e; f++) {
                            var a = n[0],
                                c = Math.min(e - u, a.length);
                            o ? r += a.slice(0, c) : a.copy(r, u, 0, c), c < a.length ? n[0] = a.slice(c) : n.shift(), u += c
                        }
                    }
                    return r
                }

                function _(e) {
                    var t = e._readableState;
                    if (t.length > 0) throw new Error("endReadable called on non-empty stream");
                    t.endEmitted || (t.ended = !0, r.nextTick(function() {
                        t.endEmitted || 0 !== t.length || (t.endEmitted = !0, e.readable = !1, e.emit("end"))
                    }))
                }

                function m(e, t) {
                    for (var r = 0, n = e.length; r < n; r++) t(e[r], r)
                }

                function E(e, t) {
                    for (var r = 0, n = e.length; r < n; r++)
                        if (e[r] === t) return r;
                    return -1
                }
                t.exports = i;
                var A = e("isarray"),
                    L = e("buffer").Buffer;
                i.ReadableState = n;
                var S = e("events").EventEmitter;
                S.listenerCount || (S.listenerCount = function(e, t) {
                    return e.listeners(t).length
                });
                var R = e("stream"),
                    B = e("core-util-is");
                B.inherits = e("inherits");
                var x, k = e("util");
                k = k && k.debuglog ? k.debuglog("stream") : function() {}, B.inherits(i, R), i.prototype.push = function(e, t) {
                    var r = this._readableState;
                    return B.isString(e) && !r.objectMode && (t = t || r.defaultEncoding, t !== r.encoding && (e = new L(e, t), t = "")), o(this, r, e, t, !1)
                }, i.prototype.unshift = function(e) {
                    var t = this._readableState;
                    return o(this, t, e, "", !0)
                }, i.prototype.setEncoding = function(t) {
                    return x || (x = e("string_decoder/").StringDecoder), this._readableState.decoder = new x(t), this._readableState.encoding = t, this
                };
                var T = 8388608;
                i.prototype.read = function(e) {
                    k("read", e);
                    var t = this._readableState,
                        r = e;
                    if ((!B.isNumber(e) || e > 0) && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return k("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? _(this) : c(this), null;
                    if (e = u(e, t), 0 === e && t.ended) return 0 === t.length && _(this), null;
                    var n = t.needReadable;
                    k("need readable", n), (0 === t.length || t.length - e < t.highWaterMark) && (n = !0, k("length less than watermark", n)), (t.ended || t.reading) && (n = !1, k("reading or ended", n)), n && (k("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1), n && !t.reading && (e = u(r, t));
                    var i;
                    return i = e > 0 ? y(e, t) : null, B.isNull(i) && (t.needReadable = !0, e = 0), t.length -= e, 0 !== t.length || t.ended || (t.needReadable = !0), r !== e && t.ended && 0 === t.length && _(this), B.isNull(i) || this.emit("data", i), i
                }, i.prototype._read = function(e) {
                    this.emit("error", new Error("not implemented"))
                }, i.prototype.pipe = function(e, t) {
                    function n(e) {
                        k("onunpipe"), e === c && o()
                    }

                    function i() {
                        k("onend"), e.end()
                    }

                    function o() {
                        k("cleanup"), e.removeListener("close", u), e.removeListener("finish", f), e.removeListener("drain", w), e.removeListener("error", a), e.removeListener("unpipe", n), c.removeListener("end", i), c.removeListener("end", o), c.removeListener("data", s), !l.awaitDrain || e._writableState && !e._writableState.needDrain || w()
                    }

                    function s(t) {
                        k("ondata");
                        var r = e.write(t);
                        !1 === r && (k("false write response, pause", c._readableState.awaitDrain), c._readableState.awaitDrain++, c.pause())
                    }

                    function a(t) {
                        k("onerror", t), h(), e.removeListener("error", a), 0 === S.listenerCount(e, "error") && e.emit("error", t)
                    }

                    function u() {
                        e.removeListener("finish", f), h()
                    }

                    function f() {
                        k("onfinish"), e.removeListener("close", u), h()
                    }

                    function h() {
                        k("unpipe"), c.unpipe(e)
                    }
                    var c = this,
                        l = this._readableState;
                    switch (l.pipesCount) {
                        case 0:
                            l.pipes = e;
                            break;
                        case 1:
                            l.pipes = [l.pipes, e];
                            break;
                        default:
                            l.pipes.push(e)
                    }
                    l.pipesCount += 1, k("pipe count=%d opts=%j", l.pipesCount, t);
                    var d = (!t || t.end !== !1) && e !== r.stdout && e !== r.stderr,
                        p = d ? i : o;
                    l.endEmitted ? r.nextTick(p) : c.once("end", p), e.on("unpipe", n);
                    var w = g(c);
                    return e.on("drain", w), c.on("data", s), e._events && e._events.error ? A(e._events.error) ? e._events.error.unshift(a) : e._events.error = [a, e._events.error] : e.on("error", a), e.once("close", u), e.once("finish", f), e.emit("pipe", c), l.flowing || (k("pipe resume"), c.resume()), e
                }, i.prototype.unpipe = function(e) {
                    var t = this._readableState;
                    if (0 === t.pipesCount) return this;
                    if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this), this);
                    if (!e) {
                        var r = t.pipes,
                            n = t.pipesCount;
                        t.pipes = null, t.pipesCount = 0, t.flowing = !1;
                        for (var i = 0; i < n; i++) r[i].emit("unpipe", this);
                        return this
                    }
                    var i = E(t.pipes, e);
                    return i === -1 ? this : (t.pipes.splice(i, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this), this)
                }, i.prototype.on = function(e, t) {
                    var n = R.prototype.on.call(this, e, t);
                    if ("data" === e && !1 !== this._readableState.flowing && this.resume(), "readable" === e && this.readable) {
                        var i = this._readableState;
                        if (!i.readableListening)
                            if (i.readableListening = !0, i.emittedReadable = !1, i.needReadable = !0, i.reading) i.length && c(this, i);
                            else {
                                var o = this;
                                r.nextTick(function() {
                                    k("readable nexttick read 0"), o.read(0)
                                })
                            }
                    }
                    return n
                }, i.prototype.addListener = i.prototype.on, i.prototype.resume = function() {
                    var e = this._readableState;
                    return e.flowing || (k("resume"), e.flowing = !0, e.reading || (k("resume read 0"), this.read(0)), w(this, e)), this
                }, i.prototype.pause = function() {
                    return k("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (k("pause"), this._readableState.flowing = !1, this.emit("pause")), this
                }, i.prototype.wrap = function(e) {
                    var t = this._readableState,
                        r = !1,
                        n = this;
                    e.on("end", function() {
                        if (k("wrapped end"), t.decoder && !t.ended) {
                            var e = t.decoder.end();
                            e && e.length && n.push(e)
                        }
                        n.push(null)
                    }), e.on("data", function(i) {
                        if (k("wrapped data"), t.decoder && (i = t.decoder.write(i)), i && (t.objectMode || i.length)) {
                            var o = n.push(i);
                            o || (r = !0, e.pause())
                        }
                    });
                    for (var i in e) B.isFunction(e[i]) && B.isUndefined(this[i]) && (this[i] = function(t) {
                        return function() {
                            return e[t].apply(e, arguments)
                        }
                    }(i));
                    var o = ["error", "close", "destroy", "pause", "resume"];
                    return m(o, function(t) {
                        e.on(t, n.emit.bind(n, t))
                    }), n._read = function(t) {
                        k("wrapped _read", t), r && (r = !1, e.resume())
                    }, n
                }, i._fromList = y
            }).call(this, e("_process"))
        }, {
            "./_stream_duplex": 12,
            _process: 10,
            buffer: 2,
            "core-util-is": 17,
            events: 6,
            inherits: 7,
            isarray: 9,
            stream: 22,
            "string_decoder/": 23,
            util: 1
        }],
        15: [function(e, t, r) {
            function n(e, t) {
                this.afterTransform = function(e, r) {
                    return i(t, e, r)
                }, this.needTransform = !1, this.transforming = !1, this.writecb = null, this.writechunk = null
            }

            function i(e, t, r) {
                var n = e._transformState;
                n.transforming = !1;
                var i = n.writecb;
                if (!i) return e.emit("error", new Error("no writecb in Transform class"));
                n.writechunk = null, n.writecb = null, u.isNullOrUndefined(r) || e.push(r), i && i(t);
                var o = e._readableState;
                o.reading = !1, (o.needReadable || o.length < o.highWaterMark) && e._read(o.highWaterMark)
            }

            function o(e) {
                if (!(this instanceof o)) return new o(e);
                a.call(this, e), this._transformState = new n(e, this);
                var t = this;
                this._readableState.needReadable = !0, this._readableState.sync = !1, this.once("prefinish", function() {
                    u.isFunction(this._flush) ? this._flush(function(e) {
                        s(t, e)
                    }) : s(t)
                })
            }

            function s(e, t) {
                if (t) return e.emit("error", t);
                var r = e._writableState,
                    n = e._transformState;
                if (r.length) throw new Error("calling transform done when ws.length != 0");
                if (n.transforming) throw new Error("calling transform done when still transforming");
                return e.push(null)
            }
            t.exports = o;
            var a = e("./_stream_duplex"),
                u = e("core-util-is");
            u.inherits = e("inherits"), u.inherits(o, a), o.prototype.push = function(e, t) {
                return this._transformState.needTransform = !1, a.prototype.push.call(this, e, t)
            }, o.prototype._transform = function(e, t, r) {
                throw new Error("not implemented")
            }, o.prototype._write = function(e, t, r) {
                var n = this._transformState;
                if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
                    var i = this._readableState;
                    (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark)
                }
            }, o.prototype._read = function(e) {
                var t = this._transformState;
                u.isNull(t.writechunk) || !t.writecb || t.transforming ? t.needTransform = !0 : (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform))
            }
        }, {
            "./_stream_duplex": 12,
            "core-util-is": 17,
            inherits: 7
        }],
        16: [function(e, t, r) {
            (function(r) {
                function n(e, t, r) {
                    this.chunk = e, this.encoding = t, this.callback = r
                }

                function i(t, r) {
                    var n = e("./_stream_duplex");
                    t = t || {};
                    var i = t.highWaterMark,
                        o = t.objectMode ? 16 : 16384;
                    this.highWaterMark = i || 0 === i ? i : o, this.objectMode = !!t.objectMode, r instanceof n && (this.objectMode = this.objectMode || !!t.writableObjectMode), this.highWaterMark = ~~this.highWaterMark, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
                    var s = t.decodeStrings === !1;
                    this.decodeStrings = !s, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(e) {
                        d(r, e)
                    }, this.writecb = null, this.writelen = 0, this.buffer = [], this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1
                }

                function o(t) {
                    var r = e("./_stream_duplex");
                    return this instanceof o || this instanceof r ? (this._writableState = new i(t, this), this.writable = !0, void A.call(this)) : new o(t)
                }

                function s(e, t, n) {
                    var i = new Error("write after end");
                    e.emit("error", i), r.nextTick(function() {
                        n(i)
                    })
                }

                function a(e, t, n, i) {
                    var o = !0;
                    if (!(E.isBuffer(n) || E.isString(n) || E.isNullOrUndefined(n) || t.objectMode)) {
                        var s = new TypeError("Invalid non-string/buffer chunk");
                        e.emit("error", s), r.nextTick(function() {
                            i(s)
                        }), o = !1
                    }
                    return o
                }

                function u(e, t, r) {
                    return !e.objectMode && e.decodeStrings !== !1 && E.isString(t) && (t = new m(t, r)), t
                }

                function f(e, t, r, i, o) {
                    r = u(t, r, i), E.isBuffer(r) && (i = "buffer");
                    var s = t.objectMode ? 1 : r.length;
                    t.length += s;
                    var a = t.length < t.highWaterMark;
                    return a || (t.needDrain = !0), t.writing || t.corked ? t.buffer.push(new n(r, i, o)) : h(e, t, !1, s, r, i, o), a
                }

                function h(e, t, r, n, i, o, s) {
                    t.writelen = n, t.writecb = s, t.writing = !0, t.sync = !0, r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1
                }

                function c(e, t, n, i, o) {
                    n ? r.nextTick(function() {
                        t.pendingcb--, o(i)
                    }) : (t.pendingcb--, o(i)), e._writableState.errorEmitted = !0, e.emit("error", i)
                }

                function l(e) {
                    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
                }

                function d(e, t) {
                    var n = e._writableState,
                        i = n.sync,
                        o = n.writecb;
                    if (l(n), t) c(e, n, i, t, o);
                    else {
                        var s = b(e, n);
                        s || n.corked || n.bufferProcessing || !n.buffer.length || w(e, n), i ? r.nextTick(function() {
                            p(e, n, s, o)
                        }) : p(e, n, s, o)
                    }
                }

                function p(e, t, r, n) {
                    r || g(e, t), t.pendingcb--, n(), y(e, t)
                }

                function g(e, t) {
                    0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"))
                }

                function w(e, t) {
                    if (t.bufferProcessing = !0, e._writev && t.buffer.length > 1) {
                        for (var r = [], n = 0; n < t.buffer.length; n++) r.push(t.buffer[n].callback);
                        t.pendingcb++, h(e, t, !0, t.length, t.buffer, "", function(e) {
                            for (var n = 0; n < r.length; n++) t.pendingcb--, r[n](e)
                        }), t.buffer = []
                    } else {
                        for (var n = 0; n < t.buffer.length; n++) {
                            var i = t.buffer[n],
                                o = i.chunk,
                                s = i.encoding,
                                a = i.callback,
                                u = t.objectMode ? 1 : o.length;
                            if (h(e, t, !1, u, o, s, a), t.writing) {
                                n++;
                                break
                            }
                        }
                        n < t.buffer.length ? t.buffer = t.buffer.slice(n) : t.buffer.length = 0
                    }
                    t.bufferProcessing = !1
                }

                function b(e, t) {
                    return t.ending && 0 === t.length && !t.finished && !t.writing
                }

                function v(e, t) {
                    t.prefinished || (t.prefinished = !0, e.emit("prefinish"))
                }

                function y(e, t) {
                    var r = b(e, t);
                    return r && (0 === t.pendingcb ? (v(e, t), t.finished = !0, e.emit("finish")) : v(e, t)), r
                }

                function _(e, t, n) {
                    t.ending = !0, y(e, t), n && (t.finished ? r.nextTick(n) : e.once("finish", n)), t.ended = !0
                }
                t.exports = o;
                var m = e("buffer").Buffer;
                o.WritableState = i;
                var E = e("core-util-is");
                E.inherits = e("inherits");
                var A = e("stream");
                E.inherits(o, A), o.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe. Not readable."))
                }, o.prototype.write = function(e, t, r) {
                    var n = this._writableState,
                        i = !1;
                    return E.isFunction(t) && (r = t, t = null), E.isBuffer(e) ? t = "buffer" : t || (t = n.defaultEncoding), E.isFunction(r) || (r = function() {}), n.ended ? s(this, n, r) : a(this, n, e, r) && (n.pendingcb++, i = f(this, n, e, t, r)), i
                }, o.prototype.cork = function() {
                    var e = this._writableState;
                    e.corked++
                }, o.prototype.uncork = function() {
                    var e = this._writableState;
                    e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.buffer.length || w(this, e))
                }, o.prototype._write = function(e, t, r) {
                    r(new Error("not implemented"))
                }, o.prototype._writev = null, o.prototype.end = function(e, t, r) {
                    var n = this._writableState;
                    E.isFunction(e) ? (r = e, e = null, t = null) : E.isFunction(t) && (r = t, t = null), E.isNullOrUndefined(e) || this.write(e, t), n.corked && (n.corked = 1, this.uncork()), n.ending || n.finished || _(this, n, r)
                }
            }).call(this, e("_process"))
        }, {
            "./_stream_duplex": 12,
            _process: 10,
            buffer: 2,
            "core-util-is": 17,
            inherits: 7,
            stream: 22
        }],
        17: [function(e, t, r) {
            (function(e) {
                function t(e) {
                    return Array.isArray ? Array.isArray(e) : "[object Array]" === w(e)
                }

                function n(e) {
                    return "boolean" == typeof e
                }

                function i(e) {
                    return null === e
                }

                function o(e) {
                    return null == e
                }

                function s(e) {
                    return "number" == typeof e
                }

                function a(e) {
                    return "string" == typeof e
                }

                function u(e) {
                    return "symbol" == typeof e
                }

                function f(e) {
                    return void 0 === e
                }

                function h(e) {
                    return "[object RegExp]" === w(e)
                }

                function c(e) {
                    return "object" == typeof e && null !== e
                }

                function l(e) {
                    return "[object Date]" === w(e)
                }

                function d(e) {
                    return "[object Error]" === w(e) || e instanceof Error
                }

                function p(e) {
                    return "function" == typeof e
                }

                function g(e) {
                    return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
                }

                function w(e) {
                    return Object.prototype.toString.call(e)
                }
                r.isArray = t, r.isBoolean = n, r.isNull = i, r.isNullOrUndefined = o, r.isNumber = s, r.isString = a, r.isSymbol = u, r.isUndefined = f, r.isRegExp = h, r.isObject = c, r.isDate = l, r.isError = d, r.isFunction = p, r.isPrimitive = g, r.isBuffer = e.isBuffer
            }).call(this, {
                isBuffer: e("../../../../insert-module-globals/node_modules/is-buffer/index.js")
            })
        }, {
            "../../../../insert-module-globals/node_modules/is-buffer/index.js": 8
        }],
        18: [function(e, t, r) {
            t.exports = e("./lib/_stream_passthrough.js")
        }, {
            "./lib/_stream_passthrough.js": 13
        }],
        19: [function(e, t, r) {
            (function(n) {
                r = t.exports = e("./lib/_stream_readable.js"), r.Stream = e("stream"), r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js"), n.browser || "disable" !== n.env.READABLE_STREAM || (t.exports = e("stream"))
            }).call(this, e("_process"))
        }, {
            "./lib/_stream_duplex.js": 12,
            "./lib/_stream_passthrough.js": 13,
            "./lib/_stream_readable.js": 14,
            "./lib/_stream_transform.js": 15,
            "./lib/_stream_writable.js": 16,
            _process: 10,
            stream: 22
        }],
        20: [function(e, t, r) {
            t.exports = e("./lib/_stream_transform.js")
        }, {
            "./lib/_stream_transform.js": 15
        }],
        21: [function(e, t, r) {
            t.exports = e("./lib/_stream_writable.js")
        }, {
            "./lib/_stream_writable.js": 16
        }],
        22: [function(e, t, r) {
            function n() {
                i.call(this)
            }
            t.exports = n;
            var i = e("events").EventEmitter,
                o = e("inherits");
            o(n, i), n.Readable = e("readable-stream/readable.js"), n.Writable = e("readable-stream/writable.js"), n.Duplex = e("readable-stream/duplex.js"), n.Transform = e("readable-stream/transform.js"), n.PassThrough = e("readable-stream/passthrough.js"), n.Stream = n, n.prototype.pipe = function(e, t) {
                function r(t) {
                    e.writable && !1 === e.write(t) && f.pause && f.pause()
                }

                function n() {
                    f.readable && f.resume && f.resume()
                }

                function o() {
                    h || (h = !0, e.end())
                }

                function s() {
                    h || (h = !0, "function" == typeof e.destroy && e.destroy())
                }

                function a(e) {
                    if (u(), 0 === i.listenerCount(this, "error")) throw e
                }

                function u() {
                    f.removeListener("data", r), e.removeListener("drain", n), f.removeListener("end", o), f.removeListener("close", s), f.removeListener("error", a), e.removeListener("error", a), f.removeListener("end", u), f.removeListener("close", u), e.removeListener("close", u)
                }
                var f = this;
                f.on("data", r), e.on("drain", n), e._isStdio || t && t.end === !1 || (f.on("end", o), f.on("close", s));
                var h = !1;
                return f.on("error", a), e.on("error", a), f.on("end", u), f.on("close", u), e.on("close", u), e.emit("pipe", f), e
            }
        }, {
            events: 6,
            inherits: 7,
            "readable-stream/duplex.js": 11,
            "readable-stream/passthrough.js": 18,
            "readable-stream/readable.js": 19,
            "readable-stream/transform.js": 20,
            "readable-stream/writable.js": 21
        }],
        23: [function(e, t, r) {
            function n(e) {
                if (e && !u(e)) throw new Error("Unknown encoding: " + e)
            }

            function i(e) {
                return e.toString(this.encoding)
            }

            function o(e) {
                this.charReceived = e.length % 2, this.charLength = this.charReceived ? 2 : 0
            }

            function s(e) {
                this.charReceived = e.length % 3, this.charLength = this.charReceived ? 3 : 0
            }
            var a = e("buffer").Buffer,
                u = a.isEncoding || function(e) {
                    switch (e && e.toLowerCase()) {
                        case "hex":
                        case "utf8":
                        case "utf-8":
                        case "ascii":
                        case "binary":
                        case "base64":
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                        case "raw":
                            return !0;
                        default:
                            return !1
                    }
                },
                f = r.StringDecoder = function(e) {
                    switch (this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, ""), n(e), this.encoding) {
                        case "utf8":
                            this.surrogateSize = 3;
                            break;
                        case "ucs2":
                        case "utf16le":
                            this.surrogateSize = 2, this.detectIncompleteChar = o;
                            break;
                        case "base64":
                            this.surrogateSize = 3, this.detectIncompleteChar = s;
                            break;
                        default:
                            return void(this.write = i)
                    }
                    this.charBuffer = new a(6), this.charReceived = 0, this.charLength = 0
                };
            f.prototype.write = function(e) {
                for (var t = ""; this.charLength;) {
                    var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
                    if (e.copy(this.charBuffer, this.charReceived, 0, r), this.charReceived += r, this.charReceived < this.charLength) return "";
                    e = e.slice(r, e.length), t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                    var n = t.charCodeAt(t.length - 1);
                    if (!(n >= 55296 && n <= 56319)) {
                        if (this.charReceived = this.charLength = 0, 0 === e.length) return t;
                        break
                    }
                    this.charLength += this.surrogateSize, t = ""
                }
                this.detectIncompleteChar(e);
                var i = e.length;
                this.charLength && (e.copy(this.charBuffer, 0, e.length - this.charReceived, i), i -= this.charReceived), t += e.toString(this.encoding, 0, i);
                var i = t.length - 1,
                    n = t.charCodeAt(i);
                if (n >= 55296 && n <= 56319) {
                    var o = this.surrogateSize;
                    return this.charLength += o, this.charReceived += o, this.charBuffer.copy(this.charBuffer, o, 0, o), e.copy(this.charBuffer, 0, 0, o), t.substring(0, i)
                }
                return t
            }, f.prototype.detectIncompleteChar = function(e) {
                for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
                    var r = e[e.length - t];
                    if (1 == t && r >> 5 == 6) {
                        this.charLength = 2;
                        break
                    }
                    if (t <= 2 && r >> 4 == 14) {
                        this.charLength = 3;
                        break
                    }
                    if (t <= 3 && r >> 3 == 30) {
                        this.charLength = 4;
                        break
                    }
                }
                this.charReceived = t
            }, f.prototype.end = function(e) {
                var t = "";
                if (e && e.length && (t = this.write(e)), this.charReceived) {
                    var r = this.charReceived,
                        n = this.charBuffer,
                        i = this.encoding;
                    t += n.slice(0, r).toString(i)
                }
                return t
            }
        }, {
            buffer: 2
        }],
        24: [function(e, t, r) {
            t.exports = e("./lib/index.js")["default"]
        }, {
            "./lib/index.js": 25
        }],
        25: [function(e, t, r) {
            (function(t, n) {
                "use strict";

                function i(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }

                function o(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }

                function s(e, t) {
                    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !t || "object" != typeof t && "function" != typeof t ? e : t
                }

                function a(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
                }
                Object.defineProperty(r, "__esModule", {
                    value: !0
                });
                var u = function() {
                        function e(e, t) {
                            for (var r = 0; r < t.length; r++) {
                                var n = t[r];
                                n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                            }
                        }
                        return function(t, r, n) {
                            return r && e(t.prototype, r), n && e(t, n), t
                        }
                    }(),
                    f = e("audio-context"),
                    h = i(f),
                    c = e("extend"),
                    l = i(c),
                    d = e("stream"),
                    p = function(e) {
                        function r(e) {
                            o(this, r);
                            var n = s(this, (r.__proto__ || Object.getPrototypeOf(r)).call(this, e));
                            e = (0, l["default"])({
                                dataType: b,
                                objectMode: !1,
                                interleaved: !0,
                                channels: 1,
                                bufferSize: 0,
                                audioContext: h["default"]
                            }, e), n._dataType = e.dataType, n._objectMode = e.objectMode, n._interleaved = e.interleaved;
                            var i = n._channels = e.channels,
                                a = e.bufferSize,
                                u = e.audioContext;
                            n._queue = [];
                            var f = u.createScriptProcessor(a, 0, i),
                                c = u.createBufferSource();
                            c.loop = !0;
                            var d, p = !1,
                                g = !1,
                                w = null;
                            return f.addEventListener("audioprocess", function(e) {
                                if (!g)
                                    for (var r = e.outputBuffer, o = 0; o < r.length;) {
                                        if (!w && n._queue.length > 0 && (w = n._queue.shift(), d = 0), !w) {
                                            for (var s = 0; s < i; s++) r.getChannelData(s).fill(0, o);
                                            p && (g = !0, t.nextTick(function() {
                                                return n.emit("close")
                                            }));
                                            break
                                        }
                                        var a = r.length - o,
                                            u = w.length - d,
                                            f = Math.min(a, u);
                                        w.copyTo(r, o, d, f), d += f, o += f, d >= w.length && (w = null)
                                    }
                            }), n._node = f, n.on("finish", function() {
                                p = !0
                            }), n.on("close", function() {
                                f.disconnect()
                            }), n
                        }
                        return a(r, e), u(r, [{
                            key: "connect",
                            value: function() {
                                return this._node.connect.apply(this._node, arguments)
                            }
                        }, {
                            key: "disconnect",
                            value: function() {
                                return this._node.disconnect.apply(this._node, arguments)
                            }
                        }, {
                            key: "_write",
                            value: function(e, t, r) {
                                e = this._objectMode ? e instanceof Float32Array ? new b(this._channels, this._interleaved, e) : e instanceof Int16Array ? new v(this._channels, this._interleaved, e) : new g(e) : new this._dataType(this._channels, this._interleaved, e), this._queue.push(e), r(null)
                            }
                        }]), r
                    }(d.Writable),
                    g = function() {
                        function e(t) {
                            o(this, e), this._it = t
                        }
                        return u(e, [{
                            key: "copyTo",
                            value: function(e, t, r, n) {
                                for (var i = 0; i < this._it.numberOfChannels; i++) {
                                    var o = this._it.getChannelData(i);
                                    e.copyToChannel(o.subarray(r, r + n), i, t)
                                }
                            }
                        }, {
                            key: "length",
                            get: function() {
                                return this._it.length
                            }
                        }]), e
                    }(),
                    w = function() {
                        function e(t, r, n) {
                            o(this, e), this._channels = t, this._interleaved = r, this._it = n
                        }
                        return u(e, [{
                            key: "_get",
                            value: function(e) {
                                return this._it[e]
                            }
                        }, {
                            key: "_bulkCopy",
                            value: function(e, t, r, n) {
                                e.set(this._it.subarray(r, r + n), t)
                            }
                        }, {
                            key: "copyTo",
                            value: function(e, t, r, n) {
                                for (var i = 0; i < this._channels; i++) {
                                    var o = e.getChannelData(i);
                                    if (this._interleaved && this._channels > 1)
                                        for (var s = 0; s < n; s++) {
                                            var a = (r + s) * this._channels + i;
                                            o[t + s] = this._get(a)
                                        } else {
                                            var u = this.length * i + r;
                                            this._bulkCopy(o, t, u, n)
                                        }
                                }
                            }
                        }, {
                            key: "length",
                            get: function() {
                                return this._it.length / this._channels
                            }
                        }]), e
                    }(),
                    b = function(e) {
                        function t(e, r, i) {
                            if (o(this, t), i instanceof n) i = new Float32Array(i.buffer, i.byteOffset, i.byteLength / 4);
                            else if (!(i instanceof Float32Array)) throw new Error("Unsupported buffer type: " + i);
                            return s(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r, i))
                        }
                        return a(t, e), t
                    }(w),
                    v = function(e) {
                        function t(e, r, i) {
                            if (o(this, t), i instanceof n) i = new Int16Array(i.buffer, i.byteOffset, i.byteLength / 2);
                            else if (!(i instanceof Int16Array)) throw new Error("Unsupported buffer type: " + i);
                            return s(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r, i))
                        }
                        return a(t, e), u(t, [{
                            key: "_get",
                            value: function(e) {
                                var t = this._it[e];
                                return t / (32768 - (t > 0 ? 1 : 0))
                            }
                        }, {
                            key: "_bulkCopy",
                            value: function(e, t, r, n) {
                                for (var i = 0; i < n; i++) e[t + i] = this._get(r + i)
                            }
                        }]), t
                    }(w);
                p.AudioBuffer = g, p.Float32Array = b, p.Int16Array = v, r["default"] = p
            }).call(this, e("_process"), e("buffer").Buffer)
        }, {
            _process: 10,
            "audio-context": 26,
            buffer: 2,
            extend: 28,
            stream: 22
        }],
        26: [function(e, t, r) {
            var n = e("global/window"),
                i = n.AudioContext || n.webkitAudioContext;
            i && (t.exports = new i)
        }, {
            "global/window": 27
        }],
        27: [function(e, t, r) {
            (function(e) {
                "undefined" != typeof window ? t.exports = window : "undefined" != typeof e ? t.exports = e : t.exports = {}
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        28: [function(e, t, r) {
            "use strict";
            var n = Object.prototype.hasOwnProperty,
                i = Object.prototype.toString,
                o = function(e) {
                    return "function" == typeof Array.isArray ? Array.isArray(e) : "[object Array]" === i.call(e)
                },
                s = function(e) {
                    if (!e || "[object Object]" !== i.call(e)) return !1;
                    var t = n.call(e, "constructor"),
                        r = e.constructor && e.constructor.prototype && n.call(e.constructor.prototype, "isPrototypeOf");
                    if (e.constructor && !t && !r) return !1;
                    var o;
                    for (o in e);
                    return "undefined" == typeof o || n.call(e, o)
                };
            t.exports = function a() {
                var e, t, r, n, i, u, f = arguments[0],
                    h = 1,
                    c = arguments.length,
                    l = !1;
                for ("boolean" == typeof f ? (l = f, f = arguments[1] || {}, h = 2) : ("object" != typeof f && "function" != typeof f || null == f) && (f = {}); h < c; ++h)
                    if (e = arguments[h], null != e)
                        for (t in e) r = f[t], n = e[t], f !== n && (l && n && (s(n) || (i = o(n))) ? (i ? (i = !1, u = r && o(r) ? r : []) : u = r && s(r) ? r : {}, f[t] = a(l, u, n)) : "undefined" != typeof n && (f[t] = n));
                return f
            }
        }, {}]
    }, {}, [24])(24)
});
