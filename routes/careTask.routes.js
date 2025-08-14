const express = require("express");
const router = express.Router();
const { 
  createTaskController,
  getPatientTasksController,
  getTasksByGoalController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  markTaskCompleteController,
  getOverdueTasksController,
  getTasksDueTodayController,
  getTasksByStatusController,
  getTasksByPriorityController,
  getUpcomingTasksController,
  getTaskStatsController
} = require("../controllers/careTaskController");

// Care Task routes
router.post("/", createTaskController);
router.get("/patient/:patientId", getPatientTasksController);
router.get("/goal/:goalId/patient/:patientId", getTasksByGoalController);
router.get("/:taskId/patient/:patientId", getTaskByIdController);
router.put("/:taskId/patient/:patientId", updateTaskController);
router.delete("/:taskId/patient/:patientId", deleteTaskController);
router.post("/:taskId/patient/:patientId/complete", markTaskCompleteController);
router.get("/patient/:patientId/overdue", getOverdueTasksController);
router.get("/patient/:patientId/due-today", getTasksDueTodayController);
router.get("/patient/:patientId/status/:status", getTasksByStatusController);
router.get("/patient/:patientId/priority/:priority", getTasksByPriorityController);
router.get("/patient/:patientId/upcoming", getUpcomingTasksController);
router.get("/patient/:patientId/stats", getTaskStatsController);

module.exports = router;
