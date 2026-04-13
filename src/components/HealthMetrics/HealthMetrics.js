// src/components/HealthMetrics/HealthMetrics.js
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './HealthMetrics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HealthMetrics = ({ patientId }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [metrics, setMetrics] = useState({
    bloodPressure: { systolic: [118, 120, 119, 121, 118, 117, 119], diastolic: [76, 78, 77, 79, 76, 75, 77] },
    heartRate: [72, 74, 71, 73, 75, 72, 74],
    weight: [68.5, 68.2, 67.9, 68.0, 67.8, 67.7, 67.5],
    sleep: [7.2, 7.5, 6.8, 7.3, 7.1, 7.4, 7.2],
    steps: [5234, 6789, 4567, 7890, 6543, 7123, 6890]
  });

  const getLabels = () => {
    const dates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    if (timeRange === 'month') {
      return Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
    }
    if (timeRange === 'year') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    return dates;
  };

  const bloodPressureData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Systolic',
        data: metrics.bloodPressure.systolic,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Diastolic',
        data: metrics.bloodPressure.diastolic,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const heartRateData = {
    labels: getLabels(),
    datasets: [{
      label: 'Heart Rate (bpm)',
      data: metrics.heartRate,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const weightData = {
    labels: getLabels(),
    datasets: [{
      label: 'Weight (kg)',
      data: metrics.weight,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const sleepData = {
    labels: getLabels(),
    datasets: [{
      label: 'Sleep (hours)',
      data: metrics.sleep,
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  };

  const stepsData = {
    labels: getLabels(),
    datasets: [{
      label: 'Steps',
      data: metrics.steps,
      backgroundColor: '#3b82f6',
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: { y: { beginAtZero: false } }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  return (
    <div className="health-metrics-container">
      <div className="metrics-header">
        <h2><i className="fas fa-chart-line"></i> Health Analytics Dashboard</h2>
        <div className="time-range-selector">
          <button className={`range-btn ${timeRange === 'week' ? 'active' : ''}`} onClick={() => setTimeRange('week')}>Week</button>
          <button className={`range-btn ${timeRange === 'month' ? 'active' : ''}`} onClick={() => setTimeRange('month')}>Month</button>
          <button className={`range-btn ${timeRange === 'year' ? 'active' : ''}`} onClick={() => setTimeRange('year')}>Year</button>
        </div>
      </div>

      <div className="metrics-summary">
        <div className="summary-card">
          <div className="summary-icon"><i className="fas fa-heartbeat"></i></div>
          <div><span className="summary-value">{metrics.heartRate[metrics.heartRate.length - 1]}</span><span className="summary-unit">bpm</span><span className="summary-label">Avg Heart Rate</span></div>
          <div className="summary-trend positive"><i className="fas fa-arrow-down"></i> 2%</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><i className="fas fa-tachometer-alt"></i></div>
          <div><span className="summary-value">{metrics.bloodPressure.systolic[metrics.bloodPressure.systolic.length - 1]}/{metrics.bloodPressure.diastolic[metrics.bloodPressure.diastolic.length - 1]}</span><span className="summary-unit">mmHg</span><span className="summary-label">Blood Pressure</span></div>
          <div className="summary-trend stable"><i className="fas fa-minus"></i> Stable</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><i className="fas fa-weight"></i></div>
          <div><span className="summary-value">{metrics.weight[metrics.weight.length - 1]}</span><span className="summary-unit">kg</span><span className="summary-label">Weight</span></div>
          <div className="summary-trend positive"><i className="fas fa-arrow-down"></i> 0.5 kg</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><i className="fas fa-moon"></i></div>
          <div><span className="summary-value">{metrics.sleep[metrics.sleep.length - 1]}</span><span className="summary-unit">hrs</span><span className="summary-label">Sleep</span></div>
          <div className="summary-trend positive"><i className="fas fa-arrow-up"></i> 0.3 hrs</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><i className="fas fa-shoe-prints"></i></div>
          <div><span className="summary-value">{metrics.steps[metrics.steps.length - 1].toLocaleString()}</span><span className="summary-unit">steps</span><span className="summary-label">Daily Steps</span></div>
          <div className="summary-trend positive"><i className="fas fa-arrow-up"></i> 8%</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card"><div className="chart-header"><h3>Blood Pressure Trend</h3><span className="normal-range">Normal: &lt;120/80</span></div><div className="chart-container"><Line data={bloodPressureData} options={chartOptions} /></div></div>
        <div className="chart-card"><div className="chart-header"><h3>Heart Rate Trend</h3><span className="normal-range">Normal: 60-100 bpm</span></div><div className="chart-container"><Line data={heartRateData} options={chartOptions} /></div></div>
        <div className="chart-card"><div className="chart-header"><h3>Weight Trend</h3><span className="normal-range">Goal: 65 kg</span></div><div className="chart-container"><Line data={weightData} options={chartOptions} /></div></div>
        <div className="chart-card"><div className="chart-header"><h3>Sleep Pattern</h3><span className="normal-range">Recommended: 7-9 hrs</span></div><div className="chart-container"><Line data={sleepData} options={chartOptions} /></div></div>
        <div className="chart-card full-width"><div className="chart-header"><h3>Daily Steps</h3><span className="normal-range">Goal: 10,000 steps</span></div><div className="chart-container"><Bar data={stepsData} options={barOptions} /></div></div>
      </div>
    </div>
  );
};

export default HealthMetrics;