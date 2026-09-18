import { BaseRepository } from './BaseRepository.js';
import { Ticket, ITicket } from '../models/Ticket.model.js';
import { Route, IRoute } from '../models/Route.model.js';

export class TicketRepository extends BaseRepository<ITicket> {
  constructor() {
    super(Ticket);
  }

  async findByTicketCode(ticketCode: string): Promise<ITicket | null> {
    return this.model.findOne({ ticketCode }).exec();
  }
}

export class RouteRepository extends BaseRepository<IRoute> {
  constructor() {
    super(Route);
  }

  async findByRouteCode(routeCode: string): Promise<IRoute | null> {
    return this.model.findOne({ routeCode }).exec();
  }
}

export const ticketRepository = new TicketRepository();
export const routeRepository = new RouteRepository();
