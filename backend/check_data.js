const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    // Check categories
    const categories = await prisma.category.findMany();
    console.log('\nCategories:', categories.length);
    console.log('Category names:', categories.map(c => c.name));

    // Check products
    const products = await prisma.product.findMany();
    console.log('\nProducts:', products.length);
    console.log('Product names:', products.map(p => p.name));

    // Check users
    const users = await prisma.user.findMany();
    console.log('\nUsers:', users.length);
    console.log('User emails:', users.map(u => u.email));

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData(); 