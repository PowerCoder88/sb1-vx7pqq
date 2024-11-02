export interface ReportFilters {
  startDate: string;
  endDate: string;
  categories?: string[];
  stockStatus?: 'all' | 'low' | 'out';
  sortBy?: 'name' | 'quantity' | 'value';
}

export interface ReportData {
  id: string;
  timestamp: string;
  type: 'inventory' | 'sales' | 'alerts';
  filters: ReportFilters;
  url: string;
}