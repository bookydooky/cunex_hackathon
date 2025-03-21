import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Query to fetch user details
    const userQuery = `
      SELECT u.firstName, u.lastName, u.facultyCode, u.studentYear, 
             f.facultyNameEN 
      FROM users u
      LEFT JOIN faculties f ON u.facultyCode = f.facultyCode
      WHERE u.userId = ?
    `;
    
    const [userResult] = await connection.execute(userQuery, [userId]);

    if (userResult.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Query to fetch sales parameters
    const salesQuery = `
      SELECT successRate, jobsSold, rehired, avgResponse, bio, rating 
      FROM salesParams 
      WHERE userId = ?
    `;
    
    const [salesResult] = await connection.execute(salesQuery, [userId]);
    await connection.end();

    // Merge user details with sales parameters
    const userData = {
      ...userResult[0],
      ...salesResult[0],
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching freelance details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
