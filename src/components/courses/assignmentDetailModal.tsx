/**
 * AssignmentDetailModal Component
 * 
 * Displays detailed information about an assignment including:
 * - Assignment title and course
 * - Due date and estimated time
 * - Description (generated based on type)
 * - Submission requirements (fake bullet points)
 * - Attachments (fake file names)
 * - Mark as Complete button
 * 
 * Matches EventModal styling with blurred backdrop and scroll lock.
 */

'use client';

import { useEffect } from 'react';
import { Assignment } from './upcomingAssignments';
import { getCourseGradient } from '@/lib/mock/coursedata';

interface AssignmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onMarkComplete: (assignmentId: string) => void;
}

/**
 * Generate fake description based on assignment type
 */
function generateDescription(type: string, title: string): string {
  const descriptions: Record<string, string> = {
    'Problem Set': `Complete the ${title.toLowerCase()} covering the concepts discussed in this week's lectures. Show all work and explain your reasoning for each problem. Pay special attention to units and significant figures in your calculations.`,
    'Lab Report': `Write a comprehensive lab report for the ${title.toLowerCase()}. Include an introduction, methodology, results with data tables and graphs, discussion of findings, and conclusion. Follow the standard lab report format provided in the course syllabus.`,
    'Programming Assignment': `Implement the ${title.toLowerCase()} using the programming concepts covered in class. Your code should be well-commented, follow proper naming conventions, and include test cases. Submit both your source code and a README file explaining your approach.`,
    'Essay': `Write an analytical essay on the topic of ${title.toLowerCase()}. Your essay should be 1500-2000 words, include a clear thesis statement, supporting evidence from course materials, and proper citations in MLA format.`,
    'Reading': `Complete the assigned ${title.toLowerCase()} and take notes on key concepts. Be prepared to discuss the main ideas in class. Focus on understanding how this material connects to previous topics we've covered.`,
    'Quiz Prep': `Review the materials for ${title.toLowerCase()}. The quiz will cover chapters from the textbook and lecture notes. Practice problems are available in the course portal.`,
  };
  
  return descriptions[type] || `Complete the ${title.toLowerCase()} as assigned. Refer to the course materials for detailed instructions.`;
}

/**
 * Generate fake submission requirements based on assignment type
 */
function generateRequirements(type: string): string[] {
  const requirements: Record<string, string[]> = {
    'Problem Set': [
      'Submit solutions as a single PDF file',
      'Show all work and calculations',
      'Include your name and student ID on the first page',
    ],
    'Lab Report': [
      'Use the lab report template provided',
      'Include all required sections (Introduction, Methods, Results, Discussion)',
      'Submit graphs and data tables as appendices',
    ],
    'Programming Assignment': [
      'Submit source code as a ZIP file',
      'Include a README with setup instructions',
      'Ensure code compiles and runs without errors',
    ],
    'Essay': [
      'Submit as a Word document or PDF',
      'Use 12pt Times New Roman font, double-spaced',
      'Include a bibliography with at least 3 academic sources',
    ],
    'Reading': [
      'Complete reading before next class session',
      'Submit reading notes via the course portal',
      'Prepare at least 2 discussion questions',
    ],
    'Quiz Prep': [
      'Review all lecture slides and notes',
      'Complete practice problems',
      'Attend optional review session on Thursday',
    ],
  };
  
  return requirements[type] || [
    'Follow instructions provided in class',
    'Submit on time via the course portal',
    'Contact instructor with any questions',
  ];
}

/**
 * Generate fake attachment file names based on assignment type
 */
function generateAttachments(type: string): string[] {
  const attachments: Record<string, string[]> = {
    'Problem Set': ['problem_set_template.pdf', 'formula_sheet.pdf'],
    'Lab Report': ['lab_report_template.docx', 'data_collection_sheet.xlsx'],
    'Programming Assignment': ['starter_code.zip', 'test_cases.txt'],
    'Essay': ['essay_rubric.pdf', 'citation_guide.pdf'],
    'Reading': ['chapter_outline.pdf'],
    'Quiz Prep': ['practice_quiz.pdf', 'study_guide.pdf'],
  };
  
  return attachments[type] || ['assignment_details.pdf'];
}

export default function AssignmentDetailModal({
  isOpen,
  onClose,
  assignment,
  onMarkComplete,
}: AssignmentDetailModalProps) {

  /**
   * Lock body scroll when modal is open
   */
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Don't render if not open or no assignment
  if (!isOpen || !assignment) return null;
  
  // Generate content
  const description = generateDescription(assignment.type, assignment.title);
  const requirements = generateRequirements(assignment.type);
  const attachments = generateAttachments(assignment.type);
  const gradient = getCourseGradient(assignment.course || '');
  
  /**
   * Handle mark as complete
   */
  const handleMarkComplete = () => {
    onMarkComplete(assignment.id.toString());
    onClose();
  };
  
  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] max-w-2xl w-full max-h-[85vh] overflow-hidden pointer-events-auto transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E4E4E7] flex justify-between items-start">
            <div className="flex-1 pr-4">
              {/* Course Badge */}
              <div className="inline-block px-3 py-1 rounded-lg bg-opacity-10 mb-3" style={{ backgroundColor: `${gradient.split(' ')[0]}20` }}>
                <span className="text-[12px] font-bold uppercase tracking-wide text-[#8B5CF6]">
                  {assignment.course}
                </span>
              </div>
              
              <h2 className="text-[22px] font-bold text-[#18181B] leading-tight">
                {assignment.title}
              </h2>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-[10px] bg-[#FAFAFA] hover:bg-[#E4E4E7] transition-all duration-200 flex items-center justify-center text-[#52525B] hover:text-[#18181B] text-xl font-bold shrink-0"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          
          {/* Body - Scrollable Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
            {/* Quick Info */}
            <div className="flex gap-6 mb-6 pb-6 border-b border-[#E4E4E7]">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#A1A1AA] mb-1">Due Date</div>
                <div className="text-[15px] font-semibold text-[#18181B]">{assignment.dueDate}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#A1A1AA] mb-1">Estimated Time</div>
                <div className="text-[15px] font-semibold text-[#18181B]">{assignment.duration}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-[#A1A1AA] mb-1">Type</div>
                <div className="text-[15px] font-semibold text-[#18181B]">{assignment.type}</div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-[#18181B] mb-3">Description</h3>
              <p className="text-[14px] text-[#52525B] leading-relaxed">
                {description}
              </p>
            </div>
            
            {/* Submission Requirements */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-[#18181B] mb-3">Submission Requirements</h3>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex gap-3 text-[14px] text-[#52525B]">
                    <span className="text-[#8B5CF6] shrink-0">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Attachments */}
            <div>
              <h3 className="text-[16px] font-bold text-[#18181B] mb-3">Attachments</h3>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] transition-colors duration-200 cursor-pointer"
                  >
                    <span className="text-[20px]">📎</span>
                    <span className="text-[14px] font-medium text-[#18181B]">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer - Mark Complete Button */}
          <div className="p-6 border-t border-[#E4E4E7]">
            <button
              onClick={handleMarkComplete}
              className={`w-full py-3 px-6 rounded-xl bg-linear-to-r ${gradient} text-white font-semibold text-[14px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}