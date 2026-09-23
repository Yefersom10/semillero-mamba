export const hasRole = (userRole: string | number, target: 'ADMIN' | 'PROFESOR' | 'ESTUDIANTE') => {
  if (!userRole) return false;

  const roleStr = String(userRole).toLowerCase().trim();

  switch (target) {
    case 'ADMIN':
      return roleStr === '1' || roleStr === 'administrador' || roleStr === 'admin';
    case 'PROFESOR':
      return roleStr === '2' || roleStr === 'profesor' || roleStr === 'teacher';
    case 'ESTUDIANTE':
      return roleStr === '3' || roleStr === 'estudiante' || roleStr === 'student';
    default:
      return false;
  }
};