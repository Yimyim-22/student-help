import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    BookOpen,
    FileText,
    GraduationCap,
    Calculator,
    X,
    ArrowRight
} from 'lucide-react';
import './Welcome.css';

export default function Welcome() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        school: '',
        email: ''
    });

    const { updateUserProfile } = useApp();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.school && formData.email) {
            updateUserProfile(formData);
            navigate('/');
        }
    };

    const features = [
        {
            icon: <BookOpen size={28} />,
            title: "Track Classes",
            desc: "Manage your course schedule and details in one place."
        },
        {
            icon: <FileText size={28} />,
            title: "Manage Assignments",
            desc: "Keep track of due dates and submission statuses."
        },
        {
            icon: <GraduationCap size={28} />,
            title: "Ace Exams",
            desc: "Prepare effectively with exam schedules and reminders."
        },
        {
            icon: <Calculator size={28} />,
            title: "Calculate GPA",
            desc: "stay on top of your academic performance easily."
        }
    ];

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                {/* Hero Wrapper */}
                <div className="hero-section">
                    <h1 className="hero-title">StudyTrack</h1>
                    <p className="hero-subtitle">
                        The ultimate student companion. Organize your academic life, tracking everything from classes to your GPA in one beautiful dashboard.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="features-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card">
                            <div className="feature-icon-wrapper">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-desc">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="cta-section">
                    <button
                        className="sign-in-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Sign In to Get Started
                    </button>
                </div>
            </div>

            {/* Sign In Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target === e.currentTarget) setIsModalOpen(false);
                }}>
                    <div className="modal-content">
                        <button
                            className="close-btn"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X size={20} />
                        </button>

                        <div className="modal-header">
                            <h2 className="modal-title">Student Login</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                Enter your details to access your dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">School / University</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="University of Technology"
                                    value={formData.school}
                                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="john@student.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Go to Dashboard <ArrowRight size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
