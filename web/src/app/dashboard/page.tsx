import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { DashboardView } from '@/features/catalog/views/DashboardView';
import { getEnrollmentsForClerkUser } from '@/features/catalog/services/enrollmentService';
import { isAdminUser, syncCurrentUserToDatabase } from '@/lib/auth';
import { isDatabaseConfigured, getPrisma } from '@/lib/db';

export const metadata = {
  title: 'Área do aluno',
};

type DashboardPageProps = {
  searchParams: Promise<{ error?: string; checkout?: string }>;
};

async function isDatabaseConnected(): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;
  try {
    await getPrisma().$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const params = await searchParams;
  const user = await currentUser();
  const [admin, databaseConnected] = await Promise.all([
    isAdminUser(),
    isDatabaseConnected(),
  ]);

  await syncCurrentUserToDatabase();
  const enrollments = await getEnrollmentsForClerkUser(userId);

  const displayName =
    user?.firstName ??
    user?.username ??
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ??
    'Aluno';

  return (
    <DashboardView
      displayName={displayName}
      isAdmin={admin}
      enrollments={enrollments}
      databaseConnected={databaseConnected}
      adminRequired={params.error === 'admin_required'}
      checkoutSuccess={params.checkout === 'success'}
    />
  );
}
