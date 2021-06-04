import axios from 'axios';
import { END_POINTS } from '../constantURL';

// Get weather API
export const getCovidData = async () => {
  const URL = `${END_POINTS.GET_COVID_DATA}`;
  const response = await axios.get(URL);
  let data = response.data;
  if (!data) {
    return "Some issue in fetching data! Please try again later.";
  }
  console.log(data);
  const global = { ...data.Global };
  const report = `New Confirmed: ${global.NewConfirmed}, New Deaths: ${global.NewDeaths}, New Recovered: ${global.NewRecovered}, Total Confirmed: ${global.TotalConfirmed}: TotalRecovered: ${global.TotalRecovered}`;
  return report;
};
