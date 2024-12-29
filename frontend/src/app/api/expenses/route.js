// app/api/expenses/route.js

let expenses = []; // In-memory expenses store, replace with database if needed

export async function GET() {
  return new Response(JSON.stringify(expenses), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const { title, amount } = await request.json();
  const newExpense = { id: Date.now(), title, amount };
  expenses.push(newExpense);
  return new Response(JSON.stringify(newExpense), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
