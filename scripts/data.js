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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupedVaccination = exports.getWeekly = exports.getGroupedDeaths = exports.getGroupedConfirmed = exports.getVaccinationData = exports.getCsvConfirmedData = exports.getCsvDeathsData = exports.getallcountries = void 0;
const d3_1 = require("d3");
const ramda_1 = require("ramda");
const functions_1 = require("./functions");
if (typeof fetch !== 'function') {
    global.fetch = require('node-fetch-polyfill');
}
const DATA_URL_CONFIRMED = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const DATA_URL_DEATHS = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
const DATA_URL_VACCINATIONS = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.json";
const getallcountries = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, exports.getCsvConfirmedData)();
    const countries = (0, ramda_1.pipe)((0, ramda_1.map)((0, ramda_1.propOr)("", "Country/Region")), ramda_1.uniq)(data);
    return countries;
});
exports.getallcountries = getallcountries;
const getCsvDeathsData = () => __awaiter(void 0, void 0, void 0, function* () {
    const csvData = yield (0, d3_1.csv)(DATA_URL_DEATHS);
    return csvData;
});
exports.getCsvDeathsData = getCsvDeathsData;
const getCsvConfirmedData = () => __awaiter(void 0, void 0, void 0, function* () {
    const csvData = yield (0, d3_1.csv)(DATA_URL_CONFIRMED);
    return csvData;
});
exports.getCsvConfirmedData = getCsvConfirmedData;
const getVaccinationData = () => __awaiter(void 0, void 0, void 0, function* () {
    const vaccinationData = yield (0, d3_1.json)(DATA_URL_VACCINATIONS);
    return vaccinationData;
});
exports.getVaccinationData = getVaccinationData;
const getGroupedConfirmed = () => __awaiter(void 0, void 0, void 0, function* () {
    const confirmed = yield (0, exports.getCsvConfirmedData)();
    const groupedConfirmed = (0, functions_1.groupByCountry)(confirmed);
    return groupedConfirmed;
});
exports.getGroupedConfirmed = getGroupedConfirmed;
const getGroupedDeaths = () => __awaiter(void 0, void 0, void 0, function* () {
    const deaths = yield (0, exports.getCsvDeathsData)();
    const groupedDeaths = (0, functions_1.groupByCountry)(deaths);
    return groupedDeaths;
});
exports.getGroupedDeaths = getGroupedDeaths;
function getWeekly() {
    return __awaiter(this, void 0, void 0, function* () {
        const groupedConfirmed = yield (0, exports.getGroupedConfirmed)();
        const groupedDeaths = yield (0, exports.getGroupedDeaths)();
        const aggConfirmed = (0, functions_1.aggregateWorldData)(groupedConfirmed);
        const aggDeaths = (0, functions_1.aggregateWorldData)(groupedDeaths);
        return {
            weeklyConfirmed: aggConfirmed,
            weeklyDeaths: aggDeaths
        };
    });
}
exports.getWeekly = getWeekly;
function getGroupedVaccination() {
    return __awaiter(this, void 0, void 0, function* () {
        const vaccinated = yield (0, exports.getVaccinationData)();
        const groupedVaccinated = (0, functions_1.groupVaccinationDataByCountryAndParseDate)(vaccinated);
        return groupedVaccinated;
    });
}
exports.getGroupedVaccination = getGroupedVaccination;
