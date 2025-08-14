const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const CareTask = sequelize.define(
  "CareTask",
  {
    task_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    goal_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    task_type: {
      type: DataTypes.ENUM(
        "daily",
        "weekly",
        "monthly",
        "one_time",
        "recurring"
      ),
      allowNull: false,
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Number of times per period (e.g., 3 times per week)",
    },
    frequency_unit: {
      type: DataTypes.ENUM("day", "week", "month"),
      allowNull: true,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed", "overdue", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "urgent"),
      allowNull: false,
      defaultValue: "medium",
    },
    estimated_duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Duration in minutes",
    },
    completion_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reminder_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    reminder_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    tableName: "care_tasks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CareTask;
