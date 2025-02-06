import express from 'express';
import { courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from '../controllers/course.controller.js';

const router = express.Router()

router.post("/create", createCourse);
router.put("/update/:courseID",updateCourse);
router.delete("/delete/:courseID",deleteCourse);
router.get("/courses",getCourses);
router.get("/:courseID",courseDetails);

export default router;