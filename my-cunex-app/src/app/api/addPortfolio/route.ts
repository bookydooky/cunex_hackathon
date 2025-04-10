import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
type UserResult = {
  userId: string;
};
export async function POST(request: NextRequest) {
  const con = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
    user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
    password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
    database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
  });

  const {
    userId,
    workTitle,
    workType,
    price,
    duration,
    description,
    colabType,
    addMembers,
    tools,
  } = await request.json();

  if (!workTitle || !workType || !price || !duration || !description) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  try {
    // Step 1: Fetch the latest bannerId from the database
    const [result] = (await con.execute(
      "SELECT bannerId FROM jobBanners ORDER BY bannerId DESC LIMIT 1"
    )) as any;

    let newId;
    if (result.length > 0) {
      // Step 2: Extract numeric part, increment it, and format it
      const lastId = result[0].bannerId.replace(/^0+/, ""); // Remove leading zeros
      const nextId = parseInt(lastId, 10) + 1; // Increment by 1
      newId = nextId.toString().padStart(20, "0"); // Ensure 20-character format
    } else {
      // If no records exist, start from "00000000000000000001"
      newId = "00000000000000000001";
    }

    // Step 3: Insert new row with auto-incremented bannerId
    const insertQuery = `
      INSERT INTO jobBanners (bannerId, userId, bannerName, price, duration, typeOfWork, bannerDesc, tools)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      newId,
      userId,
      workTitle,
      price,
      duration,
      workType,
      description,
      tools,
    ];
    await con.execute(insertQuery, values);

    // Build query dynamically based on the inputs
    const colabTypeQuery =
      colabType.length > 0
        ? `typeOfWork IN (${colabType.map(() => "?").join(",")})`
        : "1=0";
    const addMembersQuery =
      addMembers.length > 0
        ? `studentId IN (${addMembers.map(() => "?").join(",")})`
        : "1=0";

    const selectUsersQuery = `
      SELECT DISTINCT userId 
      FROM (
        SELECT userId FROM jobBanners WHERE ${colabTypeQuery} AND userId != ?
        UNION
        SELECT userId FROM users WHERE ${addMembersQuery}
      ) AS combined_users
    `;

    const queryParams = [...colabType, userId];
    if (addMembers.length > 0) {
      queryParams.push(...addMembers);
    }

    const [userResults] = (await con.execute(
      selectUsersQuery,
      queryParams
    )) as any;

    if (userResults.length === 0) {
      return NextResponse.json({
        message: "Portfolio added successfully, but no matching users found",
        bannerId: newId,
        usersWithSameWorkType: [],
      });
    }

    // Step 4: Insert each userId into colabs table
    const insertColabsQuery = "INSERT INTO colabs (bannerId, userId) VALUES ?";
    const colabValues = userResults.map((row: UserResult) => [
      newId,
      row.userId,
    ]);
    await con.query(insertColabsQuery, [colabValues]);

    return NextResponse.json({
      message: "Portfolio added successfully, and collaborations created",
      bannerId: newId,
      usersWithSameWorkType: userResults,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
