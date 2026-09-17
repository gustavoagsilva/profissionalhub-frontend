const API_ROOT = "https://api.geoapify.com";
const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY?.trim();
const API_ERROR =
  "Desculpe, algo deu errado durante a solicitação. Pode haver um problema de conexão ou o servidor pode estar inativo. Por favor, tente novamente mais tarde.";
async function request(endpoint, params, options = {}) {
  if (!API_KEY)
    throw new Error("A chave da Geoapify ainda não foi configurada.");
  const query = new URLSearchParams({ ...params, apiKey: API_KEY });
  try {
    const response = await fetch(API_ROOT + endpoint + "?" + query, {
      ...options,
      signal: AbortSignal.any(
        [options.signal, AbortSignal.timeout(20000)].filter(Boolean),
      ),
    });
    if (!response.ok) throw new Error(API_ERROR);
    return await response.json();
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new Error(API_ERROR);
  }
}
export async function findPlaces(category, signal) {
  const data = await request(
    "/v2/places",
    {
      categories: category,
      filter: "circle:-46.6333,-23.5505,15000",
      bias: "proximity:-46.6333,-23.5505",
      limit: "18",
      lang: "pt",
      conditions: "named",
    },
    { signal },
  );
  return (data.features || []).map((feature) => ({
    id: feature.properties.place_id,
    name: feature.properties.name || "Local sem nome",
    address: feature.properties.formatted,
    coordinates: feature.geometry.coordinates,
    category: "Geoapify",
    icon: "pin",
  }));
}
export async function calculateTravel(origin, destination, signal) {
  const data = await request(
    "/v1/routematrix",
    {},
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "drive",
        sources: [{ location: origin.coordinates }],
        targets: [{ location: destination.coordinates }],
      }),
      signal,
    },
  );
  const result = data.sources_to_targets?.[0]?.[0];
  if (result?.distance == null || result?.time == null)
    throw new Error(
      "Não foi possível encontrar um trajeto entre esses locais.",
    );
  return result;
}
