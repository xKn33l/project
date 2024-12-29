"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic imports for Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function Home() {
  // States for weather, city input, and error handling
  const [weather, setWeather] = useState(null);
  const [cityName, setCityName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [weatherError, setWeatherError] = useState("");

  const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Access API key from environment variable

  // Handle weather search
  const fetchWeather = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return {
          name: data.name,
          temp: data.main.temp,
          condition: data.weather[0].main,
          coord: data.coord,
        };
      } else {
        setWeatherError("City not found. Please try again.");
        return null;
      }
    } catch (error) {
      setWeatherError("Error fetching weather data. Please try again.");
      console.error("Error fetching weather data:", error);
      return null;
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    const city = cityName.trim();
    if (city) {
      const weatherData = await fetchWeather(city);
      if (weatherData) {
        setWeather(weatherData);
        setWeatherError("");
      }
    } else {
      setWeatherError("Please enter a city name.");
    }
  };

  // Handle To-Do List operations
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), title: newTodo }]);
      setNewTodo("");
    } else {
      alert("Please enter a task.");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Handle Expense Tracker operations
  const addExpense = () => {
    if (newExpenseTitle.trim() && newExpenseAmount && !isNaN(newExpenseAmount)) {
      setExpenses([...expenses, { id: Date.now(), title: newExpenseTitle, amount: parseFloat(newExpenseAmount) }]);
      setNewExpenseTitle("");
      setNewExpenseAmount("");
    } else {
      alert("Please enter both the title and a valid amount.");
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-black mb-4">TouristSync</h1>

      <div className="flex w-full max-w-6xl">
        {/* Map Section on Left */}
        <div className="flex-1 h-96 mb-6 mr-6">
          <MapContainer center={[51.505, -0.09]} zoom={5} className="h-full w-full rounded-lg">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            {/* Map Marker for weather location */}
            {weather && (
              <Marker position={[weather.coord.lat, weather.coord.lon]}>
                <Popup>
                  {weather.name} <br /> Temperature: {weather.temp}°C <br /> Condition: {weather.condition}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Right Column: Weather Data + To-Do List */}
        <div className="w-1/2 flex flex-col gap-6">
          {/* Weather Data Section */}
          <div className="p-4 bg-white rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold text-black mb-2">Weather Data</h2>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Enter a city name"
              className="border p-2 mb-2 rounded text-black w-full"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full">
              Fetch Weather
            </button>
            {weatherError && <p className="text-red-500">{weatherError}</p>}
            {weather ? (
              <p className="text-black mt-2">
                {weather.name} <br /> Temperature: {weather.temp}°C <br /> Condition: {weather.condition}
              </p>
            ) : (
              <p className="text-gray-500">Enter a city and click 'Fetch Weather'.</p>
            )}
          </div>

          {/* To-Do List Section */}
          <div className="p-4 bg-white rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold text-black mb-2">To-Do List</h2>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
              className="border p-2 w-full mb-2 rounded text-black"
            />
            <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full">
              Add To-Do
            </button>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id} className="flex justify-between items-center text-black">
                  {todo.title}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Expense Tracker Section at the Bottom */}
      <div className="flex flex-col w-full p-4 bg-white rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold text-black mb-2">Expense Tracker</h2>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            value={newExpenseTitle}
            onChange={(e) => setNewExpenseTitle(e.target.value)}
            placeholder="Expense title"
            className="border p-2 rounded text-black w-1/2"
          />
          <input
            type="number"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 rounded text-black w-1/4"
          />
          <button onClick={addExpense} className="bg-blue-500 text-white px-4 py-2 rounded w-1/4">
            Add Expense
          </button>
        </div>
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id} className="flex justify-between items-center text-black">
              <span>{expense.title}: ${expense.amount.toFixed(2)}</span>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 font-bold text-black">
          <p>Total Expenses: ${totalExpenses}</p>
        </div>
      </div>
    </div>
  );
}
