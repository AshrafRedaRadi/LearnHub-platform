/**
 * One-off script: set image URL on every course that has no image.
 *
 * Usage (from backend folder, with .env containing MONGODB_URI):
 *   node utils/backfillCourseImages.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../models/Course");
const { getDefaultCourseImage, isMissingCourseImage } = require("./courseImageDefaults");

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected:", mongoose.connection.name);

  const query = {
    $or: [
      { image: { $exists: false } },
      { image: null },
      { image: "" },
      { image: { $regex: /^\s*$/ } },
    ],
  };

  const courses = await Course.find(query);
  console.log(`Found ${courses.length} course(s) without image.`);

  let updated = 0;
  for (const course of courses) {
    if (!isMissingCourseImage(course.image)) continue;
    course.image = getDefaultCourseImage(course.category);
    await course.save();
    updated += 1;
    console.log(`${course.title} : ${course.image.slice(0, 50)}…`);
  }

  console.log(`Done. Updated ${updated} document(s).`);
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
