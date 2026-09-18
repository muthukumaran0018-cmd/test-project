import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cleanup
  await prisma.activityLog.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.telemetrySnapshot.deleteMany();
  await prisma.detectionEvent.deleteMany();
  await prisma.cameraDevice.deleteMany();
  await prisma.verificationEvent.deleteMany();
  await prisma.passenger.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.trip.deleteMany();

  // Create trip
  const trip = await prisma.trip.create({
    data: {
      tripCode: 'TS-8842-EXPRESS',
      routeName: 'Bengaluru → Goa Express',
      busNumber: 'KA 01 F 9922 (Sleeper AC)',
      coachType: 'Sleeper AC',
      currentStop: 'Hubli Highway Plaza (Dinner & Fuel Stop)',
      nextStop: 'Belagavi Junction',
      targetDepartureTime: '22:00 IST',
      departureStatus: 'BLOCKED'
    }
  });

  // Seats & passengers (11 passengers)
  const passengersData = [
    { name: 'Arjun Verma', seatNumber: 'L1', phone: '+91 98765 43210', ticketId: 'TK-90210', status: 'OUTSIDE_REST_STOP' },
    { name: 'Priya Sharma', seatNumber: 'L2', phone: '+91 98123 45678', ticketId: 'TK-90211', status: 'BOARDING_PENDING' },
    { name: 'Rohan Kulkarni', seatNumber: 'L3', phone: '+91 97654 32109', ticketId: 'TK-90212', status: 'ON_BUS_VERIFIED' },
    { name: 'Ananya Iyer', seatNumber: 'L4', phone: '+91 99887 76655', ticketId: 'TK-90213', status: 'ON_BUS_VERIFIED' },
    { name: 'Vikram Malhotra', seatNumber: 'L5', phone: '+91 94567 89012', ticketId: 'TK-90214', status: 'ON_BUS_VERIFIED' },
    { name: 'Kavita Rao', seatNumber: 'L6', phone: '+91 93456 78901', ticketId: 'TK-90215', status: 'ON_BUS_VERIFIED' },
    { name: 'Siddharth Nair', seatNumber: 'L7', phone: '+91 92345 67890', ticketId: 'TK-90216', status: 'ON_BUS_VERIFIED' },
    { name: 'Meera Patel', seatNumber: 'L8', phone: '+91 91234 56789', ticketId: 'TK-90217', status: 'ON_BUS_VERIFIED' },
    { name: 'Deepak Mehta', seatNumber: 'U1', phone: '+91 98989 89898', ticketId: 'TK-90224', status: 'ON_BUS_VERIFIED' },
    { name: 'Sneha Reddy', seatNumber: 'U2', phone: '+91 97777 66666', ticketId: 'TK-90225', status: 'OUTSIDE_REST_STOP' },
    { name: 'Aditya Roy', seatNumber: 'U3', phone: '+91 96666 55555', ticketId: 'TK-90226', status: 'BOARDING_PENDING' }
  ];

  for (const p of passengersData) {
    await prisma.passenger.create({
      data: {
        tripId: trip.id,
        name: p.name,
        phone: p.phone,
        ticketId: p.ticketId,
        seatNumber: p.seatNumber,
        status: p.status as any,
        lastVerifiedAt: p.status === 'ON_BUS_VERIFIED' ? new Date() : null
      }
    });

    await prisma.seat.create({
      data: {
        tripId: trip.id,
        seatNumber: p.seatNumber,
        deck: p.seatNumber.startsWith('U') ? 'UPPER' : 'LOWER',
        berthType: p.seatNumber.startsWith('U') ? 'Upper' : 'Lower'
      }
    });
  }

  // Camera device
  await prisma.cameraDevice.create({
    data: {
      tripId: trip.id,
      label: 'Entrance Camera',
      status: 'DISCONNECTED',
      streamUrl: null
    }
  });

  // Telemetry
  await prisma.telemetrySnapshot.create({
    data: {
      tripId: trip.id,
      latitude: 15.3647,
      longitude: 75.1240,
      speedKmh: 0,
      temperatureC: 22,
      humidity: 65,
      weatherCondition: 'Clear Night'
    }
  });

  // Alerts
  await prisma.alert.create({
    data: {
      tripId: trip.id,
      severity: 'CRITICAL',
      title: 'Passenger Departure Hold Warning',
      body: 'Some passengers have not returned from Hubli Stop.',
      isResolved: false
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
