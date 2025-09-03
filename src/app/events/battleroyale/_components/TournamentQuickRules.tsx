import { Handshake, Target, Zap } from "lucide-react"

export default function TournamentQuickRules() {
  
  const listHeaderClass = "font-bold mt-6 flex items-center gap-2"
  const listItemClass = "ml-4 md:ml-8 leading-tight mt-3"
  return (
    <>
      <div className="mx-2 xs:mx-0">
        <h3 className="text-2xl font-bold">Quick Rules</h3>
        <a 
          href="/BPBR_official_rules-1.pdf" 
          download 
          className="text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
        >
          <span>Download full rules here</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </a>
      </div>
      <ul className="mt-6">
        <li className={listHeaderClass}>
          <Handshake />
          <span>Setup & Starting</span>
        </li>
        <li className={listItemClass}>
          - Rock-Paper-Scissors determines the starting team
        </li>
        <li className={listItemClass}>
          - Standard 10-cup triangle formation, 2 fingers from table&apos;s back edge
        </li>
        <li className={listItemClass}>
          - Re-racking automatically at 6, 3, and 1 cups remaining (centered, 2 fingers from back edge)
        </li>
        <li className={listItemClass}>
          - Game length: 20 minutes maximum. Tiebreakers by cup differential
        </li>

        {/* Shooting and Scoring */}
        <li className={listHeaderClass}>
          <Target />
          <span>Shooting and Scoring</span>
        </li>
        <li className={listItemClass}>
          - Elbow must be behind the table when releasing the ball
        </li>
        <li className={listItemClass}>
          - Bounce shots count as two cups and can be blocked
        </li>
        <li className={listItemClass}>
          - <u>Triple Shot</u>: Two balls in same cup = 3 cups removed total
        </li>
        <li className={listItemClass}>
          - <u>Balls Back</u>: When both teammates hit cups in same turn, get balls back + extra turn
        </li>
        <li className={listItemClass}>
          - <u>On Fire!</u>: Hit 3 cups in a row to keep shooting until you miss
        </li>

        {/* Special Situations */}
        <li className={listHeaderClass}>
          <Zap />
          <span>Special situations</span>
        </li>
        <li className={listItemClass}>
          - <u>Rebound</u>: If the ball remains on the table after a throw, it can be caught by the throwing team for a Trickshot opportunity
        </li>
        <li className={listItemClass}>
          - <b>Tactical Nuke</b>. Commonly known as <b>Miracle</b>. Landing a ball between and on top of 3 cups wins you the game automatically.
        </li>
        <li className={listItemClass}>
          - If the middle cup has been removed, a ball thrown into the empty space in the hexagon formation sends the shooter to <b>the Gulag</b>. Read{` `}
          <a href="/BPBR_official_rules-1.pdf" 
            download 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Full rules
          </a>{` `} for details
        </li>
        <li className={listItemClass}>
          - No redemption round. First team to drop the last cup wins
        </li>
      </ul>
    </>
  )
}