import { Publisher, OrderCancelledEvent, Subjects } from "@hursunss/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}