import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Student, School } from '@/types';
import { getRecentStudents, getSchools } from '@/lib/storage';
import { Users, Clock, Mail, Phone, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const RecentStudentsCard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    const loadData = () => {
      setStudents(getRecentStudents(10));
      setSchools(getSchools());
    };
    
    loadData();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const getSchoolName = (schoolId: string): string => {
    const school = schools.find(s => s.id === schoolId);
    return school?.name || 'Colegio Desconocido';
  };

  const getSectionInfo = (student: Student): string => {
    const school = schools.find(s => s.id === student.schoolId);
    if (!school) return '';
    
    for (const grade of school.grades) {
      const section = grade.sections.find(s => s.id === student.sectionId);
      if (section) {
        const levelText = grade.level === 'primaria' ? 'Primaria' : 'Secundaria';
        return `${grade.number}° ${levelText} - ${section.name}`;
      }
    }
    return '';
  };

  if (students.length === 0) {
    return (
      <Card className="border-border/50 shadow-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Últimos Alumnos Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              No hay alumnos registrados aún
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Los nuevos registros aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-card animate-fade-in overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Últimos Alumnos Registrados
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            {students.length} recientes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {students.map((student, index) => (
            <div
              key={student.id}
              className="group flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {student.nombre.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground truncate">
                    {student.nombre}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {student.whatsapp}
                  </span>
                  {student.correo && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {student.correo}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-xs font-medium">
                  {getSchoolName(student.schoolId)}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(student.createdAt), { 
                    addSuffix: true,
                    locale: es 
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentStudentsCard;
