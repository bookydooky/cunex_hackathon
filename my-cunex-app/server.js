require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json()); // Use express built-in body parser for JSON data
app.use(cors()); // Ensure CORS is enabled for cross-origin requests

var con = mysql.createConnection({
  host: process.env.NEXT_PUBLIC_AWS_RDS_HOST,
  user: process.env.NEXT_PUBLIC_AWS_RDS_USER,
  password: process.env.NEXT_PUBLIC_AWS_RDS_PASSWORD,
  database: process.env.NEXT_PUBLIC_AWS_RDS_DATABASE,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connection successful");
});

app.get("/", (req, res) => {
  res.json("OK");
});

app.post("/addPortfolio", (req, res) => {
  let newId;
  const { workTitle, workType, price, duration, description } = req.body;

  if (!workTitle || !workType || !price || !duration || !description) {
    return res.status(400).json({ error: "All fields required" });
  }

  // Step 1: Fetch the latest bannerId from the database
  const getLatestIdQuery =
    "SELECT bannerId FROM jobBanners ORDER BY bannerId DESC LIMIT 1";

  con.query(getLatestIdQuery, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      // Step 2: Extract numeric part, increment it, and format it
      let lastId = result[0].bannerId.replace(/^0+/, ""); // Remove leading zeros
      let nextId = parseInt(lastId, 10) + 1; // Increment by 1

      newId = nextId.toString().padStart(20, "0"); // Ensure 20-character format
    } else {
      // If no records exist, start from "00000000000000000001"
      newId = "00000000000000000001";
    }

    // Step 3: Insert new row with auto-incremented bannerId
    const insertQuery =
      "INSERT INTO jobBanners (bannerId, userId, bannerName, price, duration, typeOfWork, bannerDesc, tools) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      newId,
      "100000000000000001",
      workTitle,
      price,
      duration,
      workType,
      description,
      "AAA",
    ];

    con.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log("Portfolio added with bannerId:", newId);
      res
        .status(200)
        .json({ message: "Portfolio added successfully", bannerId: newId });
    });
  });
});
const getNextImageId = async () => {
  return new Promise((resolve, reject) => {
    con.query("SELECT MAX(imageId) AS lastId FROM images", (err, result) => {
      if (err) return reject(err);

      let lastId = result[0]?.lastId || "0".repeat(20);
      let numericPart = parseInt(lastId, 10) || 0;
      let nextId = (numericPart + 1).toString().padStart(20, "0");

      resolve(nextId);
    });
  });
};

// Route to receive image URLs
app.post("/addImages", async (req, res) => {
  const { images, bannerId } = req.body;

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }

  try {
    let values = images.map((imageUrl) => [bannerId, imageUrl]);

    // Insert the image data into the database. imageId is AUTO_INCREMENT, so we don't include it.
    const sql = "INSERT INTO images (bannerId, imageURL) VALUES ?";
    con.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        success: true,
        message: "Images saved successfully",
        insertedCount: result.affectedRows,
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/latest-jobs", (req, res) => {
  const limitParam = req.query.limit;
  const typeOfWorkParam = req.query.typeOfWork; // Get typeOfWork filter from query

  // Base query
  let query = `
    SELECT jb.bannerId, jb.bannerName, jb.price, jb.typeOfWork, 
           MIN(img.imageId) as firstImageId, 
           (SELECT imageURL FROM images WHERE bannerId = jb.bannerId ORDER BY imageId ASC LIMIT 1) as imageURL
    FROM jobBanners jb
    LEFT JOIN images img ON jb.bannerId = img.bannerId
  `;

  // Add filter for typeOfWork if provided
  if (typeOfWorkParam) {
    query += ` WHERE jb.typeOfWork = ? `;
  }

  query += ` GROUP BY jb.bannerId ORDER BY jb.bannerId DESC`;

  // Add LIMIT clause only if a numeric limit is provided
  if (
    limitParam &&
    limitParam.toLowerCase() !== "none" &&
    !isNaN(parseInt(limitParam))
  ) {
    query += ` LIMIT ${parseInt(limitParam)}`;
  }

  // Execute query with filtering parameter (if provided)
  con.query(query, typeOfWorkParam ? [typeOfWorkParam] : [], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ jobs: results });
  });
});

app.get("/jobDetails/:bannerId", (req, res) => {
  const { bannerId } = req.params;

  // Query to fetch job details
  const jobQuery =
    "SELECT bannerId, userId, bannerName, price, duration, typeOfWork, bannerdesc FROM jobBanners WHERE bannerId = ?";

  // Query to fetch image URLs
  const imageQuery = "SELECT imageURL FROM images WHERE bannerId = ?";

  con.query(jobQuery, [bannerId], (err, jobResult) => {
    if (err) {
      console.error("Error fetching job details:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (jobResult.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Fetch images after job details are retrieved
    con.query(imageQuery, [bannerId], (err, imageResult) => {
      if (err) {
        console.error("Error fetching images:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Extract image URLs into an array
      const images = imageResult.map((row) => row.imageURL);

      // Return combined job details with images
      res.json({
        ...jobResult[0], // Job details
        images, // Image URLs
      });
    });
  });
});
app.get("/getFreelanceDetails/:userId", (req, res) => {
  const { userId } = req.params;

  // Query to fetch user details
  const userQuery = `
    SELECT u.firstName, u.lastName, u.facultyCode, u.studentYear, 
           f.facultyNameEN 
    FROM users u
    LEFT JOIN faculties f ON u.facultyCode = f.facultyCode
    WHERE u.userId = ?
  `;

  // Query to fetch sales parameters
  const salesQuery = `
    SELECT successRate, jobsSold, rehired, avgResponse, bio, rating 
    FROM salesParams 
    WHERE userId = ?
  `;

  con.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch sales parameters after user details are retrieved
    con.query(salesQuery, [userId], (err, salesResult) => {
      if (err) {
        console.error("Error fetching sales parameters:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Merge user details with sales parameters
      const userData = {
        ...userResult[0],
        ...salesResult[0],
      };

      res.json(userData);
    });
  });
});

app.post("/confirmJob/:bannerId", async (req, res) => {
  const { bannerId } = req.params;

  if (!bannerId) {
    return res.status(400).json({ error: "Banner Error" });
  }

  try {
    values = [
      [bannerId, "100000000000000001", "100000000000000001", new Date(), 0],
    ];
    const sql =
      "INSERT INTO jobHistory (bannerId, sellerId, buyerId, dateSold, progress) VALUES ?";
    con.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({
        success: true,
        message: "Job Added Successfully",
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/getOngoingJobs", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "Missing User" });
  }
  // Query job history with banner and buyer information
  const jobData = `
    SELECT jh.*, jb.bannerName, jb.price, jb.duration,
           u.firstName, u.lastName
    FROM jobHistory jh
    LEFT JOIN jobBanners jb ON jh.bannerId = jb.bannerId
    LEFT JOIN users u ON jh.buyerId = u.userId
    WHERE jh.sellerId = ? and jh.progress != 3
  `;
  con.query(jobData, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ jobs: result });
  });
});

app.post("/addSubmittedImages", async (req, res) => {
  const { images, historyId } = req.body;

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }

  try {
    let values = images.map((imageUrl) => [historyId, imageUrl]);

    // Insert the image data into the database. imageId is AUTO_INCREMENT, so we don't include it.
    const sql = "INSERT INTO submittedImages (historyId, imageURL) VALUES ?";
    con.query(sql, [values], async (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // After images are inserted, update the progress in jobHistory table
      const updateProgressSql = `
        UPDATE jobHistory
        SET progress = progress + 1
        WHERE historyId = ?
      `;
      con.query(updateProgressSql, [historyId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Error updating progress:", updateErr);
          return res.status(500).json({ error: "Failed to update progress" });
        }

        // Return success response
        res.json({
          success: true,
          message: "Images saved and progress updated successfully",
          insertedCount: result.affectedRows,
        });
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
