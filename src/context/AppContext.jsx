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

    const [username, setUsername] = useState(() => {
        return localStorage.getItem('username') || '';
    });

    useEffect(() => {
        localStorage.setItem('username', username);
    }, [username]);

    const updateUsername = (name) => {
        setUsername(name);
    };

    // --- Theme State ---
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

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
            theme, toggleTheme,
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
