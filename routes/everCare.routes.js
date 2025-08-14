const express = require("express");
const router = express.Router();
const { 
  enrollPatientController,
  getPatientEnrollmentController,
  updateEnrollmentController,
  terminateEnrollmentController,
  getProviderEnrollmentsController,
  getEnrollmentStatsController
} = require("../controllers/everCareController");

// Ever Care Program enrollment routes
router.post("/enroll", enrollPatientController);
router.get("/enrollment/:patientId", getPatientEnrollmentController);
router.put("/enrollment/:patientId", updateEnrollmentController);
router.delete("/enrollment/:patientId", terminateEnrollmentController);
router.get("/provider/:providerId/enrollments", getProviderEnrollmentsController);
router.get("/stats", getEnrollmentStatsController);

module.exports = router;
