import ShippingAddress from "../models/shippingAddressModel.js";

// @desc    Lấy danh sách địa chỉ giao hàng của người dùng
// @route   GET /api/shippingAddress
// @access  Private
const getShippingAddressesByUser = async (req, res) => {
  const userId = req.user._id;

  try {
    // Tìm danh sách địa chỉ giao hàng của người dùng dựa vào userId
    const shippingAddresses = await ShippingAddress.findOne({ user: userId });

    // Nếu không tìm thấy, trả về danh sách rỗng
    if (!shippingAddresses) {
      return res.status(200).json({ message: "No Shipping Address found" });
    }

    // Nếu tìm thấy, trả về danh sách địa chỉ giao hàng
    res.status(200).json(shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shipping addresses", error });
  }
};

// @desc    Hiển thị địa chỉ giao hàng mặc định
// @route   GET /api/shippingAddress/default
// @access  Private
const getDefaultShippingAddress = async (req, res) => {
  const userId = req.user._id;

  try {
    // Tìm kiếm địa chỉ giao hàng của người dùng
    const shippingAddress = await ShippingAddress.findOne({ user: userId });

    // Nếu không tìm thấy địa chỉ giao hàng
    if (!shippingAddress || shippingAddress.shippingAddress.length === 0) {
      return res.status(404).json({ message: "No shipping address found" });
    }

    // Tìm địa chỉ mặc định trong danh sách địa chỉ giao hàng
    const defaultAddress = shippingAddress.shippingAddress.find(
      (address) => address.isDefault === true
    );

    // Nếu không có địa chỉ mặc định
    if (!defaultAddress) {
      return res.status(404).json({ message: "No default shipping address found" });
    }

    // Trả về địa chỉ mặc định
    res.status(200).json(defaultAddress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching default shipping address", error });
  }
};

// @desc    Thêm địa chỉ giao hàng mới
// @route   POST /api/shippingAddress
// @access  Private
const addShippingAddress = async (req, res) => {
  const userId = req.user._id;
  const {
    recipientName,
    phoneNumber,
    ProvinceID,
    ProvinceName,
    DistrictID,
    DistrictName,
    WardCode,
    WardName,
    addressDetails,
    isDefault,
  } = req.body;

  try {
    // Tìm kiếm địa chỉ giao hàng theo user ID
    let shippingAddress = await ShippingAddress.findOne({ user: userId });

    // Nếu chưa tồn tại, tạo mới
    if (!shippingAddress) {
      shippingAddress = new ShippingAddress({ user: userId, shippingAddress: [] });
    }

    // Kiểm tra nếu isDefault là true, cập nhật các địa chỉ khác làm isDefault = false
    if (isDefault) {
      shippingAddress.shippingAddress.forEach((address) => {
        address.isDefault = false;
      });
    }

    // Thêm địa chỉ mới vào danh sách
    shippingAddress.shippingAddress.push({
      recipientName,
      phoneNumber,
      ProvinceID,
      ProvinceName,
      DistrictID,
      DistrictName,
      WardCode,
      WardName,
      addressDetails,
      isDefault,
    });

    // Lưu vào cơ sở dữ liệu
    await shippingAddress.save();

    res.status(200).json(shippingAddress);
  } catch (error) {
    res.status(500).json({ message: "Error adding to ShippingAddress list", error });
  }
};

// @desc    Xóa địa chỉ giao hàng
// @route   DELETE /api/shippingAddress/:shippingaddressID
// @access  Private
const deleteShippingAddress = async (req, res) => {
  const userId = req.user._id;
  const { shippingaddressID } = req.params;

  try {
    // Tìm kiếm danh sách địa chỉ giao hàng của người dùng
    const shippingAddress = await ShippingAddress.findOne({ user: userId });

    if (!shippingAddress) {
      return res.status(404).json({ message: "Shipping address list not found" });
    }

    // Tìm chỉ số của địa chỉ cần xóa trong mảng
    const addressIndex = shippingAddress.shippingAddress.findIndex(
      (item) => item._id.toString() === shippingaddressID
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "This Shipping Address no longer exists." });
    }

    // Kiểm tra xem địa chỉ bị xóa có phải là mặc định không
    const isDefaultAddress = shippingAddress.shippingAddress[addressIndex].isDefault === true;

    // Xóa địa chỉ cần xóa
    shippingAddress.shippingAddress.splice(addressIndex, 1);

    // Nếu địa chỉ bị xóa là mặc định và còn địa chỉ khác, đặt một địa chỉ khác làm mặc định
    if (isDefaultAddress && shippingAddress.shippingAddress.length > 0) {
      shippingAddress.shippingAddress[0].isDefault = true;
    }

    // Lưu thay đổi
    await shippingAddress.save();

    res.status(200).json({ message: "Shipping address deleted successfully", shippingAddress });
  } catch (error) {
    res.status(500).json({ message: "Error removing shipping address", error });
  }
};

// @desc    Kiểm tra xem địa chỉ giao hàng có tồn tại không
// @route   GET /api/shippingAddress/:shippingaddressID
// @access  Private
const checkShippingAddress = async (req, res) => {
  const userId = req.user._id;
  const { shippingaddressID } = req.params;

  try {
    // Tìm danh sách địa chỉ giao hàng của người dùng
    const shippingaddresses = await ShippingAddress.findOne({ user: userId });

    // Nếu không có danh sách địa chỉ, trả về false
    if (!shippingaddresses) {
      return res.status(200).json({ message: "Error checking shipping address, no list found" });
    }

    // Kiểm tra xem địa chỉ có tồn tại trong danh sách không
    const addressExists = shippingaddresses.shippingAddress.some(
      (address) => address._id.toString() === shippingaddressID
    );

    res.status(200).json({ isInList: addressExists });
  } catch (error) {
    res.status(500).json({ message: "Error checking shipping address", error });
  }
};

// @desc    Cập nhật một địa chỉ giao hàng cụ thể
// @route   PUT /api/shippingAddress/:shippingaddressID
// @access  Private
const updateShippingAddress = async (req, res) => {
  const userId = req.user._id;
  const { shippingaddressID } = req.params;
  const {
    recipientName,
    phoneNumber,
    ProvinceID,
    ProvinceName,
    DistrictID,
    DistrictName,
    WardCode,
    WardName,
    addressDetails,
    isDefault,
  } = req.body;

  try {
    // Nếu isDefault là true, cập nhật tất cả các địa chỉ khác làm isDefault = false
    if (isDefault) {
      await ShippingAddress.updateOne(
        { user: userId },
        { $set: { "shippingAddress.$[].isDefault": false } }
      );
    }

    // Sử dụng findOneAndUpdate để tìm và cập nhật địa chỉ giao hàng
    const updatedShippingAddress = await ShippingAddress.findOneAndUpdate(
      { user: userId, "shippingAddress._id": shippingaddressID },
      {
        $set: {
          "shippingAddress.$.recipientName": recipientName,
          "shippingAddress.$.phoneNumber": phoneNumber,
          "shippingAddress.$.ProvinceID": ProvinceID,
          "shippingAddress.$.ProvinceName": ProvinceName,
          "shippingAddress.$.DistrictID": DistrictID,
          "shippingAddress.$.DistrictName": DistrictName,
          "shippingAddress.$.WardCode": WardCode,
          "shippingAddress.$.WardName": WardName,
          "shippingAddress.$.addressDetails": addressDetails,
          "shippingAddress.$.isDefault": isDefault,
        },
      },
      { new: true }
    );

    if (!updatedShippingAddress) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    res.status(200).json(updatedShippingAddress);
  } catch (error) {
    res.status(500).json({ message: "Error updating shipping address", error });
  }
};

export {
  getShippingAddressesByUser,
  addShippingAddress,
  deleteShippingAddress,
  checkShippingAddress,
  updateShippingAddress,
  getDefaultShippingAddress,
};
