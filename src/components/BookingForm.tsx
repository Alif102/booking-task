"use client";

import { useEffect, useState } from "react";

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

export default function BookingForm() {
  const [slots, setSlots] = useState<Slot[]>([]);


  const [selectedUser, setSelectedUser] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ---------------- FETCH USERS ----------------
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (!Array.isArray(data)) {
        setUsers([]);
        return;
      }

      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  }; useEffect(() => {
    fetchUsers();
    fetchSlots();
  }, []);

  // ---------------- FETCH SLOTS ----------------
  const fetchSlots = async () => {
    try {
      setLoadingSlots(true);

      const res = await fetch("/api/slots");
      const data = await res.json();

      if (!Array.isArray(data)) {
        setSlots([]);
        return;
      }

      setSlots(data);
    } catch (err) {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSlots();
  }, []);

  // ---------------- BOOK SLOT ----------------
  const bookSlot = async (slotId: string) => {
    setSuccess("");
    setError("");

    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    try {
      setBookingId(slotId);

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotId,
          userId: selectedUser,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setSuccess("Booking successful ✅");

      // refresh slots after booking
      await fetchSlots();
    } catch (err: any) {
      setError(err.message || "Something went wrong");

      await fetchSlots();
    } finally {
      setBookingId(null);
    }
  };

  // ---------------- FORMAT TIME ----------------
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div  className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black px-4 py-8 text-white ">
      <div className="mx-auto max-w-2xl space-y-6 ">

        {/* HEADER */}
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-purple-300">
            Book a Session
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Select a user and book an available slot
          </p>
        </div>

        {/* USER SELECT */}
        <div className="rounded-2xl border border-purple-800/40 bg-black/40 backdrop-blur-md p-5 shadow-lg hover:shadow-purple-900/30 transition">
          <label className="text-sm font-medium text-purple-200">
            Select User
          </label>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mt-2 w-full rounded-xl border border-purple-700 bg-black/60 p-3 text-white outline-none focus:border-purple-400 transition cursor-pointer"
          >
            <option value="">Select user</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="rounded-xl border border-green-500/30 bg-green-900/20 p-3 text-green-300 animate-fade-in">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-3 text-red-300 animate-fade-in">
            {error}
          </div>
        )}

        {/* SLOTS */}
        <div className="space-y-4 ">

  {loadingSlots ? (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-2xl bg-purple-900/20"
        />
      ))}
    </div>
  ) : slots.length === 0 ? (
    <p className="text-gray-400 text-center">
      No slots available
    </p>
  ) : (
    slots
      .sort(
        (a, b) =>
          new Date(b.startsAt).getTime() -
          new Date(a.startsAt).getTime()
      )
      .map((slot) => (
        <div
          key={slot.id}
          className=" group rounded-2xl border border-purple-800/30 bg-black/40 p-5 backdrop-blur-md shadow-md hover:shadow-purple-800/30 transition-all duration-300 hover:scale-[1.01]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* TIME */}
            <div>
              <div className="text-purple-200">
                <p className="text-sm">
                  {formatDate(slot.startsAt)}
                </p>

                <p className="text-lg font-semibold">
                  {formatTime(slot.startsAt)} - {formatTime(slot.endsAt)}
                </p>
              </div>

              <p
                className={`text-sm font-medium ${
                  slot.isOpen
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {slot.isOpen ? "Available" : "Booked"}
              </p>
            </div>

            {/* BUTTON */}
            <button
              disabled={!slot.isOpen || bookingId === slot.id}
              onClick={() => bookSlot(slot.id)}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-900 px-5 py-2 text-white font-medium
              hover:from-purple-500 hover:to-purple-800 transition-all duration-300
              disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {bookingId === slot.id ? "Booking..." : "Book"}
            </button>

          </div>
        </div>
      ))
  )}

</div>

      </div>
    </div>
  );
}



