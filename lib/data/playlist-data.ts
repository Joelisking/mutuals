export interface Playlist {
  name: string;
  embedUrl: string; // Apple Music embed URL
}

export const playlists: Playlist[] = [
  {
    name: "Afro Vibez",
    embedUrl: "https://embed.music.apple.com/us/playlist/afro-vibez/pl.u-11zBP8Vh8pGoDP8"
  },
  {
    name: "Holy Flow: I Do",
    embedUrl: "https://embed.music.apple.com/us/playlist/holy-flow-i-do/pl.u-DdANrR6TNyRWNW"
  },
  {
    name: "Holy Flow: Bars on Bars",
    embedUrl: "https://embed.music.apple.com/us/playlist/holy-flow-bars-on-bars/pl.4ef7d6f69250491c8a8a4b048f4161b7"
  }
];
