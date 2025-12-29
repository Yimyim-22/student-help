import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, AlertCircle, BookOpen } from 'lucide-react';
import { format, isToday, isFuture, parseISO, compareAsc } from 'date-fns';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
    const { classes, assignments, exams, username } = useApp();

    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayDate = format(new Date(), 'EEEE, MMMM do');

    // Filter Schedule for Today
    const todaysClasses = classes
        .map(cls => {
            const todaySchedule = cls.schedule.find(s => s.day === todayName);
            if (!todaySchedule) return null;
            return { ...cls, time: todaySchedule.startTime, endTime: todaySchedule.endTime };
        })
        .filter(Boolean)
        .sort((a, b) => a.time.localeCompare(b.time));

    // Upcoming Assignments (Pending & Due in future)
    const upcomingAssignments = assignments
        .filter(a => a.status === 'Pending' && isFuture(parseISO(a.dueDate)) || isToday(parseISO(a.dueDate)))
        .sort((a, b) => compareAsc(parseISO(a.dueDate), parseISO(b.dueDate)))
        .slice(0, 5);

    // Next Exam
    const upcomingExams = exams
        .filter(e => isFuture(parseISO(e.date)) || isToday(parseISO(e.date)))
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)))
        .slice(0, 3);

    // Stats
    const pendingCount = assignments.filter(a => a.status === 'Pending').length;
    const examsCount = upcomingExams.length;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="heading-lg">Hello, {username || 'Student'}! 👋</h1>
                <p className="text-muted">It's {todayDate}. Let's crush it today!</p>
            </div>

            <div className="dashboard-grid">
                {/* Today's Schedule */}
                <div className="dashboard-widget card-gradient-blue">
                    <div className="widget-header">
                        <div className="widget-title text-white">
                            <Clock size={20} className="text-white" />
                            Today's Schedule
                        </div>
                        <Link to="/classes" className="text-white-alpha">View All</Link>
                    </div>

                    <div className="db-list glass-panel">
                        {todaysClasses.length === 0 ? (
                            <div className="empty-widget text-white-alpha">No classes scheduled for today. Enjoy your free time!</div>
                        ) : (
                            todaysClasses.map((cls, idx) => (
                                <div key={idx} className="db-item glass-item">
                                    <div className="db-time text-white-alpha">
                                        {cls.time}
                                    </div>
                                    <div className="db-content">
                                        <div className="db-main-text text-white">{cls.name}</div>
                                        <div className="db-sub-text text-white-alpha">{cls.room || 'No Room'} • {cls.teacher}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Due Soon */}
                <div className="dashboard-widget card-gradient-warm">
                    <div className="widget-header">
                        <div className="widget-title text-white">
                            <AlertCircle size={20} className="text-white" />
                            Due Soon
                        </div>
                        <Link to="/assignments" className="text-white-alpha">View All</Link>
                    </div>

                    <div className="db-list glass-panel">
                        {upcomingAssignments.length === 0 ? (
                            <div className="empty-widget text-white-alpha">No upcoming assignments. You're all caught up!</div>
                        ) : (
                            upcomingAssignments.map(a => (
                                <div key={a.id} className="db-item glass-item">
                                    <div className="db-content">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div className="db-main-text text-white">{a.title}</div>
                                            {a.priority === 'High' && <span className="urgent-tag">URGENT</span>}
                                        </div>
                                        <div className="db-sub-text text-white-alpha">Due {format(parseISO(a.dueDate), 'MMM do')}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Overview Stats & Exams */}
                <div className="dashboard-widget" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <div className="widget-title" style={{ marginBottom: '1rem' }}>
                            <BookOpen size={20} className="text-primary" />
                            Quick Stats
                        </div>
                        <div className="stat-grid">
                            <div className="stat-card">
                                <div className="stat-value">{pendingCount}</div>
                                <div className="stat-label">Pending Assignments</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{examsCount}</div>
                                <div className="stat-label">Upcoming Exams</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div className="widget-title" style={{ marginBottom: '1rem' }}>
                            <Calendar size={20} className="text-primary" />
                            Next Exam
                        </div>
                        {upcomingExams.length > 0 ? (
                            <div className="db-item exam-preview-card">
                                <div className="db-content" style={{ textAlign: 'center' }}>
                                    <div className="db-main-text text-primary-dark" style={{ fontSize: '1.1rem' }}>{upcomingExams[0].title}</div>
                                    <div className="db-sub-text text-primary">
                                        {format(parseISO(upcomingExams[0].date), 'EEEE, MMM do')}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-widget">No upcoming exams.</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
