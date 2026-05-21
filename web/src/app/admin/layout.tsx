import { redirect } from 'next/navigation';
import { isAdminUser } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdminUser();
  if (!admin) {
    redirect('/dashboard?error=admin_required');
  }

  return <>{children}</>;
}
