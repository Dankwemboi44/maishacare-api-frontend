// src/components/Predictions/HealthPredictions.js
import React, { useState, useEffect } from 'react';
import './HealthPredictions.css';

const HealthPredictions = ({ healthData }) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI predictions based on health data
    setTimeout(() => {
      setPredictions({
        heartRisk: {
          level: 'Low',
          percentage: 12,
          recommendation: 'Continue your healthy lifestyle. Maintain regular exercise and balanced diet.',
          nextCheck: '3 months'
        },
        diabetesRisk: {
          level: 'Moderate',
          percentage: 28,
          recommendation: 'Monitor blood sugar levels. Consider reducing sugar intake.',
          nextCheck: '1 month'
        },
        bloodPressureTrend: {
          direction: 'Stable',
          prediction: 'Will remain within normal range if current habits continue',
          recommendation: 'Continue monitoring twice weekly'
        },
        weightProjection: {
          in3Months: 67.2,
          in6Months: 66.5,
          in12Months: 65.8,
          recommendation: 'On track to reach goal weight in 4 months'
        },
        wellnessScore: {
          current: 85,
          predictedNextMonth: 88,
          factors: ['Exercise consistency', 'Sleep quality', 'Stress levels']
        }
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) return <div className="predictions-loading"><i className="fas fa-brain"></i> AI is analyzing your health data...</div>;

  return (
    <div className="health-predictions">
      <h2><i className="fas fa-robot"></i> AI Health Predictions</h2>
      
      <div className="predictions-grid">
        <div className="prediction-card risk-card">
          <div className="card-header"><i className="fas fa-heartbeat"></i><h3>Cardiovascular Risk</h3></div>
          <div className="risk-meter"><div className="risk-fill low" style={{width: `${predictions.heartRisk.percentage}%`}}></div></div>
          <p className="risk-level">Risk Level: <strong className={predictions.heartRisk.level.toLowerCase()}>{predictions.heartRisk.level}</strong> ({predictions.heartRisk.percentage}%)</p>
          <p className="recommendation">{predictions.heartRisk.recommendation}</p>
          <p className="next-check"><i className="fas fa-calendar"></i> Next check: {predictions.heartRisk.nextCheck}</p>
        </div>

        <div className="prediction-card risk-card">
          <div className="card-header"><i className="fas fa-tint"></i><h3>Diabetes Risk</h3></div>
          <div className="risk-meter"><div className="risk-fill moderate" style={{width: `${predictions.diabetesRisk.percentage}%`}}></div></div>
          <p className="risk-level">Risk Level: <strong className={predictions.diabetesRisk.level.toLowerCase()}>{predictions.diabetesRisk.level}</strong> ({predictions.diabetesRisk.percentage}%)</p>
          <p className="recommendation">{predictions.diabetesRisk.recommendation}</p>
          <p className="next-check"><i className="fas fa-calendar"></i> Next check: {predictions.diabetesRisk.nextCheck}</p>
        </div>

        <div className="prediction-card trend-card">
          <div className="card-header"><i className="fas fa-chart-line"></i><h3>Weight Projection</h3></div>
          <div className="weight-chart">
            <div className="weight-bar" style={{height: '60px'}}><span>Now</span><strong>{healthData?.weight || 68.5} kg</strong></div>
            <div className="weight-bar" style={{height: '55px'}}><span>3m</span><strong>{predictions.weightProjection.in3Months} kg</strong></div>
            <div className="weight-bar" style={{height: '50px'}}><span>6m</span><strong>{predictions.weightProjection.in6Months} kg</strong></div>
            <div className="weight-bar" style={{height: '45px'}}><span>12m</span><strong>{predictions.weightProjection.in12Months} kg</strong></div>
          </div>
          <p className="recommendation">{predictions.weightProjection.recommendation}</p>
        </div>

        <div className="prediction-card score-card">
          <div className="card-header"><i className="fas fa-star"></i><h3>Wellness Score Prediction</h3></div>
          <div className="score-compare"><div><span>Current</span><strong>{predictions.wellnessScore.current}</strong></div><i className="fas fa-arrow-right"></i><div><span>Next Month</span><strong>{predictions.wellnessScore.predictedNextMonth}</strong></div></div>
          <div className="improvement-indicator positive"><i className="fas fa-arrow-up"></i> +3 points expected</div>
          <div className="factors"><p>Improving factors:</p><ul>{predictions.wellnessScore.factors.map((f, i) => <li key={i}>✓ {f}</li>)}</ul></div>
        </div>
      </div>

      <div className="ai-insights">
        <h3><i className="fas fa-lightbulb"></i> Personalized Insights</h3>
        <ul>
          <li>📊 Your blood pressure has been stable for 3 months - great consistency!</li>
          <li>💪 Increasing daily steps to 8,000 could reduce cardiovascular risk by 15%</li>
          <li>😴 Improving sleep quality by 1 hour may boost wellness score by 5 points</li>
          <li>🥗 Adding more fiber to diet could help reach weight goals 2 months earlier</li>
        </ul>
      </div>
    </div>
  );
};

export default HealthPredictions;
