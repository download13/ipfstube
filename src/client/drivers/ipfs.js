"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIPFSDriver = void 0;
var xstream_1 = __importDefault(require("xstream"));
var ipfs_1 = __importDefault(require("ipfs"));
var buffer_1 = require("buffer");
var adapt_1 = require("@cycle/run/lib/adapt");
function makeIPFSDriver(repo) {
    return __awaiter(this, void 0, void 0, function () {
        function ipfsDriver(req$) {
            var _this = this;
            var event$ = req$
                .map(function (req) { return __awaiter(_this, void 0, void 0, function () {
                var file, buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(req.kind === 'add')) return [3 /*break*/, 2];
                            return [4 /*yield*/, ipfs.add(req.data)];
                        case 1:
                            file = _a.sent();
                            return [2 /*return*/, {
                                    kind: 'addRes',
                                    path: file.cid
                                }];
                        case 2:
                            if (!(req.kind === 'cat')) return [3 /*break*/, 4];
                            return [4 /*yield*/, collectBuffer(ipfs.cat(req.path))];
                        case 3:
                            buffer = _a.sent();
                            console.log('cat res len', buffer.length);
                            return [2 /*return*/, {
                                    kind: 'catRes',
                                    content: buffer
                                }];
                        case 4:
                            if (!(req.kind === 'pin')) return [3 /*break*/, 8];
                            if (!req.pin) return [3 /*break*/, 6];
                            return [4 /*yield*/, ipfs.pin.add(req.path)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, ipfs.pin.rm(req.path)];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [2 /*return*/];
                    }
                });
            }); })
                .map(xstream_1.default.fromPromise)
                .flatten()
                .filter(isIPFSEvent);
            return {
                select: function (category) {
                    return adapt_1.adapt(event$.filter(function (evt) { return evt.category === category; }));
                },
                events: adapt_1.adapt(event$)
            };
        }
        var ipfs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ipfs_1.default.create({ repo: repo })];
                case 1:
                    ipfs = _a.sent();
                    Object.defineProperty(window, 'ipfsNode', { value: ipfs });
                    return [2 /*return*/, ipfsDriver];
            }
        });
    });
}
exports.makeIPFSDriver = makeIPFSDriver;
function collectBuffer(bufferIter) {
    var bufferIter_1, bufferIter_1_1;
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var a, b, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    a = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    bufferIter_1 = __asyncValues(bufferIter);
                    _b.label = 2;
                case 2: return [4 /*yield*/, bufferIter_1.next()];
                case 3:
                    if (!(bufferIter_1_1 = _b.sent(), !bufferIter_1_1.done)) return [3 /*break*/, 5];
                    b = bufferIter_1_1.value;
                    a.push(b);
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(bufferIter_1_1 && !bufferIter_1_1.done && (_a = bufferIter_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(bufferIter_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, buffer_1.Buffer.concat(a)];
            }
        });
    });
}
function isIPFSEvent(a) {
    return a !== undefined;
}
