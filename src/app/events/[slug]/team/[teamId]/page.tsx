import { notFound } from 'next/navigation';
import { getTeamDetailsAction } from '@/lib/actions/team-actions';
import { TeamDetailsClient } from './TeamDetailsClient';

interface TeamPageProps {
  params: Promise<{
    slug: string;
    teamId: string;
  }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug, teamId: teamIdParam } = await params;
  const teamId = parseInt(teamIdParam);
  
  if (isNaN(teamId)) {
    notFound();
  }

  const { team, error } = await getTeamDetailsAction(slug, teamId);

  if (error || !team) {
    notFound();
  }

  return <TeamDetailsClient team={team} />;
}