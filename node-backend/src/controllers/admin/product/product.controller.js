import { Product } from "../../../models/product.model.js";
import { body, check, query, validationResult } from "express-validator";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { json } from "express";
import { isValidObjectId } from "mongoose";
import { deleteImageByUrl } from "../../../utils/helpers.js";

// Validation rules for the product model fields
const productValidationRules = [
  check('name').notEmpty().withMessage('Product name is required'),
  check('brandName').notEmpty().withMessage('Brand name is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('categoryId')
    .notEmpty().withMessage('Category ID is required')
    .isMongoId().withMessage('Category ID must be a valid ObjectId'),
  check('returnable')
    .notEmpty().withMessage('Returnable is required')
    .isBoolean().withMessage('Returnable must be a boolean'),
  // Add more rules as needed
];
/*--------------------------------------------Add a new product---------------------------------------*/
const addProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
  }
  const { name, vendorId, brandName } = req.body;
  if (req.body?.cloudinaryUrls) {
    req.body.images = req.body.cloudinaryUrls.files
  }
  const existingProduct = await Product.findOne({ name: name, vendorId: vendorId, brandName: brandName });
  if (existingProduct) {
    return res.status(400).json(new ApiError(400, null, "Product already exists"));
  }
  const newProduct = new Product(req.body);
  await newProduct.save();
  return res.status(201).json(new ApiResponse(201, newProduct, "Product created successfully!"));
})

/*--------------------------------------------Update an existing product---------------------------------------*/
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    return res.status(400).json(new ApiError(400, null, "Invalid product ID"));
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(new ApiError(400, "Validation Error", errors.array()));
  }
  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }
  const existingImages = existingProduct.images;
  const retainedImages = req.body.images || existingProduct.images;
  const imagesToDelete = existingImages.filter(img => !retainedImages.includes(img));
  for (const img of imagesToDelete) {
    await deleteImageByUrl(img);
  }
  const newImages = req.body.cloudinaryUrls?.files || [];
  
  const updatedImages = [...retainedImages, ...newImages];
  const updatedData = {
    ...req.body,
    specifications: req.body.specifications
      ? { ...req.body.specifications }
      : existingProduct.specifications,
    images: req.body.images
      ? [...new Set([...existingProduct.images, ...req.body.images])]
      : existingProduct.images,
    images: updatedImages,
  };

  const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
  return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully!"));
})


/*--------------------------------------------Delete a product---------------------------------------*/
const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    return res.status(400).json(new ApiError(400, null, "Invalid product ID"));
  }
  const existingProduct = await Product.findById(productId);
  for (const img of existingProduct.images) {
    await deleteImageByUrl(img);
  }
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }
  return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully!"));
})

/*--------------------------------------------Get a single product by ID---------------------------------------*/
const getProduct = asyncHandler(async (req, res) => {

  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    return res.status(400).json(new ApiError(400, null, "Invalid product ID"));
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }
  return res.status(200).json(new ApiResponse(200, product, "Product retrieved successfully!"));
})

/*--------------------------------------------Get all products---------------------------------------*/
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
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
})

export { addProduct, updateProduct, deleteProduct, getProduct, getAllProducts, productValidationRules };
