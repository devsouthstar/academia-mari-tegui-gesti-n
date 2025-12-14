import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { School } from '@/types';
import { Building2, ChevronRight, GraduationCap, BookOpen, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
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

interface SchoolCardProps {
  school: School;
  onDelete: (schoolId: string) => void;
}

const SchoolCard = ({ school, onDelete }: SchoolCardProps) => {
  const totalGrades = school.grades.length;
  const totalSections = school.grades.reduce((acc, grade) => acc + grade.sections.length, 0);

  return (
    <Card className="group border-border/50 shadow-card hover:shadow-lg transition-all duration-300 animate-scale-in overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">
                {school.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Creado {formatDistanceToNow(new Date(school.createdAt), { 
                  addSuffix: true,
                  locale: es 
                })}
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar colegio?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente el colegio "{school.name}" y todos sus alumnos registrados. Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(school.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {school.hasPrimaria && (
            <Badge className="bg-success/10 text-success hover:bg-success/20 border-0">
              <BookOpen className="h-3 w-3 mr-1" />
              Primaria
            </Badge>
          )}
          {school.hasSecundaria && (
            <Badge className="bg-info/10 text-info hover:bg-info/20 border-0">
              <GraduationCap className="h-3 w-3 mr-1" />
              Secundaria
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{totalGrades} grados</span>
          <span>•</span>
          <span>{totalSections} secciones</span>
        </div>

        <Link to={`/colegios/${school.id}`}>
          <Button className="w-full group/btn" variant="default">
            Ver Detalles
            <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default SchoolCard;
