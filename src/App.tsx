import { useEffect, useMemo, useState } from "react";

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
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minArea, setMinArea] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [transactionType, setTransactionType] = useState<"all" | "rent" | "sale">("all");
  const [propertyTypeFilters, setPropertyTypeFilters] = useState({
    apartment: true,
    house: true,
  });

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

  const filteredListings = useMemo(() => {
    const parsedPriceMin = Number(priceMin) || 0;
    const parsedPriceMax = Number(priceMax) || Number.POSITIVE_INFINITY;
    const parsedMinArea = Number(minArea) || 0;
    const parsedMinBedrooms = Number(minBedrooms) || 0;

    return listings.filter((listing) => {
      const price = listing.price_rent ?? listing.price_sale ?? 0;
      const area = listing.area_m2 ?? 0;
      const bedrooms = listing.bedrooms ?? 0;
      const propertyTypeMatches =
        (listing.property_type === "apartment" && propertyTypeFilters.apartment) ||
        (listing.property_type === "house" && propertyTypeFilters.house);

      return (
        (transactionType === "all" || listing.transaction_type === transactionType) &&
        propertyTypeMatches &&
        price >= parsedPriceMin &&
        price <= parsedPriceMax &&
        area >= parsedMinArea &&
        bedrooms >= parsedMinBedrooms
      );
    });
  }, [listings, minArea, minBedrooms, priceMax, priceMin, propertyTypeFilters, transactionType]);

  return (
    <main className="app-shell">
      {error && <div className="error-banner">{error}</div>}
      <ListingList
        listings={filteredListings}
        selectedId={selectedListing?.id ?? null}
        onSelect={handleSelect}
        filters={{
          priceMin,
          priceMax,
          minArea,
          minBedrooms,
          transactionType,
          propertyTypeFilters,
        }}
        onFiltersChange={{
          setPriceMin,
          setPriceMax,
          setMinArea,
          setMinBedrooms,
          setTransactionType,
          setPropertyTypeFilters,
        }}
      />
      <section className="content-pane">
        <DetailsPanel listing={selectedListing} summary={summary} />
        <MapPanel listing={selectedListing} />
      </section>
    </main>
  );
}
