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

/**
 * 
 * @param {Country code} country 
 * @param {Number of headlines} numberOfHeadlines 
 * @returns 
 */
export const getNews = async (country = 'fr', numberOfHeadlines) => {
  const apiKey = '32f29fe1a6f24548b39acb37fa51c420';
  const URL = `${END_POINTS.GET_NEWS}?country=${country}&apiKey=${apiKey}`;
  const response = await axios.get(URL);
  const data = response.data;
  let articles = data.articles;
  // Keeping the required only
  articles.length = numberOfHeadlines;
  const headlines = articles.map((article, i) => (`  (${i + 1}.) ${article.title}  `));
  return headlines;
};
