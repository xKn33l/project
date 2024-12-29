import fetch from 'node-fetch';

export async function POST(req) {
  const { city } = await req.json();

  if (!city) {
    return new Response(JSON.stringify({ error: 'City name is required' }), { status: 400 });
  }

  try {
    const apiKey = process.env.WEATHER_API; // Ensure you have the weather API key in your .env file
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Error fetching weather data' }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data));
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
