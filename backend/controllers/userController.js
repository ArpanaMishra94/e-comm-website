import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc  Auth user & get token
// @route  GET/api/users/login
// @access Public
const authUser = asyncHandler(async (req, resp) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		generateToken(resp, user._id);

		resp.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		resp.status(401);
		throw new Error("Invalid email or password");
	}
});

// @desc  Register User
// @route  POST/api/users
// @access Public
const registerUser = asyncHandler(async (req, resp) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		resp.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		generateToken(resp, user._id);

		resp.status(201).json({
			_id: user._id,
			name: user.email,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		resp.status(400);
		throw new Error("Invalid user data");
	}
});

// @desc  Logout user / clear cookie
// @route  POST/api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, resp) => {
	resp.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});

	resp.status(200).json({ message: "Logged out successfully" });
});

// @desc  Get user profile
// @route  GET/api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, resp) => {
	resp.send("get user profile");
});

// @desc  Update user profile
// @route  PUT/api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, resp) => {
	resp.send("update user profile");
});

// @desc  Get users
// @route  GET/api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, resp) => {
	resp.send("get users");
});

// @desc  Get user by ID
// @route  GET/api/users/:id
// @access Private/Admin
const getUserByID = asyncHandler(async (req, resp) => {
	resp.send("get user by id");
});

// @desc  Delete users
// @route  DELETE/api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, resp) => {
	resp.send("delete user");
});

// @desc  Update users
// @route  PUT/api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, resp) => {
	resp.send("update user");
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
};
