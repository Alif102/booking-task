"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { GrHomeRounded } from "react-icons/gr";
import Link from "next/link";

type Booking = {
  id: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string };
  slot: { startsAt: string; endsAt: string };
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/bookings");

      setBookings(res.data);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="md:flex justify-between gap-2 px-3">
        <h1 className="text-2xl font-bold text-purple-400 mb-6">
        Confirmed Bookings
      </h1>

      <Link href='/'
          
          className="text-3xl font-bold text-purple-400 cursor-pointer"
        >
          <GrHomeRounded />
        </Link>
      </div>

      <div className="overflow-x-auto">
<table className="w-full table-auto border border-purple-700 text-center">
              <thead className="bg-purple-900">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Slot</th>
              <th className="p-3">Status</th>
              <th className="p-3">Booked At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-700">
                  <td className="p-3">{b.user?.name}</td>

                  <td className="p-3">
                    {formatDate(b.slot.startsAt)} →{" "}
                    {formatDate(b.slot.endsAt)}
                  </td>

                  <td className="p-3 text-green-400">
                    {b.status}
                  </td>

                  <td className="p-3 text-gray-400">
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