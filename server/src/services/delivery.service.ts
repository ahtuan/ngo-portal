import process from "node:process";
import { InvoiceResponse } from "@/db/schemas/invoice.schema";

class DeliveryService {
  private readonly deliveryUrl: string;
  private readonly token: string;

  constructor() {
    this.deliveryUrl = process.env.GHN_API || "https://online-gateway.ghn.vn";
    this.token = process.env.GHN_TOKEN || "";
  }

  async getDeliveryInfo(orderCode: string) {
    try {
      const order = await this.request(
        `/shiip/public-api/v2/shipping-order/detail`,
        "POST",
        {
          order_code: orderCode,
        },
      );
      let pods = order.pods?.map((item: { type: any; time: any }) => ({
        type: item.type,
        time: item.time,
      }));
      if (order.cod_transfer_date) {
        pods.push({
          type: "TRANSFER",
          time: order.cod_transfer_date,
        });
      }
      const mappedOrder: InvoiceResponse.Delivery = {
        toName: order.to_name,
        toAddress: order.to_address,
        toPhone: order.to_phone,
        status: order.status,
        expectedPickup: order.pickup_time,
        expectedDelivery: order.leadtime,
        pods,
      };
      return mappedOrder;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  private async request(url: string, method: string, body?: any): Promise<any> {
    url = this.deliveryUrl + url;
    const response = await fetch(url, {
      tls: {
        rejectUnauthorized: false,
      },
      method: method,
      headers: {
        "Content-Type": "application/json",
        Token: this.token,
      },
      body: JSON.stringify(body),
    });
    const res = await response.json();
    if (res.code === 200) {
      return res.data;
    }
    throw res.message;
  }
}

export default DeliveryService;
