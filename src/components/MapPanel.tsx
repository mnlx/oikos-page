import type { Listing } from "../types";

type Props = {
  listing: Listing | null;
};

function mapUrl(listing: Listing): string {
  const bbox = [
    (listing.longitude ?? -48.55) - 0.03,
    (listing.latitude ?? -27.6) - 0.02,
    (listing.longitude ?? -48.55) + 0.03,
    (listing.latitude ?? -27.6) + 0.02,
  ].join("%2C");
  const marker = `${listing.latitude ?? -27.6}%2C${listing.longitude ?? -48.55}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
}

export function MapPanel({ listing }: Props) {
  return (
    <section className="map-pane">
      <div className="pane-header compact">
        <p className="eyebrow">Map</p>
        <span>{listing?.address ?? listing?.neighborhood ?? "Localização aproximada"}</span>
      </div>
      <div className="map-frame">
        {listing ? (
          <iframe title="listing-map" src={mapUrl(listing)} loading="lazy" />
        ) : (
          <div className="empty-state">Selecione uma listagem com coordenadas para ver o mapa.</div>
        )}
      </div>
    </section>
  );
}
