"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  const [todos, setTodos] = useState<{ id: string | number; name: string }[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("todos")
      .select()
      .then(({ data, error }) => {
        if (!error && data) {
          setTodos(data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
        {loading ? (
          <p className="text-sm text-gray-500">Loading todos...</p>
        ) : todos && todos.length > 0 ? (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                {todo.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            Connected to Supabase! No rows found in <code>todos</code> table yet.
          </p>
        )}
      </div>
    </div>
  );
}
