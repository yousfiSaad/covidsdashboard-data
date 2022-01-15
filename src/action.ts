
import { getallcountries, getGroupedConfirmed, getGroupedDeaths, getGroupedVaccination, getWeekly } from './data';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const stringify = (obj: any) => JSON.stringify(obj, null, 4);

async function run() {
  const weeklyWorldData = await getWeekly();
  const countriesList = await getallcountries();
  const groupedDeaths = await getGroupedDeaths();
  const groupedConfirmed = await getGroupedConfirmed();
  const groupedVaccination = await getGroupedVaccination();

  await writeFile(
    'data/weekly-world-data.json',
    stringify(weeklyWorldData)
  );
  await writeFile(
    'data/countries-list.json',
    stringify(countriesList)
  );
  await writeFile(
    'data/grouped-deaths.json',
    stringify(groupedDeaths)
  );
  await writeFile(
    'data/grouped-confirmed.json',
    stringify(groupedConfirmed)
  );
  await writeFile(
    'data/grouped-vaccination.json',
    stringify(groupedVaccination)
  );

  await saveAsSeparatedFiles(countriesList, 'grouped-deaths', groupedDeaths);
  await saveAsSeparatedFiles(countriesList, 'grouped-confirmed', groupedConfirmed);
  await saveAsSeparatedFiles(countriesList, 'grouped-vaccination', groupedVaccination);
}


run();

async function saveAsSeparatedFiles(countriesList: string[], folderName: string, object: any) {
  const folderPath = `data/${folderName}`;
  const folderExits = existsSync(folderPath);
  if (!folderExits) {
    await mkdir(folderPath);
  }
  const promises = countriesList.map(async country => {
    const countryData = object[country] || [];
    return await writeFile(
      `${folderPath}/${country}.json`,
      stringify(countryData)
    );
  });
  await Promise.all(promises);
}



