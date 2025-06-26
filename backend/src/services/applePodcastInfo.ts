export interface PodcastInfo {
  showName: string;
  category: string;
  episodeName: string;
  audioUrl: string;
  logoUrl: string;
}

/**
 * 解析 Apple Podcast 單集 URL，回傳 Podcast 與單集資訊。
 *
 * @param url      Apple Podcast episode URL
 * @param pageSize 每次向 Lookup API 取回的單集數量 (max 200)
 */
export async function fetchPodcastInfoFromUrl(url: string, pageSize = 100): Promise<PodcastInfo> {
  const match = url.match(/id(\d+).*?[?&]i=(\d+)/);
  if (!match) {
    throw new Error('URL格式不正確');
  }
  const [, collectionId, trackId] = match;
  let offset = 0;
  let showData: any = null;
  let episodeData: any = null;

  while (!episodeData) {
    const api =
      `https://itunes.apple.com/lookup?id=${collectionId}` +
      `&media=podcast&entity=podcastEpisode&limit=${pageSize}&offset=${offset}`;

    const res = await fetch(api, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PodcastScraper/1.0)',
      },
    });

    if (!res.ok) {
      throw new Error(`Apple Lookup API 失敗：${res.status}`);
    }

    const json: { resultCount: number; results: any[] } = await res.json();

    if (!showData) {
      showData = json.results.find((r) => r.kind === 'podcast');

      if (!showData) {
        throw new Error('回傳資料中找不到 Podcast 本體');
      }
    }

    const episodes = json.results.filter((r) => r.wrapperType === 'podcastEpisode');
    episodeData = episodes.find((ep) => String(ep.trackId) === trackId);

    if (episodeData || episodes.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  if (!episodeData) {
    throw new Error('找不到對應單集, 請檢查 URL');
  }

  return {
    showName: showData.collectionName ?? showData.trackName ?? '',
    category: showData.primaryGenreName ?? showData.genres?.[0]?.name ?? '',
    episodeName: episodeData.trackName,
    audioUrl: episodeData.previewUrl ?? episodeData.episodeUrl ?? '',
    logoUrl: showData.artworkUrl600 ?? showData.artworkUrl100 ?? '',
  };
}
