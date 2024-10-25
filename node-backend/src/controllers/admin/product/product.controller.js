import { Product } from "../../../models/product.model.js";
import { check, validationResult } from "express-validator";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";


const productValidationRules = [
    check('name').notEmpty().withMessage('Product name is required'),
    check('brandName').notEmpty().withMessage('Brand name is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('stock').isInt({ min: 1 }).withMessage('Stock must be a non-negative integer'),
    // Add more rules as needed
];

/*--------------------------------------------Add a new product---------------------------------------*/
const addProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }
    const { name, vendorId, brandName } = req.body;
    try {
        const existingProduct = await Product.findOne({ name: name, vendorId: vendorId, brandName: brandName });
        if (existingProduct) {
            return res.status(400).json(new ApiError(400, null,"Product already exists"));
        }
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res.status(201).json(new ApiResponse(201, newProduct, "Product created successfully!"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Something went wrong", [error.message]));
    }
};
/*--------------------------------------------Update an existing product---------------------------------------*/

const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        }
        return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully!"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Something went wrong", [error.message]));
    }
};
/*--------------------------------------------Delete a product---------------------------------------*/

// 
const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        }
        return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully!"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Something went wrong", [error.message]));
    }
};

/*--------------------------------------------Get a single product by ID---------------------------------------*/

const getProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        }
        return res.status(200).json(new ApiResponse(200, product, "Product retrieved successfully!"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Something went wrong", [error.message]));
    }
};

/*--------------------------------------------Get all products---------------------------------------*/

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully!"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Something went wrong", [error.message]));
    }
};

export { addProduct, updateProduct, deleteProduct, getProduct, getAllProducts, productValidationRules };
