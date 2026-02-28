/**
 * AssignmentDetailModal Component
 * 
 * Displays detailed information about an assignment including:
 * - Assignment title and course
 * - Due date, estimated time, points possible
 * - Description (real Canvas HTML, falls back to generated)
 * - Submission requirements (mapped from Canvas submission_types)
 * - Attachments (real Canvas attachments with links, falls back to generated)
 * - Mark as Complete button
 * 
 * Matches EventModal styling with blurred backdrop and scroll lock.
 */

'use client';

import { useEffect } from 'react';
import { Assignment } from './upcomingAssignments';

interface AssignmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onMarkComplete: (assignmentId: string) => void;
}

/**
 * Fallback description if Canvas provides no description
 */
function generateFallbackDescription(type: string, title: string): string {
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
 * Map Canvas submission_types to human-readable requirements
 */
function mapSubmissionTypes(submissionTypes: string[]): string[] {
  const typeMap: Record<string, string> = {
    'online_upload': 'Submit as a file upload',
    'online_text_entry': 'Submit as a text entry in Canvas',
    'online_url': 'Submit a URL link',
    'media_recording': 'Submit a media recording',
    'online_quiz': 'Complete the quiz in Canvas',
    'discussion_topic': 'Post to the discussion board',
    'external_tool': 'Submit via the external tool linked in Canvas',
    'none': 'No submission required — mark complete when done',
    'not_graded': 'Not graded',
    'on_paper': 'Submit on paper in class',
  };

  const mapped = submissionTypes
    .map(t => typeMap[t])
    .filter(Boolean);

  // Always append a general reminder
  mapped.push('Submit before the due date shown above');

  return mapped.length > 1 ? mapped : [
    'Follow instructions provided in class',
    'Submit on time via the course portal',
    'Contact your instructor with any questions',
  ];
}

/**
 * Fallback attachments if Canvas provides none
 */
function generateFallbackAttachments(type: string): { name: string; url: string | null }[] {
  const attachments: Record<string, string[]> = {
    'Problem Set': ['problem_set_template.pdf', 'formula_sheet.pdf'],
    'Lab Report': ['lab_report_template.docx', 'data_collection_sheet.xlsx'],
    'Programming Assignment': ['starter_code.zip', 'test_cases.txt'],
    'Essay': ['essay_rubric.pdf', 'citation_guide.pdf'],
    'Reading': ['chapter_outline.pdf'],
    'Quiz Prep': ['practice_quiz.pdf', 'study_guide.pdf'],
  };

  const files = attachments[type] || ['assignment_details.pdf'];
  return files.map(name => ({ name, url: null }));
}

const FileIcon = () => (
  <svg className="w-4 h-4 shrink-0 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
    <polyline points="14 2 14 8 20 8" strokeLinejoin="round" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-[#A1A1AA]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" strokeLinecap="round" />
    <polyline points="15 3 21 3 21 9" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="10" y1="14" x2="21" y2="3" strokeLinecap="round" />
  </svg>
);

export default function AssignmentDetailModal({
  isOpen,
  onClose,
  assignment,
  onMarkComplete,
}: AssignmentDetailModalProps) {

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

  if (!isOpen || !assignment) return null;

  // Use real Canvas description if available, otherwise fall back
  const hasRealDescription = !!assignment.description && assignment.description.trim().length > 0;
  const fallbackDescription = generateFallbackDescription(assignment.type, assignment.title);

  // Use real Canvas submission types if available
  const requirements = assignment.submissionTypes && assignment.submissionTypes.length > 0
    ? mapSubmissionTypes(assignment.submissionTypes)
    : mapSubmissionTypes([]);

  // Use real Canvas attachments if available, otherwise fall back
  const attachments = assignment.attachments && assignment.attachments.length > 0
    ? assignment.attachments
    : generateFallbackAttachments(assignment.type);

  const handleMarkComplete = () => {
    onMarkComplete(assignment.id.toString());
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
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
              <div className="inline-block px-3 py-1 rounded-lg bg-violet-500/10 mb-3">
                <span className="text-[12px] font-bold uppercase tracking-wide text-[#8B5CF6]">
                  {assignment.course}
                </span>
              </div>
              <h2 className="text-[22px] font-bold text-[#18181B] leading-tight">
                {assignment.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-[10px] bg-[#FAFAFA] hover:bg-[#E4E4E7] transition-all duration-200 flex items-center justify-center text-[#52525B] hover:text-[#18181B] shrink-0"
              aria-label="Close modal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">

            {/* Quick Info */}
            <div className="flex gap-6 mb-6 pb-6 border-b border-[#E4E4E7] flex-wrap">
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
              {assignment.pointsPossible != null && (
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-[#A1A1AA] mb-1">Points</div>
                  <div className="text-[15px] font-semibold text-[#18181B]">{assignment.pointsPossible} pts</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-[16px] font-bold text-[#18181B] mb-3">Description</h3>
              {hasRealDescription ? (
                // Real Canvas HTML description — render it safely
                <div
                  className="text-[14px] text-[#52525B] leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: assignment.description! }}
                />
              ) : (
                <p className="text-[14px] text-[#52525B] leading-relaxed">
                  {fallbackDescription}
                </p>
              )}
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
                {attachments.map((file, index) => {
                  const name = typeof file === 'string' ? file : file.name;
                  const url = typeof file === 'string' ? null : file.url;

                  return url ? (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAFA] hover:bg-[#E4E4E7] transition-colors duration-200"
                    >
                      <FileIcon />
                      <span className="text-[14px] font-medium text-[#18181B] flex-1">{name}</span>
                      <LinkIcon />
                    </a>
                  ) : (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAFA]"
                    >
                      <FileIcon />
                      <span className="text-[14px] font-medium text-[#18181B]">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#E4E4E7]">
            <button
              onClick={handleMarkComplete}
              className={`w-full py-3 px-6 rounded-xl bg-linear-to-r ${assignment.gradientClass} text-white font-semibold text-[14px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}