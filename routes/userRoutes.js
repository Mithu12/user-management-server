import express from "express";
import {
  getUsers,
  getSingleUser,
  deleteUser,
  createUser,
  updateUser,
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router()


router.route('/').get(getUsers)
router.route('/:id').get(getSingleUser)
router.route('/').post(upload.single('image'), createUser)
router.route('/').patch(upload.single('image'), updateUser)
router.route('/:id').delete(deleteUser)




export default router
