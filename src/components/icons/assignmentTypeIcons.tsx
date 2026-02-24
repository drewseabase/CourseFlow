/**
 * AssignmentTypeIcon
 *
 * Inline SVG icons for each Canvas assignment type.
 * Follows the same inline SVG pattern used throughout the project.
 * Pass a `type` string matching the keys from transformers.ts.
 */
import React from "react";

interface AssignmentTypeIconProps {
  type: string;
  className?: string;
}

const ProblemSetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <line x1="8" y1="8" x2="16" y2="8" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round" />
    <line x1="8" y1="16" x2="12" y2="16" strokeLinecap="round" />
  </svg>
);

const LabReportIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 3h6v7l3.5 9H5.5L9 10V3z" strokeLinejoin="round" />
    <line x1="9" y1="3" x2="15" y2="3" strokeLinecap="round" />
    <circle cx="10" cy="15" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="17" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const ProgrammingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="16 6 22 12 16 18" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="14" y1="4" x2="10" y2="20" strokeLinecap="round" />
  </svg>
);

const EssayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 20h-7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5" strokeLinecap="round" />
    <path d="M14 18l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="8" y1="9" x2="16" y2="9" strokeLinecap="round" />
    <line x1="8" y1="13" x2="12" y2="13" strokeLinecap="round" />
  </svg>
);

const ReadingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z" strokeLinejoin="round" />
    <path d="M12 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1V6z" strokeLinejoin="round" />
  </svg>
);

const QuizIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-3 2.5-3 4.5" strokeLinecap="round" />
    <circle cx="12" cy="17.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const DiscussionIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinejoin="round" />
  </svg>
);

const MediaIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
  </svg>
);

const DefaultAssignmentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <line x1="8" y1="8" x2="16" y2="8" strokeLinecap="round" />
    <line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round" />
    <line x1="8" y1="16" x2="11" y2="16" strokeLinecap="round" />
  </svg>
);

const iconMap: Record<string, React.FC<{className?: string}>> = {
  'Problem Set': ProblemSetIcon,
  'Lab Report': LabReportIcon,
  'Programming Assignment': ProgrammingIcon,
  'Essay': EssayIcon,
  'Reading': ReadingIcon,
  'Quiz Prep': QuizIcon,
  'Discussion': DiscussionIcon,
  'Media': MediaIcon,
  'Assignment': DefaultAssignmentIcon,
};

export default function AssignmentTypeIcon({ type, className = 'w-3.5 h-3.5' }: AssignmentTypeIconProps) {
  const Icon = iconMap[type] ?? DefaultAssignmentIcon;
  return <Icon className={className} />;
}