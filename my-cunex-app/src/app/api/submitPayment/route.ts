import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: NextRequest) {
  // Extract the necessary parameters from the request body
  const { userId, accountNumber, phoneNumber, bank } = await request.json();

  // Validate if all the required parameters are present
  if (!bank || !accountNumber || !phoneNumber || !userId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  // Establish a connection to the database
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  try {
    // Prepare the SQL query to insert the payment details into the 'users' table
    const sql = `
      UPDATE users
      SET bank = ?, accountNumber = ?, phoneNumber = ?
      WHERE userId = ?
    `;

    // Execute the query
    //@ts-expect-error - TS doesn't know about the mysql2/promise API
    const [result] = await con.query(sql, [
      bank,
      accountNumber,
      phoneNumber,
      userId,
    ]);

    // Check if the query affected any rows
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "User not found or no changes made" },
        { status: 404 }
      );
    }

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Payment details updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    // Log the error and return a 500 response
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  } finally {
    // Close the database connection
    await con.end();
  }
}
