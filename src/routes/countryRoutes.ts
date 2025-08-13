import express from "express";
import { getAllCountries, getCountryByCode, getByRegion, searchCountries, saveCountry, removeCountry, getSavedCountries, getCountriesBatch } from "../controllers/countryController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// router.get("/", getAllCountries);
router.get("/search", searchCountries);
router.get("/", getCountriesBatch); 
router.get("/:code", getCountryByCode);
router.get("/region/:region", getByRegion);


router.post("/save", protect, saveCountry);
router.delete("/save/:code", protect, removeCountry);
router.get("/saved/list", protect, getSavedCountries);

export default router;
