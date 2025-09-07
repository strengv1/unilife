import React from 'react';

interface Event {
  time: string;
  title: string;
  details: string;
  phase: 'setup' | 'swiss' | 'playoffs' | 'finals';
  phaseLabel: string;
}

interface PhaseStyles {
  dot: string;
  label: string;
}

const TournamentSchedule: React.FC = () => {
  const events: Event[] = [
    {
      time: "11:00",
      title: "Registration & Check-in",
      details: "Team verification and tournament prep",
      phase: "setup",
      phaseLabel: "Setup"
    },
    {
      time: "12:00",
      title: "Swiss Rounds Begin",
      details: "6 rounds • ~40 minutes each",
      phase: "swiss",
      phaseLabel: "Swiss"
    },
    {
      time: "16:15",
      title: "Top 64 Teams Announced",
      details: "Rankings posted • Bracket seeding",
      phase: "swiss",
      phaseLabel: "Swiss"
    },
    {
      time: "16:20",
      title: "Single-Elimination Bracket",
      details: "Win or go home • Best-of-1 format",
      phase: "playoffs",
      phaseLabel: "Playoffs"
    },
    {
      time: "18:30",
      title: "Championship Finals & Awards",
      details: "Crown the champions • Prize ceremony",
      phase: "finals",
      phaseLabel: "Finals"
    },
    {
      time: "18:30",
      title: "Afterparty Begins",
      details: "Warm Sauna and casual games at Otakaari 20",
      phase: "finals",
      phaseLabel: "Afterparty"
    }
  ];

  const getPhaseStyles = (phase: Event['phase']): PhaseStyles => {
    const styles: Record<Event['phase'], PhaseStyles> = {
      setup: {
        dot: "bg-blue-100 border-blue-300",
        label: "bg-blue-100 text-blue-700",
      },
      swiss: {
        dot: "bg-blue-600 border-white",
        label: "bg-blue-600 text-white",
      },
      playoffs: {
        dot: "bg-red-500 border-white",
        label: "bg-red-500 text-white",
      },
      finals: {
        dot: "bg-red-600 border-white",
        label: "bg-red-600 text-white",
      }
    };
    return styles[phase] || styles.setup;
  };

  return (
    <>
      <div className="mx-2 xs:mx-0 ">
        <h3 className="text-2xl font-bold mb-2">Event Schedule</h3>
        <p className="text-gray-600 mb-8">Tournament timeline from check-in to championship finals</p>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-2 sm:left-7 top-5 bottom-5 w-0.5 bg-gradient-to-b from-blue-200 from-[0%] via-blue-600 via-[33%] to-red-500 to-[60%] rounded-full"></div>
        
        <div>
          {events.map((event, index) => {
            const phaseStyles = getPhaseStyles(event.phase);
            return (
              <div
                key={index}
                className={`relative pl-8 sm:pl-16 py-4 rounded-lg transition-colors duration-200`}
              >
                {/* Timeline dot */}
                <div className={`absolute left-[1px] sm:left-[21px] top-6 w-4 h-4 rounded-full border-2 shadow-sm ${phaseStyles.dot}`}></div>
                
                {/* Event content */}
                <div>
                  <div className="flex justify-between">
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {event.time}
                    </div>

                    {/* Phase label */}
                    <div className={`px-2 py-1 flex items-center rounded-full text-xs font-medium uppercase tracking-wide ${phaseStyles.label}`}>
                      {event.phaseLabel}
                    </div>
                  </div>

                  <div className="text-base font-medium text-gray-800 mb-1">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-600 italic">
                    {event.details}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TournamentSchedule;