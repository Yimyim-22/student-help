import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Load initial state from localStorage or use defaults
    const [classes, setClasses] = useState(() => {
        const saved = localStorage.getItem('classes');
        return saved ? JSON.parse(saved) : [];
    });

    const [assignments, setAssignments] = useState(() => {
        // Check if we have saved assignments
        const saved = localStorage.getItem('assignments');
        return saved ? JSON.parse(saved) : [];
    });

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { name: '', school: '', email: '' };
    });

    // Backwards compatibility for username
    const username = user.name;

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
        // Keep legacy username for protected route check compatibility if needed, 
        // essentially satisfying "if (!username)" checks by ensuring user.name implies a logged in state.
        if (user.name) {
            localStorage.setItem('username', user.name);
        } else {
            localStorage.removeItem('username');
        }
    }, [user]);

    const updateUserProfile = (profileData) => {
        setUser(prev => ({ ...prev, ...profileData }));
    };

    // Deprecated but kept for minimal refactor of other components if they use it strictly for name
    const updateUsername = (name) => {
        setUser(prev => ({ ...prev, name }));
    };

    // --- Theme State ---
    const THEME_PRESETS = {
        violet: {
            name: 'Violet',
            primary: '#6d28d9',
            hover: '#5b21b6',
            light: '#ddd6fe',
            gradient: 'linear-gradient(135deg, #6d28d9 0%, #a855f7 100%)'
        },
        ocean: {
            name: 'Ocean',
            primary: '#2563eb',
            hover: '#1d4ed8',
            light: '#dbeafe',
            gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
        },
        teal: {
            name: 'Teal',
            primary: '#0d9488',
            hover: '#0f766e',
            light: '#ccfbf1',
            gradient: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)'
        },
        rose: {
            name: 'Rose',
            primary: '#e11d48',
            hover: '#be123c',
            light: '#ffe4e6',
            gradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)'
        },
        amber: {
            name: 'Amber',
            primary: '#d97706',
            hover: '#b45309',
            light: '#fef3c7',
            gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
        }
    };

    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [accentColor, setAccentColor] = useState(() => {
        return localStorage.getItem('accentColor') || 'violet';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('accentColor', accentColor);
        const colors = THEME_PRESETS[accentColor] || THEME_PRESETS.violet;

        const root = document.documentElement;
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--primary-hover', colors.hover);
        root.style.setProperty('--primary-light', colors.light);
        root.style.setProperty('--gradient-primary', colors.gradient);
    }, [accentColor]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const [exams, setExams] = useState(() => {
        const saved = localStorage.getItem('exams');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('classes', JSON.stringify(classes));
    }, [classes]);

    useEffect(() => {
        localStorage.setItem('assignments', JSON.stringify(assignments));
    }, [assignments]);

    useEffect(() => {
        localStorage.setItem('exams', JSON.stringify(exams));
    }, [exams]);

    // --- Classes Actions ---
    const addClass = (cls) => {
        setClasses([...classes, { ...cls, id: uuidv4() }]);
    };

    const updateClass = (id, updatedCls) => {
        setClasses(classes.map(c => c.id === id ? { ...c, ...updatedCls } : c));
    };

    const deleteClass = (id) => {
        setClasses(classes.filter(c => c.id !== id));
    };

    // --- Assignments Actions ---
    const addAssignment = (assignment) => {
        setAssignments([...assignments, { ...assignment, id: uuidv4(), status: 'Pending' }]);
    };

    const updateAssignment = (id, updated) => {
        setAssignments(assignments.map(a => a.id === id ? { ...a, ...updated } : a));
    };

    const deleteAssignment = (id) => {
        setAssignments(assignments.filter(a => a.id !== id));
    };

    const toggleAssignmentStatus = (id) => {
        setAssignments(assignments.map(a =>
            a.id === id ? { ...a, status: a.status === 'Pending' ? 'Completed' : 'Pending' } : a
        ));
    };

    // --- Exams Actions ---
    const addExam = (exam) => {
        setExams([...exams, { ...exam, id: uuidv4() }]);
    };

    const deleteExam = (id) => {
        setExams(exams.filter(e => e.id !== id));
    };

    return (
        <AppContext.Provider value={{
            username, updateUsername,
            user, updateUserProfile,
            theme, toggleTheme,
            accentColor, setAccentColor, THEME_PRESETS,
            classes, addClass, updateClass, deleteClass,
            assignments, addAssignment, updateAssignment, deleteAssignment, toggleAssignmentStatus,
            exams, addExam, deleteExam
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
