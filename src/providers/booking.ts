export type BookingRequest = Record<string, unknown> & {
  name: string;
  appliance: string;
  preferredDate: string;
  preferredWindow: string;
};

export type BookingResult = {
  reference: string;
  status: "pending" | "confirmed";
  message: string;
};

export interface BookingProvider {
  getAvailability?(
    input: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
  createBooking(
    input: BookingRequest,
    idempotencyKey: string,
  ): Promise<BookingResult>;
  cancelBooking?(bookingId: string): Promise<BookingResult>;
  rescheduleBooking?(
    bookingId: string,
    input: Record<string, unknown>,
  ): Promise<BookingResult>;
}

function createReference() {
  return `NGA-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

export class LocalBookingProvider implements BookingProvider {
  private readonly requests = new Map<string, BookingResult>();
  private readonly referenceFactory: () => string;

  constructor(referenceFactory: () => string = createReference) {
    this.referenceFactory = referenceFactory;
  }

  async createBooking(_input: BookingRequest, idempotencyKey: string) {
    const existing = this.requests.get(idempotencyKey);
    if (existing) return existing;
    const result: BookingResult = {
      reference: this.referenceFactory(),
      status: "pending",
      message:
        "Your appointment request is pending confirmation from Nice Guy Appliance Services.",
    };
    this.requests.set(idempotencyKey, result);
    return result;
  }
}

export const bookingProvider: BookingProvider = new LocalBookingProvider();
