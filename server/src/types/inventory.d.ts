declare namespace Inventory {
  type Body = {
    uuid: string;
    name: string;
    price: number;
    grossWeight: number;
    actualWeight: number;
    unit: string;
    status: string;
    source: string;
  };

  type ByIdBody = {
    id: string;
  };
  type UpdateBody = {
    name: string;
    price: number;
    grossWeight: decimal;
    actualWeight?: decimal;
    unit?: string;
    status?: string;
  };

  type DeliveryBody = {
    uuid: string;
    note: string;
    date: Date;
    inventoryId: number;
  };

  type DeliveryRequest = {
    note?: string;
    date: Date;
  };
}
