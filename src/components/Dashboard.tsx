import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, FileText, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auditApi } from '../services/api';
import { AuditData } from '../types';
import Navbar from './Navbar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, [user]);

  const fetchAuditData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      const data = await auditApi.getAuditData(user.id);
      setAuditData(data);
    } catch (err) {
      setError('Failed to load audit data. Please try again.');
      console.error('Error fetching audit data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!user || !feedback.trim()) return;

    try {
      setSubmitting(true);
      const success = await auditApi.submitFeedback(user.id, feedback);
      
      if (success) {
        setSubmitted(true);
        setFeedback('');
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading audit information...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <div className="flex items-center space-x-2 text-red-700">
              <FileText className="h-5 w-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchAuditData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : auditData ? (
          <div className="space-y-6">
            {auditData.hasAudit ? (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Audit Schedule</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Faculty ID</p>
                        <p className="text-lg font-semibold text-gray-900">{auditData.facultyId}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <Clock className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Slot</p>
                        <p className="text-lg font-semibold text-gray-900">{auditData.slot}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Venue</p>
                        <p className="text-lg font-semibold text-gray-900">{auditData.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Day Order</p>
                        <p className="text-lg font-semibold text-gray-900">{auditData.dayOrder}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Feedback</h3>
                  
                  {submitted ? (
                    <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="text-green-800 font-medium">Feedback Submitted Successfully</p>
                        <p className="text-green-600 text-sm">Thank you for your feedback!</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Enter your audit feedback and remarks here..."
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors duration-200"
                      />
                      
                      <button
                        onClick={handleSubmitFeedback}
                        disabled={submitting || !feedback.trim()}
                        className="mt-4 flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {submitting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                        <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Audit Scheduled</h3>
                <p className="text-gray-600">No audit scheduled for today</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;