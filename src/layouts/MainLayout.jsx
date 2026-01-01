import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, ClipboardList, GraduationCap, BookOpen, Sun, Moon, Calculator, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Layout.css';

export default function MainLayout() {
    const { theme, toggleTheme } = useApp();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
    const closeDrawer = () => setIsDrawerOpen(false);

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <header className="mobile-header">
                <button
                    className="menu-btn"
                    onClick={toggleDrawer}
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>
                <div className="mobile-logo">
                    <BookOpen size={24} className="logo-icon" />
                    <span className="logo-text">StudyTrack</span>
                </div>
            </header>

            {/* Overlay */}
            {isDrawerOpen && (
                <div className="drawer-overlay" onClick={closeDrawer} aria-hidden="true" />
            )}

            {/* Sidebar / Drawer */}
            <aside className={`sidebar ${isDrawerOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <BookOpen className="logo-icon" size={28} />
                        <span className="logo-text">StudyTrack</span>
                    </div>
                    <button
                        className="close-btn mobile-only"
                        onClick={closeDrawer}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="nav-links">
                    <NavLink
                        to="/"
                        onClick={closeDrawer}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span className="nav-text">Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/classes"
                        onClick={closeDrawer}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Calendar size={20} />
                        <span className="nav-text">Classes</span>
                    </NavLink>

                    <NavLink
                        to="/assignments"
                        onClick={closeDrawer}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <ClipboardList size={20} />
                        <span className="nav-text">Assignments</span>
                    </NavLink>

                    <NavLink
                        to="/exams"
                        onClick={closeDrawer}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <GraduationCap size={20} />
                        <span className="nav-text">Exams</span>
                    </NavLink>

                    <NavLink
                        to="/gpa"
                        onClick={closeDrawer}
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
