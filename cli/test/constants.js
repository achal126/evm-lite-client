"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Session_1 = require("../src/classes/Session");
exports.datadir = path.join(__dirname, './assets');
exports.session = new Session_1.default(exports.datadir);
exports.pwdPath = path.join(exports.datadir, 'pwd.txt');
exports.password = fs.readFileSync(exports.pwdPath, 'utf8');
exports.otherPwdPath = path.join(exports.datadir, 'other_pwd.txt');
exports.otherPassword = fs.readFileSync(exports.pwdPath, 'utf8');