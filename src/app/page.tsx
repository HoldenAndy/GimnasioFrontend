import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirigimos automáticamente al login cuando alguien entra a la raíz
  redirect('/login');
}
