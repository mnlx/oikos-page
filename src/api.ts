import type { Listing, Summary } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchListings(): Promise<Listing[]> {
  const response = await fetch(`${API_BASE_URL}/api/listings`);
  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status}`);
  }
  return response.json();
}

export async function fetchListing(id: number): Promise<Listing> {
  const response = await fetch(`${API_BASE_URL}/api/listings/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch listing ${id}: ${response.status}`);
  }
  return response.json();
}

export async function fetchSummary(): Promise<Summary> {
  const response = await fetch(`${API_BASE_URL}/api/summary`);
  if (!response.ok) {
    throw new Error(`Failed to fetch summary: ${response.status}`);
  }
  return response.json();
}
