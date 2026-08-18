export type ContactResult = { reference: string; received: true };

export interface ContactProvider {
  createContactRequest(input: Record<string, unknown>): Promise<ContactResult>;
}

export class LocalContactProvider implements ContactProvider {
  async createContactRequest() {
    return {
      reference: `NGC-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
      received: true as const,
    };
  }
}

export const contactProvider: ContactProvider = new LocalContactProvider();
