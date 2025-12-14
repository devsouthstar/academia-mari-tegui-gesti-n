import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { updateSectionsForGrade } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import { Grade } from '@/types';

interface SectionManagerProps {
  schoolId: string;
  grade: Grade;
  onUpdate: () => void;
}

const SectionManager = ({ schoolId, grade, onUpdate }: SectionManagerProps) => {
  const [open, setOpen] = useState(false);
  const [maxSection, setMaxSection] = useState(
    grade.sections[grade.sections.length - 1]?.name || 'A'
  );

  const handleSubmit = () => {
    const letter = maxSection.toUpperCase();
    
    if (!/^[A-Z]$/.test(letter)) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese una letra válida (A-Z)',
        variant: 'destructive',
      });
      return;
    }

    updateSectionsForGrade(schoolId, grade.id, letter);
    
    toast({
      title: 'Secciones actualizadas',
      description: `Se han configurado las secciones de A hasta ${letter}`,
    });

    setOpen(false);
    onUpdate();
  };

  const levelText = grade.level === 'primaria' ? 'Primaria' : 'Secundaria';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurar Secciones
          </DialogTitle>
          <DialogDescription>
            {grade.number}° {levelText} - Ingrese la última letra para generar las secciones.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="maxSection">Última Sección (A-Z)</Label>
            <Input
              id="maxSection"
              value={maxSection}
              onChange={(e) => setMaxSection(e.target.value.toUpperCase())}
              maxLength={1}
              placeholder="Ej: D"
              className="h-11 text-center text-lg font-bold uppercase"
            />
            <p className="text-sm text-muted-foreground">
              Ejemplo: Ingresar "D" creará las secciones A, B, C, D
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionManager;
