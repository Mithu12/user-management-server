import asyncHandler from "express-async-handler";
import pool from "../utils/db.js";
import fs from 'fs'
import path from "path";


// @desc    fetch all Users
// @route   GET /api/users

export const getUsers = asyncHandler(async (req, res) => {
  let currentPage = req.query.currentPage || 1
  const {limit = 20} = req.query

  // const whereClause = lastId ? `WHERE users.id<${Number(lastId)}` : ''

  const countQuery = `SELECT count(*) FROM users`
  const count = await pool.query(countQuery)

  const query = `SELECT * FROM users ORDER BY users.id DESC LIMIT ${Number(limit)} OFFSET ${(currentPage-1)*limit}`
  const users = await pool.query(query)

  res.json({
    message: '',
    success: true,
    data: users.rows,
    totalPages: Math.ceil(count.rows[0].count / limit)
  })
})


// @desc    fetch single User details
// @route   GET /api/users/:id


export const getSingleUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  const query = `SELECT * FROM users WHERE users.id=${id}`

  const user = await pool.query(query)
  if (user.rows.length)
    res.json({
      message: '',
      success: true,
      data: user.rows[0]
    })
  else {
    res.status(404)
    throw new Error('User not found')
  }
})


// @desc    Creat User
// @route   POST /api/users


export const createUser = asyncHandler(async (req, res) => {

  const image = '/' + req.file.filename


  const {
    name,
    email,
    phone,
    nid = 0,
    area,
    district,
    postalCode
  } = req.body

  const userInfo = `'${image}','${name}','${email}','${phone}',${nid ? nid : 0},'${area}','${district}', ${postalCode}`
  const query = `INSERT INTO users(
    image,
    name,
    email,
    phone,
    nid,
    area,
    district,
    postalCode
    ) VALUES(${userInfo})`
  await pool.query(query)
  res.json({
    message: '',
    success: true,
  })
})


// @desc    Update User
// @route   PATCH /api/users/:id


export const updateUser = asyncHandler(async (req, res) => {
  const image = req.file ? '/' + req.file.filename : ''
  const {
    id,
    name,
    email,
    phone,
    nid,
    area,
    district,
    postalCode
  } = req.body

  let oldData = null
// check if a new image has been uploaded then set oldData
  if (image) {
    const oldDataQuery = `SELECT image FROM users WHERE users.id=${id}`
    oldData = await pool.query(oldDataQuery)
  }
  const query = `UPDATE users SET ${image ? `image = '${image}',` : ''}
    name = '${name}',
    email = '${email}',
    phone = '${phone}',
    nid = ${nid},
    area = '${area}',
    district = '${district}',
    postalCode = ${postalCode} where users.id = ${id}`
  await pool.query(query)

  // remove old image after updating using oldData
  if (oldData) {
    const oldImageFile = oldData.rows[0].image
    const __dirname = path.resolve()
    const filePath = __dirname + '/uploads' + oldImageFile
    if (fs.existsSync(filePath)) {
      await fs.unlinkSync(filePath)
    }
  }

  res.json({
    message: 'Updated Successfully',
    success: true,
  })
})


// @desc    Delete User
// @route   GET /api/users/:id

export const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.params
  const query = `SELECT image FROM users WHERE users.id=${id}`
  const userRemoveQuery = `DELETE FROM users WHERE users.id=${id}`
  const user = await pool.query(query)

  if (user.rows.length) {
    await pool.query(userRemoveQuery)
    const oldImageFile = user.rows[0].image
    const __dirname = path.resolve()
    const filePath = __dirname + '/uploads' + oldImageFile
    if (fs.existsSync(filePath)) {
      await fs.unlinkSync(filePath)
    }
    res.json({
      message: 'Deleted Successfully',
      success: true,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

