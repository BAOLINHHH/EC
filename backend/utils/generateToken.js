import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // Kiểm tra sự tồn tại của JWT_SECRET
  // if (!process.env.JWT_SECRET) {
  //   throw new Error("JWT_SECRET is not defined in the environment variables");
  // }

  // const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
  //   expiresIn: '30d',
  // });

  // Set JWT as HTTP-Only cookie
  // res.cookie('jwt', token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV !== 'development',  // Chỉ sử dụng secure khi trong môi trường production
  //   sameSite: 'Strict',  // 'Strict' là lựa chọn tốt nhất cho bảo mật
  //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  // });

  return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '30d' }) // Trả về token để có thể log ra ngoài
}

export default generateToken;
