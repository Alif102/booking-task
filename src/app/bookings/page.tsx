"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(true);

  // GET USERS + SLOTS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, slotRes] = await Promise.all([
          axios.get("/api/users"),
          axios.get("/api/slots"),
        ]);

        setUsers(userRes.data);
        setSlots(slotRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchData();
  }, []);

  // BOOK SLOT
  const bookSlot = async (slotId: string) => {
    try {
      setBookingId(slotId);
      setError("");
      setSuccess("");

      await axios.post("/api/bookings", {
        slotId,
        userId: selectedUser,
      });

      setSuccess("Booking successful 🎉");

      // IMPORTANT: redirect to bookings page
      router.push("/bookings");

    } catch (err: any) {
      setError(err?.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  const formatTime = (t: string) =>
    new Date(t).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold text-purple-400 mb-4">
        Book Slot
      </h1>

      {/* USER SELECT */}
      <select
        className="bg-gray-900 p-2 rounded mb-4"
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select user</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* SLOTS */}
      {loadingSlots ? (
        <p>Loading...</p>
      ) : (
        slots.map((slot) => (
          <div
            key={slot.id}
            className="border border-purple-700 p-4 rounded mb-3"
          >
            <p>
              {formatTime(slot.startsAt)} - {formatTime(slot.endsAt)}
            </p>

            <button
              onClick={() => bookSlot(slot.id)}
              disabled={!slot.isOpen || bookingId === slot.id}
              className="mt-2 bg-purple-600 px-4 py-1 rounded"
            >
              {bookingId === slot.id ? "Booking..." : "Book"}
            </button>
          </div>
        ))
      )}

      {success && <p className="text-green-400">{success}</p>}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}