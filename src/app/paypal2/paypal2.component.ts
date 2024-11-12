import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-paypal2',
  standalone: true,
  imports: [],
  templateUrl: './paypal2.component.html',
  styleUrl: './paypal2.component.css',
})
export class Paypal2Component {
  @ViewChild('elementRef', { static: true }) elementRef!: ElementRef;
  @Input()
  amount!: any;
  constructor() {}

  ngOnInit(): void {
    this.loadPaypalScript().then(() => {
      this.renderPaypalButton();
    });
  }

  private loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paypal-sdk')) {
        resolve(); // PayPal SDK already loaded
        return;
      }

      const script = document.createElement('script');
      script.src =
        'https://www.paypal.com/sdk/js?client-id=ARFz2kmEa9965hDGm7H3VoZvhjTbJZzF4pPN1fPvGBVK7lCPA6Px3UQNLNkUQunevD9-X-HcWImvyq4Y'; // Replace with your client ID
      script.id = 'paypal-sdk';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }

  private renderPaypalButton(): void {
    // Ensure that window.paypal is available
    if (!window.paypal) {
      console.error('PayPal SDK not loaded');
      return;
    }

    window.paypal
      .Buttons({
        style: {
          shape: 'rect',
          layout: 'vertical',
          color: 'gold',
          label: 'paypal',
        },
        message: {
          amount: 15,
        },
        async createOrder() {
          try {
            const response = await fetch('http://localhost:5204/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: 1,
                name: 'mostafa',
                quantity: 5,
                amount: this.amount,
              }),
            });

            if (!response.ok) {
              const errorDetail = await response.json();
              throw new Error(JSON.stringify(errorDetail));
            }

            const orderData = await response.json();

            if (orderData.id) {
              return orderData.id;
            }

            const errorMessage = orderData?.details?.[0]
              ? `${orderData.details[0].issue} ${orderData.details[0].description} (${orderData.debug_id})`
              : JSON.stringify(orderData);

            throw new Error(errorMessage);
          } catch (error) {
            console.error(error);
            // Handle the error appropriately in your UI
          }
        },

        async onApprove(data: any, actions: any) {
          try {
            const response = await fetch(
              `http://localhost:5204/api/orders/${data.orderID}/capture`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            const orderData = await response.json();
            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
              return actions.restart();
            } else if (errorDetail) {
              throw new Error(
                `${errorDetail.description} (${orderData.debug_id})`
              );
            } else if (!orderData.purchase_units) {
              throw new Error(JSON.stringify(orderData));
            } else {
              const transaction =
                orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
              console.log(
                `Transaction ${transaction.status}: ${transaction.id}`
              );
            }
          } catch (error) {
            console.error(error);
            // Handle the error appropriately in your UI
          }
        },
      })
      .render(this.elementRef.nativeElement);
  }
}
