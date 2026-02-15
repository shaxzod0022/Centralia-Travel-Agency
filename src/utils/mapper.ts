// src/mappers/facet.mapper.ts
import { BackendFacets, FilterFacets } from "@/interfaces/filter.interface";

export const mapBackendFacetsToUI = (facets: BackendFacets): FilterFacets => ({
  countries: facets.countries.map((c) => ({
    value: String(c.id),
    label: c.name,
    count: c.count,
    disabled: c.disabled,
  })),

  destinations: facets.destinations.map((d) => ({
    value: String(d.id),
    label: d.name,
    count: d.count,
    disabled: d.disabled,
  })),

  categories: facets.categories.map((c) => ({
    value: String(c.key),
    label: c.value,
    count: c.count,
    disabled: c.disabled,
  })),

  duration: facets.duration.map((d) => ({
    value: d.key,
    label: d.key,
    count: d.count,
    disabled: d.disabled,
  })),

  season: facets.season.map((s) => ({
    value: s.key,
    label: s.key,
    count: s.count,
    disabled: s.disabled,
  })),

  technical: facets.technical.map((t) => ({
    value: String(t.key),
    label: `${t.key}/5`,
    count: t.count,
    disabled: t.disabled,
  })),

  fitness: facets.fitness.map((f) => ({
    value: String(f.key),
    label: `${f.key}/5`,
    count: f.count,
    disabled: f.disabled,
  })),

  price: facets.price.map((p) => ({
    value: p.key,
    label: `${p.key} $`,
    count: p.count,
    disabled: p.disabled,
  })),
});
