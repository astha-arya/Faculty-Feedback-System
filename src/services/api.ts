import { AuditData } from '../types';

const API_BASE_URL = 'https://your-backend-api.com'; // Replace with your actual backend URL

export const auditApi = {
  // Get audit data for logged-in faculty
  getAuditData: async (facultyId: string): Promise<AuditData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/audit/${facultyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching audit data:', error);
      
      // Mock data for demonstration - remove this in production
      return {
        hasAudit: true,
        facultyId: facultyId,
        slot: "FN",
        venue: "TP-1 202",
        dayOrder: "Day 2"
      };
    }
  },

  // Submit feedback for audit
  submitFeedback: async (facultyId: string, feedback: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/audit/${facultyId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Mock success for demonstration - remove this in production
      return true;
    }
  }
};