import {User} from '../../../models/user.model.js'

const create = async (req,res) =>{
    const { firstName, lastName, email, mobile, address, shopName, commissionRate, password } = req.body;

    try {
        // Check if vendor with same email exists
        const existingVendor = await User.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ message: "Vendor with this email already exists" });
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
        });

        // Vendor ko database mein save karo
        await vendor.save();


        // Response return karo
        res.status(201).json({
            message: "Vendor created successfully",
            vendor: {
                firstName: vendor.firstName,
                lastName: vendor.lastName,
                email: vendor.email,
                shopName: vendor.shopName,
                commissionRate: vendor.commissionRate,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating vendor", error: error.message });
    }
}

export {create}