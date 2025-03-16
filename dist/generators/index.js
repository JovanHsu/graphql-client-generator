"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptGenerator = exports.JavaScriptGenerator = exports.BaseGenerator = void 0;
var base_generator_1 = require("./base-generator");
Object.defineProperty(exports, "BaseGenerator", { enumerable: true, get: function () { return base_generator_1.BaseGenerator; } });
var javascript_generator_1 = require("./javascript-generator");
Object.defineProperty(exports, "JavaScriptGenerator", { enumerable: true, get: function () { return javascript_generator_1.JavaScriptGenerator; } });
var TypeScriptGenerator_1 = require("./typescript/TypeScriptGenerator");
Object.defineProperty(exports, "TypeScriptGenerator", { enumerable: true, get: function () { return TypeScriptGenerator_1.TypeScriptGenerator; } });
