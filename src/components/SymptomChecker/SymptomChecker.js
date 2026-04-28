// src/components/SymptomChecker/SymptomChecker.js
import React, { useState } from 'react';
import { 
  FaBrain, FaLungs, FaHeartbeat, FaStethoscope,
  FaBone, FaEye, FaQuestionCircle, FaTooth, FaArrowRight, 
  FaArrowLeft, FaCheckCircle, FaExclamationTriangle,
  FaThermometerHalf, FaTired, FaUserMd, FaRobot, FaCommentDots,
  FaShieldAlt
} from 'react-icons/fa';

const SymptomChecker = ({ onAskAIDoctor, userName }) => {
  const [step, setStep] = useState(1);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);

  const bodyParts = [
    { id: 'head', name: 'Head', icon: <FaBrain />, color: '#ef4444', symptoms: ['Headache', 'Dizziness', 'Migraine', 'Pressure in head'] },
    { id: 'chest', name: 'Chest', icon: <FaHeartbeat />, color: '#dc2626', symptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'Cough'] },
    { id: 'lungs', name: 'Lungs', icon: <FaLungs />, color: '#3b82f6', symptoms: ['Cough', 'Wheezing', 'Difficulty breathing', 'Chest congestion'] },
    { id: 'stomach', name: 'Stomach', icon: <FaStethoscope />, color: '#10b981', symptoms: ['Nausea', 'Vomiting', 'Abdominal pain', 'Bloating', 'Diarrhea'] },
    { id: 'joints', name: 'Joints/Bones', icon: <FaBone />, color: '#f59e0b', symptoms: ['Joint pain', 'Back pain', 'Neck pain', 'Swelling'] },
    { id: 'eyes', name: 'Eyes', icon: <FaEye />, color: '#8b5cf6', symptoms: ['Redness', 'Itching', 'Blurred vision', 'Dry eyes'] },
    { id: 'ears', name: 'Ears', icon: <FaQuestionCircle />, color: '#ec4899', symptoms: ['Ear pain', 'Ringing', 'Hearing loss', 'Itching'] },
    { id: 'whole', name: 'Whole Body', icon: <FaTired />, color: '#6b7280', symptoms: ['Fever', 'Fatigue', 'Chills', 'Night sweats', 'Weight loss'] }
  ];

  const durationOptions = [
    'Less than 24 hours', '1-3 days', '4-7 days', '1-2 weeks', 'More than 2 weeks'
  ];

  const analyzeSymptoms = () => {
    const analysis = {
      possibleCauses: [],
      recommendations: [],
      urgency: 'low',
      seeDoctor: false
    };

    if (selectedBodyPart === 'head' && selectedSymptoms.includes('Headache')) {
      if (severity >= 7) {
        analysis.possibleCauses.push('Severe headache - possible migraine');
        analysis.urgency = 'medium';
        analysis.recommendations.push('Rest in a dark, quiet room');
        if (severity >= 9) analysis.seeDoctor = true;
      } else {
        analysis.possibleCauses.push('Mild headache - possible dehydration or stress');
        analysis.recommendations.push('Drink water and rest');
      }
    }

    if (selectedBodyPart === 'chest' && selectedSymptoms.includes('Chest pain')) {
      analysis.possibleCauses.push('Chest pain requires medical evaluation');
      analysis.urgency = 'high';
      analysis.seeDoctor = true;
      analysis.recommendations.push('Seek medical attention immediately');
    }

    if (selectedSymptoms.includes('Fever')) {
      if (severity >= 8) {
        analysis.possibleCauses.push('High fever - possible infection');
        analysis.urgency = 'high';
        analysis.seeDoctor = true;
      } else {
        analysis.possibleCauses.push('Mild fever - body fighting infection');
        analysis.recommendations.push('Rest and stay hydrated');
      }
    }

    if (analysis.recommendations.length === 0) {
      analysis.recommendations.push('Rest and monitor your symptoms');
      analysis.recommendations.push('Stay hydrated');
    }

    analysis.disclaimer = "⚠️ This is not a medical diagnosis. Always consult a healthcare provider for medical advice.";

    setResult(analysis);
    setStep(5);
  };

  const resetChecker = () => {
    setStep(1);
    setSelectedBodyPart(null);
    setSelectedSymptoms([]);
    setSeverity(5);
    setDuration('');
    setResult(null);
  };

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const getUrgencyColor = () => {
    if (!result) return '#10b981';
    switch(result.urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getUrgencyText = () => {
    if (!result) return '';
    switch(result.urgency) {
      case 'high': return '⚠️ Seek medical attention soon';
      case 'medium': return '📞 Consider consulting a doctor';
      default: return '✅ Monitor at home';
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🩺 Symptom Checker</h2>
        <p style={{ color: '#64748b' }}>Guided questions to help understand your symptoms</p>
        
        {step > 1 && step < 5 && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 2 ? '#3b82f6' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: step >= 2 ? 'white' : '#64748b' }}>1</div>
            <div style={{ width: '60px', height: '2px', background: step >= 3 ? '#3b82f6' : '#e2e8f0', margin: '0 8px' }}></div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 3 ? '#3b82f6' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: step >= 3 ? 'white' : '#64748b' }}>2</div>
            <div style={{ width: '60px', height: '2px', background: step >= 4 ? '#3b82f6' : '#e2e8f0', margin: '0 8px' }}></div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 4 ? '#3b82f6' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: step >= 4 ? 'white' : '#64748b' }}>3</div>
            <div style={{ width: '60px', height: '2px', background: step >= 5 ? '#3b82f6' : '#e2e8f0', margin: '0 8px' }}></div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 5 ? '#3b82f6' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: step >= 5 ? 'white' : '#64748b' }}>4</div>
          </div>
        )}
      </div>

      {/* Step 1: Body Part */}
      {step === 1 && (
        <div>
          <h3 style={{ marginBottom: '20px' }}>Where are you experiencing symptoms?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {bodyParts.map(part => (
              <button
                key={part.id}
                onClick={() => setSelectedBodyPart(part.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px',
                  background: selectedBodyPart === part.id ? '#eff6ff' : '#f8fafc',
                  border: `2px solid ${selectedBodyPart === part.id ? part.color : '#e2e8f0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ color: part.color, fontSize: '24px' }}>{part.icon}</span>
                <span>{part.name}</span>
              </button>
            ))}
          </div>
          <button 
            style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            disabled={!selectedBodyPart}
            onClick={() => setStep(2)}
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}

      {/* Step 2: Symptoms */}
      {step === 2 && (
        <div>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowLeft /> Back
          </button>
          <h3 style={{ marginBottom: '20px' }}>Select all symptoms you're experiencing</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {bodyParts.find(p => p.id === selectedBodyPart)?.symptoms.map(symptom => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  background: selectedSymptoms.includes(symptom) ? '#3b82f6' : '#f1f5f9',
                  color: selectedSymptoms.includes(symptom) ? 'white' : '#1e293b',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                {selectedSymptoms.includes(symptom) && <FaCheckCircle />}
                {symptom}
              </button>
            ))}
          </div>
          <button 
            style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            disabled={selectedSymptoms.length === 0}
            onClick={() => setStep(3)}
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}

      {/* Step 3: Severity & Duration */}
      {step === 3 && (
        <div>
          <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px' }}>
            <FaArrowLeft /> Back
          </button>
          
          <div style={{ marginBottom: '30px' }}>
            <h3>How severe are your symptoms? (1-10)</h3>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              style={{ width: '100%', margin: '20px 0' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3>How long have you had these symptoms?</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0' }}>
              {durationOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setDuration(opt)}
                  style={{
                    padding: '10px 16px',
                    background: duration === opt ? '#3b82f6' : '#f1f5f9',
                    color: duration === opt ? 'white' : '#1e293b',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button 
            style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            disabled={!duration}
            onClick={analyzeSymptoms}
          >
            Analyze Symptoms <FaRobot />
          </button>
        </div>
      )}

      {/* Step 4: Loading */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <FaRobot style={{ fontSize: '40px' }} />
          <p>Analyzing your symptoms...</p>
        </div>
      )}

      {/* Step 5: Results */}
      {step === 5 && result && (
        <div>
          <div style={{ borderBottom: `2px solid ${getUrgencyColor()}`, paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: getUrgencyColor(), fontWeight: 'bold' }}>{getUrgencyText()}</div>
            <button onClick={resetChecker} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}>Start Over</button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4>Possible Explanations</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {result.possibleCauses.map((cause, i) => <li key={i}>{cause}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4>Recommendations</h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
            </ul>
          </div>

          {result.seeDoctor && (
            <div style={{ display: 'flex', gap: '12px', padding: '16px', background: '#fef3c7', borderRadius: '12px', margin: '20px 0' }}>
              <FaExclamationTriangle style={{ color: '#f59e0b', fontSize: '24px' }} />
              <div>
                <strong>Recommendation to see a doctor</strong>
                <p style={{ margin: 0 }}>Based on your symptoms, you should consult a healthcare provider.</p>
              </div>
            </div>
          )}

          <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b', margin: '20px 0' }}>
            {result.disclaimer}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onAskAIDoctor} style={{ flex: 1, padding: '12px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
              <FaCommentDots /> Ask AI Doctor
            </button>
            <button style={{ flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
              <FaUserMd /> Book Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;