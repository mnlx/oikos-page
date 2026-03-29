import type { Listing, Summary } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function parseJsonResponse<T>(response: Response, resource: string): Promise<T> {
  if (!response.ok) {
    throw new Error(`Failed to fetch ${resource}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const bodyPreview = (await response.text()).slice(0, 120).trim();
    throw new Error(
      `Expected JSON for ${resource}, received ${contentType || "unknown content type"}${bodyPreview ? `: ${bodyPreview}` : ""}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchListings(): Promise<Listing[]> {
  const response = await fetch(`${API_BASE_URL}/api/listings`);
  return parseJsonResponse<Listing[]>(response, "listings");
}

export async function fetchListing(id: number): Promise<Listing> {
  const response = await fetch(`${API_BASE_URL}/api/listings/${id}`);
  return parseJsonResponse<Listing>(response, `listing ${id}`);
}

export async function fetchSummary(): Promise<Summary> {
  const response = await fetch(`${API_BASE_URL}/api/summary`);
  return parseJsonResponse<Summary>(response, "summary");
}
