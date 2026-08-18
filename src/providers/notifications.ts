export interface NotificationProvider {
  sendBookingRequest(input: {
    reference: string;
  }): Promise<{ sent: boolean; reason: string }>;
  sendContactRequest?(input: {
    reference: string;
  }): Promise<{ sent: boolean; reason: string }>;
}

export class DisabledNotificationProvider implements NotificationProvider {
  async sendBookingRequest() {
    return {
      sent: false,
      reason: "A production notification provider is not configured.",
    };
  }
}

export const notificationProvider: NotificationProvider =
  new DisabledNotificationProvider();
