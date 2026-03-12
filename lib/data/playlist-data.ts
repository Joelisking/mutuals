export interface Playlist {
  name: string;
  description: string;
  embedUrl: string;
}

export const playlists: Playlist[] = [
  {
    name: 'ALTE+',
    description: 'The soundtrack to a new wave. ALTE+ captures the spirit of Nigeria\'s alternative music scene — experimental, genre-defying sounds from artists rewriting the rules. Our editors keep this one fresh, so add it to your library and stay ahead of the curve.',
    embedUrl: 'https://open.spotify.com/embed/playlist/5SWGitla2ckYWNEY2GzZXX?utm_source=generator&theme=0',
  },
  {
    name: 'TAP IN+',
    description: 'Your entry point into the sounds shaping the culture right now. TAP IN+ is a cross-genre collection spanning Afrobeats, drill, R&B, and everything in between — curated for those who move at the speed of culture.',
    embedUrl: 'https://open.spotify.com/embed/playlist/3xhI6PhfgA04ZeTNvy7PQJ?utm_source=generator&theme=0',
  },
  {
    name: 'SOUND UP+',
    description: 'A spotlight on the artists you need to know before everyone else does. SOUND UP+ is our platform for emerging voices — tracks that are turning heads and building momentum across the diaspora and beyond.',
    embedUrl: 'https://open.spotify.com/embed/playlist/5y3Nt0j3IqC5o7DZYtbWw2?utm_source=generator&theme=0',
  },
];
