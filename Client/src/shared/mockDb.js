// Stateful Mock Database for offline/standalone execution mode
export const mockDb = {
  users: [
    {
      _id: 'usr_pat1',
      userId: 'usr_pat1',
      role: 'patient',
      name: 'Alex Johnson',
      phoneNumber: '+919876543213',
      email: 'alex.j@example.com',
      isPhoneVerified: true,
      isActive: true,
    },
    {
      _id: 'usr_ther1',
      userId: 'usr_ther1',
      role: 'therapist',
      name: 'Dr. Ananya Iyer',
      phoneNumber: '+919876543211',
      email: 'ananya.iyer@onemedical.com',
      isPhoneVerified: true,
      isActive: true,
    },
    {
      _id: 'usr_ther2',
      userId: 'usr_ther2',
      role: 'therapist',
      name: 'Dr. Arjun Mehta',
      phoneNumber: '+919876543212',
      email: 'arjun.mehta@onemedical.com',
      isPhoneVerified: true,
      isActive: true,
    }
  ],
  
  therapists: [
    {
      _id: 'ther_prof1',
      userId: 'usr_ther1',
      name: 'Dr. Ananya Iyer',
      specializations: ['Sports Injury', 'ACL Rehabilitation', 'Knee Joint Recovery'],
      qualifications: ['BPT', 'MPT (Sports Ortho)', 'CSCS Certified'],
      experienceYears: 8,
      languages: ['English', 'Hindi', 'Spanish'],
      bio: 'Specialist in sports injury rehabilitation, ACL post-op recovery, and joint mobility programs.',
      clinicName: 'One Medical Downtown Hub',
      consultationFee: 120000,
      ratingAvg: 4.9,
      ratingCount: 42,
      isVerified: true
    },
    {
      _id: 'ther_prof2',
      userId: 'usr_ther2',
      name: 'Dr. Arjun Mehta',
      specializations: ['Spine & Lumbar Rehab', 'Post-Surgical Recovery', 'Shoulder Instability'],
      qualifications: ['BPT', 'MPT (Neurology)'],
      experienceYears: 12,
      languages: ['English', 'Hindi'],
      bio: 'Dedicated to helping patients regain functional lumbar mobility and spinal decompression.',
      clinicName: 'One Medical HQ Road',
      consultationFee: 150000,
      ratingAvg: 4.9,
      ratingCount: 38,
      isVerified: true
    }
  ],
  
  appointments: [
    {
      _id: 'appt_1',
      appointmentId: 'appt_1',
      patientId: 'usr_pat1',
      therapistId: 'usr_ther1',
      therapistName: 'Dr. Ananya Iyer',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:30',
      endTime: '11:15',
      serviceType: 'ACL Rehabilitation Review',
      status: 'confirmed',
      paymentStatus: 'paid'
    }
  ],

  programs: [
    {
      _id: 'prog_1',
      title: 'ACL Reconstruction Rehabilitation (Phase 1)',
      description: 'Focuses on patellar mobilization and restoring full knee extension.',
      durationWeeks: 4,
      recoveryScore: 82,
      exercises: [
        { name: 'Straight Leg Raise (SLR)', sets: 3, reps: 10 },
        { name: 'Quad Setting / Iso Quad', sets: 3, reps: 15 }
      ]
    }
  ],

  activePrograms: {
    'usr_pat1': {
      _id: 'pat_prog_1',
      patientId: 'usr_pat1',
      programId: 'prog_1',
      startDate: new Date().toISOString(),
      status: 'active',
      recoveryScore: 78,
      adherencePercent: 85,
      painTrendScore: 70,
      milestoneScore: 80,
      patientGoals: 'Restore full knee mobility & quad strength',
      exerciseOverrides: [
        { _id: 'ex1', name: 'Hamstring Stretch', sets: 3, reps: 10, durationSec: 30, category: 'Legs & Mobility' },
        { _id: 'ex2', name: 'Pelvic Tilts', sets: 3, reps: 15, durationSec: 45, category: 'Core & Lumbar' },
        { _id: 'ex3', name: 'Cat-Cow Stretch', sets: 4, reps: 12, durationSec: 60, category: 'Spine Flexibility' },
      ],
      milestones: [
        { title: 'Full Knee Extension (0°)', achieved: true },
        { title: 'Adherence threshold >75%', achieved: true }
      ]
    }
  },

  sessionLogs: []
};

export default mockDb;
