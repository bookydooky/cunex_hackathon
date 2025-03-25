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
  return NextResponse.json({
    userId: "00101258338600000230",
    studentId: "6538123621",
    firstNameEN: "Pasut",
    lastNameEN: "Aranchaiya",
    facultyCode: "21",
    facultyNameEN: "FACULTY OF ENGINEERING",
    facultyNameTH: "คณะวิศวกรรมศาสตร์",
    studentYear: "2565",
  });
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  // Ensure the token is available
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/profile?token=${token}`;
  const headers = {
    "Content-Type": "application/json",
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    ClientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  };

  try {
    // Fetch profile data
    const response = await axios.get(url, { headers });

    const profile = response.data;
    const {
      userId,
      studentId,
      firstNameEN,
      lastNameEN,
      facultyCode,
      facultyNameEN,
      facultyNameTH,
      studentYear,
    } = profile;

    // Check if the user exists in the database
    const [userResult] = (await con.query(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    )) as any;

    if (userResult.length > 0) {
      // User already exists
      console.log("User already exists:", userId);
      return NextResponse.json(response.data);
    }
    // Check if facultyCode exists in the faculties table
    const [facultyResult] = (await con.query(
      "SELECT * FROM faculties WHERE facultyCode = ?",
      [facultyCode]
    )) as any;

    if (facultyResult.length === 0) {
      // Insert faculty details if not already in the database
      const insertFacultyQuery = `
        INSERT INTO faculties (facultyCode, facultyNameEN, facultyNameTH)
        VALUES (?, ?, ?)
      `;
      const facultyValues = [facultyCode, facultyNameEN, facultyNameTH];
      await con.query(insertFacultyQuery, facultyValues);
    }
    // Insert into 'users' table
    const insertUserQuery = `
      INSERT INTO users (userId, studentId, firstName, lastName, facultyCode, studentYear)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const userValues = [
      userId,
      studentId,
      firstNameEN,
      lastNameEN,
      facultyCode,
      studentYear,
    ];

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
    return NextResponse.json(
      { error: "Error fetching profile" },
      { status: 500 }
    );
  } finally {
    await con.end();
  }
}