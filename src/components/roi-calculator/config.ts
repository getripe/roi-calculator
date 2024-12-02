// Configuration object for all text content
export const content = {
  title: "ROI Calculator",
  signups: {
    label: "Qualified Signups",
    description: "The number of qualified signups (MQLs / ICP / PQLs etc) that your team wants to get in contact with",
    toastTitle: "Updated Signups",
    toastDescription: (value: number) => `Qualified signups set to ${value}`,
  },
  revenue: {
    label: "Revenue per Closed Deal (Average Contract Value)",
    description: "The average contract value",
    toastTitle: "Updated Revenue per Closed Deal",
    toastDescription: (value: string) => `Revenue per closed deal set to ${value}`,
  },
  closeRate: {
    label: "Sales Close Rate",
    description: "Percentage of sales leads that result in customer conversions",
    toastTitle: "Updated Close Rate",
    toastDescription: (value: string) => `Sales close rate set to ${value}%`,
  },
  results: {
    projectedRevenue: {
      title: "Projected Revenue",
      period: "/ year"
    },
    toolCost: {
      title: "Cost of Tool",
      period: "/ month"
    },
    roi: {
      title: "Yearly ROI",
      suffix: "x"
    }
  }
};

export const inputConfig = {
  signups: {
    default: 500,
    max: 3000,
    step: 1,
    roundingRules: [
      { threshold: 1000, step: 50 },
      { threshold: 3000, step: 100 }
    ]
  },
  revenue: {
    default: 500,
    max: 10000,
    step: 500
  },
  closeRates: ["20", "30", "40", "50"]
};