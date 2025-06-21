import db from '../config/db.js';

export const getAllColivingRooms = (req, res) => {
  const sql = 'SELECT * FROM coliving_rooms';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

export const getColivingRoomById = (req, res) => {
  const sql = 'SELECT * FROM coliving_rooms WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.status(200).json({
      success: true,
      data: result[0]
    });
  });
};

export const createColivingRoom = (req, res) => {
  const {
    price,
    area,
    bathroom,
    bedroom,
    dedicated_work_space,
    property_id,
    occupied,
    facilitie,
    locking,
    image,
    property_name,
    user_name,
    phone_no,
    adhar_number
  } = req.body;

  const sql = `INSERT INTO coliving_rooms SET ?`;
  const data = {
    price,
    area,
    bathroom,
    bedroom,
    dedicated_work_space,
    property_id,
    occupied,
    facilitie,
    locking,
    image,
    property_name,
    user_name,
    phone_no,
    adhar_number

  };

  db.query(sql, data, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to create room'
      });
    }
    res.status(201).json({
      success: true,
      data: { id: result.insertId, ...data }
    });
  });
};

export const updateColivingRoom = (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const fields = Object.keys(updateData)
    .filter(key => updateData[key] !== undefined)
    .map(key => `${key} = ?`);
  const values = [...Object.values(updateData).filter(val => val !== undefined), id];

  const sql = `UPDATE coliving_rooms SET ${fields.join(', ')} WHERE id = ?`;
  
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.json({
      success: true,
      message: 'Room updated successfully'
    });
  });
};

export const deleteColivingRoom = (req, res) => {
  const sql = 'DELETE FROM coliving_rooms WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  });
};

// Get coliving rooms by property_id
export const getColivingRoomsByPropertyId = (req, res) => {
  const { property_id } = req.params;
  const sql = 'SELECT * FROM coliving_rooms WHERE property_id = ?';
  db.query(sql, [property_id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (!results.length) {
      return res.status(404).json({
        success: false,
        error: 'No rooms found for this property_id'
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

// occupied status update

export const updateColivingRoomOccupiedStatus = (req, res) => {
  const { id } = req.params;
  const { occupied } = req.body;

  if (typeof occupied === 'undefined') {
    return res.status(400).json({
      success: false,
      error: 'Occupied status is required.'
    });
  }

  const sql = 'UPDATE coliving_rooms SET occupied = ? WHERE id = ?';
  db.query(sql, [occupied, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.json({
      success: true,
      message: 'Occupied status updated successfully'
    });
  });
};


// Get coliving rooms by user_name
// export const getColivingRoomsByUserName = (req, res) => {
//   const { username } = req.params;
//   const sql = 'SELECT * FROM coliving_rooms WHERE user_name = ?';
//   db.query(sql, [username], (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         error: 'Database error'
//       });
//     }
//     if (!results.length) {
//       return res.status(404).json({
//         success: false,
//         error: 'No rooms found for this user_name'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: results
//     });
//   });
// };


// Get coliving rooms by user_name
export const getColivingRoomsByUserName = (req, res) => {
  const { username } = req.params;
  const sql = 'SELECT * FROM coliving_rooms WHERE user_name = ?';
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};


// Update(put) coliving room
export const putColivingRoom = (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Remove undefined fields
  const fields = Object.keys(updateData)
    .filter(key => updateData[key] !== undefined)
    .map(key => `${key} = ?`);
  const values = Object.values(updateData).filter(val => val !== undefined);

  if (!fields.length) {
    return res.status(400).json({
      success: false,
      error: 'No fields provided for update'
    });
  }

  const sql = `UPDATE coliving_rooms SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.json({
      success: true,
      message: 'Room updated successfully'
    });
  });
};


// export const putColivingRoom = (req, res) => {
//   const { id } = req.params;
//   const updateData = { ...req.body };

//   // Filter out undefined or null fields
//   const fields = Object.keys(updateData)
//     .filter(key => updateData[key] !== undefined && updateData[key] !== null)
//     .map(key => `${key} = ?`);
//   const values = Object.values(updateData).filter(val => val !== undefined && val !== null);

//   if (!fields.length) {
//     return res.status(400).json({
//       success: false,
//       error: 'No fields provided for update'
//     });
//   }

//   const sql = `UPDATE coliving_rooms SET ${fields.join(', ')} WHERE id = ?`;
//   values.push(id);

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         error: 'Database error'
//       });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Room not found'
//       });
//     }
//     res.json({
//       success: true,
//       message: 'Room updated successfully'
//     });
//   });
// };