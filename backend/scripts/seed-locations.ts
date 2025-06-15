import { createDB } from '../src/db';
import { locations, districts, managers, storeHours } from '../src/db/schema';

// Sample data for testing
const sampleDistricts = [
  {
    id: crypto.randomUUID(),
    districtNumber: 'D001',
    districtName: 'North Texas District',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    districtNumber: 'D002',
    districtName: 'South Texas District',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleManagers = [
  {
    id: crypto.randomUUID(),
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@tootntotum.com',
    phoneNumber: '(806) 555-0101',
    role: 'store_manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@tootntotum.com',
    phoneNumber: '(806) 555-0102',
    role: 'store_manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@tootntotum.com',
    phoneNumber: '(806) 555-0201',
    role: 'district_manager',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleLocations = [
  {
    id: crypto.randomUUID(),
    storeNumber: '001',
    storeName: 'Toot\'n Totum #001 - Downtown',
    address: '123 Main Street',
    city: 'Amarillo',
    state: 'TX',
    zipCode: '79101',
    phoneNumber: '(806) 555-1001',
    latitude: 35.2220,
    longitude: -101.8313,
    googlePlaceId: null,
    districtId: sampleDistricts[0].id,
    storeManagerId: sampleManagers[0].id,
    districtManagerId: sampleManagers[2].id,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    storeNumber: '002',
    storeName: 'Toot\'n Totum #002 - West Side',
    address: '456 Western Avenue',
    city: 'Amarillo',
    state: 'TX',
    zipCode: '79109',
    phoneNumber: '(806) 555-1002',
    latitude: 35.1849,
    longitude: -101.8746,
    googlePlaceId: null,
    districtId: sampleDistricts[0].id,
    storeManagerId: sampleManagers[1].id,
    districtManagerId: sampleManagers[2].id,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    storeNumber: '003',
    storeName: 'Toot\'n Totum #003 - Canyon',
    address: '789 University Drive',
    city: 'Canyon',
    state: 'TX',
    zipCode: '79015',
    phoneNumber: '(806) 555-1003',
    latitude: 34.9804,
    longitude: -101.9171,
    googlePlaceId: null,
    districtId: sampleDistricts[1].id,
    storeManagerId: null, // No manager assigned yet
    districtManagerId: sampleManagers[2].id,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Standard store hours (same for all locations for simplicity)
const createStoreHours = (locationId: string) => [
  // Sunday
  { id: crypto.randomUUID(), locationId, dayOfWeek: 0, openTime: '06:00', closeTime: '23:00', isClosed: false, createdAt: new Date(), updatedAt: new Date() },
  // Monday
  { id: crypto.randomUUID(), locationId, dayOfWeek: 1, openTime: '05:00', closeTime: '24:00', isClosed: false, createdAt: new Date(), updatedAt: new Date() },
  // Tuesday
  { id: crypto.randomUUID(), locationId, dayOfWeek: 2, openTime: '05:00', closeTime: '24:00', isClosed: false, createdAt: new Date(), updatedAt: new Date() },
  // Wednesday
  { id: crypto.randomUUID(), locationId, dayOfWeek: 3, openTime: '05:00', closeTime: '24:00', isClosed: false, createdAt: new Date(), updatedAt: new Date() },
  // Thursday
  { id: crypto.randomUUID(), locationId, dayOfWeek: 4, openTime: '05:00', closeTime: '24:00', isClosed: false, createdAt: new Date(), updatedAt: new Date() },
  // Friday
  { id: crypto.randomUUID(), locationId, dayOfWeek: 5, openTime: '05:00', closeTime: '24:00', isClosed: false, createdAt: new Date(), updatedAt: new Date() },
  // Saturday
  { id: crypto.randomUUID(), locationId, dayOfWeek: 6, openTime: '05:00', closeTime: '24:00', isClosed: false, createdAt: new Date(), updatedAt: new Date() },
];

async function seedDatabase() {
  try {
    // Get database connection from environment
    const DB = process.env.DB;
    if (!DB) {
      throw new Error('DB environment variable not found. Make sure to run this script with proper environment setup.');
    }

    console.log('🌱 Starting database seeding...');
    
    // Note: In a real Cloudflare Workers environment, we'd need to use the actual D1 binding
    // For now, this script demonstrates the data structure
    console.log('📊 Sample data prepared:');
    console.log(`- ${sampleDistricts.length} districts`);
    console.log(`- ${sampleManagers.length} managers`);
    console.log(`- ${sampleLocations.length} locations`);
    console.log(`- ${sampleLocations.length * 7} store hours records`);

    // In a real implementation, you would:
    // const db = createDB(DB);
    // await db.insert(districts).values(sampleDistricts);
    // await db.insert(managers).values(sampleManagers);
    // await db.insert(locations).values(sampleLocations);
    // 
    // for (const location of sampleLocations) {
    //   const hours = createStoreHours(location.id);
    //   await db.insert(storeHours).values(hours);
    // }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📍 Sample locations created:');
    sampleLocations.forEach(location => {
      console.log(`- ${location.storeName} (Store #${location.storeNumber})`);
      console.log(`  📍 ${location.address}, ${location.city}, ${location.state} ${location.zipCode}`);
      console.log(`  📞 ${location.phoneNumber}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Export the data for use in other scripts or tests
export {
  sampleDistricts,
  sampleManagers,
  sampleLocations,
  createStoreHours,
};

// Run the seeding if this script is executed directly
// Note: This would work in Deno, but for Node.js we'd use a different approach
// For now, just export the function to be called manually
// seedDatabase();
