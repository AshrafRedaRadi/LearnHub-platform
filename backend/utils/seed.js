const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

const MONGO_URI = 'mongodb://127.0.0.1:27017/course_platform';

// 🔧 Convert "MM:SS" → seconds
const durationToSeconds = (duration) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return (minutes * 60) + seconds;
};

// 🔧 Slug generator (unique)
const slugify = (text) =>
    text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

const generateSlug = (title) =>
    `${slugify(title)}-${Math.random().toString(36).substring(2, 6)}`;

const seedDatabase = async () => {
    let connection;
    try {
        connection = await mongoose.connect(MONGO_URI);
        console.log('🚀 Connected to MongoDB');

        // 🧹 Clear DB
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            Lesson.deleteMany({})
        ]);
        console.log('🧹 Database cleared');

        // 🔐 Password
        const hashedPassword = await bcrypt.hash('Password123!', 10);

        // 👨‍🏫 Instructors
        const instructorsData = [
            {
                name: 'Sarah Drasner',
                email: 'sarah@instructor.com',
                password: hashedPassword,
                role: 'instructor',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                bio: 'VP of Developer Experience at Netlify. Vue.js core team member.',
                title: 'Senior Staff Engineer',
                yearsOfExperience: 15
            },
            {
                name: 'Jonas Schmedtmann',
                email: 'jonas@instructor.com',
                password: hashedPassword,
                role: 'instructor',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
                bio: 'Top-rated instructor specializing in JavaScript & CSS architecture.',
                title: 'Full Stack Architect',
                yearsOfExperience: 10
            }
        ];

        // 👨‍🎓 Students
        const studentNames = [
            'Alex Rivera',
            'Sarah Chen',
            'Jordan Smith',
            'Elena Rodriguez',
            'Marcus Aurelius',
            'Zoe Jenkins'
        ];

        const studentsData = studentNames.map((name, i) => ({
            name,
            email: `student${i + 1}@example.com`,
            password: hashedPassword,
            role: 'student',
            avatar: `https://i.pravatar.cc/150?u=${i}`
        }));

        const instructors = await User.insertMany(instructorsData);
        const students = await User.insertMany(studentsData);

        console.log('👥 Users created');

        // 📚 Course templates
        const courseTemplates = [
            { title: 'Advanced React Patterns', category: 'Development', price: 89.99, level: 'advanced', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800' },
            { title: 'Node.js Microservices Architecture', category: 'Development', price: 94.99, level: 'advanced', img: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800' },
            { title: 'Fullstack Next.js Bootcamp', category: 'Development', price: 79.99, level: 'intermediate', img: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800' },

            { title: 'UI/UX Design Systems in Figma', category: 'Design', price: 54.99, level: 'intermediate', img: 'https://images.unsplash.com/photo-1581291518066-10499e46a74b?w=800' },
            { title: 'Advanced Web Animations (GSAP)', category: 'Design', price: 69.99, level: 'advanced', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800' },

            { title: 'Startup Business Strategy', category: 'Business', price: 99.99, level: 'advanced', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800' },
            { title: 'Agile Project Management', category: 'Business', price: 89.99, level: 'beginner', img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800' },

            { title: 'Digital Marketing Growth Hacks', category: 'Marketing', price: 49.99, level: 'beginner', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' },
            { title: 'SEO Mastery 2024', category: 'Marketing', price: 59.99, level: 'intermediate', img: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=800' },

            { title: 'Machine Learning with Python', category: 'Data Science', price: 109.99, level: 'advanced', img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800' },
            { title: 'Data Visualization with Tableau', category: 'Data Science', price: 74.99, level: 'beginner', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' }
        ];

        // 🎯 Shuffle courses (better featured logic)
        const shuffledCourses = [...courseTemplates].sort(() => 0.5 - Math.random());

        for (const [index, item] of shuffledCourses.entries()) {
            const instructor = instructors[index % instructors.length];

            const course = new Course({
                title: item.title,
                slug: generateSlug(item.title),
                description: `Professional ${item.category} course with real-world projects and hands-on training.`,
                price: item.price,
                category: item.category,
                level: item.level,
                rating: Number((Math.random() * (4.9 - 4.2) + 4.2).toFixed(1)),
                studentsCount: 0,
                image: item.img,
                instructor: instructor._id,
                isFeatured: index < 3,
                isTrending: index < 5,
                students: []
            });

            const savedCourse = await course.save();

            // 🎥 Lessons
            const lessonTitles = [
                'Introduction',
                'Core Concepts',
                'Hands-on Project',
                'Advanced Techniques',
                'Optimization',
                'Real-world Case Study'
            ];

            const lessons = Array.from({ length: 5 + Math.floor(Math.random() * 3) }).map((_, i) => ({
                title: `${lessonTitles[i % lessonTitles.length]} - ${item.category}`,
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                duration: durationToSeconds(`${Math.floor(Math.random() * 10) + 5}:00`),
                order: i + 1,
                isLocked: i !== 0,
                courseId: savedCourse._id
            }));

            await Lesson.insertMany(lessons);

            // 👨‍🎓 Enrollment (optimized)
            const selectedStudents = [...students]
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            await Promise.all([
                ...selectedStudents.map(student =>
                    User.findByIdAndUpdate(student._id, {
                        $push: {
                            enrolledCourses: {
                                courseId: savedCourse._id,
                                progress: Math.floor(Math.random() * 80)
                            }
                        }
                    })
                ),
                Course.findByIdAndUpdate(savedCourse._id, {
                    $addToSet: { students: { $each: selectedStudents.map(s => s._id) } },
                    $set: { studentsCount: selectedStudents.length }
                })
            ]);
        }

        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('🔥 Seed Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
        process.exit();
    }
};

seedDatabase();