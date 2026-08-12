// Stateful Mock Database for offline/standalone execution mode
export const mockDb = {
  users: [
    {
      _id: 'usr_pat1',
      userId: 'usr_pat1',
      role: 'patient',
      name: 'John Doe',
      phoneNumber: '+919999999999',
      email: 'john.doe@example.com',
      isPhoneVerified: true,
      isActive: true,
    },
    {
      _id: 'usr_ther1',
      userId: 'usr_ther1',
      role: 'therapist',
      name: 'Dr. Jane Smith',
      phoneNumber: '+918888888888',
      email: 'jane.smith@onemedical.com',
      isPhoneVerified: true,
      isActive: true,
    }
  ],
  
  therapists: [
    {
      _id: 'ther_prof1',
      userId: 'usr_ther1',
      name: 'Dr. Jane Smith',
      specializations: ['Back Pain', 'Post-Op Knee', 'Shoulder Rotator Cuff'],
      qualifications: ['BPT', 'MPT (Sports Ortho)', 'COMT'],
      experienceYears: 8,
      languages: ['English', 'Hindi'],
      bio: 'Specialist in orthopaedic rehabilitation, spinal manipulation, and sports injury recovery programs.',
      clinicName: 'One Medical Indiranagar',
      consultationFee: 75000, // ₹750.00
      ratingAvg: 4.8,
      ratingCount: 34,
      isVerified: true
    },
    {
      _id: 'ther_prof2',
      userId: 'usr_ther2',
      name: 'Dr. Alan Walker',
      specializations: ['Neck Pain', 'Spine Injury', 'Neurological Rehab'],
      qualifications: ['BPT', 'MPT (Neuro)'],
      experienceYears: 6,
      languages: ['English', 'Spanish'],
      bio: 'Dedicated to helping patients regain functional mobility after stroke and complex spine surgeries.',
      clinicName: 'One Medical HSR Layout',
      consultationFee: 90000, // ₹900.00
      ratingAvg: 4.6,
      ratingCount: 22,
      isVerified: true
    }
  ],
  
  appointments: [
    {
      _id: 'appt_1',
      appointmentId: 'appt_1',
      patientId: 'usr_pat1',
      therapistId: 'usr_ther1',
      therapistName: 'Dr. Jane Smith',
      date: '2026-08-07',
      startTime: '10:00',
      endTime: '10:30',
      serviceType: 'Back Pain Consultation',
      status: 'confirmed',
      paymentStatus: 'paid'
    }
  ],
  
  activePrograms: {
    'usr_pat1': {
      _id: 'prog_p1',
      patientId: 'usr_pat1',
      assignedBy: 'usr_ther1',
      therapistName: 'Dr. Jane Smith',
      startDate: '2026-08-01',
      status: 'active',
      recoveryScore: 78,
      adherencePercent: 85,
      painTrendScore: 70,
      milestoneScore: 80,
      milestones: [
        { title: 'Reduce pain level below 5/10', achieved: true },
        { title: 'Gain 90 deg knee flexion', achieved: true },
        { title: 'Walk 500m pain-free', achieved: false }
      ],
      exerciseOverrides: [
        {
          exerciseId: 'ex1',
          name: 'Lumbar Extension Stretch',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stretching-exercises-in-nature-41582-large.mp4',
          sets: 3,
          reps: 10,
          durationSec: 30,
          notes: 'Keep core engaged and hold each extension for 5 seconds.'
        },
        {
          exerciseId: 'ex2',
          name: 'Knee-to-Chest Lumbar Flexion',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-stretching-exercises-on-mat-41584-large.mp4',
          sets: 3,
          reps: 12,
          durationSec: 20,
          notes: 'Gently pull knee towards chest. Stop if sharp pain occurs.'
        }
      ]
    }
  },
  
  sessionLogs: [
    {
      _id: 'log1',
      patientId: 'usr_pat1',
      patientProgramId: 'prog_p1',
      date: '2026-08-05',
      painLevel: 6,
      exercisesCompleted: [
        { exerciseId: 'ex1', setsDone: 3, repsDone: 10, completed: true }
      ]
    }
  ]
};
