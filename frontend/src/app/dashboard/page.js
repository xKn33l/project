"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/dashboard"); // Adjust API endpoint
        const data = await response.json();

        if (response.ok) {
          setUserData(data); // Save user data
        } else {
          setError(data.message || "Failed to fetch dashboard data.");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!userData) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-700">Welcome, {userData.name}!</h1>
        <p className="text-gray-600">Email: {userData.email}</p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Your Tasks</h2>
          <ul className="mt-2 space-y-2">
            {userData.tasks.map((task) => (
              <li
                key={task.id}
                className="p-4 bg-gray-100 border rounded-md shadow-sm"
              >
                <p className="text-gray-800">{task.taskname}</p>
                <p className="text-gray-500 text-sm">{task.date}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Your Expenses</h2>
          <ul className="mt-2 space-y-2">
            {userData.expenses.map((expense) => (
              <li
                key={expense.id}
                className="p-4 bg-gray-100 border rounded-md shadow-sm"
              >
                <p className="text-gray-800 font-bold">{expense.name}</p>
                <p className="text-gray-600">{expense.description}</p>
                <p className="text-gray-500 text-sm">$ {expense.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
