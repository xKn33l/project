export async function POST(req) {
    const { city } = await req.json();
  
    const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Access your API key from .env
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url); // Use native fetch (no need for 'node-fetch')
  
      if (response.ok) {
        const data = await response.json();
        return new Response(
          JSON.stringify({
            name: data.name,
            temp: data.main.temp,
            condition: data.weather[0].main,
            coord: data.coord
          }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "City not found" }),
          { status: 404 }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Error fetching weather data" }),
        { status: 500 }
      );
    }
  }
  