// Script to update existing products with collections field
import mongoose from 'mongoose';
import { Product } from '../src/models/Product.js';
import { connectDB } from '../src/config/db.js';

async function updateCollections() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Get all products
    const products = await Product.find({}).select('name collection').lean();
    console.log(`Found ${products.length} products to update`);

    let updatedCount = 0;

    for (const product of products) {
      const collections = [];
      
      // If product has collection field, add it to collections array
      if (product.collection) {
        collections.push(product.collection);
      }

      // Add category-based collections based on product name/type
      const name = product.name.toLowerCase();
      
      // ÁO categories
      if (name.includes('áo thun') || name.includes('ao thun')) {
        collections.push('ao', 'ao-thun');
      } else if (name.includes('áo sơ mi') || name.includes('ao so mi')) {
        collections.push('ao', 'ao-so-mi');
      } else if (name.includes('hoodie')) {
        collections.push('ao', 'ao-hoodie');
      } else if (name.includes('áo khoác') || name.includes('ao khoac')) {
        collections.push('ao', 'ao-khoac');
      } else if (name.includes('áo len') || name.includes('ao len')) {
        collections.push('ao', 'ao-len');
      } else if (name.includes('áo') || name.includes('ao')) {
        collections.push('ao');
      }
      
      // QUẦN categories
      else if (name.includes('quần jean') || name.includes('quan jean')) {
        collections.push('quan', 'quan-jean');
      } else if (name.includes('quần short') || name.includes('quan short')) {
        collections.push('quan', 'quan-short');
      } else if (name.includes('quần dài') || name.includes('quan dai')) {
        collections.push('quan', 'quan-dai');
      } else if (name.includes('quần lót') || name.includes('quan lot')) {
        collections.push('quan', 'quan-lot');
      } else if (name.includes('quần') || name.includes('quan')) {
        collections.push('quan');
      }
      
      // PHỤ KIỆN categories
      else if (name.includes('nón') || name.includes('non')) {
        collections.push('phu-kien', 'non');
      } else if (name.includes('dây nịt') || name.includes('day nit')) {
        collections.push('phu-kien', 'day-nit');
      } else if (name.includes('ví') || name.includes('vi')) {
        collections.push('phu-kien', 'vi');
      } else if (name.includes('túi') || name.includes('tui')) {
        collections.push('phu-kien', 'tui-deo');
      } else if (name.includes('balo') || name.includes('ba lô')) {
        collections.push('phu-kien', 'balo');
      }

      // Remove duplicates
      const uniqueCollections = [...new Set(collections)];

      if (uniqueCollections.length > 0) {
        await Product.findByIdAndUpdate(product._id, {
          collections: uniqueCollections
        });
        updatedCount++;
        console.log(`Updated ${product.name}: [${uniqueCollections.join(', ')}]`);
      }
    }

    console.log(`\nUpdated ${updatedCount} products with collections field`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateCollections();
