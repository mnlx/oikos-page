import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box } from "@mui/material";

import { fetchListing, fetchListings, fetchSummary } from "./api";
import { DetailsPanel } from "./components/DetailsPanel";
import { GalleryPanel } from "./components/GalleryPanel";
import { ListingList } from "./components/ListingList";
import { MapPanel } from "./components/MapPanel";
import type { Listing, Summary } from "./types";

type SortOrder = "featured" | "price-asc" | "price-desc" | "area-desc" | "recent";

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minArea, setMinArea] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [transactionType, setTransactionType] = useState<"all" | "rent" | "sale">("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");
  const [propertyTypeFilters, setPropertyTypeFilters] = useState({
    apartment: true,
    house: true,
  });
  const selectionRequestRef = useRef(0);

  useEffect(() => {
    async function load() {
      setIsBooting(true);
      setError(null);
      try {
        const [listingData, summaryData] = await Promise.all([fetchListings(), fetchSummary()]);
        startTransition(() => {
          setListings(listingData);
          setSummary(summaryData);
        });

        if (listingData[0]) {
          await loadSelectedListing(listingData[0].id);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load data.");
      } finally {
        setIsBooting(false);
      }
    }

    void load();
  }, []);

  async function loadSelectedListing(id: number) {
    const requestId = ++selectionRequestRef.current;
    setError(null);
    setIsSelecting(true);
    startTransition(() => {
      setSelectedListingId(id);
    });

    try {
      const detail = await fetchListing(id);
      if (requestId !== selectionRequestRef.current) {
        return;
      }
      startTransition(() => {
        setSelectedListing(detail);
      });
    } catch (loadError) {
      if (requestId === selectionRequestRef.current) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load listing.");
      }
    } finally {
      if (requestId === selectionRequestRef.current) {
        setIsSelecting(false);
      }
    }
  }

  async function handleSelect(listing: Listing) {
    if (listing.id === selectedListingId && selectedListing) {
      return;
    }
    await loadSelectedListing(listing.id);
  }

  const filteredListings = useMemo(() => {
    const parsedPriceMin = Number(priceMin) || 0;
    const parsedPriceMax = Number(priceMax) || Number.POSITIVE_INFINITY;
    const parsedMinArea = Number(minArea) || 0;
    const parsedMinBedrooms = Number(minBedrooms) || 0;

    const filtered = listings.filter((listing) => {
      const price = listing.price_rent ?? listing.price_sale ?? 0;
      const area = listing.area_m2 ?? 0;
      const bedrooms = listing.bedrooms ?? 0;
      const propertyTypeMatches =
        (listing.property_type === "apartment" && propertyTypeFilters.apartment) ||
        (listing.property_type === "house" && propertyTypeFilters.house);

      return (
        (listing.price_rent != null || listing.price_sale != null) &&
        (transactionType === "all" || listing.transaction_type === transactionType) &&
        propertyTypeMatches &&
        price >= parsedPriceMin &&
        price <= parsedPriceMax &&
        area >= parsedMinArea &&
        bedrooms >= parsedMinBedrooms
      );
    });

    return [...filtered].sort((left, right) => {
      const leftPrice = left.price_rent ?? left.price_sale ?? Number.POSITIVE_INFINITY;
      const rightPrice = right.price_rent ?? right.price_sale ?? Number.POSITIVE_INFINITY;
      const leftArea = left.area_m2 ?? 0;
      const rightArea = right.area_m2 ?? 0;
      const leftPublished = left.published_at ? new Date(left.published_at).getTime() : 0;
      const rightPublished = right.published_at ? new Date(right.published_at).getTime() : 0;

      switch (sortOrder) {
        case "price-asc":
          return leftPrice - rightPrice;
        case "price-desc":
          return rightPrice - leftPrice;
        case "area-desc":
          return rightArea - leftArea;
        case "recent":
          return rightPublished - leftPublished;
        case "featured":
        default:
          return right.image_count - left.image_count || rightArea - leftArea || leftPrice - rightPrice;
      }
    });
  }, [listings, minArea, minBedrooms, priceMax, priceMin, propertyTypeFilters, sortOrder, transactionType]);

  useEffect(() => {
    if (isBooting) {
      return;
    }

    if (filteredListings.length === 0) {
      startTransition(() => {
        setSelectedListingId(null);
        setSelectedListing(null);
      });
      return;
    }

    if (selectedListingId && filteredListings.some((listing) => listing.id === selectedListingId)) {
      return;
    }

    void loadSelectedListing(filteredListings[0].id);
  }, [filteredListings, isBooting, selectedListingId]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceMin) count += 1;
    if (priceMax) count += 1;
    if (minArea) count += 1;
    if (minBedrooms) count += 1;
    if (transactionType !== "all") count += 1;
    if (!propertyTypeFilters.apartment || !propertyTypeFilters.house) count += 1;
    if (sortOrder !== "featured") count += 1;
    return count;
  }, [minArea, minBedrooms, priceMax, priceMin, propertyTypeFilters, sortOrder, transactionType]);

  function clearFilters() {
    setPriceMin("");
    setPriceMax("");
    setMinArea("");
    setMinBedrooms("");
    setTransactionType("all");
    setSortOrder("featured");
    setPropertyTypeFilters({
      apartment: true,
      house: true,
    });
  }

  return (
    <Box component="main" className="app-shell">
      {error && (
        <Alert severity="error" className="error-banner">
          {error}
        </Alert>
      )}
      <ListingList
        listings={filteredListings}
        selectedId={selectedListingId}
        onSelect={handleSelect}
        isLoading={isBooting}
        activeFilterCount={activeFilterCount}
        onClearFilters={clearFilters}
        filters={{
          priceMin,
          priceMax,
          minArea,
          minBedrooms,
          transactionType,
          sortOrder,
          propertyTypeFilters,
        }}
        onFiltersChange={{
          setPriceMin,
          setPriceMax,
          setMinArea,
          setMinBedrooms,
          setTransactionType,
          setSortOrder,
          setPropertyTypeFilters,
        }}
      />
      <Box component="section" className="content-pane">
        <GalleryPanel listing={selectedListing} isLoading={isBooting || isSelecting} />
        <Box className="content-grid">
          <DetailsPanel listing={selectedListing} summary={summary} isLoading={isBooting || isSelecting} />
          <MapPanel listing={selectedListing} isLoading={isBooting || isSelecting} />
        </Box>
      </Box>
    </Box>
  );
}
