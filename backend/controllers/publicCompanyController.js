// controllers/PublicCompanyController.js
import PublicCompany from '../models/publicCompanyModel.js';

// @desc     Create public company
// @route    POST api/publicompanies
// @access   Public
const createPublicCompany = async (req, res) => {
    try {
        const publicCompany = new PublicCompany({publicCompanyName: "Sample"});
        await publicCompany.save();
        res.status(201).json(publicCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc     Get all public companies
// @route    GET api/publicompanies
// @access   Public
const getPublicCompanies = async (req, res) => {
    try {
        const publicCompanies = await PublicCompany.find();
        res.status(200).json(publicCompanies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc     Get public company by ID
// @route    GET api/publicompanies/:id
// @access   Public
const getPublicCompanyById = async (req, res) => {
    try {
        const publicCompany = await PublicCompany.findById(req.params.id);
        if (!publicCompany) return res.status(404).json({ message: 'Public company not found' });
        res.status(200).json(publicCompany);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc     Update public company by ID
// @route    PUT api/publicompanies/:id
// @access   Public
const updatePublicCompany = async (req, res) => {
    try {
        const publicCompany = await PublicCompany.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!publicCompany) return res.status(404).json({ message: 'Public company not found' });
        res.status(200).json(publicCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc     Delete public company by ID
// @route    DELETE api/publicompanies/:id
// @access   Public
const deletePublicCompany = async (req, res) => {
    try {
        const publicCompany = await PublicCompany.findByIdAndDelete(req.params.id);
        if (!publicCompany) return res.status(404).json({ message: 'Public company not found' });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exporting functions
export { createPublicCompany, getPublicCompanies, getPublicCompanyById, updatePublicCompany, deletePublicCompany };