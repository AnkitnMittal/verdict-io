import { User } from '../models/User.js';

export const createAdmin = async () => {
  try {
    const existAdmin = await User.findOne({ role: 'admin' });
    if (existAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const adminFullName = process.env.ADMIN_FULL_NAME || 'System Admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123456';

    await User.create({
      fullName: adminFullName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};
