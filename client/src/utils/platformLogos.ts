export const PLATFORM_LOGOS: Record<string, string> = {
  reddit: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
  twitter: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
  x: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/X_logo.svg',
  youtube: 'https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png',
  spotify: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
  medium: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/medium.svg',
  scientificamerican: 'https://www.scientificamerican.com/favicon.ico',
};

export function getPlatform(url?: string) {
  if (!url) return null;
  if (url.includes('reddit.com')) return 'reddit';
  if (url.includes('twitter.com')) return 'twitter';
  if (url.includes('x.com')) return 'x';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('medium.com')) return 'medium';
  if (url.includes('scientificamerican.com')) return 'scientificamerican';
  return null;
}

// Get favicon for any link
export function getFavicon(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${u.origin}/favicon.ico`;
  } catch {
    return null;
  }
}
