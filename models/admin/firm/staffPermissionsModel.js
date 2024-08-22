const mongoose = require('mongoose');

const staffPermissionSchema = new mongoose.Schema({
  // Name of the permission
  permission_name: {
    type: String,
    required: true,
  },
  // The module this permission belongs to
  module: {
    type: String,
    required: true,
    enum: [
      'dashboard', 'calendar', 'setting', 'diary', 'advocate', 'document', 
      'member', 'group', 'case', 'todo', 'bill', 'timesheet', 'expense', 
      'client', 'doctype', 'court', 'highcourt', 'bench', 'cause', 'tax', 
      'motions'
    ],
  },
  // The level of permission (e.g., 0: Show, 1: Manage, 2: Create, etc.)
  permission_level: {
    type: Number,
    required: true,
    enum: [0, 1, 2, 3, 4], // Adjust based on your permission levels
  },
  // Default flag (0: Not Default, 1: Default)
  is_default: {
    type: Number,
    default: 0,
    enum: [0, 1],
  },
});

module.exports = mongoose.model('StaffPermissionModel', staffPermissionSchema);
