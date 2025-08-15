const { CareGoal, CareTask, TaskCompletion } = require("../models");
const { Op, sequelize } = require("sequelize");

// Create a new care goal
async function createGoal(goalData) {
  try {
    const goal = await CareGoal.create(goalData);
    return goal;
  } catch (error) {
    throw new Error(`Failed to create care goal: ${error.message}`);
  }
}

// Get all goals for a patient
async function getPatientGoals(patientId) {
  try {
    const goals = await CareGoal.findAll({
      where: { patient_id: patientId },
      include: [
        {
          model: CareTask,
          as: "tasks",
          include: [
            {
              model: TaskCompletion,
              as: "completions",
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return goals;
  } catch (error) {
    throw new Error(`Failed to get patient goals: ${error.message}`);
  }
}

// Get a specific goal with tasks
async function getGoalById(goalId, patientId) {
  try {
    const goal = await CareGoal.findOne({
      where: { goal_id: goalId, patient_id: patientId },
      include: [
        {
          model: CareTask,
          as: "tasks",
          include: [
            {
              model: TaskCompletion,
              as: "completions",
            },
          ],
        },
      ],
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    return goal;
  } catch (error) {
    throw new Error(`Failed to get goal: ${error.message}`);
  }
}

// Update a care goal
async function updateGoal(goalId, patientId, updateData) {
  try {
    const goal = await CareGoal.findOne({
      where: { goal_id: goalId, patient_id: patientId },
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    await goal.update(updateData);
    return goal;
  } catch (error) {
    throw new Error(`Failed to update goal: ${error.message}`);
  }
}

// Delete a care goal
async function deleteGoal(goalId, patientId) {
  try {
    const goal = await CareGoal.findOne({
      where: { goal_id: goalId, patient_id: patientId },
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    await goal.destroy();
    return { message: "Goal deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete goal: ${error.message}`);
  }
}

// Get goals by category
async function getGoalsByCategory(patientId, category) {
  try {
    const goals = await CareGoal.findAll({
      where: { patient_id: patientId, category },
      include: [
        {
          model: CareTask,
          as: "tasks",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return goals;
  } catch (error) {
    throw new Error(`Failed to get goals by category: ${error.message}`);
  }
}

// Get goals by priority
async function getGoalsByPriority(patientId, priority) {
  try {
    const goals = await CareGoal.findAll({
      where: { patient_id: patientId, priority },
      include: [
        {
          model: CareTask,
          as: "tasks",
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return goals;
  } catch (error) {
    throw new Error(`Failed to get goals by priority: ${error.message}`);
  }
}

// Get overdue goals
async function getOverdueGoals(patientId) {
  try {
    const today = new Date();
    const goals = await CareGoal.findAll({
      where: {
        patient_id: patientId,
        target_date: {
          [Op.lt]: today,
        },
        status: {
          [Op.ne]: "completed",
        },
      },
      include: [
        {
          model: CareTask,
          as: "tasks",
        },
      ],
      order: [["target_date", "ASC"]],
    });

    return goals;
  } catch (error) {
    throw new Error(`Failed to get overdue goals: ${error.message}`);
  }
}

// Update goal progress
async function updateGoalProgress(goalId, patientId) {
  try {
    const goal = await CareGoal.findOne({
      where: { goal_id: goalId, patient_id: patientId },
      include: [
        {
          model: CareTask,
          as: "tasks",
        },
      ],
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    const totalTasks = goal.tasks.length;
    const completedTasks = goal.tasks.filter(
      (task) => task.status === "completed"
    ).length;

    if (totalTasks > 0) {
      const progressPercentage = Math.round(
        (completedTasks / totalTasks) * 100
      );
      await goal.update({ progress_percentage: progressPercentage });

      // Update goal status based on progress
      if (progressPercentage === 100) {
        await goal.update({ status: "completed" });
      } else if (progressPercentage > 0) {
        await goal.update({ status: "in_progress" });
      }
    }

    return goal;
  } catch (error) {
    throw new Error(`Failed to update goal progress: ${error.message}`);
  }
}

// Get goals summary for a patient
async function getGoalsSummary(patientId) {
  try {
    const goals = await CareGoal.findAll({
      where: { patient_id: patientId },
      attributes: [
        "status",
        "priority",
        "category",
        [sequelize.fn("COUNT", sequelize.col("goal_id")), "count"],
      ],
      group: ["status", "priority", "category"],
    });

    return goals;
  } catch (error) {
    throw new Error(`Failed to get goals summary: ${error.message}`);
  }
}

module.exports = {
  createGoal,
  getPatientGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalsByCategory,
  getGoalsByPriority,
  getOverdueGoals,
  updateGoalProgress,
  getGoalsSummary,
};
