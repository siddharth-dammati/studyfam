export const impactConfig = {
  // Live Configured Data
  registrations: 12847,
  supportPerRegistration: 18,
  operationsPerRegistration: 9,
  milestone: 15000,
  
  // Official NTA JEE Main Fee Structure (configurable)
  supportAmountBoys: 1000,
  supportAmountGirls: 800,
  
  // Derived Calculations
  get supportPool() {
    return this.registrations * this.supportPerRegistration;
  },
  get averageCostPerStudent() {
    return (this.supportAmountBoys + this.supportAmountGirls) / 2;
  },
  get topNScholarsCount() {
    return Math.floor(this.supportPool / this.averageCostPerStudent);
  },
  get studentsSupported() {
    return this.topNScholarsCount;
  },
  get remainingToMilestone() {
    return this.milestone - this.registrations;
  },
  get progressPercentage() {
    return Math.min((this.registrations / this.milestone) * 100, 100);
  },
  // Dynamic calculator for any registration milestone
  calculateTopN(totalRegistrations: number) {
    const pool = totalRegistrations * this.supportPerRegistration;
    return Math.floor(pool / this.averageCostPerStudent);
  }
};

export function formatIndianNumber(num: number) {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatIndianCurrency(num: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}
