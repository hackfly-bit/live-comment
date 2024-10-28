// Next Imports
import { NextResponse } from 'next/server'
import type { UserTable } from './users'
import { PrismaClient } from '@prisma/client'
import { compareSync } from 'bcrypt-ts'

const prisma = new PrismaClient()

type ResponseUser = Omit<UserTable, 'password'> // Adjust UserTable to your actual user type

export async function POST(req: Request) {
  try {
    // Vars
    const { email, password } = await req.json()

    // const salt = genSaltSync(10)
    // const hashedPassword = await hashSync(password, salt)
    // Query the database to find the user
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    const userPassword = user.password
    const is_true = compareSync(password, userPassword)
    // console.log('istrue : ' + is_true)
    // Check if the user exists and verify the password
    if (is_true) {
      // Exclude the password from the response
      const { password: _, ...filteredUserData } = user

      return NextResponse.json(filteredUserData)
    } else {
      // We return 401 status code and error message if user is not found or password is incorrect
      return NextResponse.json(
        {
          message: ['Email or Password is invalid']
        },
        {
          status: 401,
          statusText: 'Unauthorized Access'
        }
      )
    }
  } catch (error) {
    console.error('Error during user authentication:', error)
    return NextResponse.json(
      {
        message: ['Internal server error']
      },
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    )
  } finally {
    await prisma.$disconnect() // Ensure to close the database connection
  }
}
