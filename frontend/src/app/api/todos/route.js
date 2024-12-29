// app/api/todos/route.js

let todos = []; // In-memory todos store, replace with database if needed

export async function GET() {
  return new Response(JSON.stringify(todos), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const { task } = await request.json();
  const newTodo = { id: Date.now(), task };
  todos.push(newTodo);
  return new Response(JSON.stringify(newTodo), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request) {
  const { id } = await request.json();
  todos = todos.filter((todo) => todo.id !== id);
  return new Response(null, { status: 204 });
}
