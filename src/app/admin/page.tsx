"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: string;
  name: string;
};

type Slot = {
  id: string;
  startsAt: string;
  endsAt: string;
  isOpen: boolean;
};

export default function AdminPage() {
  // ---------------- STATE ----------------
  const [users, setUsers] = useState<User[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);

  const [userName, setUserName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [loading, setLoading] = useState(false);

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    }
  };

  // ---------------- FETCH SLOTS ----------------
  const fetchSlots = async () => {
    try {
      const res = await axios.get("/api/slots");
      setSlots(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSlots([]);
    }
  };

  // ---------------- INIT LOAD ----------------
  useEffect(() => {
    fetchUsers();
    fetchSlots();
  }, []);

  // ---------------- CREATE USER ----------------
  const createUser = async () => {
    if (!userName.trim()) return;

    try {
      setLoading(true);

      await axios.post("/api/users/create", {
        name: userName,
      });

      setUserName("");
      await fetchUsers();
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CREATE SLOT ----------------
  const createSlot = async () => {
    if (!start || !end) return;

    try {
      setLoading(true);

      await axios.post("/api/slots/create", {
        startsAt: start,
        endsAt: end,
      });

      setStart("");
      setEnd("");
      await fetchSlots();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        Admin Panel
      </h1>

      {/* ---------------- CREATE USER ---------------- */}
      <div className="rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold">Create User</h2>

        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter user name"
          className="w-full rounded border p-2"
        />

        <button
          onClick={createUser}
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add User
        </button>
      </div>

      {/* ---------------- CREATE SLOT ---------------- */}
      <div className="rounded-xl border p-4 space-y-3">
        <h2 className="font-semibold">Create Slot</h2>

        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full rounded border p-2"
        />

        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full rounded border p-2"
        />

        <button
          onClick={createSlot}
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Slot
        </button>
      </div>

      {/* ---------------- USERS LIST ---------------- */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">
          Users ({users.length})
        </h2>

        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="rounded border p-2 text-sm"
            >
              {u.name} — {u.id}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- SLOTS LIST ---------------- */}
      <div className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">
          Slots ({slots.length})
        </h2>

        <div className="space-y-2">
          {slots.map((s) => (
            <div
              key={s.id}
              className="rounded border p-2 text-sm"
            >
              <div>
                {new Date(s.startsAt).toLocaleString()} →{" "}
                {new Date(s.endsAt).toLocaleString()}
              </div>

              <div
                className={
                  s.isOpen
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {s.isOpen ? "Open" : "Booked"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}