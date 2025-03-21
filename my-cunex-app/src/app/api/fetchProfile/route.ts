import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import mysql from "mysql2/promise";

export async function GET(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/profile?token=${process.env.NEXT_PUBLIC_TEST_TOKEN}`;
  const headers = {
    "Content-Type": "application/json",
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    ClientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  };

  try {
    console.log("ClientId", process.env.NEXT_PUBLIC_CLIENT_ID);
    console.log("ClientSecret", process.env.NEXT_PUBLIC_CLIENT_SECRET);
    console.log("Gateway", process.env.NEXT_PUBLIC_GATEWAY);
    console.log("Token", process.env.NEXT_PUBLIC_TEST_TOKEN);
    console.log("host", process.env.NEXT_PUBLIC_AWS_RDS_HOST);
    console.log("user", process.env.NEXT_PUBLIC_AWS_RDS_USER);
    console.log("password", process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD);
    console.log("database", process.env.NEXT_PUBLIC_AWS_RDS_DATABASE);
    // Fetch profile data
    const response = await axios.get(url, { headers });

    const profile = response.data;
    const { userId, studentId, firstNameEN, lastNameEN, facultyCode, studentYear } = profile;

    // Check if the user exists in the database
    const [userResult] = await con.query("SELECT * FROM users WHERE userId = ?", [userId]) as any;

    if (userResult.length > 0) {
      // User already exists
      console.log("User already exists:", userId);
      return NextResponse.json(response.data);
    }

    // Insert into 'users' table
    const insertUserQuery = `
      INSERT INTO users (userId, studentId, firstName, lastName, facultyCode, studentYear)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const userValues = [userId, studentId, firstNameEN, lastNameEN, facultyCode, studentYear];

    await con.query(insertUserQuery, userValues);

    // Insert into 'salesParams' table
    const insertSalesQuery = `
      INSERT INTO salesParams (userId, successRate, jobsSold, rehired, avgResponse, bio, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const salesValues = [
      userId,
      100,
      0,
      0,
      0,
      `Hello, My name is ${firstNameEN} ${lastNameEN}!`,
      5.0,
    ];

    await con.query(insertSalesQuery, salesValues);

    console.log("Profile added to database:", { userId });
    return NextResponse.json(response.data); // Send back the profile data
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 });
  } finally {
    await con.end();
  }
}
