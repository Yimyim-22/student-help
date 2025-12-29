import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, Calculator } from 'lucide-react';
import './Gpa.css';

const GRADE_POINTS = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0
};

export default function Gpa() {
    // Initial state with one semester and one empty course
    const [semesters, setSemesters] = useState(() => {
        const saved = localStorage.getItem('gpa_data');
        return saved ? JSON.parse(saved) : [{
            id: Date.now(),
            name: 'Semester 1',
            courses: [{ id: Date.now(), name: '', units: '', grade: 'A' }]
        }];
    });

    useEffect(() => {
        localStorage.setItem('gpa_data', JSON.stringify(semesters));
    }, [semesters]);

    const calculateSemesterGPA = (courses) => {
        let totalPoints = 0;
        let totalUnits = 0;

        courses.forEach(course => {
            const units = parseFloat(course.units);
            if (!isNaN(units) && course.grade) {
                totalPoints += units * GRADE_POINTS[course.grade];
                totalUnits += units;
            }
        });

        return totalUnits === 0 ? 0 : (totalPoints / totalUnits).toFixed(2);
    };

    const calculateCGPA = () => {
        let totalPoints = 0;
        let totalUnits = 0;

        semesters.forEach(semester => {
            semester.courses.forEach(course => {
                const units = parseFloat(course.units);
                if (!isNaN(units) && course.grade) {
                    totalPoints += units * GRADE_POINTS[course.grade];
                    totalUnits += units;
                }
            });
        });

        return totalUnits === 0 ? 0 : (totalPoints / totalUnits).toFixed(2);
    };

    const addSemester = () => {
        setSemesters([
            ...semesters,
            {
                id: Date.now(),
                name: `Semester ${semesters.length + 1}`,
                courses: [{ id: Date.now(), name: '', units: '', grade: 'A' }]
            }
        ]);
    };

    const removeSemester = (semesterId) => {
        if (semesters.length > 1) {
            setSemesters(semesters.filter(s => s.id !== semesterId));
        }
    };

    const addCourse = (semesterId) => {
        setSemesters(semesters.map(semester => {
            if (semester.id === semesterId) {
                return {
                    ...semester,
                    courses: [...semester.courses, { id: Date.now(), name: '', units: '', grade: 'A' }]
                };
            }
            return semester;
        }));
    };

    const removeCourse = (semesterId, courseId) => {
        setSemesters(semesters.map(semester => {
            if (semester.id === semesterId) {
                return {
                    ...semester,
                    courses: semester.courses.filter(c => c.id !== courseId)
                };
            }
            return semester;
        }));
    };

    const updateCourse = (semesterId, courseId, field, value) => {
        setSemesters(semesters.map(semester => {
            if (semester.id === semesterId) {
                return {
                    ...semester,
                    courses: semester.courses.map(course => {
                        if (course.id === courseId) {
                            return { ...course, [field]: value };
                        }
                        return course;
                    })
                };
            }
            return semester;
        }));
    };

    return (
        <div className="gpa-container fade-in">
            <header className="gpa-header">
                <h1>GPA Tracker</h1>
                <a
                    href="https://sis.nileuniversity.edu.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sis-link-btn"
                >
                    <ExternalLink size={18} />
                    Open SIS Portal
                </a>
            </header>

            <div className="cumulative-gpa-card">
                <span className="cgpa-label">Cumulative GPA (CGPA)</span>
                <div className="cgpa-value">{calculateCGPA()}</div>
            </div>

            <div className="semester-list">
                {semesters.map((semester, index) => (
                    <div key={semester.id} className="semester-card">
                        <div className="semester-header">
                            <h2>{semester.name}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className="semester-gpa">GPA: {calculateSemesterGPA(semester.courses)}</span>
                                {semesters.length > 1 && (
                                    <button
                                        onClick={() => removeSemester(semester.id)}
                                        className="remove-course-btn"
                                        title="Remove Semester"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="course-list">
                            {semester.courses.map((course) => (
                                <div key={course.id} className="course-item">
                                    <div className="grade-input-group">
                                        <input
                                            type="text"
                                            placeholder="Course Name (e.g. MTH 101)"
                                            value={course.name}
                                            onChange={(e) => updateCourse(semester.id, course.id, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="grade-input-group">
                                        <input
                                            type="number"
                                            placeholder="Units"
                                            min="0"
                                            value={course.units}
                                            onChange={(e) => updateCourse(semester.id, course.id, 'units', e.target.value)}
                                        />
                                    </div>
                                    <div className="grade-input-group">
                                        <select
                                            value={course.grade}
                                            onChange={(e) => updateCourse(semester.id, course.id, 'grade', e.target.value)}
                                        >
                                            {Object.keys(GRADE_POINTS).map(grade => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => removeCourse(semester.id, course.id)}
                                        className="remove-course-btn"
                                        disabled={semester.courses.length === 1}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => addCourse(semester.id)} className="add-course-btn">
                            <Plus size={18} /> Add Course
                        </button>
                    </div>
                ))}
            </div>

            <button onClick={addSemester} className="add-semester-btn">
                Add Semester
            </button>
        </div>
    );
}
