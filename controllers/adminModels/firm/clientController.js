const { validationResult } = require('express-validator');
const Client = require('../../../models/admin/firm/clientModel');

const registerClient = async (req, res) => {
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
      const { name, email, password, phone } = req.body;
  
      console.log("Client Data is:", req.body);
  
      // Save the client details to the database
      const newClient = new Client({
        name,
        email,
        password,
        phone,
      });
  
      const clientData = await newClient.save();
  
      return res.status(201).json({
        success: true,
        msg: 'Client Registered Successfully!',
        data: clientData,
      });
  
    } catch (error) {
      console.error('Error registering client:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to register client.',
        error: error.message,
      });
    }
  };
  
 
  
  


  const getClients = async (req, res) => {
    try {
      // Fetch all client data from the database
      const clientData = await Client.find();
  
      // Ensure that data is always an array
      if (!Array.isArray(clientData)) {
        throw new Error('Expected an array of client data');
      }
  
      // Return the client data with success status
      return res.status(200).json({
        success: true,
        msg: 'Client data retrieved successfully',
        data: clientData.map(client => ({
          _id: client._id,
          name: client.name,
          email: client.email,
          phone: client.phone, // Include any other client-specific field
        })),
      });
    } catch (error) {
      // Handle errors and send a failure response
      console.error('Error retrieving client data:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to retrieve client data.',
        error: error.message,
      });
    }
  };
  


  const deleteClient = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Log the ID for debugging
      
      
      // Find and delete the advocate by ID
      const deleteClient = await Client.findByIdAndDelete(id);
      
      // Check if the advocate was found and deleted
      if (!deleteClient) {
        return res.status(404).json({
          success: false,
          msg: 'Client not found',
        });
      }
      
      // Return success response with deleted advocate data
      return res.status(200).json({
        success: true,
        msg: 'Client deleted successfully',
        data: deleteClient,
      });
    } catch (error) {
      // Handle errors and send failure response
      return res.status(400).json({
        success: false,
        msg: 'Error deleting client: ' + error.message,
      });
    }
  };


  const updateClient = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        phone,
        password
      } = req.body;
  
  
      // Prepare the update object
      let updateFields = {
        name,
        email,
        phone,
      };
  
      // Handle password hashing if provided
      if (password) {
        // Hash the password here before saving it (you need to implement hashPassword function)
        updateFields.password = await hashPassword(password);
      }
  
   
      // Find the client by ID and update their details
      const updatedClient = await Client.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true }
      );
  
      if (!updatedClient) {
        return res.status(404).json({
          success: false,
          msg: 'Client not found',
        });
      }
  
      return res.status(200).json({
        success: true,
        msg: 'Client updated successfully',
        data: updatedClient,
      });
    } catch (error) {
      console.error('Error updating client:', error.message);
      return res.status(500).json({
        success: false,
        msg: 'Server Error: Unable to update client.',
        error: error.message,
      });
    }
  };
  
  // Helper function to hash password
  const hashPassword = async (password) => {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };
  


  
  
  


module.exports = {
    registerClient,
    getClients,
    deleteClient,
    updateClient,
}
