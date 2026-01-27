// Standalone test for Timetable Logic (Mocking DB)

const mockPrograms = [{ _id: 'p1', name: 'B.Sc. CS', semesters: [1, 2] }];
const mockCourses = [
    { _id: 'c1', code: 'CS101', title: 'Intro to Programming', credits: 4, type: 'Theory', program: 'p1', semester: 1 },
    { _id: 'c2', code: 'CS102', title: 'Digital Logic', credits: 4, type: 'Theory', program: 'p1', semester: 1 },
    { _id: 'c3', code: 'CS103', title: 'Maths I', credits: 4, type: 'Theory', program: 'p1', semester: 1 },
    { _id: 'c4', code: 'CS104', title: 'Physics', credits: 4, type: 'Theory', program: 'p1', semester: 1 },
    { _id: 'c5', code: 'CS105', title: 'Lab I', credits: 2, type: 'Practical', program: 'p1', semester: 1 },
];
const mockFaculty = [
    { _id: 'f1', name: 'Dr. Smith', expertise: ['CS101', 'CS105'] },
    { _id: 'f2', name: 'Prof. Johnson', expertise: ['CS102'] },
    { _id: 'f3', name: 'Dr. Brown', expertise: ['CS103'] },
    { _id: 'f4', name: 'Dr. White', expertise: ['CS104'] },
];
const mockRooms = [
    { _id: 'r1', name: 'Room 101', type: 'Classroom' },
    { _id: 'r2', name: 'Lab A', type: 'Lab' },
];

const generateSchedule = () => {
    console.log('Generating Timetable for B.Sc. CS - Semester 1...');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = [1, 2, 3, 4, 5, 6, 7, 8];
    let schedule = [];

    for (const day of days) {
        let dailySchedule = { day, periods: [] };
        console.log(`\nProcessing ${day}:`);

        for (const period of periods) {
            // Simple Round Robin for demo
            const course = mockCourses[(period - 1) % mockCourses.length];

            // Simple Faculty Matching (Mock)
            const faculty = mockFaculty.find(f => f.expertise.includes(course.code)) || mockFaculty[0];

            // Simple Room Matching
            const room = course.type === 'Practical' ? mockRooms[1] : mockRooms[0];

            dailySchedule.periods.push({
                period,
                course: course.code,
                faculty: faculty.name,
                room: room.name,
                type: course.type
            });

            console.log(`  Period ${period}: ${course.code} (${course.type}) - ${faculty.name} - ${room.name}`);
        }
        schedule.push(dailySchedule);
    }

    return schedule;
};

generateSchedule();
