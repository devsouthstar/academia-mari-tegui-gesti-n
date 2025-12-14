import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Student } from '@/types';
import { updateStudent, deleteStudent } from '@/lib/storage';
import { Pencil, Trash2, Phone, Mail, User, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudentTableProps {
  students: Student[];
  onStudentUpdated: () => void;
}

const StudentTable = ({ students, onStudentUpdated }: StudentTableProps) => {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    whatsapp: '',
    correo: '',
  });

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditForm({
      nombre: student.nombre,
      whatsapp: student.whatsapp,
      correo: student.correo,
    });
  };

  const handleEditSubmit = () => {
    if (!editingStudent) return;

    if (!editForm.nombre.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre no puede estar vacío',
        variant: 'destructive',
      });
      return;
    }

    if (!editForm.whatsapp.trim()) {
      toast({
        title: 'Error',
        description: 'El número de WhatsApp no puede estar vacío',
        variant: 'destructive',
      });
      return;
    }

    updateStudent({
      ...editingStudent,
      nombre: editForm.nombre.trim(),
      whatsapp: editForm.whatsapp.trim(),
      correo: editForm.correo.trim(),
    });

    toast({
      title: 'Alumno actualizado',
      description: 'Los datos han sido actualizados exitosamente',
    });

    setEditingStudent(null);
    onStudentUpdated();
  };

  const handleDeleteConfirm = () => {
    if (!deleteStudentId) return;

    deleteStudent(deleteStudentId);
    toast({
      title: 'Alumno eliminado',
      description: 'El alumno ha sido eliminado exitosamente',
    });

    setDeleteStudentId(null);
    onStudentUpdated();
  };

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-muted/20">
        <div className="p-4 rounded-full bg-muted mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">
          No hay alumnos registrados en esta sección
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Use el formulario de arriba para agregar alumnos
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border/50 overflow-hidden bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo Electrónico
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => (
              <TableRow 
                key={student.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell className="font-medium">{student.nombre}</TableCell>
                <TableCell>{student.whatsapp}</TableCell>
                <TableCell>
                  {student.correo ? (
                    student.correo
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Sin Correo
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleEditClick(student)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteStudentId(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Editar Alumno
            </DialogTitle>
            <DialogDescription>
              Modifique los datos del alumno según sea necesario.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre Completo</Label>
              <Input
                id="edit-nombre"
                value={editForm.nombre}
                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-whatsapp">Número de WhatsApp</Label>
              <Input
                id="edit-whatsapp"
                value={editForm.whatsapp}
                onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-correo">
                Correo Electrónico
                <span className="text-xs text-muted-foreground ml-2">(opcional)</span>
              </Label>
              <Input
                id="edit-correo"
                type="email"
                value={editForm.correo}
                onChange={(e) => setEditForm({ ...editForm, correo: e.target.value })}
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudent(null)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteStudentId} onOpenChange={() => setDeleteStudentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar alumno?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente los datos del alumno. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StudentTable;
