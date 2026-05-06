'use client';

export default function TestBooking() {
  const handleBooking = async () => {
    const res = await fetch('/api/bookings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId: 1, userId: 1 }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <button onClick={handleBooking}>
      Test Booking
    </button>
  );
}