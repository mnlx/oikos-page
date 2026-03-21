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
    transactionType: "all" | "rent" | "sale";
    propertyTypeFilters: {
      apartment: boolean;
      house: boolean;
    };
  };
  onFiltersChange: {
    setPriceMin: (value: string) => void;
    setPriceMax: (value: string) => void;
    setMinArea: (value: string) => void;
    setMinBedrooms: (value: string) => void;
    setTransactionType: (value: "all" | "rent" | "sale") => void;
    setPropertyTypeFilters: (value: { apartment: boolean; house: boolean }) => void;
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
  function togglePropertyType(type: "apartment" | "house") {
    onFiltersChange.setPropertyTypeFilters({
      ...filters.propertyTypeFilters,
      [type]: !filters.propertyTypeFilters[type],
    });
  }

  return (
    <aside className="listing-pane">
      <div className="pane-header">
        <p className="eyebrow">Listings</p>
        <h1>Oikos</h1>
        <span>{listings.length} resultados</span>
      </div>
      <div className="listing-filters">
        <div className="transaction-switch" role="tablist" aria-label="Tipo de negocio">
          <button
            type="button"
            className={filters.transactionType === "all" ? "is-active" : ""}
            onClick={() => onFiltersChange.setTransactionType("all")}
          >
            Todos
          </button>
          <button
            type="button"
            className={filters.transactionType === "rent" ? "is-active" : ""}
            onClick={() => onFiltersChange.setTransactionType("rent")}
          >
            Alugar
          </button>
          <button
            type="button"
            className={filters.transactionType === "sale" ? "is-active" : ""}
            onClick={() => onFiltersChange.setTransactionType("sale")}
          >
            Comprar
          </button>
        </div>
        <div className="property-switch" role="group" aria-label="Tipo de imóvel">
          <button
            type="button"
            className={filters.propertyTypeFilters.apartment ? "is-active" : ""}
            onClick={() => togglePropertyType("apartment")}
          >
            Apartamentos
          </button>
          <button
            type="button"
            className={filters.propertyTypeFilters.house ? "is-active" : ""}
            onClick={() => togglePropertyType("house")}
          >
            Casas
          </button>
        </div>
        <label>
          <span>Preco min</span>
          <input
            type="number"
            min="0"
            placeholder="R$ 0"
            value={filters.priceMin}
            onChange={(event) => onFiltersChange.setPriceMin(event.target.value)}
          />
        </label>
        <label>
          <span>Preco max</span>
          <input
            type="number"
            min="0"
            placeholder="Sem limite"
            value={filters.priceMax}
            onChange={(event) => onFiltersChange.setPriceMax(event.target.value)}
          />
        </label>
        <label>
          <span>Area min</span>
          <input
            type="number"
            min="0"
            placeholder="Ex. 65 m²"
            value={filters.minArea}
            onChange={(event) => onFiltersChange.setMinArea(event.target.value)}
          />
        </label>
        <label>
          <span>Quartos min</span>
          <input
            type="number"
            min="0"
            placeholder="Ex. 2"
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
