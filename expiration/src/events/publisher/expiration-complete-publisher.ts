import { ExpirationCompleteEvent, Subjects, Publisher } from "@hursunss/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}