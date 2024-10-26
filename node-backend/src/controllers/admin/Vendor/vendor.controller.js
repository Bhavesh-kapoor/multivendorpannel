
import {User} from '../../../models/user.model.js'
import ApiError from '../../../utils/apiErrors.js';
import ApiResponse from '../../../utils/apiResponse.js';
import { check, validationResult } from "express-validator";



const validateInput = [
  check("firstName", "First Name is required").notEmpty(),
  check("lastName", "Last Name is required").notEmpty(),
  check("email", "Email is required").isEmail(),
  check("mobile", "Mobile is required").notEmpty(),
  check("shopName", "Mobile is required").notEmpty(),
  check("gender", "Gender is required").notEmpty(),
  check("password", "password is required").notEmpty(),
];
const createVendor = async (req,res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }
    const { firstName, lastName, email, mobile,gender, shopName, password,role } = req.body;
    try {
        // Check if vendor with same email exists
        const existingVendor = await User.findOne({ email });
        if (existingVendor) {
            return res.status(400).json(new ApiError(400,'Vendor with this email already exists',[],''));
        }

        // Naya vendor object create karo
        const vendor = new User({
            firstName,
            lastName,
            email,
            mobile,
            shopName,
            role:vendor,
            password,
            gender
        });

        // Vendor ko database mein save karo
        await vendor.save();


        // return response
        return res.status(201).json(new ApiResponse(200,{   firstName: vendor.firstName,
            lastName: vendor.lastName,
            email: vendor.email,
            shopName: vendor.shopName,
            commissionRate: vendor.commissionRate,},"Vendor created successfully"))
    } catch (error) {
        return res.status(500).json(new ApiError(500,"Error creating vendor",[error.message],''))
    }
}

const readVendor = async (req, res) => {
    const { email } = req.params;

    try {
        const vendor = await User.findOne({ email, role: "vendor" });
        if (!vendor) {
            return res.status(404).json(new ApiError(404,'Vendor not found',[],''));
        }

        return res.status(200).json(new ApiResponse(200,{
            firstName: vendor.firstName,
            lastName: vendor.lastName,
            email: vendor.email,
            mobile: vendor.mobile,
            address: vendor.address,
            shopName: vendor.shopName,
            commissionRate: vendor.commissionRate,
        },'Vendor Fetched Successfully'))

      
    } catch (error) {
     return   res.status(500).json(new ApiError(500,'Error reading vendor',[error.message],''));
    }
};


const readAllVendors = async (req, res) => {
    try {
        // Fetch all vendors with role "vendor"
        const vendors = await User.find({ role: "vendor" });

        // Check if any vendors were found
        if (!vendors.length) {
            return res.status(404).json(new ApiError(404, 'No vendors found', [], ''));
        }

        // Return the list of vendors
        return res.status(200).json(new ApiResponse(200, vendors, 'Vendors fetched successfully'));
    } catch (error) {
        return res.status(500).json(new ApiError(500, 'Error reading vendors', [error.message], ''));
    }
};

const updateVendor = async (req, res) => {
    const { email } = req.params;
    const { firstName, lastName, mobile, address, shopName, commissionRate, password } = req.body;

    try {
        // Prepare the update object based on provided fields
        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (mobile) updateFields.mobile = mobile;
        if (address) updateFields.address = address;
        if (shopName) updateFields.shopName = shopName;
        if (commissionRate !== undefined) updateFields.commissionRate = commissionRate;
        if (password) updateFields.password = await bcrypt.hash(password, 10);

        // Use findOneAndUpdate to find the vendor by email and update fields
        const updatedVendor = await User.findOneAndUpdate(
            { email, role: "vendor" },
            { $set: updateFields },
            { new: true, runValidators: true } // Returns updated document and enforces schema validation
        );

        if (!updatedVendor) {
        return res.status(404).json(new ApiError(404,'Vendor not found',[],''))
        }

        // Return updated vendor data in the response
        return res.status(200).json(new ApiResponse(200,{
            firstName: updatedVendor.firstName,
            lastName: updatedVendor.lastName,
            email: updatedVendor.email,
            mobile: updatedVendor.mobile,
            address: updatedVendor.address,
            shopName: updatedVendor.shopName,
            commissionRate: updatedVendor.commissionRate,
        },'Vendor updated successfully'))
        
    } catch (error) {
        return res.status(500).json(new ApiError(500,'Error updating vendor',[],''))

    }
};

const deleteVendor = async (req, res) => {
    const { email } = req.params;

    try {
        const vendor = await User.findOneAndDelete({ email, role: "vendor" });
        if (!vendor) {
            return res.status(404).json(new ApiError(404,'Vendor not found',[],''));
        }

       return  res.status(200).json(new ApiResponse(200,{},'Vendor deleted successfully'));
    } catch (error) {
       return res.status(500).json(new ApiError(500,'Error deleting vendor',[],''));
    }
};





export {createVendor,readVendor,updateVendor,deleteVendor,readAllVendors}