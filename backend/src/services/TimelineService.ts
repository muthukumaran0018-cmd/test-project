import { TimelineEvent, ITimelineEvent, TimelineAction, TimelineType } from '../models/TimelineEvent.model.js';

export class TimelineService {
  async getEventsByTrip(tripId: string) {
    return TimelineEvent.find({ tripId }).sort({ timestamp: -1 }).limit(50).exec();
  }

  async recordEvent(data: {
    tripId: string;
    seatNumber: string;
    passengerName: string;
    action: TimelineAction;
    details: string;
    type?: TimelineType;
  }) {
    const event = new TimelineEvent({
      tripId: data.tripId,
      seatNumber: data.seatNumber,
      passengerName: data.passengerName,
      action: data.action,
      details: data.details,
      type: data.type || 'info',
      timestamp: new Date(),
    });
    return await event.save();
  }
}

export const timelineService = new TimelineService();
