import Language from '../models/languageModel.js'; 
 
// @desc     Create language
// @route    POST api/languages
// @access   Public
const createLanguage = async (req, res) => { 
    try { 
        const language = new Language({languageName: "Sample"}); 
        await language.save(); 
        res.status(201).json(language); 
    } catch (error) { 
        res.status(400).json({ message: error.message }); 
    } 
}; 
 
// @desc     Get all languages
// @route    GET api/languages
// @access   Public
const getLanguages = async (req, res) => { 
    try { 
        const languages = await Language.find(); 
        res.status(200).json(languages); 
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    } 
}; 
 
// @desc     Get language by ID
// @route    GET api/languages/:id
// @access   Public
const getLanguageById = async (req, res) => { 
    try { 
        const language = await Language.findById(req.params.id); 
        if (!language) return res.status(404).json({ message: 'Language not found' }); 
        res.status(200).json(language); 
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    } 
}; 
 
// @desc     Update language by ID
// @route    PUT api/languages/:id
// @access   Public
const updateLanguage = async (req, res) => { 
    try { 
        const language = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
        if (!language) return res.status(404).json({ message: 'Language not found' }); 
        res.status(200).json(language); 
    } catch (error) { 
        res.status(400).json({ message: error.message }); 
    } 
}; 
 
// @desc     Delete language by ID
// @route    DELETS api/languages/:id
// @access   Public
const deleteLanguage = async (req, res) => { 
    try { 
        const language = await Language.findByIdAndDelete(req.params.id); 
        if (!language) return res.status(404).json({ message: 'Language not found' }); 
        res.status(204).send(); // No content 
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    } 
}; 
 
// Exporting functions
export { createLanguage, getLanguages, getLanguageById, updateLanguage, deleteLanguage };