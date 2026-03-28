import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';

async function seedAdmin() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminEmail = 'admin@news.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating role to Ensure ADMIN access.');
            existingAdmin.role = 'ADMIN';
            // Also updating password to 'admin123' so the user exactly knows how to login
            existingAdmin.password = 'admin123';
            await existingAdmin.save();
            console.log('✅ Admin user updated successfully.');
        } else {
            console.log('Creating new Admin user...');
            const adminUser = await User.create({
                fullName: 'Super Admin',
                username: 'superadmin',
                email: adminEmail,
                password: 'admin123',
                role: 'ADMIN' // Set role directly
            });
            console.log('✅ Admin user created successfully:', adminUser.email);
        }

        console.log('\n--- Admin Login Credentials ---');
        console.log('Email: admin@news.com');
        console.log('Password: admin123');
        console.log('-------------------------------\n');
        
    } catch (e) {
        console.error('❌ Failed to seed admin:', e.message);
    } finally {
        await mongoose.disconnect();
        console.log('Database disconnected.');
    }
}

seedAdmin();
