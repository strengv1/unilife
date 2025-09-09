import { checkAuthAction } from '@/lib/actions/auth-actions';
import { getTournamentsAction } from '@/lib/actions/tournament-actions';
import { AdminClient } from './AdminClient';

export default async function AdminPage() {
  const [authResult, tournamentsResult] = await Promise.all([
    checkAuthAction(),
    getTournamentsAction()
  ]);
  
  return (
    <AdminClient 
      initialAuth={authResult.authenticated}
      initialTournaments={tournamentsResult.tournaments || []}
      initialError={tournamentsResult.error}
    />
  );
}