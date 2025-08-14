const { createTask, getPatientTasks, getTasksByGoal, getTaskById, updateTask, deleteTask, markTaskComplete, getTasksByStatus, getTasksByPriority, getOverdueTasks, getTasksDueToday, getUpcomingTasks, getTaskStats } = require("../services/careTaskService");

// Create a new care task
async function createTaskController(req, res) {
  try {
    const { goal_id, patient_id, title, description, task_type, frequency, frequency_unit, due_date, priority, estimated_duration, reminder_enabled, reminder_time } = req.body;

    // Validate required fields
    if (!goal_id || !patient_id || !title || !task_type) {
      return res.status(400).json({
        success: false,
        message: "Goal ID, patient ID, title, and task type are required",
      });
    }

    const taskData = {
      goal_id,
      patient_id,
      title,
      description,
      task_type,
      frequency,
      frequency_unit,
      due_date: due_date ? new Date(due_date) : null,
      priority: priority || "medium",
      estimated_duration,
      reminder_enabled: reminder_enabled !== undefined ? reminder_enabled : true,
      reminder_time: reminder_time || null,
    };

    const task = await createTask(taskData);

    res.status(201).json({
      success: true,
      message: "Care task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all tasks for a patient
async function getPatientTasksController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const tasks = await getPatientTasks(patientId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get tasks for a specific goal
async function getTasksByGoalController(req, res) {
  try {
    const { goalId, patientId } = req.params;

    if (!goalId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Goal ID and Patient ID are required",
      });
    }

    const tasks = await getTasksByGoal(goalId, patientId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get a specific task
async function getTaskByIdController(req, res) {
  try {
    const { taskId, patientId } = req.params;

    if (!taskId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Task ID and Patient ID are required",
      });
    }

    const task = await getTaskById(taskId, patientId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update a care task
async function updateTaskController(req, res) {
  try {
    const { taskId, patientId } = req.params;
    const updateData = req.body;

    if (!taskId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Task ID and Patient ID are required",
      });
    }

    // Convert due_date to Date if provided
    if (updateData.due_date) {
      updateData.due_date = new Date(updateData.due_date);
    }

    const task = await updateTask(taskId, patientId, updateData);

    res.status(200).json({
      success: true,
      message: "Care task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete a care task
async function deleteTaskController(req, res) {
  try {
    const { taskId, patientId } = req.params;

    if (!taskId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Task ID and Patient ID are required",
      });
    }

    const result = await deleteTask(taskId, patientId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Mark task as complete
async function markTaskCompleteController(req, res) {
  try {
    const { taskId, patientId } = req.params;
    const completionData = req.body;

    if (!taskId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Task ID and Patient ID are required",
      });
    }

    const task = await markTaskComplete(taskId, patientId, completionData);

    res.status(200).json({
      success: true,
      message: "Task marked as complete successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get tasks by status
async function getTasksByStatusController(req, res) {
  try {
    const { patientId, status } = req.params;

    if (!patientId || !status) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and status are required",
      });
    }

    const tasks = await getTasksByStatus(patientId, status);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get tasks by priority
async function getTasksByPriorityController(req, res) {
  try {
    const { patientId, priority } = req.params;

    if (!patientId || !priority) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and priority are required",
      });
    }

    const tasks = await getTasksByPriority(patientId, priority);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get overdue tasks
async function getOverdueTasksController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const tasks = await getOverdueTasks(patientId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get tasks due today
async function getTasksDueTodayController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const tasks = await getTasksDueToday(patientId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get upcoming tasks
async function getUpcomingTasksController(req, res) {
  try {
    const { patientId } = req.params;
    const { days } = req.query;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const tasks = await getUpcomingTasks(patientId, days ? parseInt(days) : 7);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get task statistics
async function getTaskStatsController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const stats = await getTaskStats(patientId);

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
  createTaskController,
  getPatientTasksController,
  getTasksByGoalController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
  markTaskCompleteController,
  getTasksByStatusController,
  getTasksByPriorityController,
  getOverdueTasksController,
  getTasksDueTodayController,
  getUpcomingTasksController,
  getTaskStatsController,
};
