export const to12Hour = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${suffix}`;
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const getPlayTime = (status: string) => {
  if (!status) return '';

  const s = status.toLowerCase();

  if (s.includes('finished') || s.includes('ft') || s.includes('full'))
    return 'Full-Time';
  if (s.includes('ht')) return 'Half-Time';

  // Match things like 45, 7, 90+3, etc.
  const minuteMatch = status.match(/(\d+\+?\d*)/);
  if (minuteMatch) return `${minuteMatch[1]}'`;

  return status; // fallback
};

export const formatLiveScore = (match: any) => {
  const score =
    match.event_final_result || match.event_halftime_result || '? - ?';
  const playtime = getPlayTime(match.event_status);

  let status = 'In Play';
  const raw = match.event_status?.toLowerCase() || '';
  if (raw.includes('finished') || raw.includes('ft') || raw.includes('full'))
    status = 'Full-Time';
  else if (raw.includes('ht')) status = 'Half-Time';

  return { score, playtime, status };
};

export const aggregateBestOdds = (bookmakers: any[]) => {
  const homeOdds: number[] = [];
  const drawOdds: number[] = [];
  const awayOdds: number[] = [];

  for (const b of bookmakers) {
    if (b.odd_1 && typeof b.odd_1 === 'number') homeOdds.push(b.odd_1);
    if (b.odd_x && typeof b.odd_x === 'number') drawOdds.push(b.odd_x);
    if (b.odd_2 && typeof b.odd_2 === 'number') awayOdds.push(b.odd_2);
  }

  const clean = (arr: number[]) => {
    if (arr.length === 0) return null;

    arr = arr.sort((a, b) => a - b);

    // Remove 5% high and 5% low outliers (optional but recommended)
    const cut = Math.floor(arr.length * 0.05);
    const sliced = arr.slice(cut, arr.length - cut);

    return Math.min(...sliced);
  };

  return {
    home: clean(homeOdds),
    draw: clean(drawOdds),
    away: clean(awayOdds),
  };
};

export const aggregateBestLiveOdds = (liveOdds: any[]) => {
  // Filter to only 1x2 markets (full time or time-window variants)
  const markets = liveOdds.filter(
    (o) =>
      o.odd_name.toLowerCase().includes('1x2') &&
      o.is_odd_suspended.toLowerCase() === 'no' && // ignore suspended ones
      !isNaN(parseFloat(o.odd_value)), // ignore invalid numbers
  );

  if (markets.length === 0) {
    return { home: null, draw: null, away: null };
  }

  const home: number[] = [];
  const draw: number[] = [];
  const away: number[] = [];

  for (const m of markets) {
    const value = parseFloat(m.odd_value);
    if (m.odd_type === 'Home') home.push(value);
    if (m.odd_type === 'Draw') draw.push(value);
    if (m.odd_type === 'Away') away.push(value);
  }

  const pickLowest = (arr: number[]) =>
    arr.length === 0 ? null : Math.min(...arr);

  return {
    home: pickLowest(home),
    draw: pickLowest(draw),
    away: pickLowest(away),
  };
};

export const parseScore = (scoreStr: string) => {
  if (!scoreStr) {
    return { homeScore: 0, awayScore: 0 };
  }
  const [home, away] = scoreStr.split('-').map((s) => Number(s.trim()));
  return { homeScore: home, awayScore: away };
};

export const toAcronym = (teamName: string) => {
  return teamName
    .replace(/[\.\,\-]/g, '') // remove punctuation
    .split(/\s+/) // split words
    .map((word) => word[0].toUpperCase()) // take first letter uppercase
    .join('');
};
