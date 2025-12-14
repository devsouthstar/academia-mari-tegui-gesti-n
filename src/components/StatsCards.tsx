import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getSchools, getStudents } from '@/lib/storage';
import { School, Users, BookOpen, TrendingUp } from 'lucide-react';

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalPrimaria: 0,
    totalSecundaria: 0,
  });

  useEffect(() => {
    const loadStats = () => {
      const schools = getSchools();
      const students = getStudents();
      
      let totalPrimaria = 0;
      let totalSecundaria = 0;
      
      schools.forEach(school => {
        if (school.hasPrimaria) totalPrimaria++;
        if (school.hasSecundaria) totalSecundaria++;
      });

      setStats({
        totalSchools: schools.length,
        totalStudents: students.length,
        totalPrimaria,
        totalSecundaria,
      });
    };

    loadStats();
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      label: 'Total Colegios',
      value: stats.totalSchools,
      icon: School,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Alumnos',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-info/10 text-info',
    },
    {
      label: 'Con Primaria',
      value: stats.totalPrimaria,
      icon: BookOpen,
      color: 'bg-success/10 text-success',
    },
    {
      label: 'Con Secundaria',
      value: stats.totalSecundaria,
      icon: TrendingUp,
      color: 'bg-warning/10 text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card 
            key={item.label}
            className="border-border/50 shadow-card hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
