import { School, Student, Grade, Section, LevelType } from '@/types';

const SCHOOLS_KEY = 'academia_schools';
const STUDENTS_KEY = 'academia_students';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Schools
export const getSchools = (): School[] => {
  const data = localStorage.getItem(SCHOOLS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSchools = (schools: School[]): void => {
  localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
};

export const createSchool = (name: string, hasPrimaria: boolean, hasSecundaria: boolean): School => {
  const grades: Grade[] = [];
  const schoolId = generateId();

  if (hasPrimaria) {
    for (let i = 1; i <= 6; i++) {
      grades.push({
        id: generateId(),
        number: i,
        level: 'primaria',
        sections: [{ id: generateId(), name: 'A', gradeId: '' }],
        schoolId,
      });
    }
  }

  if (hasSecundaria) {
    for (let i = 1; i <= 5; i++) {
      grades.push({
        id: generateId(),
        number: i,
        level: 'secundaria',
        sections: [{ id: generateId(), name: 'A', gradeId: '' }],
        schoolId,
      });
    }
  }

  // Update gradeId references
  grades.forEach(grade => {
    grade.sections.forEach(section => {
      section.gradeId = grade.id;
    });
  });

  const school: School = {
    id: schoolId,
    name,
    hasPrimaria,
    hasSecundaria,
    grades,
    createdAt: new Date().toISOString(),
  };

  const schools = getSchools();
  schools.push(school);
  saveSchools(schools);
  return school;
};

export const updateSchool = (updatedSchool: School): void => {
  const schools = getSchools();
  const index = schools.findIndex(s => s.id === updatedSchool.id);
  if (index !== -1) {
    schools[index] = updatedSchool;
    saveSchools(schools);
  }
};

export const deleteSchool = (schoolId: string): void => {
  const schools = getSchools().filter(s => s.id !== schoolId);
  saveSchools(schools);
  // Also delete all students from this school
  const students = getStudents().filter(s => s.schoolId !== schoolId);
  saveStudents(students);
};

export const addLevelToSchool = (schoolId: string, level: LevelType): void => {
  const schools = getSchools();
  const school = schools.find(s => s.id === schoolId);
  if (!school) return;

  if (level === 'primaria' && !school.hasPrimaria) {
    school.hasPrimaria = true;
    for (let i = 1; i <= 6; i++) {
      const gradeId = generateId();
      school.grades.push({
        id: gradeId,
        number: i,
        level: 'primaria',
        sections: [{ id: generateId(), name: 'A', gradeId }],
        schoolId,
      });
    }
  }

  if (level === 'secundaria' && !school.hasSecundaria) {
    school.hasSecundaria = true;
    for (let i = 1; i <= 5; i++) {
      const gradeId = generateId();
      school.grades.push({
        id: gradeId,
        number: i,
        level: 'secundaria',
        sections: [{ id: generateId(), name: 'A', gradeId }],
        schoolId,
      });
    }
  }

  saveSchools(schools);
};

export const removeLevelFromSchool = (schoolId: string, level: LevelType): void => {
  const schools = getSchools();
  const school = schools.find(s => s.id === schoolId);
  if (!school) return;

  if (level === 'primaria') {
    school.hasPrimaria = false;
    const gradesToRemove = school.grades.filter(g => g.level === 'primaria').map(g => g.id);
    school.grades = school.grades.filter(g => g.level !== 'primaria');
    // Remove students from these grades
    const students = getStudents().filter(s => {
      const grade = school.grades.find(g => g.sections.some(sec => sec.id === s.sectionId));
      return grade !== undefined;
    });
    saveStudents(students);
  }

  if (level === 'secundaria') {
    school.hasSecundaria = false;
    school.grades = school.grades.filter(g => g.level !== 'secundaria');
  }

  saveSchools(schools);
};

export const updateSectionsForGrade = (schoolId: string, gradeId: string, maxSection: string): void => {
  const schools = getSchools();
  const school = schools.find(s => s.id === schoolId);
  if (!school) return;

  const grade = school.grades.find(g => g.id === gradeId);
  if (!grade) return;

  const maxChar = maxSection.toUpperCase().charCodeAt(0);
  const newSections: Section[] = [];

  for (let i = 65; i <= maxChar; i++) {
    const sectionName = String.fromCharCode(i);
    const existingSection = grade.sections.find(s => s.name === sectionName);
    newSections.push(existingSection || { id: generateId(), name: sectionName, gradeId });
  }

  grade.sections = newSections;
  saveSchools(schools);
};

// Students
export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStudents = (students: Student[]): void => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

export const createStudent = (
  nombre: string,
  whatsapp: string,
  correo: string,
  sectionId: string,
  schoolId: string
): Student => {
  const student: Student = {
    id: generateId(),
    nombre,
    whatsapp,
    correo: correo || '',
    sectionId,
    schoolId,
    createdAt: new Date().toISOString(),
  };

  const students = getStudents();
  students.push(student);
  saveStudents(students);
  return student;
};

export const updateStudent = (updatedStudent: Student): void => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === updatedStudent.id);
  if (index !== -1) {
    students[index] = updatedStudent;
    saveStudents(students);
  }
};

export const deleteStudent = (studentId: string): void => {
  const students = getStudents().filter(s => s.id !== studentId);
  saveStudents(students);
};

export const getStudentsBySection = (sectionId: string): Student[] => {
  return getStudents().filter(s => s.sectionId === sectionId);
};

export const getRecentStudents = (limit: number = 10): Student[] => {
  return getStudents()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};
