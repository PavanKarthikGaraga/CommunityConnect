'use client';

import React, { useState } from 'react';
import './faq.css';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How can I start volunteering?",
      answer: "Simply create an account, complete your profile with your interests and skills. Our AI will match you with suitable projects that align with your preferences and expertise.",
      icon: "🎯"
    },
    {
      question: "I'm an NGO, how can I post projects?",
      answer: "Register as an NGO, verify your organization's credentials, and start posting projects immediately. We provide tools to manage volunteers and track progress.",
      icon: "🏢"
    },
    {
      question: "Is there a cost involved?",
      answer: "The platform is completely free for volunteers. NGOs have free basic features with optional premium features for enhanced project management.",
      icon: "💰"
    },
    {
      question: "How do you verify NGOs?",
      answer: "We have a thorough verification process including registration documents, past work history, and references. We conduct periodic reviews.",
      icon: "✅"
    },
    {
      question: "Can government bodies participate?",
      answer: "Yes, government bodies can register and collaborate on projects. They get special features for oversight and coordination.",
      icon: "🏛️"
    }
  ];

  return (
    <div className="faq-grid">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          onClick={() => setActiveIndex(activeIndex === index ? null : index)}
        >
          <div className="faq-question">
            <div className="question-content">
              <span className="faq-icon">{faq.icon}</span>
              <h3>{faq.question}</h3>
            </div>
            <span className="toggle-icon">{activeIndex === index ? '−' : '+'}</span>
          </div>
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 