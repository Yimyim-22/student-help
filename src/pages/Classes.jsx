import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Plus, Trash2, Clock, MapPin, User, Calendar, X } from 'lucide-react';
import './Classes.css';

export default function Classes() {
    const { classes, addClass, deleteClass } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        teacher: '',
        room: '',
        schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:30' }]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleScheduleChange = (index, field, value) => {
        const newSchedule = [...formData.schedule];
        newSchedule[index][field] = value;
        setFormData({ ...formData, schedule: newSchedule });
    };

    const addScheduleSlot = () => {
        setFormData({
            ...formData,
            schedule: [...formData.schedule, { day: 'Monday', startTime: '09:00', endTime: '10:30' }]
        });
    };

    const removeScheduleSlot = (index) => {
        if (formData.schedule.length === 1) return;
        const newSchedule = formData.schedule.filter((_, i) => i !== index);
        setFormData({ ...formData, schedule: newSchedule });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addClass(formData);
        setIsModalOpen(false);
        setFormData({
            name: '',
            teacher: '',
            room: '',
            schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:30' }]
        });
    };

    return (
        <div>
            <div className="classes-header">
                <div>
                    <h1 className="heading-lg">My Classes</h1>
                    <p className="text-muted">Manage your subjects and schedule.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Class
                </button>
            </div>

            <div className="classes-grid">
                {classes.length === 0 ? (
                    <div className="empty-state">
                        <p className="text-muted">No classes added yet. Click "Add Class" to get started.</p>
                    </div>
                ) : (
                    classes.map((cls) => (
                        <div key={cls.id} className="class-card">
                            <div className="class-header">
                                <div>
                                    <h3 className="class-name">{cls.name}</h3>
                                    <div className="class-teacher">
                                        <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                        {cls.teacher}
                                    </div>
                                </div>
                                {cls.room && (
                                    <div className="class-room">
                                        <MapPin size={12} style={{ display: 'inline', marginRight: '2px' }} />
                                        {cls.room}
                                    </div>
                                )}
                            </div>

                            <div className="schedule-list">
                                {cls.schedule.map((slot, idx) => (
                                    <div key={idx} className="schedule-item">
                                        <span className="day-badge">{slot.day}</span>
                                        <span className="text-muted">
                                            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                            {slot.startTime} - {slot.endTime}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn-icon"
                                    onClick={() => deleteClass(cls.id)}
                                    style={{ color: 'var(--text-muted)' }}
                                    title="Delete Class"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Class"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Subject Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="form-input"
                            placeholder="e.g. Mathematics"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Teacher</label>
                        <input
                            type="text"
                            name="teacher"
                            className="form-input"
                            placeholder="e.g. Mr. Smith"
                            value={formData.teacher}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Room / Code</label>
                        <input
                            type="text"
                            name="room"
                            className="form-input"
                            placeholder="e.g. 101 or Zoom Link"
                            value={formData.room}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Schedule</label>
                        {formData.schedule.map((slot, index) => (
                            <div key={index} className="schedule-inputs">
                                <select
                                    className="form-select"
                                    value={slot.day}
                                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                                >
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                    <option>Saturday</option>
                                    <option>Sunday</option>
                                </select>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={slot.startTime}
                                    onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                                />
                                <input
                                    type="time"
                                    className="form-input"
                                    value={slot.endTime}
                                    onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => removeScheduleSlot(index)}
                                    disabled={formData.schedule.length === 1}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.4rem' }}
                            onClick={addScheduleSlot}
                        >
                            <Plus size={14} /> Add Another Time Slot
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Save Class
                    </button>
                </form>
            </Modal>
        </div>
    );
}
