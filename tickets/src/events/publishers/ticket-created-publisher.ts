import { Publisher, Subjects, TicketCreatedEvent } from "@hursunss/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}

