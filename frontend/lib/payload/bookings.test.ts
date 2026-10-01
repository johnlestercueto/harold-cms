import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildBookingSubmissionBody } from "./bookings";

describe("booking submission payload", () => {
  it("includes the GCash reference number", () => {
    const payload = {
      transientHouse: 7,
      customer: {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "+639171234567",
      },
      checkIn: "2026-09-20",
      checkOut: "2026-09-22",
      guests: 2,
      additionalFees: 0,
      paymentMethod: "gcash" as const,
      gcashReferenceNumber: "1234567890",
    };

    const body = buildBookingSubmissionBody(payload);

    assert.equal(body instanceof FormData, true);
    assert.equal(body.get("paymentMethod"), "gcash");
    assert.equal(body.get("gcashReferenceNumber"), "1234567890");
    assert.equal(body.get("customer"), JSON.stringify(payload.customer));
  });
});
