import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  category: 'announcement' | 'event' | 'result' | 'notice' | 'achievement';
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  pinned?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  email: string;
  phone?: string;
  bio: string;
  imageUrl?: string;
  role: 'head_teacher' | 'teacher' | 'helper';
}

export interface StudentApplication {
  id: string;
  studentName: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  previousSchool?: string;
  classApplying: string;
  documents?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'Dr. Principal Rahman',
    subject: 'Administration & Leadership',
    qualification: 'PhD in Education, M.Ed',
    experience: '22 years',
    email: 'head@school.edu',
    phone: '+880 1700-000001',
    bio: 'Dr. Rahman leads our school with a vision of excellence and inclusive education. With over two decades in educational leadership, he has transformed the school into a beacon of academic achievement.',
    role: 'head_teacher',
  },
  {
    id: 't2',
    name: 'Mr. Karim Ahmed',
    subject: 'Mathematics',
    qualification: 'M.Sc in Applied Mathematics',
    experience: '12 years',
    email: 'karim@school.edu',
    phone: '+880 1700-000002',
    bio: 'Mr. Karim is an award-winning mathematics educator known for making complex topics approachable. His students consistently achieve top results in national examinations.',
    role: 'teacher',
  },
  {
    id: 't3',
    name: 'Ms. Fatima Noor',
    subject: 'English Language & Literature',
    qualification: 'M.A in English Literature, B.Ed',
    experience: '9 years',
    email: 'fatima@school.edu',
    phone: '+880 1700-000003',
    bio: 'Ms. Fatima brings literature to life through creative teaching methods. She runs the school\'s debate club and has published several educational resources.',
    role: 'teacher',
  },
  {
    id: 't4',
    name: 'Mr. Arif Hossain',
    subject: 'Science & Physics',
    qualification: 'M.Sc in Physics',
    experience: '8 years',
    email: 'arif@school.edu',
    phone: '+880 1700-000004',
    bio: 'Mr. Arif leads practical science classes with hands-on experiments. He established the school\'s first proper science laboratory.',
    role: 'teacher',
  },
  {
    id: 't5',
    name: 'Ms. Nadia Islam',
    subject: 'Bangladesh Studies & History',
    qualification: 'M.A in History',
    experience: '7 years',
    email: 'nadia@school.edu',
    phone: '+880 1700-000005',
    bio: 'Ms. Nadia has a passion for national heritage and instills cultural pride in her students through immersive storytelling and historical analysis.',
    role: 'teacher',
  },
  {
    id: 't6',
    name: 'Mr. Rahim Helper',
    subject: 'Office Administration',
    qualification: 'Bachelor in Business Administration',
    experience: '5 years',
    email: 'helper@school.edu',
    phone: '+880 1700-000006',
    bio: 'Mr. Rahim manages school records, student registrations, and administrative operations with efficiency and professionalism.',
    role: 'helper',
  },
];

const DEFAULT_NEWS: NewsPost[] = [
  {
    id: 'n1',
    title: 'Annual Science Fair 2026 — Registration Open!',
    content: 'We are thrilled to announce that registration for our Annual Science Fair is now open. Students from classes 6 to 10 are invited to participate with innovative projects. Winners will receive scholarships and certificates. Registration deadline: June 15, 2026.',
    category: 'event',
    authorId: '1',
    authorName: 'Dr. Principal Rahman',
    authorRole: 'Head Teacher',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    pinned: true,
  },
  {
    id: 'n2',
    title: 'SSC Results 2025 — Outstanding Achievement',
    content: 'We are proud to announce that 98% of our SSC batch 2025 passed with flying colors. 12 students achieved GPA 5.00 and 3 students ranked in the top 10 nationally. Congratulations to all students and their dedicated teachers!',
    category: 'result',
    authorId: '1',
    authorName: 'Dr. Principal Rahman',
    authorRole: 'Head Teacher',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    pinned: false,
  },
  {
    id: 'n3',
    title: 'New Library Books Available',
    content: 'The school library has received over 500 new books covering science, literature, mathematics, and technology. Students are encouraged to visit and explore. Library hours: Sunday to Thursday, 8am–4pm.',
    category: 'announcement',
    authorId: '2',
    authorName: 'Mr. Karim Ahmed',
    authorRole: 'Teacher',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'approved',
    pinned: false,
  },
];

interface DataContextType {
  news: NewsPost[];
  teachers: Teacher[];
  applications: StudentApplication[];
  addNews: (post: Omit<NewsPost, 'id' | 'createdAt'>) => void;
  updateNewsStatus: (id: string, status: NewsPost['status']) => void;
  deleteNews: (id: string) => void;
  togglePin: (id: string) => void;
  addApplication: (app: Omit<StudentApplication, 'id' | 'submittedAt'>) => void;
  updateApplicationStatus: (id: string, status: StudentApplication['status'], notes?: string) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  approvedNews: NewsPost[];
  pendingNews: NewsPost[];
}

const DataContext = createContext<DataContextType | null>(null);

function loadData<T>(key: string, defaults: T): T {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaults;
}

function saveData<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsPost[]>(() => loadData('school_news', DEFAULT_NEWS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadData('school_teachers', DEFAULT_TEACHERS));
  const [applications, setApplications] = useState<StudentApplication[]>(() => loadData('school_applications', []));

  useEffect(() => { saveData('school_news', news); }, [news]);
  useEffect(() => { saveData('school_teachers', teachers); }, [teachers]);
  useEffect(() => { saveData('school_applications', applications); }, [applications]);

  function addNews(post: Omit<NewsPost, 'id' | 'createdAt'>) {
    const newPost: NewsPost = { ...post, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setNews(prev => [newPost, ...prev]);
  }

  function updateNewsStatus(id: string, status: NewsPost['status']) {
    setNews(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }

  function deleteNews(id: string) {
    setNews(prev => prev.filter(p => p.id !== id));
  }

  function togglePin(id: string) {
    setNews(prev => prev.map(p => p.id === id ? { ...p, pinned: !p.pinned } : p));
  }

  function addApplication(app: Omit<StudentApplication, 'id' | 'submittedAt'>) {
    const newApp: StudentApplication = { ...app, id: Date.now().toString(), submittedAt: new Date().toISOString() };
    setApplications(prev => [newApp, ...prev]);
  }

  function updateApplicationStatus(id: string, status: StudentApplication['status'], notes?: string) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status, notes: notes || a.notes } : a));
  }

  function addTeacher(teacher: Teacher) {
    setTeachers(prev => [...prev, teacher]);
  }

  function updateTeacher(id: string, updates: Partial<Teacher>) {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }

  function deleteTeacher(id: string) {
    setTeachers(prev => prev.filter(t => t.id !== id));
  }

  const approvedNews = news.filter(p => p.status === 'approved').sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pendingNews = news.filter(p => p.status === 'pending');

  return (
    <DataContext.Provider value={{
      news, teachers, applications,
      addNews, updateNewsStatus, deleteNews, togglePin,
      addApplication, updateApplicationStatus,
      addTeacher, updateTeacher, deleteTeacher,
      approvedNews, pendingNews,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
