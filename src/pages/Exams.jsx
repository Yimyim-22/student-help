import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Calendar, Clock, BookOpen, Trash2 } from 'lucide-react';
import { differenceInDays, format, parseISO } from 'date-fns';
import './Exams.css';

export default function Exams() {
    const { exams, classes, addExam, deleteExam } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Force re-render every minute to update countdowns (optional, but good for "Hours left")
    // For Days left, standard render is enough.

    const [formData, setFormData] = useState({
        title: '',
        classId: '',
        date: '',
        time: '',
        topics: '',
        type: 'Final'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addExam(formData);
        setIsModalOpen(false);
        setFormData({
            title: '',
            classId: '',
            date: '',
            time: '',
            topics: '',
            type: 'Final'
        });
    };

    const getDaysRemaining = (dateString) => {
        const examDate = parseISO(dateString);
        const today = new Date();
        return differenceInDays(examDate, today);
    };

    const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

    const getClassName = (classId) => {
        const cls = classes.find(c => c.id === classId);
        return cls ? cls.name : 'General';
    };

    return (
        <div>
            <div className="classes-header">
                <div>
                    <h1 className="heading-lg">Exams</h1>
                    <p className="text-muted">Prepare for your upcoming tests.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Exam
                </button>
            </div>

            <div className="exams-grid">
                {sortedExams.length === 0 ? (
                    <div className="empty-state">
                        <p className="text-muted">No upcoming exams scheduled.</p>
                    </div>
                ) : (
                    sortedExams.map(exam => {
                        const daysLeft = getDaysRemaining(exam.date);
                        const isUrgent = daysLeft <= 3 && daysLeft >= 0;
                        const isPast = daysLeft < 0;

                        return (
                            <div key={exam.id} className="exam-card">
                                <div className="exam-header">
                                    <div>
                                        <h3 className="exam-title">{exam.title}</h3>
                                        <div className="exam-class">
                                            <BookOpen size={14} />
                                            {getClassName(exam.classId)}
                                            <span style={{ margin: '0 4px' }}>•</span>
                                            <span className="exam-type-badge">{exam.type}</span>
                                        </div>
                                    </div>

                                    {!isPast ? (
                                        <div className={`countdown-badge ${isUrgent ? 'urgent' : ''}`}>
                                            <div className="countdown-days">{daysLeft}</div>
                                            <div className="countdown-label">Days Left</div>
                                        </div>
                                    ) : (
                                        <div className="countdown-badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
                                            <div className="countdown-days">Done</div>
                                        </div>
                                    )}
                                </div>

                                <div className="exam-details">
                                    <div className="detail-row">
                                        <span><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Date</span>
                                        <span>{format(parseISO(exam.date), 'MMM do, yyyy')}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Time</span>
                                        <span>{exam.time}</span>
                                    </div>
                                    {exam.topics && (
                                        <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                                            <strong>Topics:</strong> {exam.topics}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        className="btn-icon"
                                        onClick={() => deleteExam(exam.id)}
                                        title="Delete"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule Exam"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Exam Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g. Midterm"
                            className="form-input"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Class</label>
                        <select
                            name="classId"
                            className="form-select"
                            value={formData.classId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a Class...</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="schedule-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="form-input"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label className="form-label">Time</label>
                            <input
                                type="time"
                                name="time"
                                required
                                className="form-input"
                                value={formData.time}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Exam Type</label>
                        <select
                            name="type"
                            className="form-select"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option>Quiz</option>
                            <option>Midterm</option>
                            <option>Final</option>
                            <option>Project Presentation</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Topics / Syllabus</label>
                        <textarea
                            name="topics"
                            className="form-input"
                            rows="3"
                            placeholder="Chapters 1-5..."
                            value={formData.topics}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Add Exam
                    </button>
                </form>
            </Modal>
        </div>
    );
}
