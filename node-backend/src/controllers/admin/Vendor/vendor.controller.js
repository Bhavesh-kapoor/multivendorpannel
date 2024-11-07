import { body, check, validationResult } from "express-validator";
import { User } from "../../../models/user.model.js";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { isValidObjectId } from "../../../utils/helpers.js";
import asyncHandler from "../../../utils/aysncHandler.js";

const vendorValidations = [
  check("firstName").notEmpty().withMessage("First Name is required!"),
  check("lastName").notEmpty().withMessage("Last Name is required!"),
  check("email").notEmpty().withMessage("Email is required!"),
  check("mobile").notEmpty().withMessage("Mobile is required!"),
  check("shopName").notEmpty().withMessage("Shop Name is required!"),
  check("address").notEmpty().withMessage("Address is required!"),
  check("password").notEmpty().withMessage("Password  is required!"),
  check("commissionRate").optional(),
  check("allowedTabs").notEmpty().isLength({ min: 1 }),
];

const createVendor = async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(new ApiError(400, "Validation Error", errors));
  }

  const {
    firstName,
    lastName,
    email,
    mobile,
    address,
    shopName,
    gst,
    shopType,
    commissionRate,
    password,
    allowedTabs,
  } = req.body;

  try {
    // Check if vendor with same email exists
    const existingVendor = await User.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Vendor with this email already exists", [], "")
        );
    }
    shopdetails = {
      name: shopName,
      gst: gst,
      shopType: shopType,
    };
    // Naya vendor object create karo
    const vendor = new User({
      firstName,
      lastName,
      email,
      mobile,
      address,
      shopdetails,
      commissionRate,
      role: "vendor",
      password,
      allowedTabs,
    });

    // Vendor ko database mein save karo
    const vendorcreated = await vendor.save();

    // return response
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

// const readAllVendors = async (req, res) => {
//   try {
//     // Fetch all vendors with role "vendor"
//     const vendors = await User.find(); // Profile Image,fullName,_id,email,phoneNumber,Role,created_At

//     // Check if any vendors were found
//     if (!vendors.length) {
//       return res
//         .status(404)
//         .json(new ApiError(404, "No vendors found", [], ""));
//     }

//     // Return the list of vendors
//     return res
//       .status(200)
//       .json(new ApiResponse(200, vendors, "Vendors fetched successfully"));
//   } catch (error) {
//     return res
//       .status(500)
//       .json(new ApiError(500, "Error reading vendors", [error.message], ""));
//   }
// };

const readAllVendors = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    searchkey,
    startDate,
    endDate,
    sortkey = "created_at",
    sortdir = "desc",
  } = req.query;

  // const { role } = req.user;
  // console.log(role);

  try {
    let filter = { role: "vendor" };

    if (search && searchkey) {
      filter = { ...filter, [searchkey]: search };
    }

    if (status) {
      filter = { ...filter, status: status };
    }

    if (startDate || endDate) {
      if (startDate) {
        filter = { ...filter, created_at: { $gte: new Date(startDate) } };
      }

      if (endDate) {
        filter = { ...filter, created_at: { $lte: new Date(endDate) } };
      }
    }

    const skip = (page - 1) * limit;

    const sort = { [sortkey]: sortdir === "asc" ? 1 : -1 };

    const vendors = await User.find(filter)
      .select("profileImage firstName lastName _id email mobile role createdAt")
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

    if (!vendors.length) {
      return res
        .status(404)
        .json(new ApiError(404, "No vendors found", [], ""));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, vendors, "Vendors fetched successfully"));
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

  const { firstName, lastName, mobile, shopdetails, allowedTabs, isActive } =
    req.body;
  const existingVendor = await User.findById(_id);
  if (!existingVendor) {
    return res.status(404).json(new ApiError(404, null, "Vendor not found"));
  }
  if (existingVendor.role !== "vendor") {
    return res
      .status(400)
      .json(new ApiError(400, null, "User is not a vendor"));
  }

  // Prepare the update object with validation
  const updateFields = {};

  // Basic fields
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  if (mobile) updateFields.mobile = mobile;
  if (isActive !== undefined) updateFields.isActive = isActive;

  // Shop details validation
  if (shopdetails) {
    // Validate GST format
    if (shopdetails.gst && !/^[0-9A-Z]{15}$/.test(shopdetails.gst)) {
      return res
        .status(400)
        .json(new ApiError(400, null, "Invalid GST number format"));
    }

    // Validate shop type
    if (
      shopdetails.shopType &&
      !["Retail", "Wholesale", "Online", "Franchise"].includes(
        shopdetails.shopType
      )
    ) {
      return res.status(400).json(new ApiError(400, null, "Invalid shop type"));
    }
    const updatedShopDetails = {};
    shopdetails.name
      ? (updatedShopDetails.name = shopdetails.name)
      : (updatedShopDetails.name = existingVendor.shopdetails.name);
    shopdetails.gst
      ? (updatedShopDetails.gst = shopdetails.gst)
      : (updatedShopDetails.gst = existingVendor.shopdetails.gst);
    shopdetails.shopType
      ? (updatedShopDetails.shopType = shopdetails.shopType)
      : (updatedShopDetails.shopType = existingVendor.shopdetails.shopType);
    // Assign the updated shop details object to updateFields
    updateFields.shopdetails = updatedShopDetails;
  }
  // Allowed tabs validation
  if (allowedTabs) {
    const isValidTabs = allowedTabs.every(
      (tab) =>
        tab.name &&
        Array.isArray(tab.crudRoles) &&
        tab.crudRoles.every((role) =>
          ["Read", "Create", "Edit", "Delete"].includes(role)
        )
    );

    if (!isValidTabs) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid allowed tabs format"));
    }

    updateFields.allowedTabs = allowedTabs;
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
    .json(
      new ApiResponse(
        200,
        { vendor: updatedVendor },
        "Vendor updated successfully"
      )
    );
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
  createVendor,
  readVendor,
  updateVendor,
  deleteVendor,
  readAllVendors,
  vendorValidations,
};
