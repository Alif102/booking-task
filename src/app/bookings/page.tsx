"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Booking = {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  slot: {
    id: string;
    startsAt: string;
    endsAt: string;
  };
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/bookings");

      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Confirmed Bookings
        </h1>
        <p className="text-sm text-gray-500">
          All successful bookings in the system
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-white">

        <table className="w-full text-sm">

          {/* HEAD */}
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Slot Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Booked At</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>

            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>

            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>

            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t">

                  {/* USER */}
                  <td className="p-3 font-medium">
                    {b.user?.name}
                  </td>

                  {/* SLOT */}
                  <td className="p-3">
                    {formatDate(b.slot.startsAt)} →{" "}
                    {formatDate(b.slot.endsAt)}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                      {b.status}
                    </span>
                  </td>

                  {/* CREATED AT */}
                  <td className="p-3 text-gray-600">
                    {formatDate(b.createdAt)}
                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>

      </div>
    </div>
  );
}