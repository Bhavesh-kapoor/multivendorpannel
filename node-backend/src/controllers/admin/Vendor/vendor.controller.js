import ApiError from "../../../utils/apiErrors.js";
import { User } from "../../../models/user.model.js";
import ApiResponse from "../../../utils/apiResponse.js";
import asyncHandler from "../../../utils/aysncHandler.js";
import { check, validationResult } from "express-validator";
import { deleteImageByUrl, isValidObjectId } from "../../../utils/helpers.js";

const vendorValidations = [
  check("email").notEmpty().withMessage("Email is required!"),
  check("mobile").notEmpty().withMessage("Mobile is required!"),
  check("lastName").notEmpty().withMessage("Last Name is required!"),
  check("shopName").notEmpty().withMessage("Shop Name is required!"),
  check("firstName").notEmpty().withMessage("First Name is required!"),
];

const createVendor = async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(new ApiError(400, "Validation Error", errors));
  }
  const {
    gst,
    email,
    mobile,
    gender,
    lastName,
    shopName,
    shopType,
    isActive,
    firstName,
    dateOfBirth,
    cloudinaryUrls,
  } = req.body;
  const profileImage = (cloudinaryUrls && cloudinaryUrls["profileImage"]) || "";
  try {
    const existingVendor = await User.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Vendor with this email already exists", [], "")
        );
    }
    const shopdetails = { gst: gst, name: shopName, shopType: shopType };
    const vendor = new User({
      email,
      mobile,
      gender,
      lastName,
      isActive,
      firstName,
      dateOfBirth,
      shopdetails,
      profileImage,
      role: "vendor",
      gst: gst ?? "",
      shopName: shopName ?? "",
      shopType: shopType ?? "",
    });
    const vendorcreated = await vendor.save();
    return res
      .status(201)
      .json(new ApiResponse(200, vendorcreated, "Vendor created successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Error creating vendor", [error.message], ""));
  }
};

const readVendor = async (req, res) => {
  const { email } = req.params;

  try {
    const vendor = await User.findOne({ email, role: "vendor" });
    if (!vendor) {
      return res
        .status(404)
        .json(new ApiError(404, "Vendor not found", [], ""));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          email: vendor.email,
          mobile: vendor.mobile,
          address: vendor.address,
          shopName: vendor.shopName,
          commissionRate: vendor.commissionRate,
        },
        "Vendor Fetched Successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error reading vendor", [error.message], ""));
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.findOne(
      { _id: id },
      {
        role: 1,
        email: 1,
        mobile: 1,
        gender: 1,
        isActive: 1,
        lastName: 1,
        firstName: 1,
        dateOfBirth: 1,
        shopdetails: 1,
        allowedTabs: 1,
        profileImage: 1,
      }
    );
    if (!result) {
      return res
        .status(404)
        .json(new ApiError(404, "Vendor not found", [], ""));
    }
    const formattedData = JSON.parse(JSON.stringify(result));
    const data = {
      ...formattedData,
      gst: result?.shopdetails?.gst,
      shopName: result?.shopdetails?.name,
      shopType: result?.shopdetails?.shopType,
    };
    delete data?.shopdetails;
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Data Fetched Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error reading vendor", [error.message], ""));
  }
};

const readAllVendors = async (req, res) => {
  const {
    role,
    status,
    endDate,
    page = 1,
    startDate,
    searchkey,
    limit = 10,
    search = "",
    sortdir = "desc",
    sortkey = "createdAt",
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  try {
    const pipeline = [];
    const matchStage = {};

    if (role) matchStage.role = role;
    if (search && searchkey)
      matchStage[searchkey] = { $regex: search, $options: "i" };

    if (status) matchStage.status = status;

    if (startDate || endDate) {
      matchStage.created_at = {};
      if (startDate) matchStage.created_at.$gte = new Date(startDate);
      if (endDate) matchStage.created_at.$lte = new Date(endDate);
    }

    if (Object.keys(matchStage).length > 0)
      pipeline.push({ $match: matchStage });

    const sortStage = {
      $sort: { [sortkey]: sortdir === "asc" ? 1 : -1 },
    };
    pipeline.push(sortStage);
    pipeline.push({ $skip: (pageNumber - 1) * limitNumber });
    pipeline.push({ $limit: limitNumber });

    pipeline.push({
      $project: {
        _id: 1,
        email: 1,
        role: 1,
        mobile: 1,
        lastName: 1,
        createdAt: 1,
        firstName: 1,
        profileImage: 1,
      },
    });

    const vendors = await User.aggregate(pipeline);
    const totalUsers = await User.countDocuments();

    if (!vendors.length) {
      return res
        .status(404)
        .json(new ApiError(404, "No vendors found", [], ""));
    }
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          result: vendors,
          pagination: {
            currentPage: pageNumber,
            totalItems: totalUsers,
            itemsPerPage: limitNumber,
            totalPages: Math.ceil(totalUsers / limitNumber),
          },
        },
        "Vendors fetched successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error reading vendors", [error.message], ""));
  }
};

const updateVendor = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!isValidObjectId(_id)) {
    return res.status(400).json(new ApiError(400, "Invalid vendor ID"));
  }

  const {
    gst,
    email,
    mobile,
    gender,
    shopType,
    lastName,
    shopName,
    isActive,
    firstName,
    dateOfBirth,
    cloudinaryUrls,
  } = req.body;
  const profileImage = (cloudinaryUrls && cloudinaryUrls["profileImage"]) || "";

  const existingVendor = await User.findById(_id);

  if (!existingVendor)
    return res.status(404).json(new ApiError(404, null, "Vendor not found"));

  if (profileImage && existingVendor.profileImage)
    await deleteImageByUrl(existingVendor.profileImage);

  if (existingVendor.role !== "vendor") {
    return res
      .status(400)
      .json(new ApiError(400, null, "User is not a vendor"));
  }

  const updateFields = {
    ...(gender && { gender }),
    ...(lastName && { lastName }),
    ...(firstName && { firstName }),
    ...(dateOfBirth && { dateOfBirth }),
    ...(profileImage && { profileImage }),
    ...(isActive !== undefined && { isActive }),
    ...(email && !existingVendor?.isEmailVerified && { email }),
    ...(mobile && !existingVendor?.isMobileVerified && { mobile }),
  };

  if (gst || shopName || shopType) {
    const updatedShopDetails = {
      gst: gst || existingVendor.shopdetails?.gst,
      name: shopName || existingVendor.shopdetails?.name,
      shopType: shopType || existingVendor.shopdetails?.shopType,
    };
    if (
      updatedShopDetails.gst &&
      !/^[0-9A-Z]{15}$/.test(updatedShopDetails.gst)
    ) {
      return res
        .status(400)
        .json(new ApiError(400, null, "Invalid GST number format"));
    }
    updateFields.shopdetails = updatedShopDetails;
  }

  // Update the vendor
  const updatedVendor = await User.findByIdAndUpdate(
    _id,
    { $set: updateFields },
    {
      new: true,
      runValidators: true,
      select: "-password -refreshToken", // Exclude sensitive fields
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVendor, "Vendor updated successfully"));
});

const deleteVendor = async (req, res) => {
  const { _id } = req.params;
  console.log(_id);
  if (!isValidObjectId(_id)) {
    return res.status(400).json(new ApiError(400, "", "Invalid vendor  ID!"));
  }

  try {
    const vendor = await User.findByIdAndDelete({ _id });
    if (!vendor) {
      return res
        .status(404)
        .json(new ApiError(404, "Vendor not found", "Vendor not found", ""));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Vendor deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error deleting vendor", [], ""));
  }
};

export {
  readVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  readAllVendors,
  vendorValidations,
};
