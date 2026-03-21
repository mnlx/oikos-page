import type { Listing, Summary } from "../types";

type Props = {
  listing: Listing | null;
  summary: Summary | null;
};

function dateLabel(value: string | null | undefined): string {
  if (!value) {
    return "n/d";
  }
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

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

export function DetailsPanel({ listing, summary }: Props) {
  if (!listing) {
    return (
      <section className="details-pane empty-state">
        <p>Selecione uma listagem para ver detalhes, links e dados de scraping.</p>
      </section>
    );
  }

  return (
    <section className="details-pane">
      <div className="details-top">
        <div className="scrape-meta">
          <p className="eyebrow">Scrape Data</p>
          <ul>
            <li>Fonte: {listing.source_name}</li>
            <li>Broker: {listing.broker_name ?? "n/d"}</li>
            <li>Último scrape: {dateLabel(listing.last_scraped_at)}</li>
            <li>Última execução: {dateLabel(summary?.latest_scrape_finished_at)}</li>
            <li>Status: {summary?.latest_scrape_status ?? "n/d"}</li>
          </ul>
        </div>
        <div className="detail-links">
          <a href={listing.canonical_url} target="_blank" rel="noreferrer">
            Abrir anúncio
          </a>
          {typeof listing.raw_payload.raw_html === "string" && (
            <a href={listing.canonical_url} target="_blank" rel="noreferrer">
              Ver fonte original
            </a>
          )}
        </div>
      </div>
      <div className="detail-body">
        <h2>{listing.title}</h2>
        <p className="detail-price">{money(listing.price_rent ?? listing.price_sale)}</p>
        <p className="detail-address">
          {[listing.address, listing.neighborhood, `${listing.city}/${listing.state}`].filter(Boolean).join(" • ")}
        </p>
        <div className="detail-grid">
          <span>{listing.property_type}</span>
          <span>{listing.bedrooms ?? "n/d"} quartos</span>
          <span>{listing.bathrooms ?? "n/d"} banheiros</span>
          <span>{listing.parking_spaces ?? "n/d"} vagas</span>
          <span>{listing.area_m2 ? `${listing.area_m2} m²` : "área n/d"}</span>
        </div>
        <p className="detail-description">{listing.description ?? "Sem descrição disponível."}</p>
      </div>
    </section>
  );
}
