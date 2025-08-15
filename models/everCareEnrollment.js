const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const EverCareEnrollment = sequelize.define(
  "EverCareEnrollment",
  {
    enrollment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    provider_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("active", "suspended", "terminated"),
      allowNull: false,
      defaultValue: "active",
    },
    subscription_tier: {
      type: DataTypes.ENUM("basic", "premium", "vital boost"),
      allowNull: false,
    },
    weekly_consultations: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    monthly_consultations: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    home_visits_per_month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    next_review_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ever_care_enrollments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = EverCareEnrollment;
