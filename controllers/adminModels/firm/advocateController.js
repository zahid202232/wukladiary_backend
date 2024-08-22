const { validationResult } = require('express-validator');
const Advocate = require('../../../models/admin/firm/advocateSchema');

const registerAdvocate = async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          msg: 'Validation Errors',
          errors: errors.array(),
        });
      }
  
      // Destructure request body
      const {
        firmIdByLocal,
        advName,
        email,
        password,
        phone,
        age,
        lawex,
        firmid,
        bank,
        address1Office,
        address2Office,
        zipcodeOffice,
        address1Chamber,
        address2Chamber,
        zipcodeChamber,
        countryOffice,
        stateOffice,
        cityOffice,
        countryChamber,
        stateChamber,
        cityChamber
      } = req.body;
      
      console.log("Advocate Data is : ", req.body);
      // Handle file
      const image = req.file; // Multer adds the file object to req.file
  
      if (!image) {
        return res.status(400).json({
          success: false,
          msg: 'Image file is required.',
        });
      }
  
      // Save the advocate details to the database (example)
      const newAdvocate = new Advocate({
        firmIdByLocal,
        advName,
        email,
        password,
        phone,
        age,
        image: image.filename, // Store file path in the database
        lawex,
        firmid,
        bank,
        address1Office,
        address2Office,
        zipcodeOffice,
        address1Chamber,
        address2Chamber,
        zipcodeChamber,
        countryOffice,
        stateOffice,
        cityOffice,
        countryChamber,
        stateChamber,
        cityChamber
      });
  
      const advocateData = await newAdvocate.save();
  
      return res.status(201).json({
        success: true,
        msg: 'Advocate Registered Successfully!',
        data: advocateData,
      });
  
    } catch (error) {
      console.error('Error registering advocate:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to register advocate.',
        error: error.message,
      });
    }
  };
  



  const getAdvocates = async (req, res) => {
    try {
      // Fetch all advocate data from the database
      const advocateData = await Advocate.find();
  
      // Ensure that data is always an array
      if (!Array.isArray(advocateData)) {
        throw new Error('Expected an array of advocate data');
      }
  
      // Return the advocate data with success status
      return res.status(200).json({
        success: true,
        msg: 'Advocate data retrieved successfully',
        data: advocateData.map(advocate => ({
          _id: advocate._id,
          advName: advocate.advName,
          email: advocate.email,
          phone: advocate.phone,
          age: advocate.age,
          image: advocate.image, // File path or filename
          lawex: advocate.lawex,
          firmid: advocate.firmid,
          bank: advocate.bank,
          address1Office: advocate.address1Office,
          address2Office: advocate.address2Office,
          zipcodeOffice: advocate.zipcodeOffice,
          address1Chamber: advocate.address1Chamber,
          address2Chamber: advocate.address2Chamber,
          zipcodeChamber: advocate.zipcodeChamber,
          countryOffice: advocate.countryOffice,
          stateOffice: advocate.stateOffice,
          cityOffice: advocate.cityOffice,
          countryChamber: advocate.countryChamber,
          stateChamber: advocate.stateChamber,
          cityChamber: advocate.cityChamber,
          firmIdByLocal: advocate.firmIdByLocal,
        })),
      });
    } catch (error) {
      // Handle errors and send a failure response
      console.error('Error retrieving advocate data:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to retrieve advocate data.',
        error: error.message,
      });
    }
  };
  
  const getAdvocateById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the document data by ID from the database
      const advocateData = await Advocate.findById(id);

     
  
      if (!advocateData) {
        return res.status(404).json({
          success: false,
          msg: 'Advocate not found',
          data: null,
        });
      }
  
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'Advocate data retrieved successfully',
        data: advocateData,
      });
     
  
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the Advocate data',
        data: null // Ensure data is null on error
      });
    }
  
  }

  const deleteAdvocate = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Log the ID for debugging
      console.log(id);
      
      // Find and delete the advocate by ID
      const deletedAdvocate = await Advocate.findByIdAndDelete(id);
      
      // Check if the advocate was found and deleted
      if (!deletedAdvocate) {
        return res.status(404).json({
          success: false,
          msg: 'Advocate not found',
        });
      }
      
      // Return success response with deleted advocate data
      return res.status(200).json({
        success: true,
        msg: 'Advocate deleted successfully',
        data: deletedAdvocate,
      });
    } catch (error) {
      // Handle errors and send failure response
      return res.status(400).json({
        success: false,
        msg: 'Error deleting advocate: ' + error.message,
      });
    }
  };


const updateAdvocate = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        advName,
        email,
        phone,
        age,
        lawex,
        firmid,
        bank,
        address1Office,
        address2Office,
        zipcodeOffice,
        address1Chamber,
        address2Chamber,
        zipcodeChamber,
        countryOffice,
        stateOffice,
        cityOffice,
        countryChamber,
        stateChamber,
        cityChamber
      } = req.body;
  
      // Handle file
      const image = req.file; // Multer adds the file object to req.file
  
      // Prepare the update object
      let updateFields = {
        advName,
        email,
        phone,
        age,
        lawex,
        firmid,
        bank,
        address1Office,
        address2Office,
        zipcodeOffice,
        address1Chamber,
        address2Chamber,
        zipcodeChamber,
        countryOffice,
        stateOffice,
        cityOffice,
        countryChamber,
        stateChamber,
        cityChamber
      };
      
      console.log("Update Advocate Data is : ", req.body);
      // If a new image file is provided, update it
      if (image) {
        updateFields.image = image.filename; // Store file path in the database
      }
  
      // Find the advocate by ID and update their details
      const updatedAdvocate = await Advocate.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true }
      );
  
      if (!updatedAdvocate) {
        return res.status(404).json({
          success: false,
          msg: 'Advocate not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        msg: 'Advocate updated successfully',
        data: updatedAdvocate,
      });
    } catch (error) {
      console.error('Error updating advocate:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to update advocate.',
        error: error.message,
      });
    }
  };

const getAdvocatByFirmId = async (req, res) => {
    try {
      const { firmIdByLocal } = req.params;
      console.log("Received firmId:", firmIdByLocal);
  
      const advocates = await Advocate.find({ firmIdByLocal: firmIdByLocal });
      console.log("Advocates found:", advocates);
  
      if (!advocates || advocates.length === 0) {
        return res.status(404).json({
          success: false,
          msg: 'Advocates Data not found',
          data: null,
        });
      }
  
      // Return the cases data with success status
      return res.status(200).json({
        success: true,
        msg: 'Advocates data retrieved successfully',
        data: advocates,
      });
  
    } catch (error) {
      console.error("Error while retrieving case data:", error);
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the Case data',
        data: null, // Ensure data is null on error
      });
    }
  };
  
  
  


module.exports = {
    registerAdvocate,
    getAdvocates,
    deleteAdvocate,
    updateAdvocate,
    getAdvocateById,
    getAdvocatByFirmId,
}
