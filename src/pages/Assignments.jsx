import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Calendar, AlertCircle, BookOpen, Trash2 } from 'lucide-react';
import './Assignments.css';

export default function Assignments() {
    const { assignments, classes, addAssignment, deleteAssignment, toggleAssignmentStatus } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classId: '',
        dueDate: '',
        priority: 'Medium'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addAssignment(formData);
        setIsModalOpen(false);
        setFormData({
            title: '',
            description: '',
            classId: '',
            dueDate: '',
            priority: 'Medium'
        });
    };

    // Sort assignments: Pending first, then by Due Date
    const sortedAssignments = [...assignments].sort((a, b) => {
        if (a.status === b.status) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return a.status === 'Pending' ? -1 : 1;
    });

    const filteredAssignments = sortedAssignments.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'pending') return a.status === 'Pending';
        if (filter === 'completed') return a.status === 'Completed';
        return true;
    });

    const getClassName = (classId) => {
        const cls = classes.find(c => c.id === classId);
        return cls ? cls.name : 'General';
    };

    return (
        <div>
            <div className="classes-header">
                <div>
                    <h1 className="heading-lg">Assignments</h1>
                    <p className="text-muted">Stay on top of your deadlines.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Assignment
                </button>
            </div>

            <div className="assignments-controls">
                <select
                    className="form-select filter-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Assignments</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="assignments-list">
                {filteredAssignments.length === 0 ? (
                    <div className="empty-state">
                        <p className="text-muted">No assignments found.</p>
                    </div>
                ) : (
                    filteredAssignments.map((assignment) => (
                        <div key={assignment.id} className={`assignment-card ${assignment.status === 'Completed' ? 'completed' : ''}`}>
                            <input
                                type="checkbox"
                                className="assignment-checkbox"
                                checked={assignment.status === 'Completed'}
                                onChange={() => toggleAssignmentStatus(assignment.id)}
                            />

                            <div className="assignment-details">
                                <h3 className="assignment-title">{assignment.title}</h3>
                                <div className="assignment-meta">
                                    <span className="meta-item">
                                        <BookOpen size={14} />
                                        {getClassName(assignment.classId)}
                                    </span>
                                    <span className="meta-item">
                                        <Calendar size={14} />
                                        {new Date(assignment.dueDate).toLocaleDateString()}
                                    </span>
                                    <span className={`priority-badge priority-${assignment.priority.toLowerCase()}`}>
                                        {assignment.priority}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="btn-icon"
                                onClick={() => deleteAssignment(assignment.id)}
                                style={{ color: 'var(--text-muted)' }}
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Assignment"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
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

                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            required
                            className="form-input"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select
                            name="priority"
                            className="form-select"
                            value={formData.priority}
                            onChange={handleInputChange}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description (Optional)</label>
                        <textarea
                            name="description"
                            className="form-input"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Save Assignment
                    </button>
                </form>
            </Modal>
        </div>
    );
}
