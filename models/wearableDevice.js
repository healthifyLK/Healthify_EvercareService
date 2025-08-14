const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const WearableDevice = sequelize.define(
  "WearableDevice",
  {
    device_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    device_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    device_type: {
      type: DataTypes.ENUM(
        "fitness_tracker",
        "smartwatch",
        "blood_pressure_monitor",
        "glucose_monitor",
        "heart_rate_monitor",
        "sleep_tracker",
        "other"
      ),
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    serial_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    integration_type: {
      type: DataTypes.ENUM("api", "bluetooth", "manual", "other"),
      allowNull: false,
      defaultValue: "api",
    },
    api_endpoint: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    api_key: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    last_sync: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sync_frequency: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Sync frequency in minutes",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "error", "disconnected"),
      allowNull: false,
      defaultValue: "active",
    },
    metrics_enabled: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Array of enabled metrics for this device",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "wearable_devices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = WearableDevice;
