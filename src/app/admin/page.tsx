"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { GrHomeRounded } from "react-icons/gr";
import Link from "next/link";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";

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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-6xl space-y-10">

        {/* HEADER */}
        <div className=" md:flex justify-between gap-2 px-3">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-purple-400"
          >
            Admin Dashboard
          </motion.h1>

          <div className=" flex gap-3 justify-center items-center ">

            <Link href='/bookings-information'

              className="text-3xl font-bold text-purple-400 cursor-pointer"
            >
              <FaBookmark />
            </Link>
            <Link href='/'

              className="text-3xl font-bold text-purple-400 cursor-pointer"
            >
              <GrHomeRounded />
            </Link>

          </div>


        </div>

        {/* GRID 1: USER */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* CREATE USER */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-xl border border-purple-600 bg-zinc-900 p-5 space-y-4 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-purple-300">
              Create User
            </h2>

            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user name"
              className="w-full rounded bg-black border border-purple-500 p-2 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={createUser}
              disabled={loading}
              className="w-full rounded cursor-pointer bg-purple-800 hover:bg-purple-700 transition px-4 py-2 font-medium"
            >
              Add User
            </button>
          </motion.div>

          {/* USERS LIST */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-xl border border-purple-600 bg-zinc-900 p-5"
          >
            <h2 className="text-lg font-semibold text-purple-300 mb-3">
              Users ({users.length})
            </h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex justify-between rounded bg-black border border-zinc-700 p-2 text-sm hover:border-purple-500 transition"
                >
                  <span>{u.name}</span>
                  <span className="text-gray-400">{u.id}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* GRID 2: SLOT */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* CREATE SLOT */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-xl border border-purple-600 bg-zinc-900 p-5 space-y-3"
          >
            <h2 className="text-lg font-semibold text-purple-300">
              Create Slot
            </h2>

            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded bg-white text-black cursor-pointer font-bold border border-purple-500 p-2"
            />

            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded bg-white text-black cursor-pointer font-bold border border-purple-500 p-2"
            />

            <button
              onClick={createSlot}
              disabled={loading}
              className="w-full rounded cursor-pointer bg-purple-800 hover:bg-purple-700 transition px-4 py-2"
            >
              Add Slot
            </button>
          </motion.div>

          {/* SLOTS LIST */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-xl border border-purple-600 bg-zinc-900 p-5"
          >
            <h2 className="text-lg font-semibold text-purple-300 mb-3">
              Slots ({slots.length})
            </h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {slots.map((s) => (
                <div
                  key={s.id}
                  className="rounded border border-zinc-700 bg-black p-3 text-sm hover:border-purple-500 transition"
                >
                  <div className="text-gray-200">
                    {new Date(s.startsAt).toLocaleString()} →{" "}
                    {new Date(s.endsAt).toLocaleString()}
                  </div>

                  <div
                    className={`mt-1 font-medium ${s.isOpen ? "text-green-400" : "text-red-400"
                      }`}
                  >
                    {s.isOpen ? "Open" : "Booked"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
