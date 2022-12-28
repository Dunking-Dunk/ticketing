import { Publisher, OrderCreatedEvent, Subjects } from "@hursunss/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}