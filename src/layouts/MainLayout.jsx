import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, ClipboardList, GraduationCap, BookOpen, Sun, Moon, Calculator } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Layout.css';

export default function MainLayout() {
    const { theme, toggleTheme } = useApp();

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="logo-container">
                    <BookOpen className="logo-icon" size={28} />
                    <span className="logo-text">StudyTrack</span>
                </div>

                <nav className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="nav-text">Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/classes"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Calendar size={20} />
                        <span className="nav-text">Classes</span>
                    </NavLink>

                    <NavLink
                        to="/assignments"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <ClipboardList size={20} />
                        <span className="nav-text">Assignments</span>
                    </NavLink>

                    <NavLink
                        to="/exams"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <GraduationCap size={20} />
                        <span className="nav-text">Exams</span>
                    </NavLink>

                    <NavLink
                        to="/gpa"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Calculator size={20} />
                        <span className="nav-text">GPA</span>
                    </NavLink>

                    <button
                        onClick={toggleTheme}
                        className="nav-item theme-toggle"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="nav-text">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div >
    );
}
