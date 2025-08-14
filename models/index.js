const EverCareEnrollment = require("./everCareEnrollment");
const CareGoal = require("./careGoal");
const CareTask = require("./careTask");
const TaskCompletion = require("./taskCompletion");
const WearableDevice = require("./wearableDevice");
const DeviceMetrics = require("./deviceMetrics");

// Ever Care Enrollment Associations
EverCareEnrollment.hasMany(CareGoal, {
  foreignKey: "patient_id",
  sourceKey: "patient_id",
  as: "careGoals",
});

EverCareEnrollment.hasMany(WearableDevice, {
  foreignKey: "patient_id",
  sourceKey: "patient_id",
  as: "wearableDevices",
});

// Care Goal Associations
CareGoal.belongsTo(EverCareEnrollment, {
  foreignKey: "patient_id",
  targetKey: "patient_id",
  as: "enrollment",
});

CareGoal.hasMany(CareTask, {
  foreignKey: "goal_id",
  sourceKey: "goal_id",
  as: "tasks",
});

// Care Task Associations
CareTask.belongsTo(CareGoal, {
  foreignKey: "goal_id",
  targetKey: "goal_id",
  as: "goal",
});

CareTask.hasMany(TaskCompletion, {
  foreignKey: "task_id",
  sourceKey: "task_id",
  as: "completions",
});

// Task Completion Associations
TaskCompletion.belongsTo(CareTask, {
  foreignKey: "task_id",
  targetKey: "task_id",
  as: "task",
});

// Wearable Device Associations
WearableDevice.belongsTo(EverCareEnrollment, {
  foreignKey: "patient_id",
  targetKey: "patient_id",
  as: "enrollment",
});

WearableDevice.hasMany(DeviceMetrics, {
  foreignKey: "device_id",
  sourceKey: "device_id",
  as: "metrics",
});

// Device Metrics Associations
DeviceMetrics.belongsTo(WearableDevice, {
  foreignKey: "device_id",
  targetKey: "device_id",
  as: "device",
});

module.exports = {
  EverCareEnrollment,
  CareGoal,
  CareTask,
  TaskCompletion,
  WearableDevice,
  DeviceMetrics,
};
