import express from "express";
import pool from "../utils/db.js";
import {createUserTable, deleteUserTable, getUserTableData, insertDummyUserData} from "../utils/dbQueries.js";

const router = express.Router()

router.get('/delete/table', async (req, res) => {
  const data = await pool.query(deleteUserTable)
  res.json({message: "Table users Deleted"})
})
router.get('/create/table', async (req, res) => {
  const data = await pool.query(createUserTable)
  res.json({message: "Table users created"})
})
router.get('/list/table', async (req, res) => {
  const data = await pool.query(getUserTableData)
  res.json(data.rows)
})
router.get('/add/table', async (req, res) => {
  const data = await pool.query(insertDummyUserData)
  res.json({message: "Dummy Data added to users table"})
})

export default router
