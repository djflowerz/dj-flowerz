import {PaymentsMetrics} from "./payments-metrics";
import {BookingMetrics} from "./booking-metrics";

export interface Metrics {
  properties: number;
  bookings: number;
  payments: number;
  paymentOverview: PaymentsMetrics[];
  bookingOverview: BookingMetrics[];
}
