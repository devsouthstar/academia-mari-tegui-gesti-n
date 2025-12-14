export interface Student {
  id: string;
  nombre: string;
  whatsapp: string;
  correo: string;
  sectionId: string;
  schoolId: string;
  createdAt: string;
}

export interface Section {
  id: string;
  name: string;
  gradeId: string;
}

export interface Grade {
  id: string;
  number: number;
  level: 'primaria' | 'secundaria';
  sections: Section[];
  schoolId: string;
}

export interface School {
  id: string;
  name: string;
  hasPrimaria: boolean;
  hasSecundaria: boolean;
  grades: Grade[];
  createdAt: string;
}

export type LevelType = 'primaria' | 'secundaria';
