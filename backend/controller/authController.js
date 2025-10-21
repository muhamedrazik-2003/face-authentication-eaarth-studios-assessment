const users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getFaceDescriptor, faceapi } = require("../config/faceapiConfig");

const isProduction = process.env.NODE_ENV === "production";

// Helper
const sendError = (res, code, message) => res.status(code).json({ message });

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const photoId = req.files?.idImage?.[0];
    const selfie = req.files?.selfie?.[0];

    if (!fullName || !email || !password || !photoId || !selfie) {
      return sendError(res, 400, "Please provide all required fields");
    }

    const existing = await users.findOne({ email });
    if (existing) return sendError(res, 400, "User already exists");

    const idDescriptor = await getFaceDescriptor(photoId.buffer);
    const selfieDescriptor = await getFaceDescriptor(selfie.buffer);

    if (!idDescriptor || !selfieDescriptor)
      return sendError(res, 400, "Face not detected in image(s)");

    const distance = faceapi.euclideanDistance(idDescriptor, selfieDescriptor);
    if (distance > 0.6) return sendError(res, 400, "Faces do not match");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await users.create({
      fullName,
      email,
      password: hashedPassword,
      faceDescriptor: Array.from(selfieDescriptor),
      status: "pending",
      role: "user",
    });

    res.status(201).json({
      message: "User registration successful. Please wait for verification.",
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Verify Existing User
exports.VerfiyExistingUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req body recieved", req.body);
    if (!email || !password)
      return sendError(res, 400, "Email and password required");

    const user = await users.findOne({ email });
    if (!user) return sendError(res, 404, "User not found");

    if (user.status === "rejected")
      return sendError(res, 403, "Your account has been rejected");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 400, "Invalid password");

    res.json({ message: "User verified", userEmail: user.email });
  } catch (err) {
    console.error("Verify Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Login with Face Authentication
exports.loginWithFaceAuthentication = async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file) return sendError(res, 400, "selfie required");
    if (!email) return sendError(res, 400, "Email not provided");

    const user = await users.findOne({ email });
    if (!user) return sendError(res, 404, "User not found");

    const selfieDescriptor = await getFaceDescriptor(req.file.buffer);
    if (!selfieDescriptor) return sendError(res, 400, "Face not detected");

    const distance = faceapi.euclideanDistance(
      user.faceDescriptor,
      selfieDescriptor
    );

    if (distance > 0.6) return sendError(res, 400, "Faces do not match");

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        _id:user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      },
    });
  } catch (err) {
    console.error("Face Auth Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Change Account Status
exports.changeAccountStatus = async (req, res) => {
  try {
    const { status, userId } = req.body;
    if (!status) return sendError(res, 400, "Status not provided");

    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );
    if (!updatedUser) return sendError(res, 404, "User not found");

    res.json({
      message: "Status updated",
      user: {
        _id:updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        status: updatedUser.status,
        createdAt: updatedUser.createdAt
      },
    });
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find(
      {},
      "email fullName role status createdAt _id"
    );

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({
      message: "All users retrieved successfully.",
      allUsers,
    });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({
      message: "Internal Server Error. Please try again later.",
    });
  }
};
