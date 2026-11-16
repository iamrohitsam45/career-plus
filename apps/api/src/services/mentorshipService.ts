import { MentorProfileModel, MentorBookingModel } from '../models';
import { MentorBookingSchema } from '@careerpulse/shared';
import crypto from 'crypto';

export class MentorshipService {
  static async getAllMentors(serviceType?: string) {
    const filter: any = {};
    if (serviceType && serviceType !== 'all') {
      filter.servicesOffered = serviceType;
    }

    const docs = await MentorProfileModel.find(filter).sort({ rating: -1 }).lean();
    return docs.map((d: any) => ({
      ...d,
      id: d._id.toString(),
    }));
  }

  static async getMentorById(id: string) {
    const doc = await MentorProfileModel.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { userId: id }],
    }).lean();

    if (!doc) return null;
    return {
      ...(doc as any),
      id: (doc as any)._id.toString(),
    };
  }

  static async bookSession(data: {
    mentorId: string;
    candidateId: string;
    candidateName: string;
    serviceType: string;
    bookingDate: string;
    slotTime: string;
    notes?: string;
  }) {
    // Check if slot is already booked (double booking prevention)
    const existing = await MentorBookingModel.findOne({
      mentorId: data.mentorId,
      bookingDate: new Date(data.bookingDate),
      slotTime: data.slotTime,
      status: 'confirmed',
    });

    if (existing) {
      throw new Error('This time slot has already been booked. Please select another slot.');
    }

    const mentor = await this.getMentorById(data.mentorId);
    if (!mentor) {
      throw new Error('Mentor not found');
    }

    const meetingRoomId = `careerpulse-${crypto.randomBytes(4).toString('hex')}`;
    const meetingUrl = `https://meet.jit.si/${meetingRoomId}`;

    const booking = await MentorBookingModel.create({
      mentorId: data.mentorId,
      mentorName: mentor.fullName,
      candidateId: data.candidateId,
      candidateName: data.candidateName,
      serviceType: data.serviceType,
      bookingDate: new Date(data.bookingDate),
      slotTime: data.slotTime,
      status: 'confirmed',
      meetingUrl,
      notes: data.notes,
      priceInr: mentor.sessionPriceInr || 999,
      paymentStatus: 'paid',
    });

    return {
      ...booking.toObject(),
      id: booking._id.toString(),
    };
  }

  static async getCandidateBookings(candidateId: string) {
    const docs = await MentorBookingModel.find({ candidateId })
      .sort({ bookingDate: 1 })
      .lean();

    return docs.map((d: any) => ({
      ...d,
      id: d._id.toString(),
    }));
  }

  static async getMentorBookings(mentorUserId: string) {
    const docs = await MentorBookingModel.find({ mentorId: mentorUserId })
      .sort({ bookingDate: 1 })
      .lean();

    return docs.map((d: any) => ({
      ...d,
      id: d._id.toString(),
    }));
  }
}
