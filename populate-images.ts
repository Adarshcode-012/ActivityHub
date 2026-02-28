import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
    const activities = await prisma.activity.findMany({
        where: { imageUrl: null }
    });

    console.log(`Found ${activities.length} activities without images.`);

    for (const activity of activities) {
        console.log(`Fetching image for: ${activity.title}`);
        try {
            const query = encodeURIComponent(activity.title);
            const res = await fetch(`https://unsplash.com/napi/search/photos?query=${query}&per_page=1&page=1`);
            if (res.ok) {
                const data = await res.json();
                if (data.results && data.results.length > 0) {
                    const url = data.results[0].urls.regular;
                    await prisma.activity.update({
                        where: { id: activity.id },
                        data: { imageUrl: url }
                    });
                    console.log(`Updated ${activity.title} with ${url}`);
                } else {
                    console.log(`No Unsplash results for ${activity.title}`);
                }
            }
        } catch (e) {
            console.error(e);
        }
        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

run().then(() => console.log('Done')).catch(console.error).finally(() => prisma.$disconnect());
