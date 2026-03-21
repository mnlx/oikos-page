import type { Listing } from "../types";

type Props = {
  listings: Listing[];
  selectedId: number | null;
  onSelect: (listing: Listing) => void;
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

export function ListingList({ listings, selectedId, onSelect }: Props) {
  return (
    <aside className="listing-pane">
      <div className="pane-header">
        <p className="eyebrow">Listings</p>
        <h1>Oikos</h1>
        <span>{listings.length} resultados</span>
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
            <strong>{listing.title}</strong>
            <p>{listing.neighborhood ?? listing.city}</p>
            <div className="listing-metrics">
              <span>{money(listing.price_rent ?? listing.price_sale)}</span>
              <span>{listing.area_m2 ? `${listing.area_m2} m²` : "Área n/d"}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
