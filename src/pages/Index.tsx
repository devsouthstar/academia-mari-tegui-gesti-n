import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import RecentStudentsCard from '@/components/RecentStudentsCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, School, Users, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-12 text-primary-foreground shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-white/20">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  Academia Mariátegui
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                Sistema de Gestión de Alumnos
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-6 leading-relaxed">
                Administra de forma eficiente los registros de alumnos de tu institución educativa. 
                Organiza por colegios, grados y secciones.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/colegios">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 gap-2 font-semibold shadow-lg"
                  >
                    <School className="h-5 w-5" />
                    Gestionar Colegios
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl" />
                <div className="relative grid grid-cols-2 gap-3 p-4">
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Alumnos</span>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                    <School className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Colegios</span>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm col-span-2">
                    <Sparkles className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Gestión Eficiente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Resumen General
          </h2>
          <StatsCards />
        </section>

        {/* Recent Students */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Actividad Reciente
          </h2>
          <RecentStudentsCard />
        </section>
      </main>
    </div>
  );
};

export default Index;
