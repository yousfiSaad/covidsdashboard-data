"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateWorldData = exports.aggregateAndAvg = exports.avgByWeek = exports.groupVaccinationDataByCountryAndParseDate = exports.groupByCountry = exports.aggregate = exports.parseYYYYMMDD = exports.cleanAndAddNewCases2 = exports.mapCountriesNames = void 0;
const moment_1 = __importDefault(require("moment"));
const ramda_1 = require("ramda");
exports.mapCountriesNames = (0, ramda_1.cond)([
    [(0, ramda_1.equals)("US"), (0, ramda_1.always)("United States")],
    [ramda_1.T, ramda_1.identity],
]);
exports.cleanAndAddNewCases2 = (0, ramda_1.pipe)((0, ramda_1.nth)(0), ramda_1.toPairs, (0, ramda_1.reject)(([key, _val]) => ["Province/State", "Country/Region", "Lat", "Long"].includes(key)), (0, ramda_1.map)(([key, val]) => ({
    date: new Date(key),
    dateAsStr: key,
    cases: parseInt(val),
})), (0, ramda_1.scan)((acc, curr) => (Object.assign(Object.assign({}, curr), { newCases: curr.cases - acc.cases })), { cases: 0 }), (0, ramda_1.reject)(({ newCases }) => isNaN(newCases) || newCases < 0));
const parseYYYYMMDD = (str) => {
    const [year, month, day] = str.split("-");
    return new Date(parseInt(year) || 0, (parseInt(month) || 0) - 1, parseInt(day) || 0);
};
exports.parseYYYYMMDD = parseYYYYMMDD;
exports.aggregate = (0, ramda_1.pipe)(ramda_1.flatten, (0, ramda_1.groupBy)((0, ramda_1.propOr)(null, "date")), ramda_1.toPairs, (0, ramda_1.map)(([, datums]) => datums.reduce((a, b) => (Object.assign(Object.assign({}, b), { cases: a.cases + b.cases, newCases: a.newCases + b.newCases })), { cases: 0, newCases: 0 })), (0, ramda_1.sortBy)((0, ramda_1.prop)("date")));
exports.groupByCountry = (0, ramda_1.pipe)((0, ramda_1.groupBy)((0, ramda_1.propOr)("", "Country/Region")), (0, ramda_1.map)((0, ramda_1.groupBy)((0, ramda_1.propOr)("", "Province/State"))), (0, ramda_1.map)((0, ramda_1.map)(exports.cleanAndAddNewCases2)), (0, ramda_1.map)((0, ramda_1.propOr)([], "")), (0, ramda_1.map)(exports.aggregate));
exports.groupVaccinationDataByCountryAndParseDate = (0, ramda_1.pipe)((0, ramda_1.groupBy)((0, ramda_1.propOr)("", "country")), (0, ramda_1.map)((0, ramda_1.pipe)((0, ramda_1.nth)(0), (0, ramda_1.propOr)([], "data"), (0, ramda_1.map)((d) => (Object.assign(Object.assign({}, d), { dateAsStr: d.date, date: (0, exports.parseYYYYMMDD)(d.date) }))))));
const avgByGetter = (getter) => (data) => data.reduce((acc, cur) => acc + getter(cur), 0) /
    data.length;
// TODO: create another lite worker without momentjs
const avgByWeek = (data, propName = "newCases") => {
    const getter = (0, ramda_1.prop)(propName);
    const groupedByWeek = (0, ramda_1.groupBy)((d) => {
        const dateWrapped = (0, moment_1.default)(d.date);
        const str = dateWrapped.format("YYYY-ww");
        return str;
    }, data);
    const avFunc = avgByGetter(getter);
    const averaged = (0, ramda_1.map)(avFunc, groupedByWeek);
    const weekData = (0, ramda_1.pipe)(ramda_1.toPairs, (0, ramda_1.map)(([weekAsStr, weekDatum]) => {
        return {
            date: (0, moment_1.default)(weekAsStr + "-3", "YYYY-ww-d").toDate(),
            [propName]: weekDatum,
        };
    }), (0, ramda_1.sortBy)((0, ramda_1.prop)("date")))(averaged);
    const lastDatum = (0, ramda_1.last)(weekData);
    if (lastDatum && lastDatum.date > new Date(2018, 10, 1)) {
        lastDatum.date = new Date();
    }
    // TODO: bad fix
    return weekData.slice(1);
};
exports.avgByWeek = avgByWeek;
const aggregateAndAvg = (data) => {
    const agg = (0, exports.aggregate)(data);
    const avg = (0, exports.avgByWeek)(agg);
    return {
        agg,
        avg
    };
};
exports.aggregateAndAvg = aggregateAndAvg;
exports.aggregateWorldData = (0, ramda_1.pipe)(ramda_1.values, (0, ramda_1.map)(ramda_1.values), ramda_1.flatten, exports.avgByWeek);
