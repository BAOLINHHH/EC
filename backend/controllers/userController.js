import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import OTP from "../models/OTPCodeModel.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// @desc     Auth user & get token
// @route    POST api/users/login
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (user.status === 0) {
      res.status(403).json({ message: "Tài khoản chưa được kích hoạt"});
    } else if (await user.matchPassword(password)) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error("Email hoặc mật khẩu không hợp lệ");
    }
  } else {
    res.status(401);
    throw new Error("Email hoặc mật khẩu không hợp lệ");
  }
});

// @desc     Gửi OTP qua email
// @route    POST /api/users/send-otp
// @access   Public
const sendOtpByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    // Kiểm tra email có trong yêu cầu hay không
    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }

    // Tạo mã OTP ngẫu nhiên và thời gian hết hạn
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // Hết hạn sau 1 phút

    // Kiểm tra nếu đã có mã OTP cho email này
    const existingOtp = await OTP.findOne({ email });

    if (existingOtp && existingOtp.expiresAt > Date.now()) {
      return res.status(400).json({ message: 'OTP vẫn còn hiệu lực. Vui lòng kiểm tra email của bạn.' });
    }

    // Cập nhật hoặc tạo mới mã OTP
    if (existingOtp) {
      existingOtp.code = otp;
      existingOtp.expiresAt = expiresAt;
      await existingOtp.save();
    } else {
      await OTP.create({ email, code: otp, expiresAt });
    }

    // Cấu hình bộ gửi SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Tùy chọn email
    const mailOptions = {
      from: `"Xác thực OTP" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Mã xác thực',
      text: `Mã OTP của bạn là: ${otp}`,
      html: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Lưu ý: mã OTP của bạn có thời hạn 1 phút.</p>`,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    // Phản hồi khi email được gửi thành công
    res.status(200).json({ message: 'Mã OTP mới đã được gửi tới email' });
  } catch (error) {
    console.error('Lỗi khi gửi OTP:', error.message || error);
    res.status(500).json({
      message: 'Gửi OTP thất bại',
      error: error.message || 'Có lỗi không mong muốn xảy ra',
    });
  }
});

// @desc     Register user with OTP verification
// @route    POST api/users/register-and-verify
// @access   Public
const registerAndVerifyUser = asyncHandler(async (req, res) => {
  const { name, email, password, otp } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !email || !password || !otp) {
    return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin và mã OTP.' });
  }

  // Kiểm tra người dùng đã tồn tại
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Người dùng đã tồn tại.' });
  }

  // Lấy thông tin OTP từ bảng OTP
  const otpRecord = await OTP.findOne({ email });

  // Kiểm tra nếu OTP không tồn tại hoặc không khớp
  if (!otpRecord || otpRecord.code !== otp) {
    return res.status(400).json({ message: 'OTP không hợp lệ.' });
  }

  // Kiểm tra thời gian hết hạn của OTP
  if (otpRecord.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'OTP đã hết hạn.' });
  }

  // Xóa mã OTP sau khi xác thực thành công
  await OTP.deleteOne({ email });

  // OTP hợp lệ, tạo người dùng mới
  const user = await User.create({
    name,
    email,
    password,
    status: 1, // Đánh dấu trạng thái đã kích hoạt
  });

  // Tạo token và trả về thông tin người dùng
  res.status(201).json({
    message: 'Xác thực OTP thành công. Người dùng đã được tạo mới.',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  });
});

// // @desc     Register user
// // @route    POST api/users
// // @access   Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400);
//     throw new Error("Người dùng đã tồn tại");
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//   });

//   if (user) {
//     generateToken(res, user._id);

//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   } else {
//     res.status(400);
//     throw new Error("Dữ liệu người dùng không hợp lệ");
//   }
// });

// // @desc     Verify OTP for user's email
// // @route    POST api/users/verify-otp
// // @access   Public
// const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     // Kiểm tra nếu thiếu email hoặc otp
//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email và OTP là bắt buộc" });
//     }

//     // Tìm người dùng với email và kiểm tra OTP
//     const user = await User.findOne({ email });

//     // Kiểm tra nếu người dùng không tồn tại hoặc OTP không trùng khớp
//     if (!user || user.code !== parseInt(otp, 10)) {
//       return res.status(400).json({ message: "OTP hoặc email không hợp lệ" });
//     }

//     // Kiểm tra thời gian hết hạn OTP
//     if (user.expiresAt < Date.now()) {
//       return res.status(400).json({ message: "Mã OTP đã hết hạn" });
//     }

//     // OTP hợp lệ, có thể tiếp tục với xác thực người dùng hoặc cập nhật trạng thái
//     res.status(200).json({ message: "Xác thực OTP thành công" });

//     // Cập nhật lại trạng thái 
//     await User.updateOne({ email }, { $set: { status: 1 } });

//   } catch (error) {
//     console.error("Lỗi khi xác thực OTP:", error.message || error);
//     res
//       .status(500)
//       .json({ message: "Xác thực OTP thất bại", error: error.message });
//   }
// };

// // @desc     Sending OTP to user's email
// // @route    POST api/users/send-otp
// // @access   Public
// const sendOtpByEmail = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Kiểm tra email có trong yêu cầu hay không
//     if (!email) {
//       return res.status(400).json({ message: "Email là bắt buộc" });
//     }

//     // Tạo mã OTP và thời gian hết hạn mới
//     const otp = crypto.randomInt(100000, 999999);
//     const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 phút sau hết hạn

//     // Tìm người dùng với email
//     const user = await User.findOne({ email });

//     // Nếu người dùng tồn tại, kiểm tra và cập nhật OTP
//     if (user) {
//       if (user.expiresAt && user.expiresAt > Date.now()) {
//         return res.status(400).json({ message: "OTP vẫn còn hiệu lực. Vui lòng kiểm tra email của bạn." });
//       }      
//       user.code = otp;
//       user.expiresAt = expiresAt;
//       await user.save();
//     }

//     // Cấu hình bộ gửi SMTP
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     // Tùy chọn email
//     const mailOptions = {
//       from: `"Xác thực OTP" <${process.env.SMTP_USER}>`,
//       to: email,
//       subject: "Mã xác thực",
//       text: `Mã OTP của bạn là: ${otp}`,
//       html: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Lưu ý: mã OTP của bạn có thời hạn 10 phút.</p>`,
//     };

//     // Gửi email
//     await transporter.sendMail(mailOptions);

//     // Phản hồi khi email được gửi thành công
//     res.status(200).json({
//       message: "Mã OTP mới đã được gửi tới email",
//     });
//   } catch (error) {
//     console.error("Lỗi khi gửi OTP:", error.message || error);
//     res.status(500).json({
//       message: "Gửi OTP thất bại",
//       error: error.message || "Có lỗi không mong muốn xảy ra",
//     });
//   }
// };

// @desc     Logout user / clear cookie
// @route    POST api/users/logout
// @access   Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Đăng xuất thành công" });
});

// @desc     Get user profile
// @route    GET api/users/profile
// @access   Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

// // @desc     Update user profile
// // @route    Put api/users/profile
// // @access   Private
// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;

//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updateUser = await user.save();

//     res.status(200).json({
//       _id: updateUser._id,
//       name: updateUser.name,
//       email: updateUser.email,
//       isAdmin: updateUser.isAdmin,
//     });
//   } else {
//     res.status(404);
//     throw new Error("Không tìm thấy người dùng");
//   }
// });

// @desc     Get users
// @route    GET api/users
// @access   Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 10; // Số người dùng mỗi trang
  const page = Number(req.query.pageNumber) || 1; // Trang hiện tại

  // Tính tổng số người dùng
  const count = await User.countDocuments();

  // Lấy danh sách người dùng theo phân trang
  const users = await User.find()
    .limit(pageSize) // Giới hạn số lượng người dùng mỗi trang
    .skip(pageSize * (page - 1)); // Bỏ qua số người dùng đã qua trong các trang trước

  // Trả về kết quả, bao gồm người dùng, trang hiện tại và tổng số trang
  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize), // Tính tổng số trang
  });
});

// @desc     Delete user
// @route    DELETE api/users/:id
// @access   Public
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // if (user.isAdmin) {
    //   res.status(400);
    //   throw new Error("Không thể xóa người dùng admin");
    // }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

// @desc     Get user by ID
// @route    GET api/users/:id
// @access   Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

// @desc     Update user
// @route    PUT api/users/:id
// @access   Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }
});

// @desc     Request password reset (forgot password)
// @route    POST /api/users/forgot-password
// @access   Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Kiểm tra nếu email không được cung cấp
  if (!email) {
    res.status(400);
    throw new Error("Email là bắt buộc");
  }

  const user = await User.findOne({ email });

  // Kiểm tra nếu người dùng không tồn tại
  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Tạo token ngẫu nhiên
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Mã hóa token trước khi lưu trong DB
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Lưu token và thời gian hết hạn vào user document
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 1 * 60 * 1000; // Hết hạn sau 1 phút
  await user.save();

  // Cấu hình SMTP và gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const resetUrl = `localhost:4000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Đặt lại mật khẩu" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Yêu cầu đặt lại mật khẩu",
    text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng liên kết sau: ${resetUrl}`,
    html: `<p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng liên kết sau:</p><a href="${resetUrl}">${resetUrl}</a>`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "Email yêu cầu đặt lại mật khẩu đã được gửi" });
});

// @desc     Reset password
// @route    POST /api/users/reset-password
// @access   Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Kiểm tra token và mật khẩu mới có trong yêu cầu
  if (!token || !newPassword) {
    res.status(400);
    throw new Error("Token và mật khẩu mới là bắt buộc");
  }

  // Mã hóa token để so sánh với token đã lưu trong DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Tìm người dùng có token khớp và còn hạn
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, // Token chưa hết hạn
  });

  if (!user) {
    res.status(400);
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }

  // Cập nhật mật khẩu mới
  user.password = newPassword;
  user.resetPasswordToken = undefined; // Xóa token sau khi sử dụng
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
});

// @desc     Change user password
// @route    PUT /api/users/change-password
// @access   Private (Yêu cầu người dùng đăng nhập)
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Kiểm tra xem các trường dữ liệu có được cung cấp đầy đủ không
  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Mật khẩu cũ và mật khẩu mới là bắt buộc");
  }

  // Tìm người dùng hiện tại bằng ID từ token xác thực
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("Không tìm thấy người dùng");
  }

  // Kiểm tra xem mật khẩu cũ có khớp không
  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Mật khẩu cũ không chính xác");
  }

  // Cập nhật mật khẩu mới
  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });
});

export {
  authUser,
  //registerUser,
  registerAndVerifyUser,
  logoutUser,
  getUserProfile,
  //updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  sendOtpByEmail,
  //verifyOtp,
  forgotPassword,
  resetPassword,
  changePassword
};