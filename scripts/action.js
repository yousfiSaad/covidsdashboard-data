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
const data_1 = require("./data");
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const functions_1 = require("./functions");
const ramda_1 = require("ramda");
const stringify = (obj) => JSON.stringify(obj, null, 4);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const weeklyWorldData = yield (0, data_1.getWeekly)();
        const countriesList = yield (0, data_1.getallcountries)();
        const groupedDeaths = yield (0, data_1.getGroupedDeaths)();
        const groupedConfirmed = yield (0, data_1.getGroupedConfirmed)();
        const groupedVaccination = yield (0, data_1.getGroupedVaccination)();
        const groupedWeekAvgDeaths = (0, ramda_1.map)(functions_1.avgByWeek)(groupedDeaths);
        const groupedWeekAvgConfirmed = (0, ramda_1.map)(functions_1.avgByWeek)(groupedConfirmed);
        yield (0, promises_1.writeFile)('data/weekly-world-data.json', stringify(weeklyWorldData));
        yield (0, promises_1.writeFile)('data/countries-list.json', stringify(countriesList));
        yield (0, promises_1.writeFile)('data/grouped-deaths.json', stringify(groupedDeaths));
        yield (0, promises_1.writeFile)('data/grouped-confirmed.json', stringify(groupedConfirmed));
        yield (0, promises_1.writeFile)('data/grouped-vaccination.json', stringify(groupedVaccination));
        yield saveAsSeparatedFiles(countriesList, 'grouped-deaths', groupedDeaths);
        yield saveAsSeparatedFiles(countriesList, 'grouped-confirmed', groupedConfirmed);
        yield saveAsSeparatedFiles(countriesList, 'grouped-vaccination', groupedVaccination, functions_1.mapCountriesNames);
        yield saveAsSeparatedFiles(countriesList, 'grouped-week-avg-deaths', groupedWeekAvgDeaths);
        yield saveAsSeparatedFiles(countriesList, 'grouped-week-avg-confirmed', groupedWeekAvgConfirmed);
    });
}
run();
function saveAsSeparatedFiles(countriesList, folderName, object, nameMapper) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = `data/${folderName}`;
        const folderExits = (0, fs_1.existsSync)(folderPath);
        if (!folderExits) {
            yield (0, promises_1.mkdir)(folderPath);
        }
        const promises = countriesList.map(country => {
            const countryName = nameMapper ? nameMapper(country) : country;
            const countryData = object[countryName] || [];
            return (0, promises_1.writeFile)(`${folderPath}/${country}.json`, stringify(countryData));
        });
        yield Promise.all(promises);
    });
}
