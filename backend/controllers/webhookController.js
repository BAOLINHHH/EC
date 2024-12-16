import { getFuseInstance } from "../utils/fuseConfig.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Coupon from '../models/couponModel.js';
import Form from '../models/formModel.js';
import Language from '../models/languageModel.js';
import dotenv from "dotenv";
dotenv.config();

//const bookURL = process.env.CLIENT_URL;

// @desc    POST webhook handleWebhook
// @route   POST /webhook/handleWebhook
// @access  Private
const handleWebhook = async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  const any = req.body.queryResult.parameters.any;

  if (intentName === "MyCustomIntent") {
    // Truy cập database và lấy thông tin cần thiết
    console.log("req.body.queryResult", req.body.queryResult.parameters.any);

    let response = {
      fulfillmentText: "Dữ liệu của bạn đây",
    };
    res.json(response);
  } else if (intentName === "Cuốn sách abc có nội dung thế nào ?") {
    let response = {
      fulfillmentText: "Cuốn sách " + any + " rất hay.",
    };
    res.json(response);
  }
  if (intentName === "Cuốn sách {any} do ai sáng tác ?") {
    try {
      // Tìm kiếm sách theo tên
      const book = await Product.findOne({ bookName: any }).select(
        "author bookName"
      );

      if (book) {
        let response = {
          fulfillmentText: `Cuốn sách "${book.bookName}" được sáng tác bởi tác giả "${book.author}".`,
        };
        res.json(response);
      } else {
        let response = {
          fulfillmentText: `Xin lỗi, tôi không tìm thấy thông tin về cuốn sách "${any}". Có thể bạn cần nhập chính xác tên sách`,
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách:", error);
      let response = {
        fulfillmentText:
          "Xin lỗi tôi chưa giải quyết được câu hỏi của bạn. Vui lòng đặt câu hỏi lại sau.",
      };
      res.json(response);
    }
  } else if (intentName === "Các quyển sách nào đang bán chạy vậy?") {
    try {
      // Lấy 5 quyển sách bán chạy nhất từ cơ sở dữ liệu (sắp xếp theo rating hoặc bán chạy)
      const topRatedBooks = await Product.find()
        .sort({ rating: -1 })  // Sắp xếp theo rating cao nhất (hoặc có thể thay bằng số lượng bán)
        .limit(5)  // Lấy 5 sách
        .populate("category")
        .populate("author")
        .populate("form")
        .populate("publicCompany")
        .populate("language");
  
        if (topRatedBooks.length > 0) {
          // Tạo phản hồi với danh sách các sách
          let responseText = "Dưới đây là 5 quyển sách bán chạy nhất:<br>";
          topRatedBooks.forEach((book, index) => {
            const bookLink = `${process.env.CLIENT_URL}/${book._id}`;  // Tạo đường link sản phẩm
            responseText += `${index + 1}. "${book.bookName}" - Tác giả: ${book.author} | Đánh giá: ${book.rating} | <a href="${bookLink}" target="_blank">Link</a><br>`;  // Dùng HTML để tạo hyperlink
          });
        let response = {
          fulfillmentText: responseText,
        };
        res.json(response);
      } else {
        let response = {
          fulfillmentText: "Xin lỗi, không có sách nào bán chạy tại thời điểm này.",
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sách bán chạy:", error);
      let response = {
        fulfillmentText: "Xin lỗi, tôi gặp vấn đề khi lấy thông tin sách bán chạy. Vui lòng thử lại sau.",
      };
      res.json(response);
    }  
  } else if (intentName === "Tìm sách theo thể loại") {
    try {
      // Tham số thể loại sẽ được lấy từ parameter `any`
      const category = req.body.queryResult.parameters.any;
  
      if (category) {
        // Tìm thể loại trong bảng Category theo tên categoryName
        const categoryDoc = await Category.findOne({ categoryName: category });
  
        if (categoryDoc) {
          // Tìm sách theo category ID (ObjectId)
          const booksByCategory = await Product.find({ category: categoryDoc._id })
            .sort({ rating: -1 })  // Sắp xếp theo rating cao nhất
            .limit(5)  // Lấy 5 sách theo thể loại
            .populate("category", "categoryName") // Populate chỉ lấy field categoryName của category
            .populate("author")
            .populate("form")
            .populate("publicCompany")
            .populate("language");
  
            if (booksByCategory.length > 0) {
              let responseText = `Dưới đây là các sách thể loại "${category}":<br>`;
              booksByCategory.forEach((book, index) => {
                const bookLink = `${process.env.CLIENT_URL}/${book._id}`;  // Tạo đường link sản phẩm
                responseText += `${index + 1}. "${book.bookName}" - Tác giả: ${book.author} | Đánh giá: ${book.rating} | Thể loại: ${book.category.categoryName} | <a href="${bookLink}" target="_blank">Link</a><br>`;  // Sử dụng HTML cho hyperlink
              });            
            let response = {
              fulfillmentText: responseText,
            };
            res.json(response);
          } else {
            let response = {
              fulfillmentText: `Xin lỗi, không có sách nào thuộc thể loại "${category}".`,
            };
            res.json(response);
          }
        } else {
          let response = {
            fulfillmentText: `Xin lỗi, không tìm thấy thể loại "${category}" trong cơ sở dữ liệu.`,
          };
          res.json(response);
        }
      } else {
        let response = {
          fulfillmentText: "Vui lòng cung cấp thể loại sách bạn muốn tìm.",
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi tìm sách theo thể loại:", error);
      let response = {
        fulfillmentText: "Xin lỗi, tôi gặp vấn đề khi tìm sách theo thể loại. Vui lòng thử lại sau.",
      };
      res.json(response);
    }  
  } else if (intentName === "Tìm sách theo mô tả gần đúng") {
    try {
      // Lấy tất cả sách từ cơ sở dữ liệu (hoặc có thể giới hạn theo yêu cầu)
      const books = await Product.find().populate("category").populate("author");

      // Tạo đối tượng Fuse với danh sách sách
      const fuse = getFuseInstance(books);

      // Tìm kiếm gần đúng với từ khóa người dùng nhập
      const result = fuse.search(any);

      if (result.length > 0) {
        // Tạo danh sách các sách tìm được
        let responseText = "Dưới đây là các sách gần giống với tìm kiếm của bạn:<br>";
        result.forEach((item, index) => {
          const book = item.item;
          const bookLink = `${process.env.CLIENT_URL}/${book._id}`;  // Tạo đường link sản phẩm
          responseText += `${index + 1}. "${book.bookName}" - Tác giả: ${book.author} | Giá: ${book.bookPrice} | <a href="${bookLink}" target="_blank">Link</a><br>`;  // Sử dụng HTML cho hyperlink
        });

        let response = {
          fulfillmentText: responseText,
        };
        res.json(response);
      } else {
        let response = {
          fulfillmentText: `Xin lỗi, tôi không tìm thấy sách nào gần giống với từ khóa "${any}".`,
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách:", error);
      let response = {
        fulfillmentText: "Xin lỗi, tôi gặp vấn đề khi tìm kiếm sách. Vui lòng thử lại sau.",
      };
      res.json(response);
    }
  } else if (intentName === "Tìm sách theo khoảng giá") {
    try {
      // Lấy tham số giá từ người dùng
      const minPrice = req.body.queryResult.parameters.minPrice;  // Giá thấp nhất
      const maxPrice = req.body.queryResult.parameters.maxPrice;  // Giá cao nhất
  
      // Kiểm tra xem người dùng đã cung cấp giá hay chưa
      if (minPrice == null || maxPrice == null) {
        let response = {
          fulfillmentText: "Vui lòng cung cấp cả giá thấp nhất và giá cao nhất để tìm sách.",
        };
        return res.json(response);
      }
  
      // Tìm sách theo phạm vi giá
      const booksByPrice = await Product.find({
        bookPrice: { $gte: minPrice, $lte: maxPrice },  // Lọc theo giá
      })
        .sort({ price: 1 })  // Sắp xếp theo giá từ thấp đến cao
        .limit(5)  // Giới hạn kết quả trả về
        .populate("category", "categoryName")
        .populate("author", "name");
  
      if (booksByPrice.length > 0) {
        let responseText = `Dưới đây là các sách có giá trong khoảng từ ${minPrice} đến ${maxPrice}:\n`;
        booksByPrice.forEach((book, index) => {
          const bookLink = `${process.env.CLIENT_URL}/${book._id}`;  // Tạo đường link sản phẩm
          responseText += `${index + 1}. "${book.bookName}" - Tác giả: ${book.author} | Giá: ${book.bookPrice} | <a href="${bookLink}" target="_blank">Link</a><br>`;
        });
  
        let response = {
          fulfillmentText: responseText,
        };
        res.json(response);
      } else {
        let response = {
          fulfillmentText: `Xin lỗi, tôi không tìm thấy sách nào có giá trong khoảng từ ${minPrice} đến ${maxPrice}.`,
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi tìm sách theo giá:", error);
      let response = {
        fulfillmentText: "Xin lỗi, tôi gặp vấn đề khi tìm kiếm sách theo giá. Vui lòng thử lại sau.",
      };
      res.json(response);
    }
  } else if (intentName === "Tìm sách dưới mức giá") {
    try {
      // Lấy tham số giá tối đa từ người dùng
      let maxPrice = req.body.queryResult.parameters.maxPrice;  // Giá cao nhất mà người dùng yêu cầu
  
      // Kiểm tra xem tham số có giá trị là chuỗi kiểu "100k", "50k" hay không
      if (maxPrice && typeof maxPrice === 'string') {
        // Chuyển đổi "100k", "50k" thành 100000, 50000
        maxPrice = maxPrice.replace(/k$/, '000'); // Thay thế "k" bằng "000"
      }
  
      // Kiểm tra xem giá có hợp lệ không
      if (maxPrice == null || isNaN(maxPrice)) {
        let response = {
          fulfillmentText: "Vui lòng cung cấp mức giá tối đa mà bạn muốn tìm sách.",
        };
        return res.json(response);
      }
  
      // Tìm sách có giá dưới mức giá tối đa
      const booksUnderPrice = await Product.find({
        bookPrice: { $lte: parseInt(maxPrice) },  // Lọc sách có giá nhỏ hơn hoặc bằng giá tối đa
      })
        .sort({ bookPrice: 1 })  // Sắp xếp theo giá từ thấp đến cao
        .limit(5)  // Giới hạn kết quả trả về (5 sách)
        .populate("category", "categoryName")
        .populate("author", "name");
  
      if (booksUnderPrice.length > 0) {
        let responseText = `Dưới đây là các sách có giá dưới ${maxPrice} đồng:\n`;
        booksUnderPrice.forEach((book, index) => {
          const bookLink = `${process.env.CLIENT_URL}/${book._id}`;  // Tạo đường link sản phẩm
          responseText += `${index + 1}. "${book.bookName}" - Tác giả: ${book.author} | Giá: ${book.bookPrice} đồng | <a href="${bookLink}" target="_blank">Link</a><br>`;
        });
  
        let response = {
          fulfillmentText: responseText,
        };
        res.json(response);
      } else {
        let response = {
          fulfillmentText: `Xin lỗi, tôi không tìm thấy sách nào có giá dưới ${maxPrice} đồng.`,
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi tìm sách theo giá:", error);
      let response = {
        fulfillmentText: "Xin lỗi, tôi gặp vấn đề khi tìm kiếm sách theo giá. Vui lòng thử lại sau.",
      };
      res.json(response);
    }
  } else if (intentName === "Các mã giảm giá đang có") {
    try {
      // Lấy các mã giảm giá còn hiệu lực
      const currentDate = new Date();
      const activeCoupons = await Coupon.find({
        status: 'active',  // Mã giảm giá còn hiệu lực
        expirationDate: { $gte: currentDate },  // Mã giảm giá chưa hết hạn
      });

      if (activeCoupons.length > 0) {
        // Tạo phản hồi với danh sách các mã giảm giá
        let responseText = "Dưới đây là các mã giảm giá đang có:<br>";
        activeCoupons.forEach((coupon, index) => {
          responseText += `${index + 1}. Mã giảm giá: ${coupon.code} - Giảm: ${coupon.discount}% - Tối đa: ${coupon.maxDiscount} VNĐ | Đơn hàng tối thiểu: ${coupon.minOrderValue} VNĐ | Hết hạn: ${coupon.expirationDate.toLocaleDateString()}<br>`;
        });
        const couponLink = `${process.env.CLIENT_URL}/coupon`; // Tạo đường dẫn đến giao diện mã giảm giá
        responseText += `<br>Xem thêm các mã giảm giá tại đây: <a href="${couponLink}" target="_blank">Link</a>`; // Sử dụng HTML cho hyperlink        

        let response = {
          fulfillmentText: responseText,
        };
        res.json(response);
      } else {
        let response = {
          fulfillmentText: "Hiện tại không có mã giảm giá nào còn hiệu lực.",
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi lấy mã giảm giá:", error);
      let response = {
        fulfillmentText: "Xin lỗi, tôi gặp vấn đề khi lấy thông tin mã giảm giá. Vui lòng thử lại sau.",
      };
      res.json(response);
    }
  } else if (intentName === "Tìm sách theo ngôn ngữ") {
    try {
      if (any) {
        // Tìm ngôn ngữ trong bảng ngôn ngữ
        const languageDoc = await Language.findOne({ languageName: any });

        if (languageDoc) {
          // Tìm sách theo ngôn ngữ (dùng ngôn ngữ từ bảng ngôn ngữ)
          const booksByLanguage = await Product.find({ language: languageDoc._id })
            .sort({ rating: -1 })  // Sắp xếp theo rating cao nhất
            .limit(5)  // Giới hạn kết quả trả về 5 sách
            .populate("author")
            .populate("form")
            .populate("publicCompany")
            .populate("language");

          if (booksByLanguage.length > 0) {
            let responseText = `Dưới đây là các sách bằng ngôn ngữ "${any}":\n`;
            booksByLanguage.forEach((book, index) => {
              const bookLink = `${process.env.CLIENT_URL}/${book._id}`;  // Tạo đường link sản phẩm
              responseText += `${index + 1}. "${book.bookName}" - Tác giả: ${book.author} | Đánh giá: ${book.rating} | Ngôn ngữ: ${book.language.languageName} | <a href="${bookLink}" target="_blank">Link</a><br>`;  // Thêm link vào phản hồi
            });

            let response = {
              fulfillmentText: responseText,
            };
            res.json(response);
          } else {
            let response = {
              fulfillmentText: `Xin lỗi, không có sách nào bằng ngôn ngữ "${any}".`,
            };
            res.json(response);
          }
        } else {
          let response = {
            fulfillmentText: `Xin lỗi, không tìm thấy ngôn ngữ "${any}" trong cơ sở dữ liệu.`,
          };
          res.json(response);
        }
      } else {
        let response = {
          fulfillmentText: "Vui lòng cung cấp ngôn ngữ sách bạn muốn tìm.",
        };
        res.json(response);
      }
    } catch (error) {
      console.error("Lỗi khi tìm sách theo ngôn ngữ:", error);
      let response = {
        fulfillmentText: "Xin lỗi, tôi gặp vấn đề khi tìm sách theo ngôn ngữ. Vui lòng thử lại sau.",
      };
      res.json(response);
    }
  } else if (intentName === 'Các quyển sách dưới định dạng Ebook') {
    try {
      // Truy vấn các sản phẩm có định dạng Ebook
      const ebookBooks = await Product.find({ ebook: true }).limit(5).populate('language');  // Lấy 5 sách Ebook đầu tiên và join với bảng 'Language'

      if (ebookBooks.length === 0) {
        return res.json({
          message: 'Hiện tại không có sách nào dưới định dạng Ebook.',
        });
      }

      let responseText = 'Dưới đây là một số sách có định dạng Ebook:\n';

      // Duyệt qua từng sách và tạo chuỗi kết quả
      ebookBooks.forEach((book, index) => {
        const bookLink = `${process.env.CLIENT_URL}/${book._id}`; // Tạo link đến sách
        responseText += `${index + 1}. "${book.bookName}" - Tác giả: ${book.author} | Đánh giá: ${book.rating} | Ngôn ngữ: ${book.language.languageName} | <a href="${bookLink}" target="_blank">Link</a><br>`;
      });

      return res.json({
        message: responseText,
      });
    } catch (error) {
      console.error('Error retrieving Ebook books:', error);
      return res.json({
        message: 'Đã có lỗi xảy ra khi lấy thông tin sách.',
      });
    }
  } else if (intent === 'Tìm sách theo tên') {
    // Xử lý intent tìm sách theo tên (ví dụ)
    // Code xử lý cho intent này
    res.json({
      message: 'Đây là sách bạn tìm theo tên...',
    });
  }
  else {
    res.json({ fulfillmentText: "Intent không được xử lý trong webhook này." });
  }
};

export { handleWebhook };
