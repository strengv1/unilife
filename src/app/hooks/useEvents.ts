export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  isFeatured?: boolean;
};

const events: Event[] = [
  {
    id: "1",
    title: "Beer Pong Battle Royale",
    date: "September 2025, 2025",
    time: "11:00 - 22:00",
    location: "Alvarin Aukio, Otaniemi",
    image: "/abp_festarit.png?height=400&width=600",
    category: "Party / Festival",
    isFeatured: true,
  },
  // ... more events
];


export function useEvents() {
  return {
    all: events,
    featured: events.filter(e => e.isFeatured),
    upcoming: events.slice(0, 3),
  };
}