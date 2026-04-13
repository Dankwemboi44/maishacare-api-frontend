// src/components/HealthArticles/HealthArticles.js
import React, { useState } from 'react';
import './HealthArticles.css';

const HealthArticles = () => {
  const [articles] = useState([
    { id: 1, title: '10 Tips for a Healthy Heart', category: 'Heart Health', readTime: '5 min', image: '❤️', content: 'Regular exercise, balanced diet, stress management...' },
    { id: 2, title: 'Understanding Blood Pressure Numbers', category: 'Education', readTime: '3 min', image: '🩺', content: 'What do systolic and diastolic numbers mean?...' },
    { id: 3, title: 'Benefits of Telemedicine', category: 'Technology', readTime: '4 min', image: '💻', content: 'Convenient, accessible healthcare from home...' },
    { id: 4, title: 'Managing Diabetes with Diet', category: 'Nutrition', readTime: '6 min', image: '🥗', content: 'Food choices that help control blood sugar...' },
    { id: 5, title: 'Stress Reduction Techniques', category: 'Mental Health', readTime: '4 min', image: '🧘', content: 'Simple practices for daily stress relief...' },
    { id: 6, title: 'Importance of Annual Checkups', category: 'Prevention', readTime: '3 min', image: '📅', content: 'Why regular health screenings matter...' }
  ]);

  const [tips] = useState([
    { id: 1, text: '💧 Drink 8 glasses of water daily', category: 'Hydration' },
    { id: 2, text: '🚶 Take 10,000 steps every day', category: 'Exercise' },
    { id: 3, text: '😴 Get 7-8 hours of quality sleep', category: 'Sleep' },
    { id: 4, text: '🥦 Eat a rainbow of vegetables', category: 'Nutrition' },
    { id: 5, text: '🧘 Practice deep breathing for 5 minutes', category: 'Mental Health' }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Heart Health', 'Education', 'Technology', 'Nutrition', 'Mental Health', 'Prevention'];

  const filteredArticles = selectedCategory === 'All' ? articles : articles.filter(a => a.category === selectedCategory);

  return (
    <div className="health-articles-container">
      <div className="daily-tip">
        <div className="tip-header"><i className="fas fa-lightbulb"></i><h3>Daily Health Tip</h3></div>
        <div className="tip-content">{tips[Math.floor(Math.random() * tips.length)].text}</div>
      </div>

      <div className="articles-header"><h2><i className="fas fa-newspaper"></i> Health Articles</h2><div className="category-filters">{categories.map(cat => (<button key={cat} className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>))}</div></div>

      <div className="articles-grid">{filteredArticles.map(article => (<div key={article.id} className="article-card"><div className="article-icon">{article.image}</div><div className="article-info"><h3>{article.title}</h3><div className="article-meta"><span className="category">{article.category}</span><span className="read-time"><i className="far fa-clock"></i> {article.readTime}</span></div><p>{article.content.substring(0, 80)}...</p><button className="read-more">Read More →</button></div></div>))}</div>
    </div>
  );
};

export default HealthArticles;