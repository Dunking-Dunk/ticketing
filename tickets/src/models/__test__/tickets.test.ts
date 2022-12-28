import { Ticket } from "../tickets";

it('implements optimistic concurrency control', async() => {
    //create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: '2324'
    })
    //save the ticket to the database
    await ticket.save()
    //fetch the ticket twice

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    //make two separate chances to the tickets we fetched
    firstInstance!.set({ price: 20 })
    secondInstance!.set({price: 25})
    //save the first fetched ticket
    await firstInstance!.save()
    //save the second fetched ticket and expect an error

    expect(async () => {
        await secondInstance!.save();
    }).rejects.toThrow();
})

it('increments the version number on multiple saves',async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: '2324'
    })

    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})