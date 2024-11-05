import { check, validationResult } from "express-validator";
import { User } from "../../../models/user.model.js";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { isValidObjectId } from "../../../utils/helpers.js";
import bcrypt from "bcrypt";

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

    // Naya vendor object create karo
    const vendor = new User({
      firstName,
      lastName,
      email,
      mobile,
      address,
      shopName,
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

const readAllVendors = async (req, res) => {
  try {
    // Fetch all vendors with role "vendor"
    const vendors = await User.find(); // Profile Image,fullName,_id,email,phoneNumber,Role,created_At

    // Check if any vendors were found
    if (!vendors.length) {
      return res
        .status(404)
        .json(new ApiError(404, "No vendors found", [], ""));
    }

    // Return the list of vendors
    return res
      .status(200)
      .json(new ApiResponse(200, vendors, "Vendors fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error reading vendors", [error.message], ""));
  }
};

const updateVendor = async (req, res) => {
  const { _id } = req.params;
  if (!isValidObjectId(_id)) {
    return res.status(400).json(new ApiError(400, "", "Invalid vendor  ID!"));
  }

  const {
    firstName,
    lastName,
    mobile,
    address,
    shopName,
    commissionRate,
    password,
    allowedTabs,
  } = req.body;

  try {
    // Prepare the update object based on provided fields
    const updateFields = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (mobile) updateFields.mobile = mobile;
    if (address) updateFields.address = address;
    if (shopName) updateFields.shopName = shopName;
    if (commissionRate !== undefined)
      updateFields.commissionRate = commissionRate;
    if (allowedTabs) updateFields.allowedTabs = allowedTabs;

    // Use findOneAndUpdate to find the vendor by email and update fields
    const updatedVendor = await User.findByIdAndUpdate(
      { _id },
      { $set: updateFields },
      { new: true, runValidators: true } // Returns updated document and enforces schema validation
    );

    if (!updatedVendor) {
      return res
        .status(404)
        .json(new ApiError(404, "Vendor not found", [], ""));
    }

    // Return updated vendor data in the response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          updatedVendor,
        },
        "Vendor updated successfully"
      )
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Error updating vendor", [], ""));
  }
};

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
