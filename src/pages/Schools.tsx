import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import SchoolCard from '@/components/SchoolCard';
import CreateSchoolDialog from '@/components/CreateSchoolDialog';
import { getSchools, deleteSchool } from '@/lib/storage';
import { School } from '@/types';
import { Building2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Schools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSchools = () => {
    setSchools(getSchools());
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleDeleteSchool = (schoolId: string) => {
    deleteSchool(schoolId);
    toast({
      title: 'Colegio eliminado',
      description: 'El colegio y todos sus datos han sido eliminados',
    });
    loadSchools();
  };

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              Gestión de Colegios
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra los colegios y sus niveles educativos
            </p>
          </div>
          <CreateSchoolDialog onSchoolCreated={loadSchools} />
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar colegio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 max-w-md"
          />
        </div>

        {/* Schools Grid */}
        {filteredSchools.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchools.map((school) => (
              <SchoolCard 
                key={school.id} 
                school={school} 
                onDelete={handleDeleteSchool}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No se encontraron colegios' : 'No hay colegios registrados'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchTerm
                ? 'Intente con otro término de búsqueda'
                : 'Comience creando su primer colegio para empezar a registrar alumnos'}
            </p>
            {!searchTerm && <CreateSchoolDialog onSchoolCreated={loadSchools} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default Schools;
