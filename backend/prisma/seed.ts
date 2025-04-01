import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@apothecare.nl',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Pijnstillers',
        description: 'Medicijnen voor pijnverlichting',
        slug: 'pijnstillers',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vitamines & Supplementen',
        description: 'Voedingssupplementen en vitamines',
        slug: 'vitamines-supplementen',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Verzorging',
        description: 'Persoonlijke verzorgingsproducten',
        slug: 'verzorging',
      },
    }),
    prisma.category.create({
      data: {
        name: 'EHBO',
        description: 'Eerste hulp producten',
        slug: 'ehbo',
      },
    }),
  ]);

  // Create products for each category
  const products = await Promise.all([
    // Pijnstillers
    prisma.product.create({
      data: {
        name: 'Paracetamol 500mg',
        description: 'Pijnstillende en koortsverlagende tabletten',
        price: 2.99,
        image: '/images/products/paracetamol.jpg',
        stock: 100,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ibuprofen 400mg',
        description: 'Ontstekingsremmende pijnstiller',
        price: 4.99,
        image: '/images/products/ibuprofen.jpg',
        stock: 75,
        categoryId: categories[0].id,
      },
    }),

    // Vitamines & Supplementen
    prisma.product.create({
      data: {
        name: 'Vitamine D3 25mcg',
        description: 'Voor sterke botten en tanden',
        price: 8.95,
        image: '/images/products/vitamine-d3.jpg',
        stock: 50,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Multivitamine A-Z',
        description: 'Complete dagelijkse vitamines en mineralen',
        price: 12.95,
        image: '/images/products/multivitamine.jpg',
        stock: 60,
        categoryId: categories[1].id,
      },
    }),

    // Verzorging
    prisma.product.create({
      data: {
        name: 'Handcrème',
        description: 'Intensief verzorgende handcrème',
        price: 5.99,
        image: '/images/products/handcreme.jpg',
        stock: 40,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lippenbalsem',
        description: 'Beschermende en hydraterende lippenbalsem',
        price: 3.49,
        image: '/images/products/lippenbalsem.jpg',
        stock: 80,
        categoryId: categories[2].id,
      },
    }),

    // EHBO
    prisma.product.create({
      data: {
        name: 'EHBO-set Basic',
        description: 'Basis eerste hulp set voor thuis',
        price: 15.95,
        image: '/images/products/ehbo-set.jpg',
        stock: 25,
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pleisterset',
        description: 'Diverse maten waterbestendige pleisters',
        price: 4.49,
        image: '/images/products/pleisters.jpg',
        stock: 90,
        categoryId: categories[3].id,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
  console.log('Admin user created with email: admin@apothecare.nl and password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 