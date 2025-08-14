const express = require("express");
const router = express.Router();
const { 
  createGoalController,
  getPatientGoalsController,
  getGoalByIdController,
  updateGoalController,
  deleteGoalController,
  getGoalsByCategoryController,
  getGoalsByPriorityController,
  getOverdueGoalsController,
  updateGoalProgressController,
  getGoalsSummaryController
} = require("../controllers/careGoalController");

// Care Goal routes
router.post("/", createGoalController);
router.get("/patient/:patientId", getPatientGoalsController);
router.get("/:goalId/patient/:patientId", getGoalByIdController);
router.put("/:goalId/patient/:patientId", updateGoalController);
router.delete("/:goalId/patient/:patientId", deleteGoalController);
router.get("/patient/:patientId/category/:category", getGoalsByCategoryController);
router.get("/patient/:patientId/priority/:priority", getGoalsByPriorityController);
router.get("/patient/:patientId/overdue", getOverdueGoalsController);
router.put("/:goalId/patient/:patientId/progress", updateGoalProgressController);
router.get("/patient/:patientId/summary", getGoalsSummaryController);

module.exports = router;
