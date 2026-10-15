import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorflow';

async function checkDatabase() {
  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!\n');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Collections & Document Counts:');
    console.log('=================================');
    
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(` • ${col.name.padEnd(20)}: ${count} document(s)`);
    }

    console.log('\n🔍 Latest Added Records (Sample):');
    console.log('=================================');

    // Show latest users
    const users = await mongoose.connection.db.collection('users')
      .find({}, { projection: { name: 1, email: 1, role: 1, createdAt: 1 } })
      .sort({ _id: -1 })
      .limit(3)
      .toArray();
    console.log('\n--- Recent Users ---');
    console.table(users);

    // Show latest vendors
    const vendors = await mongoose.connection.db.collection('vendors')
      .find({}, { projection: { companyName: 1, status: 1, tier: 1, category: 1 } })
      .sort({ _id: -1 })
      .limit(3)
      .toArray();
    console.log('\n--- Recent Vendors ---');
    console.table(vendors);

    // Show latest purchase orders
    const pos = await mongoose.connection.db.collection('purchaseorders')
      .find({}, { projection: { poNumber: 1, title: 1, status: 1, totalAmount: 1 } })
      .sort({ _id: -1 })
      .limit(3)
      .toArray();
    console.log('\n--- Recent Purchase Orders ---');
    console.table(pos);

    await mongoose.disconnect();
    console.log('\n✅ Database check complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Check Error:', err.message);
    process.exit(1);
  }
}

checkDatabase();
