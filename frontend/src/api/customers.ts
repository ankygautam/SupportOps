import { apiRequest, type QueryValue } from "@/api/client";
import type { CustomerDetailDto, CustomerSummaryDto } from "@/types/api";

export interface CustomerListQuery {
  [key: string]: QueryValue;
  q?: string;
  segment?: string;
  health?: string;
}

export async function getCustomers(query?: CustomerListQuery) {
  return apiRequest<CustomerSummaryDto[]>("/api/customers", undefined, query);
}

export async function getCustomer(id: string) {
  return apiRequest<CustomerDetailDto>(`/api/customers/${id}`);
}
