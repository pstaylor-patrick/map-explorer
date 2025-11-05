export type TrendDirection = "up" | "down" | "steady";

export type LocationPoint = {
  id: string;
  name: string;
  city: string;
  state: string;
  stateCode: string;
  coordinates: [number, number]; // [longitude, latitude]
  focusAreas: string[];
  summary: string;
  metrics: {
    reach: number;
    impactScore: number;
    funding: number;
    lastUpdated: string;
    trend: TrendDirection;
  };
};

export type StateInsight = {
  state: string;
  stateCode: string;
  headline: string;
  highlights: string[];
  totalPrograms: number;
  averageImpact: number;
  centroid: [number, number];
};

export const LOCATION_DATA: LocationPoint[] = [
  {
    id: "denver-climate-hub",
    name: "Front Range Climate Hub",
    city: "Denver",
    state: "Colorado",
    stateCode: "CO",
    coordinates: [-104.9903, 39.7392],
    focusAreas: ["Climate Resilience", "Community Readiness"],
    summary:
      "A public-private partnership helping cities across the Front Range coordinate wildfire mitigation and air-quality monitoring.",
    metrics: {
      reach: 27,
      impactScore: 88,
      funding: 4.2,
      lastUpdated: "2024-11-04",
      trend: "up",
    },
  },
  {
    id: "austin-tech-bridge",
    name: "Austin Workforce Bridge",
    city: "Austin",
    state: "Texas",
    stateCode: "TX",
    coordinates: [-97.7431, 30.2672],
    focusAreas: ["Workforce Development", "STEM"],
    summary:
      "Hands-on apprenticeship network connecting emerging tech companies with community colleges and nonprofit training partners.",
    metrics: {
      reach: 41,
      impactScore: 82,
      funding: 5.6,
      lastUpdated: "2024-10-19",
      trend: "steady",
    },
  },
  {
    id: "chicago-community-insight",
    name: "Midwest Community Insight Lab",
    city: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    coordinates: [-87.6298, 41.8781],
    focusAreas: ["Data Activation", "Civic Engagement"],
    summary:
      "Open-data collaboration giving municipalities playbooks to operationalize real-time community pulse dashboards.",
    metrics: {
      reach: 18,
      impactScore: 91,
      funding: 6.1,
      lastUpdated: "2024-09-12",
      trend: "up",
    },
  },
  {
    id: "seattle-blue-economy",
    name: "Puget Sound Blue Economy Fund",
    city: "Seattle",
    state: "Washington",
    stateCode: "WA",
    coordinates: [-122.3321, 47.6062],
    focusAreas: ["Sustainability", "Blue Economy"],
    summary:
      "Catalyst investment portfolio backing marine innovation labs, shoreline restoration, and port decarbonization pilots.",
    metrics: {
      reach: 12,
      impactScore: 86,
      funding: 8.4,
      lastUpdated: "2024-08-28",
      trend: "steady",
    },
  },
  {
    id: "atlanta-digital-equity",
    name: "Atlanta Digital Equity Exchange",
    city: "Atlanta",
    state: "Georgia",
    stateCode: "GA",
    coordinates: [-84.388, 33.749],
    focusAreas: ["Digital Equity", "Broadband"],
    summary:
      "Regional exchange aligning infrastructure dollars with neighborhood level adoption and device access programming.",
    metrics: {
      reach: 35,
      impactScore: 79,
      funding: 3.3,
      lastUpdated: "2024-11-19",
      trend: "up",
    },
  },
  {
    id: "boston-biotech-talent",
    name: "Boston Biotech Talent Corridor",
    city: "Boston",
    state: "Massachusetts",
    stateCode: "MA",
    coordinates: [-71.0589, 42.3601],
    focusAreas: ["Life Sciences", "Workforce"],
    summary:
      "Talent corridor initiative linking research anchors with vocational programs and local employers filling lab tech roles.",
    metrics: {
      reach: 22,
      impactScore: 84,
      funding: 4.9,
      lastUpdated: "2024-07-07",
      trend: "down",
    },
  },
  {
    id: "phoenix-water-coalition",
    name: "Sonoran Water Coalition",
    city: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    coordinates: [-112.074, 33.4484],
    focusAreas: ["Water Innovation", "Climate Resilience"],
    summary:
      "Coalition funding drought mitigation pilots, micro-irrigation retrofits, and predictive analytics for water districts.",
    metrics: {
      reach: 16,
      impactScore: 77,
      funding: 2.8,
      lastUpdated: "2024-09-29",
      trend: "steady",
    },
  },
  {
    id: "new-york-social-impact",
    name: "Harbor Social Impact Studio",
    city: "New York City",
    state: "New York",
    stateCode: "NY",
    coordinates: [-74.006, 40.7128],
    focusAreas: ["Social Innovation", "Impact Investing"],
    summary:
      "Studio supporting catalytic capital projects and measurement frameworks for metropolitan social enterprises.",
    metrics: {
      reach: 29,
      impactScore: 93,
      funding: 9.1,
      lastUpdated: "2024-10-02",
      trend: "up",
    },
  },
];

export const STATE_INSIGHTS: StateInsight[] = [
  {
    state: "Colorado",
    stateCode: "CO",
    headline: "Wildfire readiness programs scaling across the Front Range.",
    highlights: [
      "Multi-county coordination hub",
      "Real-time air-quality sensors deployed",
      "Strong public-private cost share",
    ],
    totalPrograms: 11,
    averageImpact: 86,
    centroid: [-105.7821, 39.5501],
  },
  {
    state: "Texas",
    stateCode: "TX",
    headline: "High-volume tech apprenticeships filling entry-level roles.",
    highlights: [
      "New capital stack for wraparound services",
      "Safer pathways for non-traditional students",
      "Employer consortium growth +18% YoY",
    ],
    totalPrograms: 24,
    averageImpact: 81,
    centroid: [-99.9018, 31.9686],
  },
  {
    state: "Illinois",
    stateCode: "IL",
    headline: "Civic data collaboratives producing policy-ready insights.",
    highlights: [
      "City-county data-sharing compacts",
      "Best-in-class community governance model",
      "Public dashboards refreshed hourly",
    ],
    totalPrograms: 14,
    averageImpact: 89,
    centroid: [-89.3985, 40.6331],
  },
  {
    state: "Washington",
    stateCode: "WA",
    headline: "Maritime decarbonization accelerating with port pilots.",
    highlights: [
      "Hybrid-electric ferry retrofits funded",
      "Community shoreline restoration grants",
      "Blue economy incubator at full capacity",
    ],
    totalPrograms: 9,
    averageImpact: 83,
    centroid: [-120.7401, 47.7511],
  },
  {
    state: "Georgia",
    stateCode: "GA",
    headline: "Digital equity exchange supporting metro and rural partners.",
    highlights: [
      "Fiber deployment map with adoption triggers",
      "Device lending libraries covering 17 counties",
      "Anchor institutions sharing broadband playbooks",
    ],
    totalPrograms: 19,
    averageImpact: 78,
    centroid: [-82.9001, 32.1656],
  },
  {
    state: "Massachusetts",
    stateCode: "MA",
    headline: "Biotech workforce corridor balancing lab and field roles.",
    highlights: [
      "Stackable credentials align with employer ladders",
      "Rotational lab fellowships with stipends",
      "Cross-institutional mentorship network",
    ],
    totalPrograms: 15,
    averageImpact: 85,
    centroid: [-71.3824, 42.4072],
  },
  {
    state: "Arizona",
    stateCode: "AZ",
    headline: "Water resilience projects pushing conservation tech uptick.",
    highlights: [
      "Irrigation modernization targets high-use farms",
      "Predictive supply dashboards for water districts",
      "Utility rebate programs co-designed with tribes",
    ],
    totalPrograms: 12,
    averageImpact: 76,
    centroid: [-112.0938, 34.0489],
  },
  {
    state: "New York",
    stateCode: "NY",
    headline: "Impact studio elevating social enterprises to export playbooks.",
    highlights: [
      "Catalytic capital deployed into 14 ventures",
      "Measurement lab onboarding six new cities",
      "Anchor philanthropic commitments extended",
    ],
    totalPrograms: 28,
    averageImpact: 92,
    centroid: [-75.4999, 43.0004],
  },
];

export const STATE_INSIGHTS_BY_CODE: Record<string, StateInsight> =
  STATE_INSIGHTS.reduce(
    (acc, insight) => {
      acc[insight.stateCode] = insight;
      return acc;
    },
    {} as Record<string, StateInsight>,
  );

export const LOCATION_BY_ID: Record<string, LocationPoint> =
  LOCATION_DATA.reduce(
    (acc, location) => {
      acc[location.id] = location;
      return acc;
    },
    {} as Record<string, LocationPoint>,
  );
