import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import StudentForm from '@/components/StudentForm';
import StudentTable from '@/components/StudentTable';
import { getSchools, getStudentsBySection } from '@/lib/storage';
import { exportToExcel } from '@/lib/export';
import { School, Student, Grade, Section } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Download, Users, FileSpreadsheet, BookOpen, GraduationCap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SectionView = () => {
  const { schoolId, sectionId } = useParams<{ schoolId: string; sectionId: string }>();
  const [school, setSchool] = useState<School | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  const loadData = () => {
    const schools = getSchools();
    const foundSchool = schools.find(s => s.id === schoolId);
    
    if (foundSchool) {
      setSchool(foundSchool);
      
      for (const g of foundSchool.grades) {
        const foundSection = g.sections.find(s => s.id === sectionId);
        if (foundSection) {
          setGrade(g);
          setSection(foundSection);
          break;
        }
      }
    }
    
    if (sectionId) {
      setStudents(getStudentsBySection(sectionId));
    }
  };

  useEffect(() => {
    loadData();
  }, [schoolId, sectionId]);

  const handleExport = () => {
    if (students.length === 0) {
      toast({
        title: 'Sin datos',
        description: 'No hay alumnos para exportar en esta sección',
        variant: 'destructive',
      });
      return;
    }

    const levelText = grade?.level === 'primaria' ? 'Primaria' : 'Secundaria';
    const fileName = `${school?.name}_${grade?.number}${levelText}_Seccion${section?.name}`;
    
    exportToExcel(students, fileName);
    
    toast({
      title: 'Archivo descargado',
      description: 'El archivo Excel ha sido descargado exitosamente',
    });
  };

  if (!school || !grade || !section) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Sección no encontrada
            </h2>
            <Link to="/colegios">
              <Button variant="outline">Volver a Colegios</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const levelText = grade.level === 'primaria' ? 'Primaria' : 'Secundaria';
  const LevelIcon = grade.level === 'primaria' ? BookOpen : GraduationCap;
  const levelColor = grade.level === 'primaria' ? 'text-success' : 'text-info';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          to={`/colegios/${school.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a {school.name}
        </Link>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-primary/10`}>
                <LevelIcon className={`h-6 w-6 ${levelColor}`} />
              </div>
              {grade.number}° {levelText} - Sección {section.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="outline">{school.name}</Badge>
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                {students.length} alumno{students.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleExport}
            className="gap-2"
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Descargar a Excel
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Student Form */}
        <div className="mb-8">
          <StudentForm
            sectionId={section.id}
            schoolId={school.id}
            onStudentCreated={loadData}
          />
        </div>

        {/* Students Table */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Lista de Alumnos
          </h2>
          <StudentTable students={students} onStudentUpdated={loadData} />
        </div>
      </main>
    </div>
  );
};

export default SectionView;
