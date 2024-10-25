import { Product } from "../../../models/product.model.js";
import { body, check, query, validationResult } from "express-validator";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { isValidObjectId } from "../../../utils/mongoose.utility.js";


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
            return res.status(400).json(new ApiError(400, null, "Product already exists"));
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
    if (!isValidObjectId(productId)) {
        return res.status(400).json(new ApiError(400, null, "Invalid product ID"));
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
    }

    try {
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json(new ApiError(404, "Product not found"));
        }
        const updatedData = {
            ...req.body,
            specifications: req.body.specifications
                ? { ...req.body.specifications }
                : existingProduct.specifications,
            images: req.body.images
                ? [...new Set([...existingProduct.images, ...req.body.images])]
                : existingProduct.images,
        };

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
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
    if (!isValidObjectId(productId)) {
        return res.status(400).json(new ApiError(400, null, "Invalid product ID"));
    }

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
    if (!isValidObjectId(productId)) {
        return res.status(400).json(new ApiError(400, null, "Invalid product ID"));
    }
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
    const { page = 1, limit = 10 } = req.query;
    console.log("checkk", page)
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    try {

        const products = await Product.find().skip(skip).limit(limitNumber);
        const totalProducts = await Product.countDocuments()
        return res.status(200).json(new ApiResponse(200,
            {
                result: products,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalProducts / limitNumber),
                    totalItems: totalProducts,
                    itemsPerPage: limitNumber,
                },
            }, "Products retrieved successfully!"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, "Something went wrong", [error.message]));
    }
};

export { addProduct, updateProduct, deleteProduct, getProduct, getAllProducts, productValidationRules };
