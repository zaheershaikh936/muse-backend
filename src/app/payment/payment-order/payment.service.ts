import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
@Injectable()
export class PaymentService {
  private baseUrl = process.env.PAYPAL_ENV === 'live' ? process.env.PAYPAL_CLIENT_URL : process.env.PAYPAL_SANDBOX_CLIENT_URL;

  async createPayment(body: { price: string, successUrl: string, cancelUrl: string }) {
    console.log(1.1);
    const accessToken = await this.paypalAuth();

    return await this.createOrder(accessToken, body);
  }

  async paypalAuth() {
    try {
      const data = qs.stringify({
        grant_type: 'client_credentials',
        ignoreCache: 'true',
        return_authn_schemes: 'true',
        return_client_metadata: 'true',
        return_unconsented_scopes: 'true',
      });

      const authorizationHeader = this.getAuthorizationHeader();
      const config = {
        method: 'post',
        url: `${this.baseUrl}/v1/oauth2/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: authorizationHeader,
        },
        maxBodyLength: Infinity,
        data,
      };

      const response = await axios.request(config);
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching PayPal token:', error.response?.data || error.message);
      throw new Error('Failed to fetch PayPal token');
    }
  }

  getAuthorizationHeader() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET_KEY;
    const credentials = `${clientId}:${clientSecret}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
  };

  async createOrder(accessToken: string, body: { price: string, successUrl: string, cancelUrl: string }) {
    console.log(2.1);
    const data = JSON.stringify({
      "intent": "CAPTURE",
      "purchase_units": [
        {
          "amount": {
            "currency_code": "USD",
            "value": body.price.toString()
          }
        }
      ],
      "application_context": {
        "return_url": body.successUrl,
        "cancel_url": body.cancelUrl,
        "user_action": "PAY_NOW"
      }
    });
    console.log(2.2);

    try {
      console.log(2.3);
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/v2/checkout/orders`,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          'Authorization': `Bearer ${accessToken}`
        },
        data: data
      };
      console.log(2.4);
      const response = await axios.request(config);
      console.log(2.5);
      console.log(response.data);
      console.log(2.6);
      return response
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      console.log(2.7);
    }
  }

  async conformOrder(accessToken: string, id: string) {
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/v2/checkout/orders/${id}/capture`,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          'Authorization': `Bearer ${accessToken}`,
        },
      };
      const response = await axios.request(config);
      return response.data
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  }

  async refundOrderPaymentPaypal(id: string) {
    try {
      const accessToken = await this.paypalAuth();
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/v2/payments/captures/${id}/refund`,
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
          'Authorization': `Bearer ${accessToken}`,
        },
      };
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  }

}

