const axios = require("axios");

// Configuration for external services
const appointmentServiceUrl = process.env.APPOINTMENT_SERVICE_URL || "http://localhost:5003";
const communicationServiceUrl = process.env.COMMUNICATION_SERVICE_URL || "http://localhost:5004";
const ehrServiceUrl = process.env.EHR_SERVICE_URL || "http://localhost:5001";

// Create Ever Care specific appointments
async function createEverCareAppointment(appointmentData) {
  try {
    const response = await axios.post(`${appointmentServiceUrl}/api/appointments`, {
      ...appointmentData,
      appointment_type: "ever_care_consultation",
      appointment_mode: "video", // Default for Ever Care
      additionalDetails: JSON.stringify({
        program: "ever_care",
        consultation_type: appointmentData.consultationType || "weekly",
        ...appointmentData.additionalDetails,
      }),
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to create Ever Care appointment: ${error.message}`);
  }
}

// Schedule recurring Ever Care appointments
async function scheduleRecurringAppointments(patientId, providerId, scheduleData) {
  try {
    const { frequency, startDate, endDate, consultationType } = scheduleData;
    const appointments = [];

    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const appointmentData = {
        patient_id: patientId,
        provider_id: providerId,
        scheduled_time: new Date(currentDate),
        consultationType,
        status: "Booked",
      };

      const appointment = await createEverCareAppointment(appointmentData);
      appointments.push(appointment);

      // Move to next appointment date based on frequency
      switch (frequency) {
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "biweekly":
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          currentDate.setDate(currentDate.getDate() + 7);
      }
    }

    return appointments;
  } catch (error) {
    throw new Error(`Failed to schedule recurring appointments: ${error.message}`);
  }
}

// Create Ever Care conversation thread
async function createEverCareConversation(conversationData) {
  try {
    const response = await axios.post(`${communicationServiceUrl}/api/conversations`, {
      ...conversationData,
      conversationType: "ever-care",
      startedAt: new Date(),
      status: "active",
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to create Ever Care conversation: ${error.message}`);
  }
}

// Send Ever Care notifications
async function sendEverCareNotification(notificationData) {
  try {
    const response = await axios.post(`${communicationServiceUrl}/api/messages`, {
      ...notificationData,
      messageType: "ever_care_notification",
      priority: notificationData.priority || "normal",
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to send Ever Care notification: ${error.message}`);
  }
}

// Send task reminders
async function sendTaskReminder(patientId, taskData) {
  try {
    const reminderData = {
      conversation_id: taskData.conversation_id,
      sender_id: "system",
      receiver_id: patientId,
      content: `Reminder: Your task "${taskData.title}" is due on ${new Date(taskData.due_date).toLocaleDateString()}`,
      messageType: "task_reminder",
      priority: "high",
    };

    return await sendEverCareNotification(reminderData);
  } catch (error) {
    throw new Error(`Failed to send task reminder: ${error.message}`);
  }
}

// Send goal progress updates
async function sendGoalProgressUpdate(patientId, goalData) {
  try {
    const progressData = {
      conversation_id: goalData.conversation_id,
      sender_id: "system",
      receiver_id: patientId,
      content: `Great progress! Your goal "${goalData.title}" is now ${goalData.progress_percentage}% complete.`,
      messageType: "goal_progress",
      priority: "normal",
    };

    return await sendEverCareNotification(progressData);
  } catch (error) {
    throw new Error(`Failed to send goal progress update: ${error.message}`);
  }
}

// Sync health data to EHR service
async function syncHealthDataToEHR(healthData) {
  try {
    const response = await axios.post(`${ehrServiceUrl}/api/ehr/observations`, {
      patient_id: healthData.patient_id,
      observation_type: healthData.metric_type,
      value: healthData.value,
      unit: healthData.unit,
      date_recorded: healthData.recorded_at,
      source: healthData.source || "ever_care_service",
      additional_data: healthData.additional_data || {},
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to sync health data to EHR: ${error.message}`);
  }
}

// Sync care plan to EHR service
async function syncCarePlanToEHR(patientId, carePlanData) {
  try {
    const response = await axios.post(`${ehrServiceUrl}/api/ehr/care-plans`, {
      patient_id: patientId,
      plan_type: "ever_care_program",
      goals: carePlanData.goals,
      tasks: carePlanData.tasks,
      provider_id: carePlanData.provider_id,
      start_date: carePlanData.start_date,
      end_date: carePlanData.end_date,
      status: carePlanData.status,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to sync care plan to EHR: ${error.message}`);
  }
}

// Get patient appointments from Appointment Service
async function getPatientAppointments(patientId) {
  try {
    const response = await axios.get(`${appointmentServiceUrl}/api/appointments/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get patient appointments: ${error.message}`);
  }
}

// Get patient conversations from Communication Service
async function getPatientConversations(patientId) {
  try {
    const response = await axios.get(`${communicationServiceUrl}/api/conversations/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get patient conversations: ${error.message}`);
  }
}

// Get patient health data from EHR Service
async function getPatientHealthData(patientId, startDate, endDate) {
  try {
    const response = await axios.get(`${ehrServiceUrl}/api/ehr/patient/${patientId}/observations`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get patient health data: ${error.message}`);
  }
}

// Check service health status
async function checkServiceHealth() {
  try {
    const healthChecks = {
      appointment_service: false,
      communication_service: false,
      ehr_service: false,
    };

    try {
      const appointmentResponse = await axios.get(`${appointmentServiceUrl}/health`, { timeout: 5000 });
      healthChecks.appointment_service = appointmentResponse.status === 200;
    } catch (error) {
      console.error("Appointment service health check failed:", error.message);
    }

    try {
      const communicationResponse = await axios.get(`${communicationServiceUrl}/health`, { timeout: 5000 });
      healthChecks.communication_service = communicationResponse.status === 200;
    } catch (error) {
      console.error("Communication service health check failed:", error.message);
    }

    try {
      const ehrResponse = await axios.get(`${ehrServiceUrl}/health`, { timeout: 5000 });
      healthChecks.ehr_service = ehrResponse.status === 200;
    } catch (error) {
      console.error("EHR service health check failed:", error.message);
    }

    return healthChecks;
  } catch (error) {
    throw new Error(`Failed to check service health: ${error.message}`);
  }
}

module.exports = {
  createEverCareAppointment,
  scheduleRecurringAppointments,
  createEverCareConversation,
  sendEverCareNotification,
  sendTaskReminder,
  sendGoalProgressUpdate,
  syncHealthDataToEHR,
  syncCarePlanToEHR,
  getPatientAppointments,
  getPatientConversations,
  getPatientHealthData,
  checkServiceHealth,
};
