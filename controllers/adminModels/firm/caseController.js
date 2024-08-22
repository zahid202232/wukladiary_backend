const { validationResult } = require('express-validator');
const Case = require('../../../models/admin/firm/casesModel');
const { firmRegisterValidator } = require('../../../helpers/firmValidator');

const registerCase = async (req, res) => {
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
      firmId,
      tribunal,
      localbar,
      highcourt,
      supremecourt,
      casetype,
      diarynumber,
      bench,
      casenumber,
      year,
      title,
      dateoffiling,
      judgename,
      courtroomno,
      description,
      underacts,
      undersection,
      firpolicestation,
      firno,
      firyear,
      stage,
      yourparty,
      oppositeparty,
      advocate,
      oppositpartyadvocate,
    //  casesummaryupload,
      documents, // Array of documents
      options, // Array of options
      rows // Array of rows
    } = req.body;

    console.log("Data Received is :    ", req.body);
    // Validate required fields based on the schema
    if (!firmId || !tribunal || !casenumber || !year || !title || !advocate || !description) {
      return res.status(400).json({
        success: false,
        msg: 'Missing required fields.',
      });
    }

    // Handle documents, options, and rows as arrays
    const parsedDocuments = documents ? documents.map(doc => ({ name: doc.name })) : [];
    const parsedOptions = options ? options.map(opt => ({ value: opt.value })) : [];
    const parsedRows = rows ? rows.map(row => ({ name: row.name })) : [];

    // Create case object
    const newCase = new Case({
      firmId,
      tribunal,
      localbar,
      highcourt,
      supremecourt,
      casetype,
      diarynumber,
      bench,
      casenumber,
      year,
      title,
      dateoffiling,
      judgename,
      courtroomno,
      description,
      underacts,
      undersection,
      firpolicestation,
      firno,
      firyear,
      stage,
      yourparty,
      oppositeparty,
      advocate,
      oppositpartyadvocate,
      //casesummaryupload,
      documents: parsedDocuments,
      options: parsedOptions,
      rows: parsedRows
    });

    // Save to database
    const caseData = await newCase.save();

    return res.status(201).json({
      success: true,
      msg: 'Case Registered Successfully!',
      data: caseData,
    });

  } catch (error) {
    console.error('Error registering case:', error.message);
    return res.status(500).json({
      success: false,
      msg: 'Server Error: Unable to register case.',
      error: error.message,
    });
  }
};
  
const getCase = async (req, res) => {
  try {
    // Fetch all case data from the database
    const caseData = await Case.find();

    // Ensure that data is always an array
    if (!Array.isArray(caseData)) {
      throw new Error('Expected an array of case data');
    }

    // Map over case data and format the response
    const formattedData = caseData.map(caseItem => ({
      _id: caseItem._id,
      tribunal: caseItem.tribunal,
      localbar: caseItem.localbar,
      highcourt: caseItem.highcourt,
      supremecourt: caseItem.supremecourt,
      casetype: caseItem.casetype,
      diarynumber: caseItem.diarynumber,
      bench: caseItem.bench,
      casenumber: caseItem.casenumber,
      year: caseItem.year,
      title: caseItem.title,
      dateoffiling: caseItem.dateoffiling,
      judgename: caseItem.judgename,
      courtroomno: caseItem.courtroomno,
      description: caseItem.description,
      underacts: caseItem.underacts,
      undersection: caseItem.undersection,
      firpolicestation: caseItem.firpolicestation,
      firno: caseItem.firno,
      firyear: caseItem.firyear,
      stage: caseItem.stage,
      yourparty: caseItem.yourparty,
      oppositeparty: caseItem.oppositeparty,
      advocate: caseItem.advocate,
      oppositpartyadvocate: caseItem.oppositpartyadvocate,
      documents: caseItem.documents, // Array of documents
      options: caseItem.options, // Array of options
      rows: caseItem.rows, // Array of rows
    }));

    // Return the formatted case data with success status
    return res.status(200).json({
      success: true,
      msg: 'Case data retrieved successfully',
      data: formattedData,
    });
  } catch (error) {
    // Handle errors and send a failure response
    console.error('Error retrieving case data:', error.message);
    return res.status(500).json({
      success: false,
      msg: 'Server Error: Unable to retrieve case data.',
      error: error.message,
    });
  }
};

  

  const deleteCase = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Log the ID for debugging
      console.log(id);
      
      // Find and delete the advocate by ID
      const deletedAdvocate = await Case.findByIdAndDelete(id);
      
      // Check if the advocate was found and deleted
      if (!deletedAdvocate) {
        return res.status(404).json({
          success: false,
          msg: 'Case not found',
        });
      }
      
      // Return success response with deleted advocate data
      return res.status(200).json({
        success: true,
        msg: 'Case deleted successfully',
        data: deletedAdvocate,
      });
    } catch (error) {
      // Handle errors and send failure response
      return res.status(400).json({
        success: false,
        msg: 'Error deleting Case: ' + error.message,
      });
    }
  };


  const updateCase = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        tribunal,
        localbar,
        highcourt,
        supremecourt,
        casetype,
        diarynumber,
        bench,
        casenumber,
        year,
        title,
        dateoffiling,
        judgename,
        courtroomno,
        description,
        underacts,
        undersection,
        firpolicestation,
        firno,
        firyear,
        stage,
        yourparty,
        oppositeparty,
        advocate,
        oppositpartyadvocate,
        documents, // Array of documents
        options,   // Array of options
        rows       // Array of rows
      } = req.body;
  
      // Handle documents, options, and rows as arrays
      const parsedDocuments = documents ? documents.map(doc => ({ name: doc.name })) : [];
      const parsedOptions = options ? options.map(opt => ({ value: opt.value })) : [];
      const parsedRows = rows ? rows.map(row => ({ name: row.name })) : [];
  
      // Prepare the update object
      let updateFields = {
        tribunal,
        localbar,
        highcourt,
        supremecourt,
        casetype,
        diarynumber,
        bench,
        casenumber,
        year,
        title,
        dateoffiling,
        judgename,
        courtroomno,
        description,
        underacts,
        undersection,
        firpolicestation,
        firno,
        firyear,
        stage,
        yourparty,
        oppositeparty,
        advocate,
        oppositpartyadvocate,
        documents: parsedDocuments,
        options: parsedOptions,
        rows: parsedRows
      };
  
      // If a new file is provided, handle it
      if (req.file) {
        updateFields.casesummaryupload = req.file.filename; // Assuming the field is `casesummaryupload`
      }
  
      // Find the case by ID and update the details
      const updatedCase = await Case.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true }
      );
  
      if (!updatedCase) {
        return res.status(404).json({
          success: false,
          msg: 'Case not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        msg: 'Case updated successfully',
        data: updatedCase,
      });
    } catch (error) {
      console.error('Error updating case:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to update case.',
        error: error.message,
      });
    }
  };
  
  
const getCaseById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the document data by ID from the database
      const caseById = await Case.findById(id);
  
      if (!caseById) {
        return res.status(404).json({
          success: false,
          msg: 'Case Data not found',
          data: null,
        });
      }
  
      // Return the document data with success status
      return res.status(200).json({
        success: true,
        msg: 'Case data retrieved successfully',
        data: caseById,
      });
  
    } catch (error) {
      // Handle errors and send a failure response
      return res.status(500).json({
        success: false,
        msg: 'An error occurred while retrieving the Case data',
        data: null // Ensure data is null on error
      });
    }
};
const getCaseByFirmId = async (req, res) => {
  try {
    const { firmId } = req.params;
    console.log("Received firmId:", firmId);

    // Fetch the cases by firmId from the database
    const cases = await Case.find({ firmId: firmId });
    console.log("Cases found:", cases);

    if (!cases || cases.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Case Data not found',
        data: null,
      });
    }

    // Return the cases data with success status
    return res.status(200).json({
      success: true,
      msg: 'Case data retrieved successfully',
      data: cases,
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
    registerCase,
    getCase,
    deleteCase,
    updateCase,
    getCaseById,
    getCaseByFirmId,
}
