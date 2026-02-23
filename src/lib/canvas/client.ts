/**
 * Canvas API Client
 * 
 * Thin fetch wrapper that handles:
 * - Auth headers
 * - Pagination
 * - Rate limit detection
 */
export interface CanvasClientConfig{
    baseUrl: string;
    token: string;
}

/**
 * Fetch a single page from the Canvas API
 */
async function canvasFetch(
    config: CanvasClientConfig,
    endpoint: string,
    params: Record<string, string> = {}
): Promise<{data: unknown[]; nextUrl:string | null}>{

    const url = new URL(`${config.baseUrl}/api/v1${endpoint}`);

    url.searchParams.set('per_page', '100');
    Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,v));

    const res = await fetch(url.toString(), {
        headers:{
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
        },
    });

    if(res.status === 429){
        const retryAfter = parseInt(res.headers.get('X-Rate-Limit-Remaining') ?? '5', 10);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return canvasFetch(config, endpoint, params);
    }

    if(!res.ok){
        throw new Error(`Canvas API error: ${res.status} ${res.statusText} on ${endpoint}`);
    }

    const data = await res.json();

    const linkHeader = res.headers.get('Link') ?? '';
    const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
    const nextUrl = nextMatch ? nextMatch[1] : null;

    return {data: Array.isArray(data) ? data : [data], nextUrl};
}

/**
 * Fetch ALL pages for an endpoint, following link headers automatically
 */
export async function canvasFetchAll(
    config: CanvasClientConfig,
    endpoint: string,
    params: Record<string, string> ={}
): Promise<unknown[]>{
    const allData: unknown[] = [];
    let nextUrl: string | null = null;

    const first = await canvasFetch(config, endpoint, params);
    allData.push(...first.data);
    nextUrl = first.nextUrl;

    while(nextUrl){
        const res = await fetch(nextUrl, {
            headers: {
                Authorization: `Bearer ${config.token}`,
                'Content-Type': 'application/json',
            },
        });

        if(!res.ok) break;

        const data = await res.json();
        allData.push(...(Array.isArray(data) ? data : [data]));

        const linkHeader = res.headers.get('Link') ?? '';
        const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        nextUrl = nextMatch ? nextMatch[1] : null;
    }

    return allData;
}