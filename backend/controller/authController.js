const users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getFaceDescriptor, faceapi } = require("../config/faceapiConfig");

const isProduction = process.env.NODE_ENV === "production";

exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const photoIdBuffer = req.files["idImage"][0].buffer;
    const selfieBuffer = req.files["selfie"][0].buffer;
    if (!fullName || !email || !password || !photoIdBuffer || !selfieBuffer) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide all details" });
    }

    const idDescriptor = Array.from(await getFaceDescriptor(photoIdBuffer));
    const selfieDescriptor = Array.from(await getFaceDescriptor(selfieBuffer));

    const distance = faceapi.euclideanDistance(idDescriptor, selfieDescriptor);
    console.log("Distance between ID image and selfie:", distance);
    if (distance > 0.6) {
      return res
        .status(400)
        .json({ success: false, message: "Faces do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new users({
      email,
      password: hashedPassword,
      fullName,
      faceDescriptor: selfieDescriptor,
      status: "pending",
      role: "user",
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message:
        "user Registration Successfull. please wait until your account has been verifed",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.VerfiyExistingUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Email and Password" });

    const existingUser = await users.findOne({ email });

    if (!existingUser)
      return res.status(401).json({
        success: false,
        message: "User with this email doesn't Exist",
      });

    if (existingUser.status === "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Your Account is Currently under verification. please a wait until your account is activated",
      });
    }
    if (existingUser.status === "rejected") {
      return res.status(400).json({
        success: false,
        message:
          "Your Account has been Rejected by Admin please contact customer support for more info",
      });
    }

    console.log("existingUser:", existingUser);
    console.log("existingUser.password:", existingUser.password);

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Password" });
    }

    res.status(200).json({
      success: true,
      message: "user verification success",
      userEmail: existingUser.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.loginWithFaceAuthentication = async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Selfie file is required",
      });
    }
    const selfieBuffer = req.file.buffer;

    console.log("request body and files recieved", req.body, req.files);

    if (!email || !selfieBuffer) {
      return res.status(400).json({
        success: false,
        message: "Please Provide email and image for face authentication",
      });
    }
    const currentUser = await users.findOne({ email });
    if (!currentUser)
      return res.status(401).json({
        success: false,
        message: "User with this email doesn't Exist",
      });
    const existingSelfieDescriptor = currentUser.faceDescriptor;

    const selfieDescriptor = Array.from(await getFaceDescriptor(selfieBuffer));

    const distance = faceapi.euclideanDistance(
      existingSelfieDescriptor,
      selfieDescriptor
    );
    console.log("Distance between stored selfie and login selfie:", distance);
    if (distance > 0.6) {
      return res
        .status(400)
        .json({ success: false, message: "Faces do not match" });
    }

    const accessToken = jwt.sign(
      { userId: currentUser._id, role: currentUser.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1hr" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        email: currentUser.email,
        fullName: currentUser.fullName,
        role: currentUser.role,
        status: currentUser.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changeAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.userId;
    console.log(userId);

    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "Status value not Provided" });

    const updatedUser = await users.findByIdAndUpdate(userId, { status }, {new: true});

    if(!updatedUser) return res.status(400).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      user: {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
