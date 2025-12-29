import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';
import './Welcome.css';

export default function Welcome() {
    const [name, setName] = useState('');
    const { updateUsername } = useApp();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            updateUsername(name.trim());
            navigate('/');
        }
    };

    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <div className="icon-wrapper">
                    <Sparkles size={48} className="welcome-icon" />
                </div>
                <h1 className="welcome-title">Welcome to StudyTrack!</h1>
                <p className="welcome-text">
                    Let's get started. What should we call you?
                </p>

                <form onSubmit={handleSubmit} className="welcome-form">
                    <input
                        type="text"
                        className="welcome-input"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                    />
                    <button type="submit" className="welcome-btn">
                        Let's Go!
                    </button>
                </form>
            </div>
        </div>
    );
}
