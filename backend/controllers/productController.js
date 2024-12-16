import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import moment from "moment";
import mongoose from "mongoose";

// @desc     Fetch all products
// @route    Get api/products
// @access   Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 9;
  const page = Number(req.query.pageNumber) || 1;

  const checkValue = (value) => {
    return !value || (!!value && typeof value === "string" && value === "null");
  };
  const keyword = !checkValue(req.query.keyword)
    ? { bookName: { $regex: req.query.keyword, $options: "i" } }
    : {};
  // console.log('requestKeyword',requestKeyword, !!requestKeyword , typeof requestKeyword, typeof requestKeyword=== 'string',requestKeyword ===null,requestKeyword==='null')
  // Helper function to build the category query
  const categoryCondition = (category) => {
    if (mongoose.Types.ObjectId.isValid(category)) {
      // If it's a valid ObjectId, query directly
      return { category: new mongoose.Types.ObjectId(category) };
    } else {
      // Use regex if it's a string
      return { category: { $regex: category, $options: "i" } };
    }
  };

  const category = !checkValue(req.query.category)
    ? categoryCondition(req.query.category)
    : {};

  //filter Price
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  // Kiểm tra xem minPrice và maxPrice có phải là số hợp lệ không
  // if (isNaN(minPrice) || isNaN(maxPrice)) {
  //   res.status(400);
  //   throw new Error('Invalid minPrice or maxPrice, minPrice and maxPrice must to be a number.');
  // }
  // console.log('minPrice', minPrice)
  // console.log('maxPrice',maxPrice)

  const price =
    !checkValue(minPrice) && !checkValue(maxPrice)
      ? { bookPrice: { $gte: minPrice, $lte: maxPrice } }
      : {};
  //Public Company filter
  const publicCompanyCondition = (publicCompany) => {
    if (mongoose.Types.ObjectId.isValid(publicCompany)) {
      return { publicCompany: new mongoose.Types.ObjectId(publicCompany) };
    } else {
      return { publicCompany: { $regex: publicCompany, $options: "i" } };
    }
  };

  const publicCompany = !checkValue(req.query.publicCompany)
    ? publicCompanyCondition(req.query.publicCompany)
    : {};

  //Author filter
  const authorCondition = (author) => {
    if (mongoose.Types.ObjectId.isValid(author)) {
      return { author: new mongoose.Types.ObjectId(author) };
    } else {
      return { author: { $regex: author, $options: "i" } };
    }
  };

  const author = !checkValue(req.query.author)
    ? authorCondition(req.query.author)
    : {};

  ///filter form
  const formCondition = (form) => {
    if (mongoose.Types.ObjectId.isValid(form)) {
      return { form: new mongoose.Types.ObjectId(form) };
    } else {
      return { form: { $regex: form, $options: "i" } };
    }
  };

  const form = !checkValue(req.query.form) ? formCondition(req.query.form) : {};

  ///filter language
  const languageCondition = (language) => {
    if (mongoose.Types.ObjectId.isValid(language)) {
      return { language: new mongoose.Types.ObjectId(language) };
    } else {
      return { language: { $regex: language, $options: "i" } };
    }
  };

  const language = !checkValue(req.query.language)
    ? languageCondition(req.query.language)
    : {};

  // filter rate
  const rate = !checkValue(req.query.rate)
    ? { rating: { $lte: req.query.rate } }
    : {};

  // sort
  const sortOption = req.query.sort || ""; // Lấy giá trị sắp xếp từ request
  let sortCriteria = {}; // Tiêu chí sắp xếp mặc định

  switch (sortOption) {
    case "price_asc":
      sortCriteria = { bookPrice: 1 }; // Sắp xếp giá tăng dần
      break;
    case "price_desc":
      sortCriteria = { bookPrice: -1 }; // Sắp xếp giá giảm dần
      break;
    case "rating_asc":
      sortCriteria = { rating: 1 }; // Sắp xếp rating tăng dần
      break;
    case "rating_desc":
      sortCriteria = { rating: -1 }; // Sắp xếp rating giảm dần
      break;
    case "name_asc":
      sortCriteria = { bookName: 1 }; // Sắp xếp tên theo alphabet tăng dần
      break;
    case "name_desc":
      sortCriteria = { bookName: -1 }; // Sắp xếp tên theo alphabet giảm dần
      break;
    default:
      sortCriteria = { _id: -1 }; // Mặc định: sắp xếp theo ID mới nhất
  }

  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  });
  const products = await Product.find({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  })
    .sort(sortCriteria)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category")
    .populate("author")
    .populate("form")
    .populate("publicCompany")
    .populate("language");

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc     Fetch all eBook products
// @route    GET api/products/ebooks
// @access   Public
const getEbooks = asyncHandler(async (req, res) => {
  // Lọc theo điều kiện ebook
  const ebookCondition = { ebook: true };

  // Lấy tất cả các sản phẩm ebook mà không có phân trang hay sắp xếp
  const products = await Product.find(ebookCondition)
    .populate("category")
    .populate("author")
    .populate("form")
    .populate("publicCompany")
    .populate("language")
    .populate("rating");
  // Trả về kết quả
  res.json({ products });
});


// @desc     Fetch all products (ADMIN)
// @route    Get api/products/admin
// @access   Public
const getProductsAdmin = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 5; // Giá trị mặc định là 5 nếu không có
  const page = Number(req.query.pageNumber) || 1;

  const checkValue = (value) => {
    return !value || (!!value && typeof value === "string" && value === "null");
  };

  const keyword = !checkValue(req.query.keyword)
    ? { bookName: { $regex: req.query.keyword, $options: "i" } }
    : {};

  // Helper function to build the category query
  const categoryCondition = (category) => {
    if (mongoose.Types.ObjectId.isValid(category)) {
      return { category: new mongoose.Types.ObjectId(category) };
    } else {
      return { category: { $regex: category, $options: "i" } };
    }
  };

  const category = !checkValue(req.query.category)
    ? categoryCondition(req.query.category)
    : {};

  // Filter Price
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;

  const price =
    !checkValue(minPrice) && !checkValue(maxPrice)
      ? { bookPrice: { $gte: minPrice, $lte: maxPrice } }
      : {};

  // Public Company filter
  const publicCompanyCondition = (publicCompany) => {
    if (mongoose.Types.ObjectId.isValid(publicCompany)) {
      return { publicCompany: new mongoose.Types.ObjectId(publicCompany) };
    } else {
      return { publicCompany: { $regex: publicCompany, $options: "i" } };
    }
  };

  const publicCompany = !checkValue(req.query.publicCompany)
    ? publicCompanyCondition(req.query.publicCompany)
    : {};

  // Author filter
  const authorCondition = (author) => {
    if (mongoose.Types.ObjectId.isValid(author)) {
      return { author: new mongoose.Types.ObjectId(author) };
    } else {
      return { author: { $regex: author, $options: "i" } };
    }
  };

  const author = !checkValue(req.query.author)
    ? authorCondition(req.query.author)
    : {};

  // Filter form
  const formCondition = (form) => {
    if (mongoose.Types.ObjectId.isValid(form)) {
      return { form: new mongoose.Types.ObjectId(form) };
    } else {
      return { form: { $regex: form, $options: "i" } };
    }
  };

  const form = !checkValue(req.query.form) ? formCondition(req.query.form) : {};

  // Filter language
  const languageCondition = (language) => {
    if (mongoose.Types.ObjectId.isValid(language)) {
      return { language: new mongoose.Types.ObjectId(language) };
    } else {
      return { language: { $regex: language, $options: "i" } };
    }
  };

  const language = !checkValue(req.query.language)
    ? languageCondition(req.query.language)
    : {};

  // Filter rate
  const rate = !checkValue(req.query.rate)
    ? { rating: { $lte: req.query.rate } }
    : {};

  // Pagination logic
  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  });

  const products = await Product.find({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category")
    .populate("author")
    .populate("form")
    .populate("publicCompany")
    .populate("language");
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc     Fetch a product
// @route    Get /api/products/:id
// @access   Public

const getProductById = asyncHandler(async (req, res) => {
  const products = await Product.findById(req.params.id)
    .populate("category")
    .populate("author")
    .populate("form")
    .populate("publicCompany")
    .populate("language");

  if (products) {
    return res.json(products);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc     Create a product
// @route    POST /api/products
// @access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  console.log("req.file", req.files);

  const bookImage = req.files[0].url;
  let pdfUrl = "";
  let audioUrl = "";
  let pdfUrlPresent = "";
  let audioUrlPresent = "";
  if (req.files && req.files.length == 3) {
    pdfUrlPresent = req.files[1].url;
    audioUrlPresent = req.files[2].url;
  }
  if (req.files && req.files.length == 5) {
    pdfUrl = req.files[1].url;
    audioUrl = req.files[2].url;
    audioUrlPresent = req.files[3].url;
    pdfUrlPresent = req.files[4].url;
  }



  const product = new Product({
    bookName: req.body.bookName,
    user: req.user._id,
    category: req.body.category,
    author: req.body.author,
    publicCompany: req.body.publicCompany,
    language: req.body.language,
    form: req.body.form,
    pageNumber: req.body.pageNumber,
    bookPrice: req.body.bookPrice,
    bookDetail: req.body.bookDetail,
    bookImage: bookImage,
    quantity: req.body.quantity || 1,
    audioUrl: audioUrl,
    pdfUrl: pdfUrl,
    ebook: req.body.ebook !== undefined ? req.body.ebook : false,
    pdfUrlPresent: pdfUrlPresent || "",
    audioUrlPresent: audioUrlPresent || "",
  });

  const createdProduct = await product.save();
  // res.status(201).json({ success: true });
  res.status(201).json(createdProduct);
});

// @desc     Update a product
// @route    PUT /api/products/:id
// @access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // Lấy thông tin từ request body
  const {
    bookName,
    bookPrice,
    bookDetail,
    bookImage,
    author,
    category,
    publicCompany,
    quantity,
    language,
    form,
    pageNumber,
    audioUrl,
    pdfUrl,
    ebook,
    pdfUrlPresent,
    audioUrlPresent,
  } = req.body;

  // Tìm sản phẩm theo id
  const product = await Product.findById(req.params.id);

  if (product) {
    // Chỉ cập nhật những thuộc tính có trong request body
    if (bookName) product.bookName = bookName;
    if (bookPrice) product.bookPrice = bookPrice;
    if (bookDetail) product.bookDetail = bookDetail;
    if (bookImage) product.bookImage = bookImage;
    if (author) product.author = author;
    if (category) product.category = category;
    if (publicCompany) product.publicCompany = publicCompany;
    if (quantity) product.quantity = quantity;
    if (language) product.language = language;
    if (form) product.form = form;
    if (pageNumber) product.pageNumber = pageNumber;
    if (audioUrl) product.audioUrl = audioUrl;
    if (pdfUrl) product.pdfUrl = pdfUrl;
    if (ebook !== undefined) product.ebook = ebook;
    if (pdfUrlPresent) product.pdfUrlPresent = pdfUrlPresent;
    if (audioUrlPresent) product.audioUrlPresent = audioUrlPresent;

    // Lưu sản phẩm đã được cập nhật
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc     Delete a product
// @route    DELETE /api/products/:id
// @access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/toprated
// @access  Public
const getTopRatedProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { bookName: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const price = req.query.price ? { bookPrice: { $lte: req.query.price } } : {};
  const publicCompany = req.query.publicCompany
    ? { publicCompany: req.query.publicCompany }
    : {};
  const form = req.query.form ? { form: req.query.form } : {};
  const author = req.query.author ? { author: req.query.author } : {};
  const language = req.query.language ? { language: req.query.language } : {};
  const rate = req.query.rate ? { rating: { $gte: req.query.rate } } : {};

  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  });

  const products = await Product.find({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  })
    .sort({ rating: -1 })
    .limit(10)
    .populate("category")
    .populate("author")
    .populate("form")
    .populate("publicCompany")
    .populate("language");

  res.status(200).json({ products, count }); // Trả về sản phẩm cùng với thông tin phân trang, nếu cần có thể nhét lại vào {} -> pages: Math.ceil(count / 10)
});

// @desc     Fetch all products
// @route    Get api/products
// @access   Public
const getProducts1 = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get latest products (Sản phẩm mới)
// @route   GET /api/products/latest
// @access  Public
const getLatestProducts = asyncHandler(async (req, res) => {
  // Kiểm tra xem query có truyền 'category' hay không, nếu có thì tạo điều kiện lọc
  const categoryCondition = (category) => {
    if (mongoose.Types.ObjectId.isValid(category)) {
      // If it's a valid ObjectId, query directly
      return { category: new mongoose.Types.ObjectId(category) };
    } else {
      // Use regex if it's a string
      return { category: { $regex: category, $options: "i" } };
    }
  };

  const checkValue = (value) => {
    return !value || (!!value && typeof value === "string" && value === "null");
  };

  const category = !checkValue(req.query.category)
    ? categoryCondition(req.query.category)
    : {};

  // Tìm sản phẩm mới nhất và lọc theo category (nếu có)
  const keyword = req.query.keyword
    ? { bookName: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const price = req.query.price ? { bookPrice: { $lte: req.query.price } } : {};
  const publicCompany = req.query.publicCompany
    ? { publicCompany: req.query.publicCompany }
    : {};
  const form = req.query.form ? { form: req.query.form } : {};
  const author = req.query.author ? { author: req.query.author } : {};
  const language = req.query.language ? { language: req.query.language } : {};
  const rate = req.query.rate ? { rating: { $gte: req.query.rate } } : {};

  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  });

  const products = await Product.find({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  })
    .sort({ createdAt: -1 })
    .limit(15)
    .populate("category")
    .populate("author")
    .populate("form")
    .populate("publicCompany")
    .populate("language");

  res.status(200).json({ products, count });
});

// @desc    Get discounted products (Sản phẩm khuyến mãi)
// @route   GET /api/products/discounted
// @access  Public
const getDiscountedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ quantity: { $gt: 0 } }).limit(5);
  res.status(200).json(products);
});

// @desc    Get featured products of the week (Sản phẩm nổi bật trong tuần)
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const oneWeekAgo = moment().subtract(7, "days").toDate();

  // Lấy các sản phẩm được tạo trong tuần qua hoặc có đánh giá trong tuần qua
  const products = await Product.find({
    createdAt: { $gte: oneWeekAgo }, // Sản phẩm được tạo trong tuần qua
  })
    .sort({ rating: -1 }) // Sắp xếp theo đánh giá cao nhất
    .limit(5); // Giới hạn kết quả trả về

  res.status(200).json(products);
});

// @desc    Get personalized products for the user (Sản phẩm dành cho bạn)
// @route   GET /api/products/recommended
// @access  Private (dành cho người dùng đã đăng nhập)
const getRecommendedProducts = asyncHandler(async (req, res) => {
  const user = req.user; // Giả định user đã đăng nhập và middleware xác thực đã được thực hiện trước đó

  if (!user) {
    res.status(401);
    throw new Error("User not authenticated");
  }

  // Lấy danh sách sản phẩm từ wishlist và cart
  const wishlistProductIds = user.wishlist.map((product) => product._id);
  const cartProductIds = user.cart.map((item) => item.product._id);

  // Tổng hợp các danh mục sản phẩm dựa trên wishlist và cart
  const wishlistProducts = await Product.find({
    _id: { $in: wishlistProductIds },
  });
  const cartProducts = await Product.find({ _id: { $in: cartProductIds } });

  // Lấy danh mục từ các sản phẩm trong wishlist và cart
  const categoriesFromWishlist = wishlistProducts.map(
    (product) => product.category
  );
  const categoriesFromCart = cartProducts.map((product) => product.category);

  // Tập hợp tất cả các danh mục yêu thích
  const userPreferences = [
    ...new Set([
      ...categoriesFromWishlist,
      ...categoriesFromCart,
      ...(user.preferences || []),
    ]),
  ];

  // Gợi ý các sản phẩm dựa trên danh mục yêu thích
  const recommendedProducts = await Product.find({
    category: { $in: userPreferences },
    _id: { $nin: [...wishlistProductIds, ...cartProductIds] }, // Loại bỏ các sản phẩm đã có trong wishlist hoặc cart
  }).limit(5); // Giới hạn số sản phẩm gợi ý

  res.status(200).json(recommendedProducts);
});

// @desc    Get top-selling products (Sản phẩm bán chạy)
// @route   GET /api/products/topsellers
// @access  Public
const getTopSellerProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { bookName: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const price = req.query.price ? { bookPrice: { $lte: req.query.price } } : {};
  const publicCompany = req.query.publicCompany
    ? { publicCompany: req.query.publicCompany }
    : {};
  const form = req.query.form ? { form: req.query.form } : {};
  const author = req.query.author ? { author: req.query.author } : {};
  const language = req.query.language ? { language: req.query.language } : {};
  const rate = req.query.rate ? { rating: { $gte: req.query.rate } } : {};

  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  });

  const products = await Product.find({
    ...keyword,
    ...category,
    ...price,
    ...publicCompany,
    ...form,
    ...author,
    ...language,
    ...rate,
  })
    .sort({ numReviews: -1 }) // Sắp xếp theo rating
    .limit(10) // Giới hạn số lượng sản phẩm
    .populate("category")
    .populate("author")
    .populate("form")
    .populate("publicCompany")
    .populate("language");

  res.status(200).json({ products, count }); // Trả về sản phẩm cùng với thông tin phân trang, nếu cần có thể nhét lại vào {} -> pages: Math.ceil(count / 10)
});

// @desc    Get similar products (Sản phẩm tương tự)
// @route   GET /api/products/:id/similar
// @access  Public
const getSimilarProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Tìm các sản phẩm có cùng category với sản phẩm hiện tại, ngoại trừ sản phẩm hiện tại
  const similarProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id }, // Loại bỏ sản phẩm hiện tại ra khỏi danh sách
  }).limit(5); // Giới hạn số sản phẩm trả về

  res.status(200).json(similarProducts);
});

export {
  getProducts,
  getEbooks,
  getProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopRatedProducts,
  getProducts1,
  getLatestProducts,
  getFeaturedProducts,
  getRecommendedProducts,
  getDiscountedProducts,
  getTopSellerProducts,
  getSimilarProducts,
};