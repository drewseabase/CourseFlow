import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/crypto';
import { fetchCourses } from './courses';
import { fetchAssignments } from './assignments';
import { fetchAnnouncements } from './announcements';

// Gradient classes to cycle through for course card coloring
const GRADIENT_CLASSES = [
  'gradient-blue',
  'gradient-purple',
  'gradient-green',
  'gradient-orange',
  'gradient-pink',
  'gradient-teal',
];

/**
 * Full Canvas sync for a user
 * Decrypts token → fetches all data → upserts into DB → updates lastSyncedAt
 */
export async function syncCanvasData(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Get the user's Canvas integration and decrypt their token
    const integration = await prisma.canvasIntegration.findUnique({
      where: { userId },
    });

    if (!integration) {
      return { success: false, error: 'No Canvas integration found for this user' };
    }

    const token = decrypt(integration.encryptedAccessToken, integration.tokenIv);
    const config = { baseUrl: integration.canvasBaseUrl, token };

    // 2. Fetch courses
    const canvasCourses = await fetchCourses(config);

    // 3. Upsert courses into DB
    const upsertedCourses = await Promise.all(
      canvasCourses.map((course, index) =>
        prisma.course.upsert({
          where: {
            userId_canvasId: {
              userId,
              canvasId: String(course.id),
            },
          },
          update: {
            name: course.name,
            code: course.course_code,
            term: course.term?.name ?? null,
            instructorName: course.teachers?.[0]?.display_name ?? null,
            enrollmentType: course.enrollments?.[0]?.type ?? 'student',
            updatedAt: new Date(),
          },
          create: {
            userId,
            canvasId: String(course.id),
            name: course.name,
            code: course.course_code,
            term: course.term?.name ?? null,
            instructorName: course.teachers?.[0]?.display_name ?? null,
            enrollmentType: course.enrollments?.[0]?.type ?? 'student',
            // Assign gradient class based on position, cycling if more than 6 courses
            gradientClass: GRADIENT_CLASSES[index % GRADIENT_CLASSES.length],
          },
        })
      )
    );

    // 4. Fetch and upsert assignments for each course
    await Promise.all(
      canvasCourses.map(async (course) => {
        const assignments = await fetchAssignments(config, course.id);

        await Promise.all(
          assignments.map(assignment =>
            prisma.assignment.upsert({
              where: {
                userId_canvasId: {
                  userId,
                  canvasId: String(assignment.id),
                },
              },
              update: {
                title: assignment.name,
                description: assignment.description,
                dueAt: assignment.due_at ? new Date(assignment.due_at) : null,
                pointsPossible: assignment.points_possible,
                submissionTypes: assignment.submission_types,
                updatedAt: new Date(),
              },
              create: {
                userId,
                canvasId: String(assignment.id),
                courseId: upsertedCourses.find(c => c.canvasId === String(course.id))!.id,
                title: assignment.name,
                description: assignment.description,
                dueAt: assignment.due_at ? new Date(assignment.due_at) : null,
                pointsPossible: assignment.points_possible,
                submissionTypes: assignment.submission_types,
                assignmentType: assignment.grading_type,
                isCompleted: false,
              },
            })
          )
        );
      })
    );

    // 5. Fetch and upsert announcements
    const courseIds = canvasCourses.map(c => c.id);
    const announcements = await fetchAnnouncements(config, courseIds);

    await Promise.all(
      announcements.map(announcement => {
        // Extract course ID from context_code e.g. "course_12345" → "12345"
        const canvasCourseId = announcement.context_code.replace('course_', '');
        const dbCourse = upsertedCourses.find(c => c.canvasId === canvasCourseId);
        if (!dbCourse) return Promise.resolve();

        return prisma.announcement.upsert({
          where: {
            userId_canvasId: {
              userId,
              canvasId: String(announcement.id),
            },
          },
          update: {
            title: announcement.title,
            message: announcement.message,
          },
          create: {
            userId,
            canvasId: String(announcement.id),
            courseId: dbCourse.id,
            title: announcement.title,
            message: announcement.message,
            postedAt: new Date(announcement.posted_at),
          },
        });
      })
    );

    // 6. Update lastSyncedAt
    await prisma.canvasIntegration.update({
      where: { userId },
      data: { lastSyncedAt: new Date() },
    });

    return { success: true };

  } catch (error) {
    console.error('Canvas sync failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown sync error',
    };
  }
}