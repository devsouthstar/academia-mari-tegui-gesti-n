import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Building2 } from 'lucide-react';
import { createSchool } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface CreateSchoolDialogProps {
  onSchoolCreated: () => void;
}

const CreateSchoolDialog = ({ onSchoolCreated }: CreateSchoolDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [hasPrimaria, setHasPrimaria] = useState(true);
  const [hasSecundaria, setHasSecundaria] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese el nombre del colegio',
        variant: 'destructive',
      });
      return;
    }

    if (!hasPrimaria && !hasSecundaria) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar al menos un nivel (Primaria o Secundaria)',
        variant: 'destructive',
      });
      return;
    }

    createSchool(name.trim(), hasPrimaria, hasSecundaria);
    
    toast({
      title: 'Colegio creado',
      description: `El colegio "${name}" ha sido creado exitosamente`,
    });

    setName('');
    setHasPrimaria(true);
    setHasSecundaria(true);
    setOpen(false);
    onSchoolCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-glow">
          <Plus className="h-4 w-4" />
          Nuevo Colegio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Crear Nuevo Colegio
          </DialogTitle>
          <DialogDescription>
            Ingrese los datos del nuevo colegio para comenzar a registrar alumnos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Colegio</Label>
              <Input
                id="name"
                placeholder="Ej: Colegio San Martín"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label>Niveles Educativos</Label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Checkbox
                    id="primaria"
                    checked={hasPrimaria}
                    onCheckedChange={(checked) => setHasPrimaria(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="primaria" className="text-sm font-medium cursor-pointer">
                      Primaria
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Grados 1° al 6°
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <Checkbox
                    id="secundaria"
                    checked={hasSecundaria}
                    onCheckedChange={(checked) => setHasSecundaria(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="secundaria" className="text-sm font-medium cursor-pointer">
                      Secundaria
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Grados 1° al 5°
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Crear Colegio
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchoolDialog;
