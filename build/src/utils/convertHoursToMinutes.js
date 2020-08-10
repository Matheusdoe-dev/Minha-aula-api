"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertHoursToMinutes(time) {
    const x = time.split(":");
    const y = Number(x[0]) * 60 + Number(x[1]);
    return y;
}
exports.default = convertHoursToMinutes;
