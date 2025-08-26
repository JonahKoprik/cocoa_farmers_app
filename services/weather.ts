export async function fetchWeather(lat: number, lon: number) {
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${lat},${lon}`);
  if (!response.ok) throw new Error('Weather fetch failed');
  return response.json();
}
