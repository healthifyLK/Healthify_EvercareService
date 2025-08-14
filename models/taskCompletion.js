const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const TaskCompletion = sequelize.define(
  "TaskCompletion",
  {
    completion_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completion_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    evidence_attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of file paths or URLs for evidence",
    },
    quality_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
      comment: "Provider rating of task completion quality (1-5)",
    },
    provider_feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    time_taken: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Time taken to complete in minutes",
    },
  },
  {
    tableName: "task_completions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = TaskCompletion;
