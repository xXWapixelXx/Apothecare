const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Clear existing data
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('Cleared existing data');

    // Read the SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'seed_data.sql'), 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql.split(';').filter(statement => statement.trim());
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement);
          console.log('Executed statement successfully');
        } catch (error) {
          console.error('Error executing statement:', error);
          console.error('Statement:', statement);
        }
      }
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase(); 