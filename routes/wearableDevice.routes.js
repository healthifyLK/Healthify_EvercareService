const express = require("express");
const router = express.Router();
const { 
  registerDeviceController,
  getPatientDevicesController,
  getDeviceByIdController,
  updateDeviceController,
  removeDeviceController,
  syncDeviceMetricsController,
  getDeviceMetricsController,
  syncMetricsToEHRController,
  getAggregatedMetricsController,
  testDeviceConnectionController,
  getDeviceStatsController
} = require("../controllers/wearableDeviceController");

// Wearable Device routes
router.post("/register", registerDeviceController);
router.get("/patient/:patientId", getPatientDevicesController);
router.get("/:deviceId/patient/:patientId", getDeviceByIdController);
router.put("/:deviceId/patient/:patientId", updateDeviceController);
router.delete("/:deviceId/patient/:patientId", removeDeviceController);
router.post("/:deviceId/patient/:patientId/sync", syncDeviceMetricsController);
router.get("/:deviceId/patient/:patientId/metrics", getDeviceMetricsController);
router.get("/patient/:patientId/metrics/:metricType/aggregated/:period", getAggregatedMetricsController);
router.post("/patient/:patientId/sync-ehr", syncMetricsToEHRController);
router.get("/patient/:patientId/stats", getDeviceStatsController);
router.get("/:deviceId/patient/:patientId/test-connection", testDeviceConnectionController);

module.exports = router;
