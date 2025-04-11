"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({
  courseStats = [],
  quizMetrics = [],
  completionRates = [],
  loading = false,
  error = null
}) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96" role="status">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="sr-only">Loading analytics data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg" role="alert">
        <i className="fas fa-exclamation-circle text-red-500 text-2xl mb-2"></i>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6" role="region" aria-label="Analytics Dashboard">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold font-inter text-gray-900">Analytics Overview</h2>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          aria-label="Select timeframe"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl" role="region" aria-label="Course Statistics">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollments</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {courseStats.totalEnrollments || 0}
              </p>
              <p className="text-sm text-gray-600">Total Enrollments</p>
            </div>
            <div className="text-green-500">
              <i className="fas fa-chart-line text-2xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-blue-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full" 
                style={{ width: `${courseStats.enrollmentRate || 0}%` }}
                role="progressbar"
                aria-valuenow={courseStats.enrollmentRate || 0}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-xl" role="region" aria-label="Quiz Performance">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Performance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-purple-600">
                {quizMetrics.averageScore || 0}%
              </p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
            <div className="text-purple-500">
              <i className="fas fa-chart-bar text-2xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-purple-200 rounded-full">
              <div 
                className="h-2 bg-purple-600 rounded-full" 
                style={{ width: `${quizMetrics.completionRate || 0}%` }}
                role="progressbar"
                aria-valuenow={quizMetrics.completionRate || 0}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl" role="region" aria-label="Lesson Completion">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Completion</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">
                {completionRates.completedLessons || 0}
              </p>
              <p className="text-sm text-gray-600">Lessons Completed</p>
            </div>
            <div className="text-green-500">
              <i className="fas fa-graduation-cap text-2xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-green-200 rounded-full">
              <div 
                className="h-2 bg-green-600 rounded-full" 
                style={{ width: `${completionRates.completionRate || 0}%` }}
                role="progressbar"
                aria-valuenow={completionRates.completionRate || 0}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryComponent() {
  const mockCourseStats = {
    totalEnrollments: 256,
    enrollmentRate: 75
  };

  const mockQuizMetrics = {
    averageScore: 85,
    completionRate: 68
  };

  const mockCompletionRates = {
    completedLessons: 42,
    completionRate: 89
  };

  return (
    <div className="p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard Stories</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Default State</h2>
          <MainComponent 
            courseStats={mockCourseStats}
            quizMetrics={mockQuizMetrics}
            completionRates={mockCompletionRates}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Loading State</h2>
          <MainComponent loading={true} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Error State</h2>
          <MainComponent error="Failed to load analytics data" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Empty State</h2>
          <MainComponent 
            courseStats={{}}
            quizMetrics={{}}
            completionRates={{}}
          />
        </div>
      </div>
    </div>
  );
});
}