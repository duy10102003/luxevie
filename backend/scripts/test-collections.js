// Test script to check collections in products
import mongoose from 'mongoose';
import { Product } from '../src/models/Product.js';
import { connectDB } from '../src/config/db.js';

async function testCollections() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Check if any products have collections field
    const productsWithCollections = await Product.find({ 
      collections: { $exists: true, $ne: [] } 
    }).select('name collections').lean();

    console.log(`Found ${productsWithCollections.length} products with collections:`);
    productsWithCollections.forEach(product => {
      console.log(`- ${product.name}: [${product.collections.join(', ')}]`);
    });

    // Check all products to see their structure
    const allProducts = await Product.find({}).select('name collection collections').limit(5).lean();
    console.log('\nSample products:');
    allProducts.forEach(product => {
      console.log(`- ${product.name}:`);
      console.log(`  collection: ${product.collection || 'none'}`);
      console.log(`  collections: [${product.collections?.join(', ') || 'none'}]`);
    });

    // Test query for ÁO category
    console.log('\nTesting ÁO category query:');
    const aoProducts = await Product.find({
      collections: { $in: ['ao', 'ao-thun', 'ao-so-mi', 'ao-hoodie', 'ao-khoac', 'ao-len'] }
    }).select('name collections').lean();
    
    console.log(`Found ${aoProducts.length} products for ÁO category:`);
    aoProducts.forEach(product => {
      console.log(`- ${product.name}: [${product.collections.join(', ')}]`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testCollections();
