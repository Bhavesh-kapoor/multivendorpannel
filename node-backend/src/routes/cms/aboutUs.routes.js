import { Router } from "express"
import { createAboutUs, aboutUsValidationRules, getAboutUsById, getAllAboutUsEntries, updateAboutUsById, deleteAboutUsById } from "../../controllers/admin/cms/aboutUs.controller.js";

const router = Router();

router.post('/create', aboutUsValidationRules, createAboutUs)
router.get('/get/:id', getAboutUsById)
router.put('/update/:id', aboutUsValidationRules, updateAboutUsById)
router.delete('/delete/:id', deleteAboutUsById)
router.get('/get-all', getAllAboutUsEntries)

export default router
