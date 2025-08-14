const { registerDevice, getPatientDevices, getDeviceById, updateDevice, removeDevice, syncDeviceMetrics, getDeviceMetrics, syncMetricsToEHR, getAggregatedMetrics, testDeviceConnection, getDeviceStats } = require("../services/wearableDeviceService");

// Register a new wearable device
async function registerDeviceController(req, res) {
  try {
    const { patient_id, device_name, device_type, manufacturer, model, serial_number, integration_type, api_endpoint, api_key, sync_frequency, metrics_enabled } = req.body;

    // Validate required fields
    if (!patient_id || !device_name || !device_type || !integration_type) {
      return res.status(400).json({
        success: false,
        message: "Patient ID, device name, device type, and integration type are required",
      });
    }

    // Validate API integration fields
    if (integration_type === "api" && (!api_endpoint || !api_key)) {
      return res.status(400).json({
        success: false,
        message: "API endpoint and API key are required for API integration",
      });
    }

    const deviceData = {
      patient_id,
      device_name,
      device_type,
      manufacturer,
      model,
      serial_number,
      integration_type,
      api_endpoint,
      api_key,
      sync_frequency: sync_frequency || 1440, // Default to 24 hours
      metrics_enabled: metrics_enabled || [],
    };

    const device = await registerDevice(deviceData);

    res.status(201).json({
      success: true,
      message: "Wearable device registered successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all devices for a patient
async function getPatientDevicesController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const devices = await getPatientDevices(patientId);

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get a specific device
async function getDeviceByIdController(req, res) {
  try {
    const { deviceId, patientId } = req.params;

    if (!deviceId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Device ID and Patient ID are required",
      });
    }

    const device = await getDeviceById(deviceId, patientId);

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update device information
async function updateDeviceController(req, res) {
  try {
    const { deviceId, patientId } = req.params;
    const updateData = req.body;

    if (!deviceId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Device ID and Patient ID are required",
      });
    }

    const device = await updateDevice(deviceId, patientId, updateData);

    res.status(200).json({
      success: true,
      message: "Device updated successfully",
      data: device,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Remove a device
async function removeDeviceController(req, res) {
  try {
    const { deviceId, patientId } = req.params;

    if (!deviceId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Device ID and Patient ID are required",
      });
    }

    const result = await removeDevice(deviceId, patientId);

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

// Sync device metrics
async function syncDeviceMetricsController(req, res) {
  try {
    const { deviceId, patientId } = req.params;

    if (!deviceId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Device ID and Patient ID are required",
      });
    }

    const metrics = await syncDeviceMetrics(deviceId, patientId);

    res.status(200).json({
      success: true,
      message: `Successfully synced ${metrics.length} metrics from device`,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get device metrics
async function getDeviceMetricsController(req, res) {
  try {
    const { deviceId, patientId } = req.params;
    const { startDate, endDate } = req.query;

    if (!deviceId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Device ID and Patient ID are required",
      });
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const metrics = await getDeviceMetrics(deviceId, patientId, start, end);

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Sync metrics to EHR
async function syncMetricsToEHRController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const result = await syncMetricsToEHR(patientId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get aggregated metrics
async function getAggregatedMetricsController(req, res) {
  try {
    const { patientId, metricType, period } = req.params;

    if (!patientId || !metricType) {
      return res.status(400).json({
        success: false,
        message: "Patient ID and metric type are required",
      });
    }

    const metrics = await getAggregatedMetrics(patientId, metricType, period || "7d");

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Test device connection
async function testDeviceConnectionController(req, res) {
  try {
    const { deviceId, patientId } = req.params;

    if (!deviceId || !patientId) {
      return res.status(400).json({
        success: false,
        message: "Device ID and Patient ID are required",
      });
    }

    const connectionStatus = await testDeviceConnection(deviceId, patientId);

    res.status(200).json({
      success: true,
      data: connectionStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get device statistics
async function getDeviceStatsController(req, res) {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const stats = await getDeviceStats(patientId);

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
  registerDeviceController,
  getPatientDevicesController,
  getDeviceByIdController,
  updateDeviceController,
  removeDeviceController,
  syncDeviceMetricsController,
  getDeviceMetricsController,
  syncMetricsToEHRController,
  getAggregatedMetricsController,
  testDeviceConnectionController,
  getDeviceStatsController,
};
