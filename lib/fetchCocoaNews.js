const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const API_KEY = '8ab707cab3bd4f4e965b852f06e81832';

async function fetchCocoaNews() {
  const response = await fetch(
    `${NEWS_API_URL}?q=cocoa&from=2025-08-20&sortBy=popularity&language=en&pageSize=10&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data.articles;
}
fetchCocoaNews
