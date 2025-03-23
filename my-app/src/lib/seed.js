import { User, Project, Task, Feedback, HoursLog } from '@/config/schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Feedback.deleteMany({});
    await HoursLog.deleteMany({});

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create NGO
    const ngo = await User.create({
      name: 'Green Earth NGO',
      email: 'green@earth.org',
      password: hashedPassword,
      role: 'NGO',
      status: 'Active',
      organization: {
        name: 'Green Earth NGO',
        website: 'www.greenearth.org',
        verificationStatus: 'Verified',
        type: 'NGO',
        registrationNumber: 'NGO123456'
      }
    });

    // Create Government Organization
    const govt = await User.create({
      name: 'City Environmental Department',
      email: 'env@citygovt.com',
      password: hashedPassword,
      role: 'Government',
      status: 'Active',
      organization: {
        name: 'City Environmental Department',
        website: 'www.citygovt.com/env',
        verificationStatus: 'Verified',
        type: 'Government',
        department: 'Environmental Protection'
      }
    });

    // Create Volunteers
    const volunteers = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'Volunteer',
        status: 'Active',
        skills: ['Teaching', 'Gardening'],
        interests: ['Environment', 'Education'],
        totalHours: 25,
        completedTasks: 5
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'Volunteer',
        status: 'Active',
        skills: ['First Aid', 'Social Media'],
        interests: ['Healthcare', 'Community'],
        totalHours: 15,
        completedTasks: 3
      }
    ]);

    // Create Projects
    const projects = await Project.create([
      {
        title: 'City Park Cleanup',
        description: 'Monthly cleanup drive at Central City Park',
        organization: ngo._id,
        status: 'Ongoing',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: {
          address: 'Central City Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        category: 'Environment',
        requiredVolunteers: 10,
        assignedVolunteers: [
          {
            volunteer: volunteers[0]._id,
            status: 'Active'
          }
        ]
      },
      {
        title: 'Digital Literacy Program',
        description: 'Teaching basic computer skills to senior citizens',
        organization: govt._id,
        status: 'Ongoing',
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        location: {
          address: 'Community Center',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002'
        },
        category: 'Education',
        requiredVolunteers: 5,
        assignedVolunteers: [
          {
            volunteer: volunteers[1]._id,
            status: 'Active'
          }
        ]
      }
    ]);

    // Create Tasks
    const tasks = await Task.create([
      {
        project: projects[0]._id,
        title: 'Coordinate Waste Segregation',
        description: 'Organize and supervise waste segregation activities',
        status: 'In Progress',
        priority: 'High',
        assignedTo: volunteers[0]._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        hoursLogged: 5
      },
      {
        project: projects[1]._id,
        title: 'Basic Computer Skills Workshop',
        description: 'Conduct workshop on basic computer operations',
        status: 'Open',
        priority: 'Medium',
        assignedTo: volunteers[1]._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        hoursLogged: 3
      }
    ]);

    // Create Feedback
    await Feedback.create([
      {
        from: volunteers[0]._id,
        to: ngo._id,
        project: projects[0]._id,
        task: tasks[0]._id,
        type: 'Suggestion',
        subject: 'Improve Waste Collection',
        message: 'We should add more recycling bins in the park',
        status: 'Pending'
      },
      {
        from: volunteers[1]._id,
        to: govt._id,
        project: projects[1]._id,
        task: tasks[1]._id,
        type: 'Query',
        subject: 'Workshop Materials',
        message: 'Do we have printed handouts for the participants?',
        status: 'Resolved',
        response: {
          message: 'Yes, materials will be provided',
          respondedBy: govt._id,
          respondedAt: new Date()
        }
      }
    ]);

    // Create Hours Logs
    await HoursLog.create([
      {
        volunteer: volunteers[0]._id,
        task: tasks[0]._id,
        project: projects[0]._id,
        hours: 5,
        date: new Date(),
        description: 'Coordinated waste segregation activity',
        status: 'Approved',
        verifiedBy: ngo._id,
        verifiedAt: new Date()
      },
      {
        volunteer: volunteers[1]._id,
        task: tasks[1]._id,
        project: projects[1]._id,
        hours: 3,
        date: new Date(),
        description: 'Conducted computer basics workshop',
        status: 'Pending'
      }
    ]);

    console.log('Database seeded successfully!');
    return {
      ngo,
      govt,
      volunteers,
      projects,
      tasks
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 