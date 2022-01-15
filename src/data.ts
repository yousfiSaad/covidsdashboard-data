
import { csv, json } from "d3";
import { map, pipe, propOr, uniq } from "ramda";
import { aggregateWorldData, groupByCountry, groupVaccinationDataByCountryAndParseDate } from "./functions";

if (typeof fetch !== 'function') {
  global.fetch = require('node-fetch-polyfill');
}

const DATA_URL_CONFIRMED =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

const DATA_URL_DEATHS =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

const DATA_URL_VACCINATIONS =
  "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.json";


export const getallcountries = async () => {
  const data = await getCsvConfirmedData();
  const countries: string[] = pipe<any, any, any>(
    map(propOr("", "Country/Region")),
    uniq
  )(data);

  return countries;
}

export const getCsvDeathsData = async () => {
  const csvData = await csv(DATA_URL_DEATHS);
  return csvData;
}

export const getCsvConfirmedData = async () => {
  const csvData = await csv(DATA_URL_CONFIRMED);
  return csvData;
}

export const getVaccinationData = async () => {
  const vaccinationData = await json(DATA_URL_VACCINATIONS);
  return vaccinationData;
}

export const getGroupedConfirmed = async () => {
  const confirmed = await getCsvConfirmedData();
  const groupedConfirmed = groupByCountry(confirmed);
  return groupedConfirmed;
}

export const getGroupedDeaths = async () => {
  const deaths = await getCsvDeathsData();
  const groupedDeaths = groupByCountry(deaths);
  return groupedDeaths;
}

export async function getWeekly() {
  const groupedConfirmed = await getGroupedConfirmed();
  const groupedDeaths = await getGroupedDeaths();
  const aggConfirmed = aggregateWorldData(groupedConfirmed);
  const aggDeaths = aggregateWorldData(groupedDeaths);
  return {
    weeklyConfirmed: aggConfirmed,
    weeklyDeaths: aggDeaths
  };
}
export async function getGroupedVaccination() {
  const vaccinated = await getVaccinationData();
  const groupedVaccinated = groupVaccinationDataByCountryAndParseDate(vaccinated);
  return groupedVaccinated;
}
