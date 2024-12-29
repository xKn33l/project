"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const useMapEvents = dynamic(() => import("react-leaflet").then((mod) => mod.useMapEvents), { ssr: false });

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));

    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  const fetchWeatherData = () => {
    if (!city) return;
    fetch("/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city }),
    })
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Error fetching weather data:", err));
  };

  const addTodo = () => {
    fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task }),
    })
      .then((res) => res.json())
      .then((newTodo) => setTodos([...todos, newTodo]));
    setTask("");
  };

  const deleteTodo = (id) => {
    fetch(`/api/todos/${id}`, { method: "DELETE" })
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  };

  const addExpense = () => {
    fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: expenseTitle, amount: parseFloat(expenseAmount) }),
    })
      .then((res) => res.json())
      .then((newExpense) => setExpenses([...expenses, newExpense]));

    setExpenseTitle("");
    setExpenseAmount("");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-black mb-4">TouristSync</h1>

      <div className="flex w-full max-w-6xl gap-6">
        <div className="w-1/2">
          <MapContainer center={[51.505, -0.09]} zoom={5} className="h-96 w-full rounded-lg">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <useMapEvents
              onClick={(e) => {
                const { lat, lng } = e.latlng;
                fetch("/api/weather", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ lat, lon: lng }),
                })
                  .then((res) => res.json())
                  .then((data) => setWeather(data))
                  .catch((err) => console.error("Error fetching weather data:", err));
              }}
            />
            {weather && (
              <Marker position={[weather.coord.lat, weather.coord.lon]}>
                <Popup>
                  {weather.name} <br /> Temperature: {weather.main.temp}°C <br /> Weather: {weather.weather[0].description}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div className="w-1/2 space-y-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-black">Weather Data</h2>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="border p-2 flex-grow rounded text-black"
              />
              <button onClick={fetchWeatherData} className="bg-blue-500 text-white px-4 py-2 rounded">Fetch Weather</button>
            </div>
            {weather ? (
              <p className="text-black mt-2">
                {weather.name} <br /> Temperature: {weather.main.temp}°C <br /> Longitude: {weather.coord.lon}, Latitude: {weather.coord.lat}
              </p>
            ) : (
              <p className="text-gray-500">Enter a city name and click "Fetch Weather" to see the data.</p>
            )}
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-black">To-Do List</h2>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task"
                className="border p-2 flex-grow rounded text-black"
              />
              <button onClick={addTodo} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            </div>
            <ul className="mt-4 space-y-2">
              {todos.map((todo) => (
                <li key={todo.id} className="flex justify-between items-center text-black">
                  {todo.task}
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-500">Delete</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-black">Expenses</h2>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="Expense Title"
                className="border p-2 flex-grow rounded text-black"
              />
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="Amount"
                className="border p-2 w-24 rounded text-black"
              />
              <button onClick={addExpense} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            </div>
            <ul className="mt-4 space-y-2">
              {expenses.map((expense) => (
                <li key={expense.id} className="flex justify-between items-center text-black">
                  {expense.title}: ${expense.amount ? expense.amount.toFixed(2) : '0.00'}
                </li>
              ))}
            </ul>
            <p className="text-black mt-4 font-bold">Total Expenses: ${totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
