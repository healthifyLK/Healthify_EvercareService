const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const DeviceMetrics = sequelize.define(
  "DeviceMetrics",
  {
    metric_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: false,
    },
    device_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    metric_type: {
      type: DataTypes.ENUM(
        "heart_rate",
        "blood_pressure",
        "steps",
        "calories",
        "sleep_duration",
        "sleep_quality",
        "glucose_level",
        "oxygen_saturation",
        "temperature",
        "weight",
        "other"
      ),
      allowNull: false,
    },
    metric_value: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    metric_unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    recorded_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data_source: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "device",
    },
    quality_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10,
      },
      comment: "Data quality score (1-10)",
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Additional device-specific metadata",
    },
    synced_to_ehr: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ehr_sync_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "device_metrics",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["patient_id", "metric_type", "recorded_at"],
      },
      {
        fields: ["device_id", "recorded_at"],
      },
    ],
  }
);

module.exports = DeviceMetrics;
