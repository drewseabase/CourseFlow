/**
 * Seed Data Configuration
 * 
 * This file contains the configuration data used to generate realistic mock schedules.
 * All data here is used to create deterministic, believable student schedules
 */

import { EventCategory } from "@/types/schedule";


// =================================
// Course Information
// =================================

/**
 * List of course names for assignment generation
 * these represent a typical engineering/Stem student schedule
 */
export const COURSES = [
    "Physics 201",
    "Calculus III",
    "Engineering Dynamics",
    "Computer Science 101",
    "History of Technology",
] as const;

/**
 * Course colors for visual organization
 * Each course gets a consistent color across all assignments and blocks
 */
export const COURSE_COLORS: Record<string, string> = {
    "Physics 201": "#3b82f6",           // Blue
    "Calculus III": "#8b5cf6",          // Purple
    "Engineering Dynamics": "#ec4899",  // Pink
    "Computer Science 101": "#10b981",  // Green
    "History of Technology": "#f59e0b", // Amber
};

// =================================
// Fixed Events
// =================================

/**
 * Class schedule configuration
 * Days: 0 = Monday, 1 = Tuesday etc
 */
export const CLASS_SCHEDULE = [
    {
    title: "Physics 201 Lecture",
    days: [0, 2, 4], // Monday, Wednesday, Friday
    startHour: 9,
    startMinute: 0,
    durationMinutes: 90, // 1.5 hours
    category: EventCategory.CLASS,
  },
  {
    title: "Calculus III",
    days: [1, 3], // Tuesday, Thursday
    startHour: 11,
    startMinute: 0,
    durationMinutes: 75,
    category: EventCategory.CLASS,
  },
  {
    title: "Engineering Dynamics",
    days: [0, 2, 4], // Monday, Wednesday, Friday
    startHour: 14,
    startMinute: 0,
    durationMinutes: 90,
    category: EventCategory.CLASS,
  },
  {
    title: "CS 101 Lab",
    days: [3], // Thursday
    startHour: 15,
    startMinute: 30,
    durationMinutes: 120, // 2 hours
    category: EventCategory.CLASS,
  },
] as const;

/**
 * Work shift configuration
 */

export const WORK_SCHEDULE = [
    {
        title: "Campus IT Help Desk",
        days: [1,3], //Tuesday Thursday
        startHour: 18,
        startMinute: 0,
        durationMinutes: 120, //2 hours (6pm - 8pm)
        category: EventCategory.WORK,
    },
] as const;

/**
 * Personal/recurring event configuration
 */
export const PERSONAL_EVENTS = [
  {
    title: "Gym",
    days: [0, 2, 4], // Monday, Wednesday, Friday
    startHour: 17,
    startMinute: 0,
    durationMinutes: 60,
    category: EventCategory.EVENT,
  },
  {
    title: "Study Group - Calc",
    days: [6], // Sunday
    startHour: 14,
    startMinute: 0,
    durationMinutes: 120,
    category: EventCategory.EVENT,
  },
] as const;

/**
 * Sleep schedule (same every day)
 */
export const SLEEP_SCHEDULE = {
    title: "Sleep",
    startHour: 23,
    startMinute: 0,
    durationMinutes: 480,
    category: EventCategory.SLEEP,
} as const;


// =================================
// Assignment Templates
// =================================

/**
 * Assignment types with typical durations
 * These are used to generate realistic assignments
 */
export const ASSIGNMENT_TEMPLATES = [
    {
        type: "Problem Set",
        courses: ["Physics 201", "Calculus III"],
        durationRange: [90, 150] // 1.5 to 2.5 hours
    },
    {
        type:"Lab Report",
        courses: ["Physics 201", "Engineering Dynamics"],
        durationRange: [120,240],
    },
    {
        type: "Programming Assignment",
        courses: ["Computer Science 101"],
        durationRange: [120, 180],
    },
    {
        type: "Essay",
        courses: ["History of Technology"],
        durationRange: [120,180],
    },
    {
        type: "Reading",
        courses: ["History of Technology", "Engineering Dynamics"],
        durationRange: [45,90],
    },
    {
        type: "Quiz Prep",
        courses: ["Calculus III", "Physics 201"],
        durationRange: [60,90],
    },
] as const;


// =================================
// Scheduling Preferences
// =================================

/**
 * Preferred study times
 * Study blocks will be scheduled during these times when possible
 */
export const PREFERRED_STUDY_HOURS = {
    morning: [8,9,10,11],
    afternoon: [13,14,15,16],
    evening: [19,20,21],
};

/**
 * Buffer time in minutes before due date
 * Study blocks will be scheduled at least this many minutes before the assignment is due
 */
export const DUE_DATE_BUFFER_MINUTES = 60;

/**
 * Maximum study block duration in minutes
 * Long assignments will be split into multiple blocks of this length
 */
export const MAX_BLOCK_DURATION_MINUTES = 120;

/**
 * Minimum study block duration in minutes
 */
export const MIN_BLOCK_DURATION_MINUTES = 30;


// =================================
// Assignment Generation Config
// =================================

/**
 * Configuration for generating assignments across a week
 * This determines how many and what type of assignments to create
 */
export const WEEKLY_ASSIGNMENTS_CONFIG = {
    totalAssignments: 6,

    //Distribution of due dates across week
    //Key: day offset from week start
    //Value: number of assignments due that day
    dueDateDistribution:{
        2:1,
        3:2,
        4:1,
        6:2,
    },

    //Common due times
    dueTimes: [8,12,17,23],
} as const;