"use server";
require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const axios = require("axios");

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
  const {
    userId,
    workTitle,
    workType,
    price,
    duration,
    description,
    colabType,
    addMembers,
  } = req.body;

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
      userId,
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

      // Build query dynamically based on the inputs
      const colabTypeQuery =
        colabType.length > 0
          ? `typeOfWork IN (${colabType.map(() => "?").join(",")})`
          : "1=0"; // If no colabTypes, return false condition

      const addMembersQuery =
        addMembers.length > 0
          ? `studentId IN (${addMembers.map(() => "?").join(",")})`
          : "1=0"; // If no addMembers, return false condition

      const selectUsersQuery = `
        SELECT DISTINCT userId 
        FROM (
          SELECT userId FROM jobBanners 
          WHERE ${colabTypeQuery} AND userId != ?
          
          UNION
          
          SELECT userId FROM users 
          WHERE ${addMembersQuery}
        ) AS combined_users`;

      // Parameter array for the query
      const queryParams = [...colabType, userId];

      // Only add addMembers parameters if there are any
      if (addMembers.length > 0) {
        queryParams.push(...addMembers);
      }

      con.query(selectUsersQuery, queryParams, (err, userResults) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (userResults.length === 0) {
          return res.status(200).json({
            message:
              "Portfolio added successfully, but no matching users found",
            bannerId: newId,
            usersWithSameWorkType: [],
          });
        }

        // Step 4: Insert each userId into colabs table
        const insertColabsQuery =
          "INSERT INTO colabs (bannerId, userId) VALUES ?";
        const colabValues = userResults.map((row) => [newId, row.userId]);

        con.query(insertColabsQuery, [colabValues], (err, colabResult) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          res.status(200).json({
            message: "Portfolio added successfully, and collaborations created",
            bannerId: newId,
            usersWithSameWorkType: userResults,
          });
        });
      });
    });
  });
});

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

app.post("/confirmJob", async (req, res) => {
  const { bannerId, userId, sellerId } = req.body;

  if (!bannerId) {
    return res.status(400).json({ error: "Banner Error" });
  }

  try {
    values = [[bannerId, sellerId, userId, new Date(), 0]];
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
    WHERE jh.sellerId = ? AND NOT (COALESCE(jh.accept,-1) = 1 OR (jh.progress = 3 AND COALESCE(jh.accept,-1) = 0))
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
        SET progress = progress + 1, accept = NULL
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
app.get("/getCompletedJobs", (req, res) => {
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
    WHERE jh.sellerId = ? AND (COALESCE(jh.accept,-1) = 1 OR (jh.progress = 3 AND COALESCE(jh.accept,-1) = 0))
  `;
  con.query(jobData, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ jobs: result });
  });
});
app.get("/getSubmittedImages", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "Missing User" });
  }
  const q = `
    SELECT jh.historyId, jb.bannerName, u.firstName, u.lastName, si.imageURL, si.submittedImageId
    FROM jobHistory jh
    LEFT JOIN jobBanners jb ON jh.bannerId = jb.bannerId
    LEFT JOIN users u ON jh.sellerId = u.userId
    LEFT JOIN submittedImages si ON jh.historyId = si.historyId
    WHERE jh.buyerId = ? AND si.checked = 0`;
  con.query(q, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});
app.post("/acceptImage", async (req, res) => {
  const { historyId, submittedImageId } = req.body; // Get historyId from request body

  if (!historyId) {
    return res.status(400).json({ error: "Cannot Find Your Work" });
  }

  try {
    // Start a transaction to ensure data consistency
    con.beginTransaction((err) => {
      if (err) {
        console.error("Transaction error:", err);
        return res.status(500).json({ error: "Transaction error" });
      }

      // Update jobHistory table
      const updateJobHistory =
        "UPDATE jobHistory SET accept = ? WHERE historyId = ?";
      con.query(updateJobHistory, [true, historyId], (err, result) => {
        if (err) {
          return con.rollback(() => {
            console.error("Database error:", err);
            res.status(500).json({ error: "Database error" });
          });
        }

        if (result.affectedRows === 0) {
          return con.rollback(() => {
            res.status(404).json({ error: "Job not found" });
          });
        }

        // Update salesParams table: increment jobsSold and totalJobs
        const updateSalesParams = `UPDATE salesParams sp
        JOIN (
            SELECT sellerId
            FROM jobHistory
            WHERE historyId = ? 
        ) jh ON sp.userId = jh.sellerId
        SET sp.jobsSold = sp.jobsSold + 1, 
            sp.totalJobs = sp.totalJobs + 1, 
            sp.successRate = (sp.jobsSold + 1) / (sp.totalJobs + 1) * 100`;

        con.query(updateSalesParams, [historyId], (err, result) => {
          if (err) {
            return con.rollback(() => {
              console.error("Database error:", err);
              res.status(500).json({ error: "Database error" });
            });
          }

          const updateImageQuery = `
          UPDATE submittedImages 
          SET checked = TRUE 
          WHERE submittedImageId = ?`;
          con.query(updateImageQuery, [submittedImageId], (err, result) => {
            if (err) {
              return con.rollback(() => {
                console.error("Database error:", err);
                res.status(500).json({ error: "Database error" });
              });
            }
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Image not found" });
            }
            console.log("Image accepted and marked as checked:", {
              submittedImageId,
            });
          });
          // Commit transaction if both queries succeed
          con.commit((err) => {
            if (err) {
              return con.rollback(() => {
                console.error("Transaction commit error:", err);
                res.status(500).json({ error: "Transaction commit error" });
              });
            }

            res.json({
              success: true,
              message: "Job Accepted Successfully, Sales Updated",
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/denyImage", async (req, res) => {
  const { historyId, submittedImageId } = req.body; // Get historyId from request body

  if (!historyId) {
    return res.status(400).json({ error: "Cannot Find Your Work" });
  }

  try {
    // Start a transaction to ensure data consistency
    con.beginTransaction((err) => {
      if (err) {
        console.error("Transaction error:", err);
        return res.status(500).json({ error: "Transaction error" });
      }

      // Update jobHistory table
      const updateJobHistory =
        "UPDATE jobHistory SET accept = ? WHERE historyId = ?";
      con.query(updateJobHistory, [false, historyId], (err, result) => {
        if (err) {
          return con.rollback(() => {
            console.error("Database error:", err);
            res.status(500).json({ error: "Database error" });
          });
        }

        if (result.affectedRows === 0) {
          return con.rollback(() => {
            res.status(404).json({ error: "Job not found" });
          });
        }

        // Update salesParams table: increment jobsSold and totalJobs
        const updateSalesParams = `UPDATE salesParams sp
        JOIN (
            SELECT sellerId
            FROM jobHistory
            WHERE historyId = ? AND progress = 3
        ) jh ON sp.userId = jh.sellerId
        SET sp.totalJobs = sp.totalJobs + 1, 
            sp.successRate = (sp.jobsSold) / (sp.totalJobs + 1) * 100`;
        con.query(updateSalesParams, [historyId], (err, result) => {
          if (err) {
            return con.rollback(() => {
              console.error("Database error:", err);
              res.status(500).json({ error: "Database error" });
            });
          }
          const updateImageQuery = `
          UPDATE submittedImages 
          SET checked = TRUE 
          WHERE submittedImageId = ?`;
          con.query(updateImageQuery, [submittedImageId], (err, result) => {
            if (err) {
              return con.rollback(() => {
                console.error("Database error:", err);
                res.status(500).json({ error: "Database error" });
              });
            }
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: "Image not found" });
            }
            console.log("Image accepted and marked as checked:", {
              submittedImageId,
            });
          });
          // Commit transaction if both queries succeed
          con.commit((err) => {
            if (err) {
              return con.rollback(() => {
                console.error("Transaction commit error:", err);
                res.status(500).json({ error: "Transaction commit error" });
              });
            }

            res.json({
              success: true,
              message: "Job Denied Successfully, Sales Updated",
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/getJobStatus/:historyId", (req, res) => {
  const { historyId } = req.params;

  // Query to fetch job status details including the accept field
  const statusQuery =
    "SELECT jh.accept, jh.historyId " +
    "FROM jobHistory jh " +
    "WHERE jh.historyId = ?";

  con.query(statusQuery, [historyId], (err, result) => {
    if (err) {
      console.error("Error fetching job status:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Job history not found" });
    }

    // Return job status details
    res.json(result[0]);
  });
});

app.get("/fetchProfile", async (req, res) => {
  const url = `${process.env.NEXT_PUBLIC_GATEWAY}/profile?token=${process.env.NEXT_PUBLIC_TEST_TOKEN}`;
  const headers = {
    "Content-Type": "application/json",
    ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    ClientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  };

  try {
    const response = await axios.get(url, { headers });

    // Extract profile data
    const profile = response.data;

    const {
      userId,
      studentId,
      firstNameEN,
      lastNameEN,
      facultyCode,
      studentYear,
    } = profile;

    // Check if the user already exists in 'users'
    const checkUserQuery = "SELECT * FROM users WHERE userId = ?";
    con.query(checkUserQuery, [userId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "Error checking user in the database" });
      }

      if (result.length > 0) {
        console.log("User already exists:", userId);
        return res.status(200).json(response.data);
      }

      // If the user doesn't exist, insert into 'users'
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

      con.query(insertUserQuery, userValues, (err, userResult) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Error inserting data into the users table" });
        }

        // Now insert into 'salesParams'
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

        con.query(insertSalesQuery, salesValues, (err, salesResult) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({
              error: "Error inserting data into the salesParams table",
            });
          }

          console.log("Profile added to database:", {
            userResult,
            salesResult,
          });
          res.status(200).json(response.data); // Send back the profile data
        });
      });
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});
app.get("/getProfile", (req, res) => {
  const { userId } = req.query;

  // Query to fetch user details
  const userQuery = `
    SELECT u.firstName, u.lastName, u.facultyCode, u.studentYear, 
           f.facultyNameEN, u.studentId
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
app.get("/getCollaborations", (req, res) => {
  const { userId } = req.query;

  // Query to fetch collaboration details, excluding NULL historyId
  const collaborationsQuery = `
    SELECT 
      jb.bannerId,
      jb.bannerName, 
      jb.price,
      jb.duration, 
      su.firstName AS sellerFirstName, 
      su.lastName AS sellerLastName,
      su.userId AS sellerId,
      c.confirmedOrg,
      c.confirmed
    FROM colabs c
    JOIN jobBanners jb ON c.bannerId = jb.bannerId
    JOIN users su ON jb.userId = su.userId
    WHERE c.userId = ? AND (c.confirmed IS NULL OR c.confirmedOrg = True OR (c.confirmed = True AND c.confirmedOrg IS NULL))
  `;

  con.query(collaborationsQuery, [userId], (err, collaborations) => {
    if (err) {
      console.error("Error fetching collaborations:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Format the data as needed
    const formattedCollaborations = collaborations.map((collab) => ({
      bannerId: collab.bannerId,
      bannerName: collab.bannerName,
      price: collab.price,
      duration: collab.duration,
      firstName: collab.sellerFirstName,
      lastName: collab.sellerLastName,
      Id: collab.sellerId,
      confirmed: collab.confirmed,
      confirmedOrg: collab.confirmedOrg,
    }));

    res.json(formattedCollaborations);
  });
});
app.post("/denyColab", async (req, res) => {
  try {
    const { userId, bannerId } = req.body;

    if (!userId || !bannerId) {
      return res.status(400).json({ error: "Missing userId or bannerId" });
    }

    const denyQuery = `
      UPDATE colabs
      SET confirmed = FALSE
      WHERE userId = ? AND bannerId = ?
    `;

    con.query(denyQuery, [userId, bannerId], (err, result) => {
      if (err) {
        console.error("Error denying collaboration:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Collaboration not found" });
      }

      res.json({ message: "Collaboration denied successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

app.post("/acceptColab", (req, res) => {
  const { userId, bannerId } = req.body;

  const acceptQuery = `
    UPDATE colabs
    SET confirmed = TRUE
    WHERE userId = ? AND bannerId = ?
  `;

  con.query(acceptQuery, [userId, bannerId], (err, result) => {
    if (err) {
      console.error("Error accepting collaboration:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Collaboration not found" });
    }

    res.json({ message: "Collaboration accepted successfully" });
  });
});

app.get("/getBannersFromColabs", (req, res) => {
  const { userId } = req.query;

  // Query to fetch bannerId and bannerName where userId matches and bannerId is in colabs table
  const bannersQuery = `
  SELECT 
    jb.bannerId,
    jb.bannerName,
    jb.price,
    jb.duration,
    jb.typeOfWork
  FROM jobBanners jb
  WHERE jb.userId = ? AND jb.bannerId IN (SELECT bannerId FROM colabs)
`;

  con.query(bannersQuery, [userId, userId], (err, banners) => {
    if (err) {
      console.error("Error fetching banners:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Format the data as needed
    const formattedBanners = banners.map((banner) => ({
      bannerId: banner.bannerId,
      bannerName: banner.bannerName,
      price: banner.price,
      duration: banner.duration,
      typeOfWork: banner.typeOfWork,
    }));

    res.json(formattedBanners);
  });
});
app.get("/getUserDetailsFromColab", (req, res) => {
  const { bannerId } = req.query;

  // Query to fetch user details from users and faculties table based on the userId
  const userDetailsQuery = `
    SELECT 
      u.userId,
      u.firstName,
      u.lastName,
      u.studentId,
      u.studentYear,
      u.facultyCode,
      f.facultyNameEN,
      c.confirmedOrg
    FROM colabs c
    JOIN users u ON c.userId = u.userId
    JOIN faculties f ON u.facultyCode = f.facultyCode
    WHERE c.bannerId = ? AND c.confirmed = True AND (c.confirmedOrg = True OR c.confirmedOrg IS NULL)
  `;

  // Query to fetch distinct typeOfWork from jobBanners table based on the userId
  const workTypesQuery = `
    SELECT DISTINCT 
      jb.typeOfWork
    FROM jobBanners jb
    WHERE jb.userId = ?
  `;

  // Execute the user details query
  con.query(userDetailsQuery, [bannerId], (err, users) => {
    if (err) {
      console.error("Error fetching user details from colabs:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // If no user found
    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "No user found for the specified bannerId" });
    }

    // For each user, fetch the distinct typeOfWork
    const userPromises = users.map((user) => {
      return new Promise((resolve, reject) => {
        // Execute work types query for each user
        con.query(workTypesQuery, [user.userId], (err, workTypes) => {
          if (err) {
            return reject(err);
          }

          // Attach the workTypes list to the user object
          user.workTypes = workTypes.map((work) => work.typeOfWork);
          resolve(user);
        });
      });
    });

    // Resolve all userPromises
    Promise.all(userPromises)
      .then((usersWithWorkTypes) => {
        // Send the response with all users and their work types
        res.json(usersWithWorkTypes);
      })
      .catch((err) => {
        console.error("Error fetching work types:", err);
        return res.status(500).json({ error: "Internal server error" });
      });
  });
});

app.post("/acceptColabFromOwner", (req, res) => {
  const { userId, bannerId } = req.body;

  const acceptQuery = `
    UPDATE colabs
    SET confirmedOrg = TRUE
    WHERE userId = ? AND bannerId = ?
  `;

  con.query(acceptQuery, [userId, bannerId], (err, result) => {
    if (err) {
      console.error("Error accepting collaboration:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Collaboration not found" });
    }

    res.json({ message: "Collaboration accepted successfully" });
  });
});
app.post("/denyColabFromOwner", (req, res) => {
  const { userId, bannerId } = req.body;

  const acceptQuery = `
    UPDATE colabs
    SET confirmedOrg = FALSE
    WHERE userId = ? AND bannerId = ?
  `;

  con.query(acceptQuery, [userId, bannerId], (err, result) => {
    if (err) {
      console.error("Error accepting collaboration:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Collaboration not found" });
    }

    res.json({ message: "Collaboration denied successfully" });
  });
});
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
