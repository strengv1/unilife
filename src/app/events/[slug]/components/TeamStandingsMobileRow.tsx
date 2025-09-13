import { useState } from "react";
import { ChartBar, ChevronDown, ChevronUp } from "lucide-react";
import { StandingWithPosition } from "@/lib/db";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  sortedTeams: StandingWithPosition[];
  showElimination: boolean;
}

const TeamRowMobile: React.FC<Props> = ({ sortedTeams, showElimination }) => {
  return (
    <div className="md:hidden">
      <div className="divide-y divide-gray-200">
        {sortedTeams.length > 0 ?
          sortedTeams.map((team) => (
            <ExpandableTeam
              key={team.id}
              team={team}
              showElimination={showElimination}
            />
          ))
          :
          <div className="px-4 py-2">Teams not visible yet.</div>
        }
      </div>
    </div>
  );
};

const ExpandableTeam: React.FC<{
  team: StandingWithPosition;
  showElimination: boolean;
}> = ({ team, showElimination }) => {
  const [expanded, setExpanded] = useState(false);
  const pointDiff =
    (team.swissGamePointsFor || 0) - (team.swissGamePointsAgainst || 0);

  const params = useParams();
  const tournamentSlug = params.slug as string || 'battleroyale';
  
  return (
    <div
      className={`
        px-3 py-2 md:p-4
        ${team.qualifiedForElimination ? "bg-green-50" : ""}
        border-b border-transparent hover:bg-gray-50 transition cursor-pointer
      `}
    >
      <div
        className="flex items-start justify-between"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        aria-expanded={expanded}
        aria-label={`Toggle details for ${team.name}`}
      >
        <div className="flex items-center gap-3">
          <span className="md:text-lg font-bold text-gray-900">#{team.position}</span>
          <div className="flex flex-col">
            <div className="font-semibold text-gray-900">
              {team.name}
              {showElimination && (
                <>
                  {team.qualifiedForElimination ? (
                    <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Qualified #{team.seed}
                    </span>
                  ) : null}
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {team.swissWins}-{team.swissLosses}-{team.swissDraws}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1">
              <div className="text-2xl font-bold text-gray-900">
                {team.swissPoints}
              </div>
              <div className="text-xs text-gray-500">pts</div>
            </div>
            <div className="text-gray-500 text-xs md:text-sm mt-1">
              <span className="whitespace-nowrap">Cup Diff:</span>
              <span
                className={`
                  font-medium text-xs md:text-sm ml-1
                  ${pointDiff > 0 ? "text-green-600" : pointDiff < 0 ? "text-red-600" : "text-gray-600"}
                `}
              >
                {pointDiff > 0 ? "+" : ""}
                {pointDiff}
              </span>
            </div>
          </div>
          <div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Extra info */}
      {expanded && (
        <>
          <div className="flex justify-between pr-7">
            <div className="text-xs text-gray-500 mt-1">
              <div>
                Median Buchholz (MB): {team.buchholzScore?.toFixed(1) || "0.0"}
              </div>
              <div>
                Opponents&apos; MB: {team.opponentsBuchholzScore?.toFixed(1) || "0.0"}
              </div>
            </div>  
            
          
            <div className="text-xs md:text-sm text-gray-500 mt-1">
              ({team.swissGamePointsFor}:{team.swissGamePointsAgainst})
            </div>
          </div>
          <Link href={`/events/${tournamentSlug}/team/${team.id}`}>
            <Button
              variant="ghost"
              className="mt-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 text-blue-700 cursor-pointer"
            >
              <ChartBar /> View Team Details
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default TeamRowMobile;
