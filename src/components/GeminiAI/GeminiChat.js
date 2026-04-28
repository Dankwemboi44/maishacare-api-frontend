import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaSpinner, FaMicrophone, FaTrash, FaCopy, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

// Intelligent response system without API
const getAIResponse = (userMessage, userName = 'User') => {
  const message = userMessage.toLowerCase().trim();
  
  // Emergency responses
  if (message.includes('emergency') || message.includes('911') || message.includes('ambulance')) {
    return "⚠️ **URGENT:** If this is a medical emergency, please call 911 or 112 immediately. Do not wait. I'm an AI assistant and cannot replace emergency services.";
  }
  
  // Greeting responses
  if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return `Hello ${userName}! 👋 I'm your AI Health Assistant. I can help you with:\n\n• Symptom analysis\n• Medication information\n• Wellness tips\n• Health education\n\nWhat would you like to know today?`;
  }
  
  // Symptom analysis
  if (message.includes('symptom') || message.includes('pain') || message.includes('hurt') || message.includes('fever') || message.includes('cough') || message.includes('headache')) {
    if (message.includes('headache')) {
      return "**Headache Analysis:**\n\nCommon causes include dehydration, stress, lack of sleep, or eye strain.\n\n💡 **Suggestions:**\n• Drink water (dehydration is a common cause)\n• Rest in a dark, quiet room\n• Apply a cold compress\n• Limit screen time\n\n⚠️ **See a doctor if:**\n• Severe or sudden onset\n• Accompanied by fever or stiff neck\n• After a head injury\n• Lasting more than 3 days\n\n*I'm an AI, not a doctor. This is for educational purposes.*";
    }
    if (message.includes('fever')) {
      return "**Fever Information:**\n\nNormal body temperature is 97°F-99°F (36°C-37.2°C). Fever is typically 100.4°F (38°C) or higher.\n\n💡 **Home Care:**\n• Rest and stay hydrated\n• Use acetaminophen or ibuprofen as directed\n• Light clothing and light blanket\n\n🚨 **Seek medical care if:**\n• Fever over 103°F (39.4°C)\n• Lasts more than 3 days\n• Accompanied by severe headache, rash, or difficulty breathing\n• Infant under 3 months with any fever";
    }
    if (message.includes('cough')) {
      return "**Cough Information:**\n\n💡 **Home remedies:**\n• Stay hydrated with warm liquids\n• Honey (for adults and children over 1)\n• Use a humidifier\n• Gargle with salt water\n\n🚨 **See a doctor if:**\n• Cough lasts more than 3 weeks\n• Difficulty breathing\n• Coughing up blood\n• Chest pain\n• High fever";
    }
    return "I understand you're experiencing symptoms. For proper analysis, please tell me:\n\n• What specific symptoms are you having?\n• How long have you had them?\n• How severe are they (mild/moderate/severe)?\n• Do you have any existing medical conditions?\n\nThis information helps me provide better guidance. Remember: I'm an AI assistant and cannot provide medical diagnosis.";
  }
  
  // Medication questions
  if (message.includes('medication') || message.includes('pill') || message.includes('drug') || message.includes('prescription') || message.includes('dosage')) {
    return "**Medication Information:**\n\n💊 **Important Medication Safety Tips:**\n• Always take medication exactly as prescribed\n• Never share prescription medications\n• Store medications properly\n• Check expiration dates\n• Keep a list of all medications\n\n⚠️ **Warning signs - contact doctor if you experience:**\n• Severe allergic reaction (rash, swelling, difficulty breathing)\n• Unusual side effects\n• Symptoms that worsen\n\n*Always consult your pharmacist or doctor for specific medication questions.*";
  }
  
  // Blood pressure questions
  if (message.includes('blood pressure') || message.includes('hypertension') || message.includes('bp')) {
    return "**Blood Pressure Information:**\n\n📊 **Normal ranges:**\n• Normal: Less than 120/80 mmHg\n• Elevated: 120-129/<80 mmHg\n• High BP Stage 1: 130-139/80-89 mmHg\n• High BP Stage 2: 140+/90+ mmHg\n\n💡 **Lifestyle changes:**\n• Reduce sodium intake\n• Exercise regularly (30 min/day)\n• Maintain healthy weight\n• Limit alcohol\n• Manage stress\n\n🚨 **Emergency (call doctor immediately):**\n• BP reading 180/120 or higher";
  }
  
  // Diabetes questions
  if (message.includes('diabetes') || message.includes('blood sugar')) {
    return "**Diabetes Information:**\n\n📊 **Blood sugar targets (fasting):**\n• Normal: 70-99 mg/dL\n• Prediabetes: 100-125 mg/dL\n• Diabetes: 126+ mg/dL\n\n💡 **Management tips:**\n• Monitor blood sugar regularly\n• Take medications as prescribed\n• Eat consistent, balanced meals\n• Stay active\n• Stay hydrated\n\n⚠️ **Emergency symptoms - seek immediate care:**\n• Very high or very low blood sugar\n• Confusion or loss of consciousness\n• Difficulty breathing";
  }
  
  // Nutrition questions
  if (message.includes('diet') || message.includes('food') || message.includes('eat') || message.includes('nutrition')) {
    return "**Healthy Eating Tips:** 🥗\n\n✅ **Do's:**\n• Eat a variety of colorful fruits and vegetables\n• Include lean proteins (chicken, fish, beans)\n• Choose whole grains over refined\n• Drink plenty of water (8+ glasses daily)\n• Practice portion control\n\n❌ **Limit:**\n• Processed foods\n• Added sugars\n• Saturated and trans fats\n• Excessive sodium\n\n🥤 **Hydration tip:** Start your day with a glass of water!";
  }
  
  // Exercise questions
  if (message.includes('exercise') || message.includes('workout') || message.includes('fitness') || message.includes('gym')) {
    return "**Exercise Guidelines:** 💪\n\n📊 **Recommendations:**\n• Adults: 150 min moderate OR 75 min vigorous activity weekly\n• Strength training: 2+ days per week\n• Balance exercises for older adults\n\n💡 **Types of exercise:**\n• **Cardio:** Walking, running, swimming, cycling\n• **Strength:** Weight lifting, bodyweight exercises\n• **Flexibility:** Stretching, yoga\n• **Balance:** Tai chi, standing exercises\n\n⚠️ **Safety:** Always warm up, cool down, and consult doctor before starting new exercise routine.";
  }
  
  // Sleep questions
  if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired')) {
    return "**Sleep Health:** 😴\n\n📊 **Recommended sleep duration:**\n• Adults (18-64): 7-9 hours\n• Older adults (65+): 7-8 hours\n\n💡 **Sleep hygiene tips:**\n• Maintain consistent sleep schedule\n• Create dark, quiet, cool bedroom\n• Avoid screens 1 hour before bed\n• Limit caffeine and alcohol\n• Exercise during day, not right before bed\n\n🚨 **See doctor if:**\n• Chronic difficulty sleeping\n• Loud snoring or gasping at night\n• Excessive daytime sleepiness";
  }
  
  // Mental health questions
  if (message.includes('anxiety') || message.includes('stress') || message.includes('depression') || message.includes('mental')) {
    return "**Mental Wellness Support:** 🧠\n\n💡 **Coping strategies:**\n• Deep breathing exercises\n• Regular physical activity\n• Connect with loved ones\n• Maintain routine\n• Limit news/social media\n• Practice mindfulness\n\n📞 **Resources (available 24/7):**\n• Crisis Hotline: 988\n• Talk to a trusted friend or family member\n• Schedule with a mental health professional\n\n*Your mental health matters. Reaching out for help is a sign of strength.*";
  }
  
  // Pregnancy questions
  if (message.includes('pregnancy') || message.includes('pregnant')) {
    return "**Pregnancy Health:** 🤰\n\n💡 **Important prenatal care:**\n• Regular prenatal checkups\n• Take prenatal vitamins with folic acid\n• Stay hydrated and eat nutritious foods\n• Avoid alcohol, smoking, and certain medications\n• Safe exercise (consult doctor first)\n\n🚨 **Seek immediate care if:**\n• Severe abdominal pain\n• Heavy bleeding\n• Severe headache or vision changes\n• Decreased fetal movement\n• Signs of preterm labor\n\n*Always consult your OB/GYN for pregnancy-specific advice.*";
  }
  
  // Pediatric/child health
  if (message.includes('child') || message.includes('baby') || message.includes('infant') || message.includes('kid')) {
    return "**Child Health Information:** 👶\n\n💡 **General tips:**\n• Keep up with vaccination schedule\n• Regular well-child visits\n• Monitor growth and development\n• Childproof your home\n\n🌡️ **Fever in children:**\n• Under 3 months: Any fever → Call doctor\n• 3-6 months: Fever over 101°F (38.3°C)\n• Over 6 months: Fever over 103°F (39.4°C)\n\n🚨 **Emergency signs:**\n• Difficulty breathing\n• Inconsolable crying\n• Lethargy or unresponsiveness\n• Seizure";
  }
  
  // Appointment booking
  if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
    return "**Booking Appointments:** 📅\n\nTo book an appointment:\n\n1️⃣ Go to the 'Book Appointment' tab in your dashboard\n2️⃣ Select your preferred doctor\n3️⃣ Choose date and time\n4️⃣ Select appointment type (In-person or Video call)\n5️⃣ Describe your reason for visit\n6️⃣ Submit request\n\n✅ After submitting, the doctor will confirm your appointment. You'll receive a notification once confirmed.\n\n📌 Would you like me to help you book an appointment now?";
  }
  
  // Help/about
  if (message.includes('help') || message.includes('what can you do') || message.includes('capabilities')) {
    return "**How I Can Help You:** 🤖\n\n• 📋 **Symptom analysis** - Get information about common symptoms\n• 💊 **Medication information** - Learn about medications and safety\n• 🥗 **Wellness tips** - Nutrition, exercise, sleep advice\n• 📊 **Health education** - Learn about conditions and prevention\n• 📅 **Appointment guidance** - Help with scheduling\n\n⚠️ **Important:** I'm an AI assistant providing general health information only. I cannot provide medical diagnosis or replace professional medical advice.\n\n**What would you like to know today?**";
  }
  
  // Thank you responses
  if (message.includes('thank')) {
    return "You're very welcome! 😊 I'm glad I could help. Is there anything else health-related I can assist you with today? Remember to stay hydrated and take care of yourself! 💙";
  }
  
  // Default response for other questions
  return `Thank you for your question about "${userMessage.substring(0, 50)}..." 

I'm here to help with health-related topics including:
• Symptoms and common conditions
• Medications and treatments
• Nutrition and exercise
• Mental wellness
• Sleep health
• Preventive care

Could you please rephrase or provide more details about your health concern? This will help me give you more accurate and helpful information.

*Remember: I'm an AI assistant providing general health education. For medical advice, please consult a healthcare provider.*`;
};

const GeminiChat = ({ user, userType }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your AI Health Assistant. I can help you with health information, symptom analysis, medication questions, and wellness tips. How can I assist you today?", 
      sender: 'ai', 
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessageText = input;
    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessageText, user?.name || 'User');
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 800);
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    const notification = document.createElement('div');
    notification.textContent = 'Copied!';
    notification.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#1e293b;color:white;padding:8px16px;border-radius:30px;z-index:1000';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 1500);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px' }}>
            <FaRobot />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>AI Health Assistant</h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#10b981' }}>● Online - Ready to help</p>
          </div>
        </div>
        <button onClick={clearChat} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
          <FaTrash />
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '12px', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.sender === 'ai' && (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <FaRobot size={16} />
              </div>
            )}
            <div style={{ maxWidth: '70%' }}>
              <div style={{ 
                padding: '12px 16px', 
                borderRadius: '18px', 
                background: msg.sender === 'user' ? '#3b82f6' : 'white', 
                color: msg.sender === 'user' ? 'white' : '#1e293b',
                border: msg.sender === 'ai' ? '1px solid #e2e8f0' : 'none',
                borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '18px',
                borderTopRightRadius: msg.sender === 'user' ? '4px' : '18px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5'
              }}>
                {msg.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ fontSize: '0.65rem', marginTop: '6px', color: '#94a3b8', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <span>{formatTime(msg.timestamp)}</span>
                {msg.sender === 'ai' && (
                  <button onClick={() => copyMessage(msg.text)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '10px' }}>
                    Copy
                  </button>
                )}
              </div>
            </div>
            {msg.sender === 'user' && (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <FaRobot size={16} />
            </div>
            <div style={{ padding: '12px 16px', borderRadius: '18px', background: 'white', border: '1px solid #e2e8f0', borderTopLeftRadius: '4px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8', animation: 'typing 1.4s infinite' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8', animation: 'typing 1.4s infinite 0.2s' }}></span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8', animation: 'typing 1.4s infinite 0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div style={{ padding: '8px 20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['What are my symptoms?', 'Medication safety tips', 'Wellness advice', 'Book appointment'].map(suggestion => (
          <button
            key={suggestion}
            onClick={() => setInput(suggestion)}
            style={{ padding: '6px 14px', background: '#f1f5f9', border: 'none', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', color: '#3b82f6', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '12px', padding: '16px 20px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your health question here..."
          disabled={loading}
          style={{ flex: 1, padding: '12px 18px', border: '1px solid #e2e8f0', borderRadius: '30px', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
          onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
        />
        <button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
          style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading || !input.trim() ? 0.5 : 1, transition: 'all 0.2s' }}
        >
          {loading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaPaperPlane />}
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '8px 16px', background: '#fef3c7', borderTop: '1px solid #fde68a', textAlign: 'center', fontSize: '0.65rem', color: '#92400e' }}>
        ⚠️ AI assistant provides general health information only. Always consult a doctor for medical advice.
      </div>

      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GeminiChat;