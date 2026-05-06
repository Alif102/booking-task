# booking-service

## Setup

```bash
docker compose up -d
pnpm install
cp .env.example .env
pnpm db:push
pnpm seed
pnpm dev
```

## Build a booking endpoint.

* `POST /api/bookings/create` — accepts `{ slotId, userId }`
* Books the slot for the user
* Charges payment via the provided `chargePayment()` mock
* Returns success or a clear error

## Requirements

* A slot can only be booked once
* A user who fails to book should not be charged
* The endpoint must work correctly under concurrent load

## Deliverable

* Working endpoint
* Run `pnpm hammer` to stress the endpoint
* Run `pnpm verify` to check final state
* Expected output after `pnpm seed \&\& pnpm hammer \&\& pnpm verify`:
`Slots open: 0 | Bookings: 1 | Charges: 1`

## Notes

* `chargePayment(bookingId, amount)` is in `src/lib/charge.ts`. Use it.
* `prisma` client is in `src/lib/prisma.ts`.
* 60 minutes. Use any tools you want. Zip and send back when done.

