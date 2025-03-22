'use client';

import React, { useState } from 'react';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How can I start volunteering?",
      answer: "Simply create an account, complete your profile with your interests and skills, and our AI will match you with suitable projects. You can also browse available opportunities manually."
    },
    {
      question: "I'm an NGO, how can I post projects?",
      answer: "Register as an NGO, verify your organization's credentials, and you can start posting projects immediately. Our platform provides tools to manage volunteers and track project progress."
    },
    {
      question: "Is there a cost involved?",
      answer: "The platform is completely free for volunteers. NGOs have free basic features with optional premium features available for enhanced project management and analytics."
    },
    {
      question: "How do you verify NGOs?",
      answer: "We have a thorough verification process that includes checking registration documents, past work history, and references. We also conduct periodic reviews to maintain quality."
    },
    {
      question: "Can government bodies participate?",
      answer: "Yes, government bodies can register and collaborate on projects. They can also access special features for oversight and coordination with NGOs and volunteers."
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
            <h3>{faq.question}</h3>
            <span className="icon">{activeIndex === index ? '−' : '+'}</span>
          </div>
          <div className="faq-answer">
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
} 