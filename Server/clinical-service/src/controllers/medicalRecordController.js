import MedicalRecord from '../models/MedicalRecord.js';

// ─── LIST MEDICAL RECORDS ─────────────────────────────────────────────────────
export const listMedicalRecords = async (req, res) => {
  try {
    const userId   = req.headers['x-user-id'] || req.query.patientId || 'usr_pat1';
    const userRole = req.headers['x-user-role'];
    const { patientId: queryPatientId, recordType, type, page = 1, limit = 50, offset = 0 } = req.query;

    const filter = { isDeleted: false };

    if (userRole === 'patient') {
      filter.patientId = userId;
      filter.visibleToPatient = true;
    } else {
      if (queryPatientId) filter.patientId = queryPatientId;
      else if (userId) filter.patientId = userId;
    }

    const effectiveType = recordType || type;
    if (effectiveType) filter.type = effectiveType;

    const effectiveSkip = offset ? parseInt(offset) : (parseInt(page) - 1) * parseInt(limit);
    const [records, total] = await Promise.all([
      MedicalRecord.find(filter).sort({ createdAt: -1 }).skip(effectiveSkip).limit(parseInt(limit)).lean(),
      MedicalRecord.countDocuments(filter),
    ]);

    res.json({
      success: true,
      records,
      data: records,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: effectiveSkip,
        hasMore: effectiveSkip + records.length < total,
      },
      meta: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── CREATE MEDICAL RECORD ───────────────────────────────────────────────────
export const createMedicalRecord = async (req, res) => {
  try {
    const uploadedBy   = req.headers['x-user-id'] || 'usr_pat1';
    const uploaderRole = req.headers['x-user-role'] || 'patient';
    const { patientId, recordType, type, title, description, fileKey, mimeType, sizeBytes, visibleToPatient, notes, data, tags } = req.body;

    const targetPatientId = patientId || uploadedBy;
    const targetType = recordType || type;

    if (!targetPatientId || !title) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'patientId and title are required.' } });
    }

    const record = await MedicalRecord.create({
      patientId: targetPatientId,
      type: targetType || 'lab_result',
      title,
      description,
      fileKey,
      mimeType,
      sizeBytes,
      uploadedBy,
      uploaderRole,
      visibleToPatient: visibleToPatient !== false,
      notes: notes || description,
      data,
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      record,
      data: { record },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET RECORD BY ID ────────────────────────────────────────────────────────
export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).lean();
    if (!record || record.isDeleted) {
      return res.status(404).json({ success: false, message: 'Medical record not found.' });
    }
    res.json({ success: true, record, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── UPDATE RECORD ───────────────────────────────────────────────────────────
export const updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record || record.isDeleted) {
      return res.status(404).json({ success: false, message: 'Medical record not found.' });
    }
    res.json({ success: true, message: 'Medical record updated successfully', record });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── DELETE RECORD ───────────────────────────────────────────────────────────
export const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!record) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Record not found.' } });
    res.json({ success: true, message: 'Record deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};

// ─── GET RECORDS BY PATIENT ──────────────────────────────────────────────────
export const getRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await MedicalRecord.find({ patientId, isDeleted: false }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, records, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
  }
};
