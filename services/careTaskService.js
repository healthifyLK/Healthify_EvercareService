const { CareTask, TaskCompletion, CareGoal } = require("../models");
const { Op, sequelize } = require("sequelize");

// Create a new care task
async function createTask(taskData) {
  try {
    const task = await CareTask.create(taskData);
    return task;
  } catch (error) {
    throw new Error(`Failed to create care task: ${error.message}`);
  }
}

// Get all tasks for a patient
async function getPatientTasks(patientId) {
  try {
    const tasks = await CareTask.findAll({
      where: { patient_id: patientId },
      include: [
        {
          model: CareGoal,
          as: "goal",
          attributes: ["title", "category", "priority"],
        },
        {
          model: TaskCompletion,
          as: "completions",
        },
      ],
      order: [["due_date", "ASC"], ["priority", "DESC"]],
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to get patient tasks: ${error.message}`);
  }
}

// Get tasks for a specific goal
async function getTasksByGoal(goalId, patientId) {
  try {
    const tasks = await CareTask.findAll({
      where: { goal_id: goalId, patient_id: patientId },
      include: [
        {
          model: TaskCompletion,
          as: "completions",
        },
      ],
      order: [["due_date", "ASC"], ["priority", "DESC"]],
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to get tasks by goal: ${error.message}`);
  }
}

// Get a specific task
async function getTaskById(taskId, patientId) {
  try {
    const task = await CareTask.findOne({
      where: { task_id: taskId, patient_id: patientId },
      include: [
        {
          model: CareGoal,
          as: "goal",
        },
        {
          model: TaskCompletion,
          as: "completions",
        },
      ],
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  } catch (error) {
    throw new Error(`Failed to get task: ${error.message}`);
  }
}

// Update a care task
async function updateTask(taskId, patientId, updateData) {
  try {
    const task = await CareTask.findOne({
      where: { task_id: taskId, patient_id: patientId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    await task.update(updateData);
    return task;
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

// Delete a care task
async function deleteTask(taskId, patientId) {
  try {
    const task = await CareTask.findOne({
      where: { task_id: taskId, patient_id: patientId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    await task.destroy();
    return { message: "Task deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }
}

// Mark task as complete
async function markTaskComplete(taskId, patientId, completionData) {
  try {
    const task = await CareTask.findOne({
      where: { task_id: taskId, patient_id: patientId },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // Create completion record
    await TaskCompletion.create({
      task_id: taskId,
      patient_id: patientId,
      completion_time: new Date(),
      notes: completionData.notes || "",
      evidence: completionData.evidence || "",
      provider_feedback: completionData.provider_feedback || "",
    });

    // Update task status
    await task.update({ status: "completed" });

    // Update goal progress
    const { updateGoalProgress } = require("./careGoalService");
    await updateGoalProgress(task.goal_id, patientId);

    return task;
  } catch (error) {
    throw new Error(`Failed to mark task complete: ${error.message}`);
  }
}

// Get tasks by status
async function getTasksByStatus(patientId, status) {
  try {
    const tasks = await CareTask.findAll({
      where: { patient_id: patientId, status },
      include: [
        {
          model: CareGoal,
          as: "goal",
          attributes: ["title", "category"],
        },
      ],
      order: [["due_date", "ASC"]],
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to get tasks by status: ${error.message}`);
  }
}

// Get tasks by priority
async function getTasksByPriority(patientId, priority) {
  try {
    const tasks = await CareTask.findAll({
      where: { patient_id: patientId, priority },
      include: [
        {
          model: CareGoal,
          as: "goal",
          attributes: ["title", "category"],
        },
      ],
      order: [["due_date", "ASC"]],
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to get tasks by priority: ${error.message}`);
  }
}

// Get overdue tasks
async function getOverdueTasks(patientId) {
  try {
    const today = new Date();
    const tasks = await CareTask.findAll({
      where: {
        patient_id: patientId,
        due_date: {
          [Op.lt]: today,
        },
        status: {
          [Op.in]: ["pending", "in_progress"],
        },
      },
      include: [
        {
          model: CareGoal,
          as: "goal",
          attributes: ["title", "category"],
        },
      ],
      order: [["due_date", "ASC"]],
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to get overdue tasks: ${error.message}`);
  }
}

// Get tasks due today
async function getTasksDueToday(patientId) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const tasks = await CareTask.findAll({
      where: {
        patient_id: patientId,
        due_date: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: {
          [Op.in]: ["pending", "in_progress"],
        },
      },
      include: [
        {
          model: CareGoal,
          as: "goal",
          attributes: ["title", "category"],
        },
      ],
      order: [["priority", "DESC"], ["due_date", "ASC"]],
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to get tasks due today: ${error.message}`);
  }
}

// Get upcoming tasks
async function getUpcomingTasks(patientId, days = 7) {
  try {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const tasks = await CareTask.findAll({
      where: {
        patient_id: patientId,
        due_date: {
          [Op.between]: [today, futureDate],
        },
        status: {
          [Op.in]: ["pending", "in_progress"],
        },
      },
      include: [
        {
          model: CareGoal,
          as: "goal",
          attributes: ["title", "category"],
        },
      ],
      order: [["due_date", "ASC"]],
    });

    return tasks;
  } catch (error) {
    throw new Error(`Failed to get upcoming tasks: ${error.message}`);
  }
}

// Get task statistics for a patient
async function getTaskStats(patientId) {
  try {
    const stats = await CareTask.findAll({
      where: { patient_id: patientId },
      attributes: [
        "status",
        "priority",
        [sequelize.fn("COUNT", sequelize.col("task_id")), "count"],
      ],
      group: ["status", "priority"],
    });

    return stats;
  } catch (error) {
    throw new Error(`Failed to get task statistics: ${error.message}`);
  }
}

module.exports = {
  createTask,
  getPatientTasks,
  getTasksByGoal,
  getTaskById,
  updateTask,
  deleteTask,
  markTaskComplete,
  getTasksByStatus,
  getTasksByPriority,
  getOverdueTasks,
  getTasksDueToday,
  getUpcomingTasks,
  getTaskStats,
};
