const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function fetch_Weather(city: string): Promise<Response> {
  return await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
}