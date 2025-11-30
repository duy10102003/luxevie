import mongoose from 'mongoose';
import 'dotenv/config';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing MONGODB_URI');

async function run() {
  await mongoose.connect(uri);
  const col = mongoose.connection.db.collection('categories');
  try {
    const idx = await col.indexes();
    console.log('Existing indexes:', idx.map(i => i.name));
  } catch {}
  try { await col.dropIndex('category_1'); console.log('Dropped category_1'); } catch (e) { console.log('Skip category_1:', e?.codeName || e?.message); }
  try { await col.dropIndex('slug_1'); console.log('Dropped slug_1'); } catch (e) { console.log('Skip slug_1:', e?.codeName || e?.message); }
  await mongoose.disconnect();
  console.log('Done');
}

run().catch(e => { console.error(e); process.exit(1); });


