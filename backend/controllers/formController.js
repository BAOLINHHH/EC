// controllers/FormController.js
import Form from '../models/formModel.js';

// @desc     Create form
// @route    POST api/forms
// @access   Public
const createForm = async (req, res) => {
    try {
        const form = new Form({form: "Sample"});
        await form.save();
        res.status(201).json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc     Get all forms
// @route    GET api/forms
// @access   Public
const getForms = async (req, res) => {
    try {
        const forms = await Form.find();
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc     Get all form by ID
// @route    GET api/forms/:id
// @access   Public
const getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: 'Form not found' });
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc     Update form by ID
// @route    PUT api/forms/:id
// @access   Public
const updateForm = async (req, res) => {
    try {
        const form = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!form) return res.status(404).json({ message: 'Form not found' });
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc     Delete form by ID
// @route    DELETS api/forms/:id
// @access   Public
const deleteForm = async (req, res) => {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);
        if (!form) return res.status(404).json({ message: 'Form not found' });
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exporting functions
export { createForm, getForms, getFormById, updateForm, deleteForm };