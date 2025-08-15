const {
  enrollPatient,
  getPatientEnrollment,
  updateEnrollment,
  terminateEnrollment,
  getProviderEnrollments,
  getEnrollmentStats,
} = require("../services/everCareService");

// Enroll a patient in the Ever Care Program
async function enrollPatientController(req, res) {
  try {
    const {
      patient_id,
      provider_id,
      subscription_tier,
      weekly_consultations,
      monthly_consultations,
      home_visits_per_month,
    } = req.body;

    // Validate required fields
    if (!patient_id || !provider_id || !subscription_tier) {
      return res.status(400).json({
        success: false,
        message: "Patient ID, provider ID, and subscription tier are required",
      });
    }

    const enrollmentData = {
      patient_id,
      provider_id,
      subscription_tier,
      weekly_consultations: weekly_consultations || 1,
      monthly_consultations: monthly_consultations || 4,
      home_visits_per_month: home_visits_per_month,
    };

    const enrollment = await enrollPatient(enrollmentData);

    res.status(201).json({
      success: true,
      message: "Patient enrolled successfully in Ever Care Program",
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get patient enrollment details
async function getPatientEnrollmentController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const enrollment = await getPatientEnrollment(patientId);

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update enrollment details
async function updateEnrollmentController(req, res) {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const enrollment = await updateEnrollment(patientId, updateData);

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Terminate enrollment
async function terminateEnrollmentController(req, res) {
  try {
    const { patientId } = req.params;
    const { reason } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Termination reason is required",
      });
    }

    const enrollment = await terminateEnrollment(patientId, reason);

    res.status(200).json({
      success: true,
      message: "Enrollment terminated successfully",
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all enrollments for a provider
async function getProviderEnrollmentsController(req, res) {
  try {
    const { providerId } = req.params;

    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: "Provider ID is required",
      });
    }

    const enrollments = await getProviderEnrollments(providerId);

    res.status(200).json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get enrollment statistics
async function getEnrollmentStatsController(req, res) {
  try {
    const stats = await getEnrollmentStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  enrollPatientController,
  getPatientEnrollmentController,
  updateEnrollmentController,
  terminateEnrollmentController,
  getProviderEnrollmentsController,
  getEnrollmentStatsController,
};
