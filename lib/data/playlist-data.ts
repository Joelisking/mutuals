export interface Playlist {
  name: string;
  embedUrl: string; // Apple Music embed URL
}

export const playlists: Playlist[] = [
  {
    name: 'ALTE+',
    embedUrl:
      'https://embed.music.apple.com/us/playlist/alte/pl.u-06oxpyxT7LE831J',
  },
  {
    name: 'TAP IN+',
    embedUrl:
      'https://embed.music.apple.com/us/playlist/tap-in/pl.u-yZyVEAXtZXk3ARB',
  },
  {
    name: 'SOUND UP+',
    embedUrl:
      'https://embed.music.apple.com/us/playlist/sound-up/pl.u-XkD0vRZcgY8lbEB',
  },
];
