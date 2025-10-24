import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample activities
  const activities = [
    {
      title: 'Morning Yoga Session',
      description: 'Start your day with a rejuvenating yoga class suitable for all levels. Includes meditation and breathing exercises.',
      date: new Date('2025-11-01T09:00:00Z'),
      capacity: 20,
    },
    {
      title: 'Hiking Adventure',
      description: 'Join us for a scenic 5-mile hike through beautiful mountain trails. Moderate difficulty level.',
      date: new Date('2025-11-03T08:00:00Z'),
      capacity: 15,
    },
    {
      title: 'Cooking Workshop',
      description: 'Learn to cook authentic Italian pasta dishes from scratch with our expert chef.',
      date: new Date('2025-11-05T18:00:00Z'),
      capacity: 12,
    },
    {
      title: 'Photography Walk',
      description: 'Explore the city and improve your photography skills with professional guidance.',
      date: new Date('2025-11-07T14:00:00Z'),
      capacity: 10,
    },
    {
      title: 'Pottery Class',
      description: 'Hands-on pottery workshop where you\'ll create your own ceramic pieces on the wheel.',
      date: new Date('2025-11-10T16:00:00Z'),
      capacity: 8,
    },
    {
      title: 'Dance Workshop',
      description: 'Learn salsa dancing basics in this fun and energetic beginner-friendly class.',
      date: new Date('2025-11-12T19:00:00Z'),
      capacity: 25,
    },
    {
      title: 'Rock Climbing',
      description: 'Indoor rock climbing session with equipment provided. Safety instruction included.',
      date: new Date('2025-11-15T10:00:00Z'),
      capacity: 12,
    },
    {
      title: 'Wine Tasting',
      description: 'Sample a selection of premium wines while learning about tasting techniques and wine regions.',
      date: new Date('2025-11-17T17:00:00Z'),
      capacity: 20,
    },
  ];

  for (const activity of activities) {
    const created = await prisma.activity.create({
      data: activity,
    });
    console.log(`✅ Created activity: ${created.title}`);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
