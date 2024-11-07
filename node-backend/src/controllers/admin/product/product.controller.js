import {
  ClothingProduct,
  CosmeticProduct,
  ElectronicProduct,
  FoodProduct,
  Product,
} from "../../../models/product.model.js";
import { body, check, validationResult } from "express-validator";
import ApiError from "../../../utils/apiErrors.js";
import ApiResponse from "../../../utils/apiResponse.js";
import { isValidObjectId } from "../../../utils/mongoose.utility.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import cloudinary from "../../../config/cloudinaryConfig.js";
import { deleteImageByUrl } from "../../../utils/helpers.js";
import { json } from "express";

const productValidationRules = [
  check("name").notEmpty().withMessage("Product name is required"),
  check("brandName").notEmpty().withMessage("Brand name is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("price").notEmpty().withMessage("Price must be a number"),
  check("stock").notEmpty().withMessage("Stock must be a non-negative integer"),
  // Add more rules as needed
];
/*--------------------------------------------Add a new product------------------------------------------*/
const addProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ApiError(400, "Validation Error", errors.array()));
  } else {
    if (req.body?.cloudinaryUrls) {
      req.body.images = req.body.cloudinaryUrls.files;
    }
    try {
      console.log(req.body);
      const { category, dynamicData } = req.body; 

      let product;

      // Check the category and create the appropriate product instance
      switch (category) {
        case "Clothing":
          product = new ClothingProduct({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            details: req.body.details, // Match ClothingSchema
          });
          break;

        case "Cosmetic":
          product = new CosmeticProduct({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            details: req.body.details, // Match CosmeticProductSchema
          });
          break;

        case "Electronic":
          product = new ElectronicProduct({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            details: req.body.details, // Match ElectronicItemSchema
          });
          break;

        case "Food":
          product = new FoodProduct({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            details: req.body.details, // Match FoodItemSchema
          });
          break;
        default:
          product = new Product({
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            stock: req.body.stock,
            details: req.body.details,
          });
          break;
      }

      // Save the product to the database
      product.additionalFeatures = dynamicData;
      await product.save();

      // Respond with the created product and a 201 status code
      return res
        .status(201)
        .json(new ApiResponse(201, product, "Product created successfully!"));
    } catch (error) {
      // Handle validation errors or other issues
      res.status(400).json({ message: error.message });
    }
  }

  // const { name, vendorId, brandName } = req.body;
  // if (req.body?.cloudinaryUrls) {
  //     req.body.images = req.body.cloudinaryUrls.files
  // }
  // const existingProduct = await Product.findOne({ name: name, vendorId: vendorId, brandName: brandName });
  // if (existingProduct) {
  //     return res.status(400).json(new ApiError(400, null, "Product already exists"));
  // }
  // const newProduct = new Product(req.body);
  // await newProduct.save();
  // return res.status(201).json(new ApiResponse(201, newProduct, "Product created successfully!"));
});
/*--------------------------------------------Update an existing product---------------------------------------*/

const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    return res.status(400).json(new ApiError(400, null, "Invalid product ID"));
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ApiError(400, "Validation Error", errors.array()));
  }

  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }
  const existingImages = existingProduct.images;
  const retainedImages = req.body.images || existingProduct.images;
  const imagesToDelete = existingImages.filter(
    (img) => !retainedImages.includes(img)
  );

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
    images: updatedImages,
  };

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updatedData,
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProduct, "Product updated successfully!")
    );
});

/*--------------------------------------------Delete a product---------------------------------------*/

//
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
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully!"));
});

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
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully!"));
});

/*--------------------------------------------Get all products---------------------------------------*/

const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);
  const totalProducts = await Product.countDocuments();
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        result: products,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalProducts / limitNumber),
          totalItems: totalProducts,
          itemsPerPage: limitNumber,
        },
      },
      "Products retrieved successfully!"
    )
  );
});

export {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  productValidationRules,
};
