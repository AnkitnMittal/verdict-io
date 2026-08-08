import { User } from '../models/User.js';

export const seedAdmin = async () => {
  try {
    const existAdmin = await User.findOne({ role: 'admin' });
    if (existAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'system_admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123456';

    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
