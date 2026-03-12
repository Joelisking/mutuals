/**
 * Seed hardcoded playlists into the backend API.
 *
 * Usage:
 *   node scripts/seed-playlists.mjs --email admin@example.com --password yourpassword
 *   node scripts/seed-playlists.mjs --token YOUR_JWT_TOKEN
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const playlists = [
  {
    title: 'ALTE+',
    curatorName: 'Mutuals+',
    description:
      "The soundtrack to a new wave. ALTE+ captures the spirit of Nigeria's alternative music scene — experimental, genre-defying sounds from artists rewriting the rules. Our editors keep this one fresh, so add it to your library and stay ahead of the curve.",
    embedUrl:
      'https://open.spotify.com/embed/playlist/5SWGitla2ckYWNEY2GzZXX?utm_source=generator&theme=0',
    platform: 'SPOTIFY',
    featured: true,
  },
  {
    title: 'TAP IN+',
    curatorName: 'Mutuals+',
    description:
      'Your entry point into the sounds shaping the culture right now. TAP IN+ is a cross-genre collection spanning Afrobeats, drill, R&B, and everything in between — curated for those who move at the speed of culture.',
    embedUrl:
      'https://open.spotify.com/embed/playlist/3xhI6PhfgA04ZeTNvy7PQJ?utm_source=generator&theme=0',
    platform: 'SPOTIFY',
    featured: true,
  },
  {
    title: 'SOUND UP+',
    curatorName: 'Mutuals+',
    description:
      'A spotlight on the artists you need to know before everyone else does. SOUND UP+ is our platform for emerging voices — tracks that are turning heads and building momentum across the diaspora and beyond.',
    embedUrl:
      'https://open.spotify.com/embed/playlist/5y3Nt0j3IqC5o7DZYtbWw2?utm_source=generator&theme=0',
    platform: 'SPOTIFY',
    featured: true,
  },
];

async function getToken(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Login failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data?.data?.accessToken || data?.access || data?.token;
}

async function createPlaylist(playlist, token) {
  const res = await fetch(`${API_URL}/playlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(playlist),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create "${playlist.name}" (${res.status}): ${text}`);
  }
  return res.json();
}

async function main() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  let token = get('--token');

  if (!token) {
    const email = get('--email');
    const password = get('--password');
    if (!email || !password) {
      console.error(
        'Provide either --token YOUR_JWT or both --email and --password\n' +
          'Example: node scripts/seed-playlists.mjs --email admin@example.com --password secret'
      );
      process.exit(1);
    }
    console.log(`Logging in as ${email}...`);
    token = await getToken(email, password);
    console.log('Login successful.\n');
  }

  console.log(`Seeding ${playlists.length} playlists to ${API_URL}...\n`);

  for (const playlist of playlists) {
    try {
      await createPlaylist(playlist, token);
      console.log(`✓ Created: ${playlist.title}`);
    } catch (err) {
      console.error(`✗ ${err.message}`);
    }
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
