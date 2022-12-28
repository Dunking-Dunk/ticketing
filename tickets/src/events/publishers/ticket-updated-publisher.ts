import { Publisher, Subjects, TicketUpdatedEvent } from "@hursunss/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
