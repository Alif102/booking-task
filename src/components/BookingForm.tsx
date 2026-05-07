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
};useEffect(() => {
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
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Book a Session</h1>
          <p className="text-sm text-gray-500">
            Select a user and book an available slot
          </p>
        </div>

        {/* USER SELECT */}
        <div className="rounded-xl border bg-white p-4">
          <label className="text-sm font-medium">
            Select User
          </label>

          <select
  value={selectedUser}
  onChange={(e) => setSelectedUser(e.target.value)}
  className="w-full rounded-lg border p-2"
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
          <div className="rounded-lg bg-green-100 p-3 text-green-700">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {/* SLOTS */}
        <div className="space-y-4">
          {loadingSlots ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-gray-500">No slots available</p>
          ) : (
            slots.map((slot) => (
              <div
                key={slot.id}
                className="rounded-xl border bg-white p-4"
              >
                <div className="flex items-center justify-between">

                  {/* TIME */}
                  <div>
                    <p className="text-lg font-semibold">
                      {formatTime(slot.startsAt)} -{" "}
                      {formatTime(slot.endsAt)}
                    </p>

                    <p
                      className={`text-sm ${
                        slot.isOpen
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {slot.isOpen ? "Available" : "Booked"}
                    </p>
                  </div>

                  {/* BUTTON */}
                  <button
                    disabled={
                      !slot.isOpen ||
                      bookingId === slot.id
                    }
                    onClick={() => bookSlot(slot.id)}
                    className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
                  >
                    {bookingId === slot.id
                      ? "Booking..."
                      : "Book"}
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