import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Phone, Mail, User } from 'lucide-react';
import { createStudent } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

interface StudentFormProps {
  sectionId: string;
  schoolId: string;
  onStudentCreated: () => void;
}

const StudentForm = ({ sectionId, schoolId, onStudentCreated }: StudentFormProps) => {
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [correo, setCorreo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese el nombre del alumno',
        variant: 'destructive',
      });
      return;
    }

    if (!whatsapp.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese el número de WhatsApp',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      createStudent(nombre.trim(), whatsapp.trim(), correo.trim(), sectionId, schoolId);
      
      toast({
        title: 'Alumno registrado',
        description: `${nombre} ha sido registrado exitosamente`,
      });

      setNombre('');
      setWhatsapp('');
      setCorreo('');
      onStudentCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          Registrar Nuevo Alumno
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Nombre Completo
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Juan Pérez García"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Número de WhatsApp
              </Label>
              <Input
                id="whatsapp"
                placeholder="Ej: +51 999 888 777"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo" className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Correo Electrónico
                <span className="text-xs text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="Ej: correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full sm:w-auto gap-2"
            disabled={isSubmitting}
          >
            <UserPlus className="h-4 w-4" />
            {isSubmitting ? 'Registrando...' : 'Registrar Alumno'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
