import { Request, Response } from "express";
import axios from "axios";
import cache from "../utils/cache";
import SavedCountry from "../models/savedCountryModel";
import dotenv from "dotenv";

interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}


dotenv.config(); // Make sure environment variables are loaded

const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables");
}

const fetchCountries = async (url: string) => {
  if (cache.has(url)) return cache.get(url);
  const { data } = await axios.get(url);
  cache.set(url, data);
  return data;
};

export const getAllCountries = async (req: Request, res: Response) => {
  try {
    const url = `${BASE_URL}/all?fields=name,capital,region,flags,population,cca2,currencies,timezones`;
    const data = await fetchCountries(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch countries", error });
  }
};

export const getCountryByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const data = await fetchCountries(`${BASE_URL}/alpha/${code}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch country", error });
  }
};

export const getByRegion = async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const data = await fetchCountries(`${BASE_URL}/region/${region}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch region countries", error });
  }
};

export const searchCountries = async (req: Request, res: Response) => {
 
  
  try {
    const { name, capital, region, timezone } = req.query;

    let countries: any[] = [];

    // If region is provided, fetch from region endpoint
    if (region) {
      countries = await fetchCountries(
        `${BASE_URL}/region/${region}?fields=name,capital,region,flags,population,cca2,currencies,timezones`
      );
    } else {
      // Otherwise fetch all countries
      countries = await fetchCountries(
        `${BASE_URL}/all?fields=name,capital,region,flags,population,cca2,currencies,timezones`
      );
    }

    let filtered = countries;

    if (name) {
      const searchName = (name as string).toLowerCase();
      filtered = filtered.filter(
        (c: any) => c.name?.common?.toLowerCase().includes(searchName)
      );
    }

    if (capital) {
      const searchCapital = (capital as string).toLowerCase();
      filtered = filtered.filter(
        (c: any) => c.capital?.[0]?.toLowerCase().includes(searchCapital)
      );
    }

    if (timezone) {
      const searchTimezone = timezone as string;
      filtered = filtered.filter(
        (c: any) => c.timezones?.includes(searchTimezone)
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error("Search failed:", error);
    res.status(500).json({ message: "Failed to search countries", error });
  }
};



// Save a country
export const saveCountry = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { code } = req.body;
    console.log(code+"heyyyyyyyyy");
    
    if (!code) return res.status(400).json({ message: "Country code required" });

    // Check if already saved
    const existing = await SavedCountry.findOne({
      user: req.user._id,
      countryCode: code.toLowerCase(),
    });
    if (existing) {
      return res.status(400).json({ message: "Country already saved" });
    }

    // Save to DB
    await SavedCountry.create({
      user: req.user._id,
      countryCode: code.toLowerCase(),
    });

    // Fetch and return full country data
    const { data } = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ message: "Failed to save country", error });
  }
};

// Remove a saved country
export const removeCountry = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ message: "Country code required" });

    await SavedCountry.findOneAndDelete({
      user: req.user._id,
      countryCode: code.toLowerCase(),
    });

    res.json({ message: "Removed", code });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove country", error });
  }
};

// Get saved countries
export const getSavedCountries = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const saved = await SavedCountry.find({ user: req.user._id });
    const codes = saved.map((item) => item.countryCode);

    if (!codes.length) return res.json([]);

    const { data } = await axios.get(
      `https://restcountries.com/v3.1/alpha?codes=${codes.join(",")}`
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch saved countries",
      error: (error as Error).message,
    });
  }
};

// controllers/countryController.ts
export const getCountriesBatch = async (req: Request, res: Response) => {
  try {
    const { offset = 0, limit = 20 } = req.query; // default 20
    const url = `${BASE_URL}/all?fields=name,capital,region,flags,population,cca2,currencies,timezones`;
    const countries: any[] = await fetchCountries(url);

    // Convert offset/limit to numbers
    const start = Number(offset);
    const end = start + Number(limit);
    const batch = countries.slice(start, end);

    res.json({
      data: batch,
      total: countries.length,
      offset: start,
      limit: Number(limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch countries", error });
  }
};
