import { seedDatabase } from '../apps/api/src/scripts/seed';
import { disconnectDB } from '../apps/api/src/config/db';

async function main() {
  console.log('🚀 Running root seed-database script for CareerPulse AI...');
  try {
    await seedDatabase();
    console.log('✨ Seed database completed successfully.');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

main();
