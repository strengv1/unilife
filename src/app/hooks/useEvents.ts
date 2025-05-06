export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  urlName: string;
  isFeatured?: boolean;
};

const events: Event[] = [
  {
    id: "1",
    title: "Beer Pong Battle Royale",
    date: "September 14th, 2025 ",
    time: "12:00 - 19:00",
    location: "Alvarinaukio, Otaniemi",
    image: "/abp_festarit.png?height=400&width=600",
    category: "Party / Festival",
    urlName: "battleroyale",
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