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

		resp.status(200).json({
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
			name: user.name,
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
	const user = await User.findById(req.user._id);

	if (user) {
		resp.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		resp.status(404);
		throw new Error("User not found");
	}
});

// @desc  Update user profile
// @route  PUT/api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, resp) => {
	const user = await User.findById(req.user._id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();

		resp.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		resp.status(404);
		throw new Error("User not found");
	}
});

// @desc  Get users
// @route  GET/api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, resp) => {
	const users = await User.find({});
	resp.status(200).json(users);
});

// @desc  Get user by ID
// @route  GET/api/users/:id
// @access Private/Admin
const getUserByID = asyncHandler(async (req, resp) => {
	const user = await User.findById(req.params.id).select("-password");

	if (user) {
		resp.status(200).json(user);
	} else {
		resp.status(404);
		throw new Error("User not found");
	}
});

// @desc  Delete users
// @route  DELETE/api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, resp) => {
	const user = await User.findById(req.params.id);

	if (user) {
		if (user.isAdmin) {
			resp.status(400);
			throw new Error("Cannot delete admin user");
		}
		await User.deleteOne({ _id: user._id });
		resp.status(200).json({ message: "User deleted successfully" });
	} else {
		resp.status(404);
		throw new Error("User not found");
	}
});

// @desc  Update users
// @route  PUT/api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, resp) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = Boolean(req.body.isAdmin);

		const updatedUser = await user.save();

		resp.status(200).json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	} else {
		resp.status(404);
		throw new Error("User not found");
	}
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
