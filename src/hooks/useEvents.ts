export type Event = {
  id: string;
  title: string;
  subtitle: string;
  coverText: string;
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
    subtitle: "Don't miss your chance to win!",
    coverText: "€2,500 Prize Pool",
    date: "September 14th, 2025",
    time: "11:00 - 19:00",
    location: "Alvarinaukio, Otaniemi",
    image: "/abp_festarit_thumb.png",
    category: "Party / Festival",
    urlName: "battleroyale",
    isFeatured: true,
  },
  // {
  //   id: "2",
  //   title: "Magic Island",
  //   subtitle: "yo what's this??",
  //   date: "???",
  //   time: "???",
  //   location: "???",
  //   image: "/magic_island_thumb.png",
  //   category: "Party / Festival",
  //   urlName: "magicisland",
  //   isFeatured: false,
  // },
  // ... more events
];


export function useEvents() {
  return {
    all: events,
    featured: events.filter(e => e.isFeatured),
    upcoming: events.slice(0, 3),
  };
}