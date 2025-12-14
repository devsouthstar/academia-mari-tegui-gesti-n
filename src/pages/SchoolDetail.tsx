import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import SectionManager from '@/components/SectionManager';
import { getSchools, addLevelToSchool, removeLevelFromSchool } from '@/lib/storage';
import { School, Grade, LevelType } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Plus,
  Minus,
  Users,
  ArrowRight,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SchoolDetail = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [school, setSchool] = useState<School | null>(null);

  const loadSchool = () => {
    const schools = getSchools();
    const found = schools.find(s => s.id === schoolId);
    setSchool(found || null);
  };

  useEffect(() => {
    loadSchool();
  }, [schoolId]);

  const handleAddLevel = (level: LevelType) => {
    if (!school) return;
    addLevelToSchool(school.id, level);
    toast({
      title: 'Nivel agregado',
      description: `Se ha agregado el nivel de ${level === 'primaria' ? 'Primaria' : 'Secundaria'}`,
    });
    loadSchool();
  };

  const handleRemoveLevel = (level: LevelType) => {
    if (!school) return;
    removeLevelFromSchool(school.id, level);
    toast({
      title: 'Nivel eliminado',
      description: `Se ha eliminado el nivel de ${level === 'primaria' ? 'Primaria' : 'Secundaria'}`,
    });
    loadSchool();
  };

  if (!school) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Colegio no encontrado
            </h2>
            <Link to="/colegios">
              <Button variant="outline">Volver a Colegios</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const primariaGrades = school.grades.filter(g => g.level === 'primaria');
  const secundariaGrades = school.grades.filter(g => g.level === 'secundaria');

  const renderGradeCard = (grade: Grade) => (
    <Card key={grade.id} className="border-border/50 shadow-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            {grade.level === 'primaria' ? (
              <BookOpen className="h-4 w-4 text-success" />
            ) : (
              <GraduationCap className="h-4 w-4 text-info" />
            )}
            {grade.number}° {grade.level === 'primaria' ? 'Primaria' : 'Secundaria'}
          </span>
          <SectionManager
            schoolId={school.id}
            grade={grade}
            onUpdate={loadSchool}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {grade.sections.map(section => (
            <Link
              key={section.id}
              to={`/colegios/${school.id}/seccion/${section.id}`}
            >
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors px-3 py-1"
              >
                Sección {section.name}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Badge>
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="h-3 w-3" />
          {grade.sections.length} sección{grade.sections.length !== 1 ? 'es' : ''}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          to="/colegios"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a Colegios
        </Link>

        {/* School Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{school.name}</h1>
          <div className="flex flex-wrap items-center gap-4">
            {school.hasPrimaria && (
              <Badge className="bg-success/10 text-success border-0 gap-1">
                <BookOpen className="h-3 w-3" />
                Primaria
              </Badge>
            )}
            {school.hasSecundaria && (
              <Badge className="bg-info/10 text-info border-0 gap-1">
                <GraduationCap className="h-3 w-3" />
                Secundaria
              </Badge>
            )}
          </div>
        </div>

        {/* Level Management */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Gestión de Niveles
          </h2>
          <div className="flex flex-wrap gap-3">
            {!school.hasPrimaria && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleAddLevel('primaria')}
              >
                <Plus className="h-4 w-4" />
                Agregar Primaria
              </Button>
            )}
            {!school.hasSecundaria && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => handleAddLevel('secundaria')}
              >
                <Plus className="h-4 w-4" />
                Agregar Secundaria
              </Button>
            )}
            {school.hasPrimaria && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                    <Minus className="h-4 w-4" />
                    Eliminar Primaria
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar nivel Primaria?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminarán todos los grados de primaria y los alumnos registrados en ellos. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRemoveLevel('primaria')}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {school.hasSecundaria && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                    <Minus className="h-4 w-4" />
                    Eliminar Secundaria
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar nivel Secundaria?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminarán todos los grados de secundaria y los alumnos registrados en ellos. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleRemoveLevel('secundaria')}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </section>

        {/* Primaria Section */}
        {primariaGrades.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-success" />
              Nivel Primaria
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {primariaGrades.map(renderGradeCard)}
            </div>
          </section>
        )}

        {/* Secundaria Section */}
        {secundariaGrades.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-info" />
              Nivel Secundaria
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {secundariaGrades.map(renderGradeCard)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SchoolDetail;
