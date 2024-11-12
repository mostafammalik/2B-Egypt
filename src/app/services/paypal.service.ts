import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private readonly clientId: string = 'ARFz2kmEa9965hDGm7H3VoZvhjTbJZzF4pPN1fPvGBVK7lCPA6Px3UQNLNkUQunevD9-X-HcWImvyq4Y';
  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&buyer-country=US&currency=USD&components=buttons&enable-funding=venmo,paylater,card`;
      script.onload = () => resolve();
      script.onerror = () => reject('PayPal SDK could not be loaded.');
      document.body.appendChild(script);
    });
  }

  async createOrder(amount: number): Promise<string> {
    try {
      const response = await fetch('http://2b-sohag.runasp.net/api/Checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          
          cart: [
            {
              id: '11',
              name: 'Mostafa product',
              quantity: '5',
            },
          ],
        }),
      });

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      }
      const errorDetail = orderData?.details?.[0];
      const errorMessage = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      throw new Error(errorMessage);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error; // Rethrow the error for handling in the component
    }
  }

  async captureOrder(orderID: string): Promise<any> {
    try {
      const response = await fetch(`http://2b-sohag.runasp.net/api/Checkout/${orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error capturing order:', error);
      throw error; // Rethrow the error for handling in the component
    }
  }
}