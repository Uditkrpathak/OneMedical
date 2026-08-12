import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

const MONGO_ATLAS_BASE = process.env.MONGO_URI || 'mongodb+srv://uditpathak65_db_user:e2m2OqGfggD5kg5M@cluster0.yj7drql.mongodb.net';

const getDbUri = (dbName) => {
  if (MONGO_ATLAS_BASE.includes('mongodb+srv://')) {
    return `${MONGO_ATLAS_BASE}/${dbName}?retryWrites=true&w=majority`;
  }
  return `${MONGO_ATLAS_BASE}/${dbName}`;
};

async function runTests() {
  console.log('🧪 Starting End-to-End Microservice Real-Time Data Integration Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Verify DB Connections
  console.log('1. Testing Database Connections:');
  try {
    const connIdentity = await mongoose.createConnection(`${getDbUri('identity_db')}`, { serverSelectionTimeoutMS: 5000 }).asPromise();
    assert(connIdentity.readyState === 1, 'identity_db connected successfully.');
    await connIdentity.close();

    const connClinical = await mongoose.createConnection(`${getDbUri('clinical_db')}`, { serverSelectionTimeoutMS: 5000 }).asPromise();
    assert(connClinical.readyState === 1, 'clinical_db connected successfully.');
    await connClinical.close();

    const connScheduling = await mongoose.createConnection(`${getDbUri('scheduling_db')}`, { serverSelectionTimeoutMS: 5000 }).asPromise();
    assert(connScheduling.readyState === 1, 'scheduling_db connected successfully.');
    await connScheduling.close();
  } catch (err) {
    assert(false, `Database connection error: ${err.message}`);
  }

  console.log('\n--- Summary ---');
  console.log(`Passed: ${passed}, Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Integration test failed with error:', err);
  process.exit(1);
});
