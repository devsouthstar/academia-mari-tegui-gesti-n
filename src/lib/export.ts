import { Student } from '@/types';

export const exportToExcel = (students: Student[], fileName: string): void => {
  // Create CSV content with proper formatting
  const headers = ['Nombre', 'Número de WhatsApp', 'Correo Electrónico'];
  
  const rows = students.map(student => [
    student.nombre,
    student.whatsapp,
    student.correo || 'Sin Correo'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Add BOM for proper Excel encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
