// seed.js
// Seeding default administrator and demo customer accounts

import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const seedDefaultUsers = async () => {
  try {
    // 1. Seed admin if not present
    const adminEmail = 'admin@framewala.com';
    const existingAdmin = await User.findByEmail(adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        first_name: 'Admin',
        last_name: 'User',
        email: adminEmail,
        phone: '9999999999',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Seeding: Default admin user created (admin@framewala.com)');
    }

    // 2. Seed demo customer if not present
    const demoEmail = 'demo@framewala.com';
    const existingDemo = await User.findByEmail(demoEmail);
    if (!existingDemo) {
      const hashedPassword = await bcrypt.hash('Demo@123', 10);
      await User.create({
        first_name: 'Demo',
        last_name: 'Customer',
        email: demoEmail,
        phone: '8888888888',
        password: hashedPassword,
        role: 'customer'
      });
      console.log('✅ Seeding: Default demo customer created (demo@framewala.com)');
    }
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
  }
};
