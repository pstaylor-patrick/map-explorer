"use client";

import { useId, useMemo, useState } from "react";
import type { JSX } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import {
  LOCATION_BY_ID,
  LOCATION_DATA,
  STATE_INSIGHTS,
  STATE_INSIGHTS_BY_CODE,
  type LocationPoint,
  type StateInsight,
  type TrendDirection,
} from "@/data/mockLocations";
import usStates from "us-atlas/states-10m.json";

type StateProperties = { name?: string } & Record<string, unknown>;

type StateFeature = Feature<Geometry, StateProperties>;

const statesTopology = usStates as unknown as Topology;
const stateObjects = statesTopology.objects as Record<string, unknown>;
const stateGeometryObject = stateObjects.states as unknown;
const stateFeatureResult = feature(
  statesTopology,
  stateGeometryObject as never,
) as unknown;
const stateFeatures = stateFeatureResult as FeatureCollection<
  Geometry,
  StateProperties
>;

const FIPS_TO_STATE_CODE: Record<string, string> = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
  "12": "FL",
  "13": "GA",
  "15": "HI",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY",
};

const formatMillions = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatNumber = new Intl.NumberFormat("en-US");

const searchTargets = LOCATION_DATA.map((location) => ({
  id: location.id,
  terms: [
    location.name,
    location.city,
    location.state,
    location.stateCode,
    ...location.focusAreas,
  ]
    .join(" ")
    .toLowerCase(),
}));

const stateSearchTargets = STATE_INSIGHTS.map((state) => ({
  code: state.stateCode,
  terms: [state.state, ...state.highlights, state.headline]
    .join(" ")
    .toLowerCase(),
}));

const TREND_LABEL: Record<TrendDirection, string> = {
  up: "Rising momentum",
  down: "Needs support",
  steady: "Stable trajectory",
};

const TREND_TONE: Record<TrendDirection, string> = {
  up: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  down: "bg-rose-500/10 text-rose-300 border-rose-500/40",
  steady: "bg-sky-500/10 text-sky-300 border-sky-500/40",
};

const HIGHLIGHT_CHIP =
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase";

const MAP_BACKGROUND = "bg-slate-900";

function getStateFromFeature(feature: StateFeature): {
  code: string | null;
  name: string | undefined;
} {
  const fips = feature.id?.toString();
  const code = fips ? (FIPS_TO_STATE_CODE[fips] ?? null) : null;
  const name = feature.properties?.name;
  return { code, name };
}

function trendTone(trend: TrendDirection): string {
  return TREND_TONE[trend] ?? TREND_TONE.steady;
}

function formatImpactScore(score: number): string {
  return `${score}/100`;
}

function formatFunding(amount: number): string {
  return `$${formatMillions.format(amount)}M`;
}

function formatPrograms(count: number): string {
  return `${count} program${count === 1 ? "" : "s"}`;
}

function filterLocations(query: string): LocationPoint[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return LOCATION_DATA;
  }

  return LOCATION_DATA.filter((location, index) => {
    const searchEntry = searchTargets[index];
    return searchEntry.terms.includes(normalized);
  });
}

function filterStates(query: string): StateInsight[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return STATE_INSIGHTS;
  }

  return STATE_INSIGHTS.filter((state, index) => {
    const searchEntry = stateSearchTargets[index];
    return searchEntry.terms.includes(normalized);
  });
}

export function MapExplorer(): JSX.Element {
  const defaultLocation = LOCATION_DATA[0];

  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    defaultLocation.id,
  );
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>(
    defaultLocation.stateCode,
  );
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const searchInputId = useId();

  const locationMatches = useMemo(
    () => filterLocations(searchTerm),
    [searchTerm],
  );

  const stateMatches = useMemo(() => filterStates(searchTerm), [searchTerm]);

  const activeLocationIds = useMemo(() => {
    return new Set(locationMatches.map((location) => location.id));
  }, [locationMatches]);

  const selectedLocation = LOCATION_BY_ID[selectedLocationId];

  const derivedStateInsight: StateInsight | undefined = useMemo(() => {
    if (selectedStateCode) {
      return STATE_INSIGHTS_BY_CODE[selectedStateCode];
    }
    if (selectedLocation) {
      return STATE_INSIGHTS_BY_CODE[selectedLocation.stateCode];
    }
    return undefined;
  }, [selectedStateCode, selectedLocation]);

  const spotlightState = useMemo(() => {
    if (hoveredStateCode && STATE_INSIGHTS_BY_CODE[hoveredStateCode]) {
      return STATE_INSIGHTS_BY_CODE[hoveredStateCode];
    }
    return derivedStateInsight;
  }, [hoveredStateCode, derivedStateInsight]);

  const summaryMetrics = useMemo(() => {
    const totalFunding = LOCATION_DATA.reduce(
      (acc, location) => acc + location.metrics.funding,
      0,
    );
    const averageImpact =
      LOCATION_DATA.reduce(
        (acc, location) => acc + location.metrics.impactScore,
        0,
      ) / LOCATION_DATA.length;

    return {
      programs: LOCATION_DATA.length,
      funding: totalFunding,
      impact: Math.round(averageImpact),
    };
  }, []);

  function handleStateSelect(nextStateCode: string | null) {
    setSelectedStateCode(nextStateCode);
    if (!nextStateCode) {
      return;
    }
    const relatedLocation = LOCATION_DATA.find(
      (location) => location.stateCode === nextStateCode,
    );
    if (relatedLocation) {
      setSelectedLocationId(relatedLocation.id);
    }
  }

  function handleLocationSelect(locationId: string) {
    const nextLocation = LOCATION_BY_ID[locationId];
    if (!nextLocation) {
      return;
    }

    setSelectedLocationId(locationId);
    setSelectedStateCode(nextLocation.stateCode);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-14 pt-10 lg:flex-row lg:pb-20">
        <section className="flex-1 lg:max-w-[58%]">
          <div className="space-y-6">
            <header className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Impact Explorer
              </span>
              <h1 className="text-4xl font-semibold text-white">
                US Programs in Focus
              </h1>
              <p className="max-w-xl text-sm text-slate-400 lg:text-base">
                High-level prototype giving stakeholders a polished feel for how
                we can surface location intelligence, state level context, and
                program metadata in one place.
              </p>
            </header>
            <div
              className={`relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,255,0.15),transparent_60%)]" />
              <div className="relative flex items-center justify-between px-6 pb-4 pt-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-indigo-200/80">
                    Portfolio Snapshot
                  </p>
                  <div className="mt-3 flex flex-wrap gap-6 text-sm text-indigo-100/90">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {formatPrograms(summaryMetrics.programs)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Mapped initiatives
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {formatFunding(summaryMetrics.funding)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Total represented capital
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {formatImpactScore(summaryMetrics.impact)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Average impact score
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden h-20 w-px bg-white/10 sm:block" />
                <div className="hidden max-w-[180px] flex-1 text-sm text-slate-300 sm:block">
                  <p>
                    Click into a marker or state to see program metadata, trend
                    signals, and curated highlights tailored to partner
                    conversations.
                  </p>
                </div>
              </div>
              <div className={`relative ${MAP_BACKGROUND} px-4 pb-6 pt-3`}>
                <div className="relative aspect-[4/3]">
                  <ComposableMap
                    projection="geoAlbersUsa"
                    projectionConfig={{
                      scale: 980,
                    }}
                    width={900}
                    height={675}
                    className="w-full"
                  >
                    <Geographies<StateFeature> geography={stateFeatures}>
                      {({ geographies }: { geographies: StateFeature[] }) =>
                        geographies.map(
                          (feature: StateFeature, index: number) => {
                            const { code, name } = getStateFromFeature(feature);
                            const isActive = code
                              ? selectedStateCode === code
                              : false;
                            const hasInsight = code
                              ? Boolean(STATE_INSIGHTS_BY_CODE[code])
                              : false;

                            const baseFill = hasInsight
                              ? "rgba(129, 140, 248, 0.35)"
                              : "rgba(30, 41, 59, 0.7)";
                            const hoverFill = hasInsight
                              ? "rgba(165, 180, 252, 0.55)"
                              : "rgba(51, 65, 85, 0.85)";
                            const selectedFill = "rgba(99, 102, 241, 0.8)";

                            const featureKey = String(feature.id ?? index);

                            return (
                              <Geography
                                key={featureKey}
                                geography={feature}
                                stroke="rgba(148, 163, 184, 0.2)"
                                strokeWidth={isActive ? 1.4 : 0.8}
                                style={{
                                  default: {
                                    fill: isActive ? selectedFill : baseFill,
                                    outline: "none",
                                    cursor: hasInsight ? "pointer" : "default",
                                  },
                                  hover: {
                                    fill: isActive ? selectedFill : hoverFill,
                                    outline: "none",
                                    cursor: hasInsight ? "pointer" : "default",
                                  },
                                  pressed: {
                                    fill: selectedFill,
                                    outline: "none",
                                    cursor: hasInsight ? "pointer" : "default",
                                  },
                                }}
                                onMouseEnter={() =>
                                  setHoveredStateCode(hasInsight ? code : null)
                                }
                                onFocus={() =>
                                  setHoveredStateCode(hasInsight ? code : null)
                                }
                                onMouseLeave={() => setHoveredStateCode(null)}
                                onBlur={() => setHoveredStateCode(null)}
                                onClick={() => handleStateSelect(code ?? null)}
                                tabIndex={hasInsight ? 0 : -1}
                                aria-label={name ?? "State"}
                              />
                            );
                          },
                        )
                      }
                    </Geographies>

                    {LOCATION_DATA.map((location) => {
                      const isSelected = location.id === selectedLocationId;
                      const isVisible =
                        !searchTerm || activeLocationIds.has(location.id);
                      const opacity = isVisible ? 1 : 0.3;
                      const markerRadius = isSelected ? 8 : 6;

                      return (
                        <Marker
                          key={location.id}
                          coordinates={location.coordinates}
                          onClick={() => handleLocationSelect(location.id)}
                          onMouseEnter={() =>
                            setHoveredStateCode(location.stateCode)
                          }
                          onMouseLeave={() => setHoveredStateCode(null)}
                          className="cursor-pointer"
                        >
                          <g transform="translate(0, -6)">
                            <circle
                              r={markerRadius}
                              fill={isSelected ? "#C7D2FE" : "#F97316"}
                              stroke="#0f172a"
                              strokeWidth={isSelected ? 2 : 1.2}
                              opacity={opacity}
                            />
                            <text
                              textAnchor="middle"
                              y={markerRadius + 12}
                              className="text-[10px] font-medium tracking-wide text-white"
                              opacity={isVisible ? 0.85 : 0.2}
                            >
                              {location.city}
                            </text>
                          </g>
                        </Marker>
                      );
                    })}
                  </ComposableMap>
                  {spotlightState ? (
                    <div className="pointer-events-none absolute left-5 top-5 z-10 max-w-xs rounded-2xl border border-white/10 bg-slate-900/85 px-4 py-3 shadow-lg backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">
                        {spotlightState.stateCode} · State spotlight
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {spotlightState.state}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        {spotlightState.headline}
                      </p>
                      <div className="mt-3 flex gap-4 text-xs text-indigo-100/80">
                        <div>
                          <p className="font-semibold text-white">
                            {formatPrograms(spotlightState.totalPrograms)}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.25em] text-indigo-200/60">
                            Density
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {formatImpactScore(spotlightState.averageImpact)}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.25em] text-indigo-200/60">
                            Avg Impact
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5" />
                </div>
              </div>
              <div className="relative flex flex-wrap items-center gap-6 border-t border-white/5 px-6 py-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-indigo-400" />
                  <span>State insight available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-orange-400" />
                  <span>Program marker</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-white/50" />
                  <span>Click to reveal detail panel</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex-1 space-y-6 lg:max-w-[42%]">
          <div className="rounded-3xl border border-white/5 bg-slate-900/80 p-6 shadow-xl">
            <label
              htmlFor={searchInputId}
              className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400"
            >
              Search Signal
            </label>
            <input
              id={searchInputId}
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try “digital equity”, “Austin”, or “water coalition”"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
            />
            {searchTerm ? (
              <div className="mt-5 space-y-5 text-sm text-slate-300">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Locations
                  </p>
                  <ul className="mt-3 space-y-2">
                    {locationMatches.length > 0 ? (
                      locationMatches.slice(0, 6).map((location) => {
                        const isActive = location.id === selectedLocationId;
                        return (
                          <li key={location.id}>
                            <button
                              type="button"
                              onClick={() => handleLocationSelect(location.id)}
                              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                                isActive
                                  ? "border-indigo-400/60 bg-indigo-500/10 text-white"
                                  : "border-white/5 bg-white/5 text-slate-200 hover:border-indigo-400/40 hover:bg-indigo-400/10"
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
                                <span>{location.stateCode}</span>
                                <span>{location.focusAreas[0]}</span>
                              </div>
                              <p className="mt-2 text-sm font-medium text-white">
                                {location.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {location.city}, {location.state}
                              </p>
                            </button>
                          </li>
                        );
                      })
                    ) : (
                      <li className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-slate-400">
                        No programs aligned to that search (yet).
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    States
                  </p>
                  <ul className="mt-3 space-y-2">
                    {stateMatches.length > 0 ? (
                      stateMatches.slice(0, 6).map((state) => {
                        const isActive =
                          state.stateCode === derivedStateInsight?.stateCode;
                        return (
                          <li key={state.stateCode}>
                            <button
                              type="button"
                              onClick={() => handleStateSelect(state.stateCode)}
                              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                                isActive
                                  ? "border-emerald-400/60 bg-emerald-500/10 text-white"
                                  : "border-white/5 bg-white/5 text-slate-200 hover:border-emerald-400/40 hover:bg-emerald-400/10"
                              }`}
                            >
                              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
                                <span>{state.stateCode}</span>
                                <span>
                                  {formatImpactScore(state.averageImpact)}
                                </span>
                              </div>
                              <p className="mt-2 text-sm font-medium text-white">
                                {state.state}
                              </p>
                              <p className="text-xs text-slate-400">
                                {state.headline}
                              </p>
                            </button>
                          </li>
                        );
                      })
                    ) : (
                      <li className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-slate-400">
                        Try widening the search – no state signals matched.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-400">
                Use the search to find relevant programs or state rollups. We
                match by location, focus area, and headline language to keep
                results intuitive.
              </p>
            )}
          </div>

          {selectedLocation ? (
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/5 bg-slate-900/80 p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`${HIGHLIGHT_CHIP} border-indigo-400/40 bg-indigo-500/10 text-xs text-indigo-200/80`}
                    >
                      {selectedLocation.stateCode} · {selectedLocation.city}
                    </span>
                    <h2 className="mt-4 text-2xl font-semibold text-white">
                      {selectedLocation.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                      {selectedLocation.summary}
                    </p>
                  </div>
                  <span
                    className={`${HIGHLIGHT_CHIP} ${trendTone(selectedLocation.metrics.trend)}`}
                  >
                    {TREND_LABEL[selectedLocation.metrics.trend]}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Impact Score
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatImpactScore(selectedLocation.metrics.impactScore)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Annual Funding
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatFunding(selectedLocation.metrics.funding)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Partners Reached
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatNumber.format(selectedLocation.metrics.reach)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Last Updated
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {new Date(
                        selectedLocation.metrics.lastUpdated,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                    Focus Strands
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLocation.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center rounded-full border border-indigo-400/40 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-100"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {derivedStateInsight ? (
                <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span
                        className={`${HIGHLIGHT_CHIP} border-emerald-400/40 bg-emerald-400/10 text-emerald-200/80`}
                      >
                        State Signal · {derivedStateInsight.stateCode}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold text-white">
                        {derivedStateInsight.state}
                      </h3>
                      <p className="mt-2 text-sm text-emerald-100/80">
                        {derivedStateInsight.headline}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-right text-sm text-emerald-100">
                      <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                        Portfolio Density
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatPrograms(derivedStateInsight.totalPrograms)}
                      </p>
                      <p className="text-xs text-emerald-200/70">
                        Avg. impact{" "}
                        {formatImpactScore(derivedStateInsight.averageImpact)}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-emerald-100/80">
                    {derivedStateInsight.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-emerald-300" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/5 bg-slate-900/80 p-6 text-sm text-slate-300">
              Select a program marker to load metadata and state context.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default MapExplorer;
