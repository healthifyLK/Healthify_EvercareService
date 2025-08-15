const {
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
} = require("../services/careGoalService");

// Create a new care goal
async function createGoalController(req, res) {
  try {
    const {
      patient_id,
      provider_id,
      title,
      description,
      category,
      target_date,
      priority,
    } = req.body;

    // Validate required fields
    if (!patient_id || !provider_id || !title || !category) {
      return res.status(400).json({
        success: false,
        message: "Patient ID, provider ID, title, and category are required",
      });
    }

    const goalData = {
      patient_id,
      provider_id,
      title,
      description,
      category,
      target_date: target_date ? new Date(target_date) : null,
      priority: priority || "medium",
    };

    const goal = await createGoal(goalData);

    res.status(201).json({
      success: true,
      message: "Care goal created successfully",
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all goals for a patient
async function getPatientGoalsController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const goals = await getPatientGoals(patientId);

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get a specific goal
async function getGoalByIdController(req, res) {
  try {
    const { goalId, patientId } = req.params;

    if (!goalId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Goal ID and Patient ID are required",
      });
    }

    const goal = await getGoalById(goalId, patientId);

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update a care goal
async function updateGoalController(req, res) {
  try {
    const { goalId, patientId } = req.params;
    const updateData = req.body;

    if (!goalId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Goal ID and Patient ID are required",
      });
    }

    const goal = await updateGoal(goalId, patientId, updateData);

    res.status(200).json({
      success: true,
      message: "Care goal updated successfully",
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete a care goal
async function deleteGoalController(req, res) {
  try {
    const { goalId, patientId } = req.params;

    if (!goalId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Goal ID and Patient ID are required",
      });
    }

    const result = await deleteGoal(goalId, patientId);

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

// Get goals by category
async function getGoalsByCategoryController(req, res) {
  try {
    const { patientId, category } = req.params;

    if (!patientId || !category) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and category are required",
      });
    }

    const goals = await getGoalsByCategory(patientId, category);

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get goals by priority
async function getGoalsByPriorityController(req, res) {
  try {
    const { patientId, priority } = req.params;

    if (!patientId || !priority) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and priority are required",
      });
    }

    const goals = await getGoalsByPriority(patientId, priority);

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get overdue goals
async function getOverdueGoalsController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const goals = await getOverdueGoals(patientId);

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update goal progress
async function updateGoalProgressController(req, res) {
  try {
    const { goalId, patientId } = req.params;

    if (!goalId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Goal ID and Patient ID are required",
      });
    }

    const goal = await updateGoalProgress(goalId, patientId);

    res.status(200).json({
      success: true,
      message: "Goal progress updated successfully",
      data: goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get goals summary
async function getGoalsSummaryController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const summary = await getGoalsSummary(patientId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  createGoalController,
  getPatientGoalsController,
  getGoalByIdController,
  updateGoalController,
  deleteGoalController,
  getGoalsByCategoryController,
  getGoalsByPriorityController,
  getOverdueGoalsController,
  updateGoalProgressController,
  getGoalsSummaryController,
};
