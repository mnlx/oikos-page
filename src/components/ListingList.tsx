import type { Listing } from "../types";

type Props = {
  listings: Listing[];
  selectedId: number | null;
  onSelect: (listing: Listing) => void;
  filters: {
    priceMin: string;
    priceMax: string;
    minArea: string;
    minBedrooms: string;
  };
  onFiltersChange: {
    setPriceMin: (value: string) => void;
    setPriceMax: (value: string) => void;
    setMinArea: (value: string) => void;
    setMinBedrooms: (value: string) => void;
  };
};

function money(value: number | null | undefined): string {
  if (value == null) {
    return "Consulte";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ListingList({ listings, selectedId, onSelect, filters, onFiltersChange }: Props) {
  return (
    <aside className="listing-pane">
      <div className="pane-header">
        <p className="eyebrow">Listings</p>
        <h1>Oikos</h1>
        <span>{listings.length} resultados</span>
      </div>
      <div className="listing-filters">
        <label>
          <span>Preco min</span>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.priceMin}
            onChange={(event) => onFiltersChange.setPriceMin(event.target.value)}
          />
        </label>
        <label>
          <span>Preco max</span>
          <input
            type="number"
            min="0"
            placeholder="sem teto"
            value={filters.priceMax}
            onChange={(event) => onFiltersChange.setPriceMax(event.target.value)}
          />
        </label>
        <label>
          <span>Area min</span>
          <input
            type="number"
            min="0"
            placeholder="m²"
            value={filters.minArea}
            onChange={(event) => onFiltersChange.setMinArea(event.target.value)}
          />
        </label>
        <label>
          <span>Quartos min</span>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={filters.minBedrooms}
            onChange={(event) => onFiltersChange.setMinBedrooms(event.target.value)}
          />
        </label>
      </div>
      <div className="listing-list">
        {listings.map((listing) => (
          <button
            key={listing.id}
            className={`listing-card ${selectedId === listing.id ? "is-selected" : ""}`}
            onClick={() => onSelect(listing)}
            type="button"
          >
            <div className="listing-card-top">
              <span>{listing.source_name}</span>
              <span>{listing.transaction_type}</span>
            </div>
            <p className="listing-price">{money(listing.price_rent ?? listing.price_sale)}</p>
            <strong>{listing.title}</strong>
            <p className="listing-subtle">{listing.neighborhood ?? listing.city}</p>
            <div className="listing-metrics">
              <span>{listing.property_type}</span>
              <span>{listing.area_m2 ? `${listing.area_m2} m²` : "Área n/d"}</span>
              <span>{listing.bedrooms ? `${listing.bedrooms} qts` : "qts n/d"}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
