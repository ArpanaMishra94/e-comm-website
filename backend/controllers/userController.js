import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';

// @desc  Auth user & get token
// @route  GET/api/users/login
// @access Public
const authUser = asyncHandler(async (req, resp) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        // Set JWT as HTTP-Only cookie
        resp.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000  // 30 Days
        });

        resp.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }
    else { 
        resp.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc  Register User
// @route  POST/api/users
// @access Public
const registerUser = asyncHandler(async (req, resp) => {
    resp.send('register user');
});

// @desc  Logout user / clear cookie
// @route  POST/api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, resp) => {
    resp.send('logout user');
});

// @desc  Get user profile
// @route  GET/api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, resp) => {
    resp.send('get user profile');
});

// @desc  Update user profile
// @route  PUT/api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, resp) => {
    resp.send('update user profile');
});

// @desc  Get users
// @route  GET/api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, resp) => {
    resp.send('get users');
});

// @desc  Get user by ID
// @route  GET/api/users/:id
// @access Private/Admin
const getUserByID = asyncHandler(async (req, resp) => {
    resp.send('get user by id');
});

// @desc  Delete users
// @route  DELETE/api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, resp) => {
    resp.send('delete user');
});

// @desc  Update users
// @route  PUT/api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, resp) => {
    resp.send('update user');
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserByID,
    updateUser,
}