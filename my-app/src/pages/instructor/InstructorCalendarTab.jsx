// Calendar Tab for Instructor Dashboard
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import LectureCalendar from '../../components/LectureCalendar';

const InstructorCalendarTab = () => {
    const { lectures, courses, instructors, getInstructorLectures } = useData();
    const { currentUser } = useAuth();

    // Get only this instructor's lectures
    const myLectures = getInstructorLectures(currentUser?.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    My Calendar
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    View your lecture schedule in calendar format
                </p>
            </div>

            <LectureCalendar
                lectures={myLectures}
                courses={courses}
                instructors={instructors}
                title="My Lecture Schedule"
            />
        </div>
    );
};

export default InstructorCalendarTab;
