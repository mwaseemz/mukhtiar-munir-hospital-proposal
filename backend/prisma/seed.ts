import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  // Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'admin@hospital.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      phoneNumber: '+92-300-1234567',
      department: 'Administration',
      isActive: true,
    },
  });

  console.log('✅ Created Super Admin:', superAdmin.email);

  // Create Doctor
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@hospital.com' },
    update: {},
    create: {
      username: 'drsmith',
      email: 'doctor@hospital.com',
      password: hashedPassword,
      firstName: 'Dr. John',
      lastName: 'Smith',
      role: 'DOCTOR',
      phoneNumber: '+92-300-1234568',
      department: 'Surgery',
      isActive: true,
    },
  });

  console.log('✅ Created Doctor:', doctor.email);

  // Create Nurse
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@hospital.com' },
    update: {},
    create: {
      username: 'nursemary',
      email: 'nurse@hospital.com',
      password: hashedPassword,
      firstName: 'Mary',
      lastName: 'Johnson',
      role: 'NURSE',
      phoneNumber: '+92-300-1234569',
      department: 'General Ward',
      isActive: true,
    },
  });

  console.log('✅ Created Nurse:', nurse.email);

  // Create Receptionist
  const receptionist = await prisma.user.upsert({
    where: { email: 'reception@hospital.com' },
    update: {},
    create: {
      username: 'reception',
      email: 'reception@hospital.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'RECEPTIONIST',
      phoneNumber: '+92-300-1234570',
      department: 'Front Desk',
      isActive: true,
    },
  });

  console.log('✅ Created Receptionist:', receptionist.email);

  // Create System Configurations
  const configs = [
    {
      key: 'MR_NUMBER_PREFIX',
      value: 'MR',
      description: 'Prefix for MR Numbers',
      category: 'PATIENT',
    },
    {
      key: 'MR_NUMBER_START',
      value: '1000',
      description: 'Starting number for MR Numbers',
      category: 'PATIENT',
    },
    {
      key: 'MR_NUMBER_PADDING',
      value: '6',
      description: 'Number of digits in MR Number',
      category: 'PATIENT',
    },
    {
      key: 'HOSPITAL_NAME',
      value: 'City General Hospital',
      description: 'Hospital Name',
      category: 'GENERAL',
    },
    {
      key: 'HOSPITAL_ADDRESS',
      value: 'Main Street, City Center',
      description: 'Hospital Address',
      category: 'GENERAL',
    },
    {
      key: 'HOSPITAL_PHONE',
      value: '+92-21-1234567',
      description: 'Hospital Phone Number',
      category: 'GENERAL',
    },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }

  console.log('✅ Created System Configurations');

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Login Credentials:');
  console.log('   Email: admin@hospital.com | Password: Admin@123');
  console.log('   Email: doctor@hospital.com | Password: Admin@123');
  console.log('   Email: nurse@hospital.com | Password: Admin@123');
  console.log('   Email: reception@hospital.com | Password: Admin@123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
