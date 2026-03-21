import { useEffect, useState } from "react";

import { fetchListing, fetchListings, fetchSummary } from "./api";
import { DetailsPanel } from "./components/DetailsPanel";
import { ListingList } from "./components/ListingList";
import { MapPanel } from "./components/MapPanel";
import type { Listing, Summary } from "./types";

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [listingData, summaryData] = await Promise.all([fetchListings(), fetchSummary()]);
        setListings(listingData);
        setSummary(summaryData);
        if (listingData[0]) {
          const detail = await fetchListing(listingData[0].id);
          setSelectedListing(detail);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load data.");
      }
    }

    void load();
  }, []);

  async function handleSelect(listing: Listing) {
    try {
      const detail = await fetchListing(listing.id);
      setSelectedListing(detail);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load listing.");
    }
  }

  return (
    <main className="app-shell">
      {error && <div className="error-banner">{error}</div>}
      <ListingList listings={listings} selectedId={selectedListing?.id ?? null} onSelect={handleSelect} />
      <section className="content-pane">
        <DetailsPanel listing={selectedListing} summary={summary} />
        <MapPanel listing={selectedListing} />
      </section>
    </main>
  );
}
