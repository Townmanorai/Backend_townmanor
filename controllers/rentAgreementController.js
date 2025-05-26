

import db from '../config/db.js';

// Get rent agreement by ID
export const getRentAgreementById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM RentAgreement WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Database error',
        details: err.message
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        error: 'Rent agreement not found',
        id: id
      });
    }
    res.status(200).json(result[0]);
  });
};


export const createRentAgreement = (req, res) => {
  try {
    // Required fields validation
    const requiredFields = [
      'city', 'security_amount', 'monthly_rent', 
      'landlord_name', 'landlord_phone', 'landlord_email',
      'tenant_name', 'tenant_phone', 'tenant_email'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    // Format date field
    const agreementStartDate = req.body.agreement_start_date ? 
      new Date(req.body.agreement_start_date).toISOString().split('T')[0] : 
      null;

    // Convert boolean fields to tinyint
    const booleanFields = [
      'has_maintenance',
      'has_other_charges',
      'landlord_verified',
      'tenant_verified',
      'consent_given',
      'needs_physical_copy'
    ];

    const agreementData = {
      ...req.body,
      agreement_start_date: agreementStartDate,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Convert boolean fields to 0/1
    booleanFields.forEach(field => {
      if (agreementData[field] !== undefined) {
        agreementData[field] = agreementData[field] ? 1 : 0;
      }
    });

    const sql = `INSERT INTO RentAgreement SET ?`;
    db.query(sql, agreementData, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Failed to create agreement'
        });
      }
      
      // Return only the ID
      res.status(201).json({
        message: 'Rent agreement created successfully',
        id: result.insertId
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const updateRentAgreement = (req, res) => {
  try {
    const { id } = req.params;
    
    // Format date field if it exists in update data
    const agreementStartDate = req.body.agreement_start_date ? 
      new Date(req.body.agreement_start_date).toISOString().split('T')[0] : 
      undefined;

    // Convert boolean fields to tinyint
    const booleanFields = [
      'has_maintenance',
      'has_other_charges',
      'landlord_verified',
      'tenant_verified',
      'consent_given',
      'needs_physical_copy'
    ];

    const updateData = {
      ...req.body,
      agreement_start_date: agreementStartDate,
      updated_at: new Date()
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Convert boolean fields to 0/1
    booleanFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = updateData[field] ? 1 : 0;
      }
    });

    const sql = `UPDATE RentAgreement SET ? WHERE id = ?`;
    db.query(sql, [updateData, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Update failed'
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: 'Agreement not found'
        });
      }
     
      res.json({ id: parseInt(id) ,
         message: 'Rent agreement updated successfully',
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Update tenant verification status
export const updateTenantVerification = (req, res) => {
  try {
    const { id } = req.params;
    const { tenant_verified } = req.body;

    if (tenant_verified === undefined) {
      return res.status(400).json({
        error: 'tenant_verified field is required'
      });
    }

    const updateData = {
      tenant_verified: tenant_verified ? 1 : 0,
      updated_at: new Date()
    };

    // First check if agreement exists
    const checkSql = 'SELECT tenant_verified FROM RentAgreement WHERE id = ?';
    db.query(checkSql, [id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Database error:', checkErr);
        return res.status(500).json({
          error: 'Failed to fetch agreement'
        });
      }

      if (checkResult.length === 0) {
        return res.status(404).json({
          error: 'Rent agreement not found'
        });
      }

      const currentStatus = checkResult[0].tenant_verified;
      
      // Only update if status is different
      if (currentStatus === updateData.tenant_verified) {
        return res.json({
          // id: parseInt(id),
          message: 'Tenant verification status already up to date'
        });
      }

      const updateSql = `UPDATE RentAgreement SET ? WHERE id = ?`;
      db.query(updateSql, [updateData, id], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            error: 'Update failed'
          });
        }

        res.json({
          id: parseInt(id),
          tenant_verified: Boolean(updateData.tenant_verified)
        });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Update landlord verification status
export const updateLandlordVerification = (req, res) => {
  try {
    const { id } = req.params;
    const { landlord_verified } = req.body;

    if (landlord_verified === undefined) {
      return res.status(400).json({
        error: 'landlord_verified field is required'
      });
    }

    const updateData = {
      landlord_verified: landlord_verified ? 1 : 0,
      updated_at: new Date()
    };

    // First check if agreement exists
    const checkSql = 'SELECT landlord_verified FROM RentAgreement WHERE id = ?';
    db.query(checkSql, [id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Database error:', checkErr);
        return res.status(500).json({
          error: 'Failed to fetch agreement'
        });
      }

      if (checkResult.length === 0) {
        return res.status(404).json({
          error: 'Rent agreement not found'
        });
      }

      const currentStatus = checkResult[0].landlord_verified;
      
      // Only update if status is different
      if (currentStatus === updateData.landlord_verified) {
        return res.json({
          id: parseInt(id),
          message: 'Landlord verification status already up to date'
        });
      }

      const updateSql = `UPDATE RentAgreement SET ? WHERE id = ?`;
      db.query(updateSql, [updateData, id], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            error: 'Update failed'
          });
        }

        res.json({
          id: parseInt(id),
          landlord_verified: Boolean(updateData.landlord_verified)
        });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// last 10 rent agreements without ID


export const getLastTenAgreements = (req, res) => {
  const sql = `
    SELECT 
      city, security_amount, stamp_paper_value, agreement_duration_months, monthly_rent,
    has_maintenance, has_other_charges, agreement_start_date, yearly_increment,
    notice_period_months, lock_in_period_months, property_type, floor_number,
    configuration, area_sqft, property_number, building_name, locality, pincode, state,

    landlord_name, landlord_age, landlord_phone, landlord_address,
    landlord_identity_number, landlord_identity_type, landlord_email, landlord_verified,

    tenant_name, tenant_age, tenant_phone, tenant_address,
    tenant_identity_number, tenant_identity_type, tenant_email, tenant_verified,

    consent_given, needs_physical_copy, transaction_id, total_amount_paid
    FROM RentAgreement 
    ORDER BY created_at DESC 
    LIMIT 10`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Failed to fetch agreements'
      });
    }

    res.status(200).json(results);
  });
};






// Delete rent agreement by ID
export const deleteRentAgreement = (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM RentAgreement WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Database error',
        details: err.message
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Rent agreement not found',
        id: id
      });
    }
    res.json({
      id: parseInt(id)
    });
  });
};

export default {
  getRentAgreementById,
  createRentAgreement,
  updateRentAgreement,
  deleteRentAgreement,
  updateTenantVerification,
  updateLandlordVerification,
  getLastTenAgreements
};