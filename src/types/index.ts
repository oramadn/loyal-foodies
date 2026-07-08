export type { Order, OrderEntry, Restaurant, OrderStatus } from "@prisma/client";

import type { Order, OrderEntry, Restaurant } from "@prisma/client";

export type OrderWithEntries = Order & {
  entries: OrderEntry[];
  restaurant: Restaurant | null;
};

export type ActionState = {
  success: boolean;
  errors?: Record<string, string>;
  message?: string;
};

export type OrderSnapshot = {
  status: "OPEN" | "CLOSED";
  payerName: string;
  restaurantName: string;
  restaurantMenuUrls: string[];
  note: string | null;
  entries: {
    id: string;
    name: string;
    items: string;
    amount: string | null;
    createdAt: string;
  }[];
  totalOwed: string;
};
