import { Router } from "express"
import { createPageBanner, bannerValidationRules, updatePageBanner, getPageBannerById, getAllPageBanners, deletePageBanner } from "../../controllers/admin/cms/pageBanner.controller.js";

const router = Router();

router.post('/create', bannerValidationRules, createPageBanner)
router.get('/get/:bannerId', getPageBannerById)
router.put('/update/:bannerId', bannerValidationRules, updatePageBanner)
router.delete('/delete/:bannerId', deletePageBanner)
router.get('/get-all', getAllPageBanners)

export default router
