// import Link from 'next/link';

import BookingForm from "./BookingForm";

// export default function HomePage() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
//       <h1 className="text-4xl font-bold mb-4">স্বাগতম উকিল বাড়ি বুকিং সিস্টেমে</h1>
//       <p className="mb-8 text-gray-600">আপনার প্রয়োজনীয় স্লটটি বুক করতে নিচের বাটনে ক্লিক করুন।</p>
//       <Link href="/booking">
//         <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
//           Book an Appointment
//         </button>
//       </Link>
//     </div>
//   );
// }


export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        {/* <h1 className="mb-6 text-3xl font-bold">
          Book a Slot
        </h1> */}

        <BookingForm />
      </div>
    </main>
  );
}