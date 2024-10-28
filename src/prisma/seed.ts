import { PrismaClient } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcrypt-ts'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const users = [
    {
      name: 'admin',
      email: 'admin@mail.com',
      password: 'password', // Make sure to hash the password
      role: 'admin'
    }
  ]

  // Hash passwords and create users
  for (const user of users) {
    const salt = genSaltSync(10)
    const hashedPassword = await hashSync(user.password, salt)
    // const hashedPassword = await bcrypt.hash(user.password, 10)
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      }
    })
  }

  console.log('Seeding completed.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
