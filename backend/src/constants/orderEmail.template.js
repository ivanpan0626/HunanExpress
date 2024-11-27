export const deliveryEmailTemplate = (orderSummary, orderDetails) => `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #f4f4f4;
          padding: 20px;
          border-radius: 8px;
        }
        h2 {
          color: #444;
        }
        .order-summary, .order-details {
          margin-bottom: 20px;
          padding: 10px;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .order-summary h3, .order-details h3 {
          margin: 0;
          font-size: 18px;
          color: #555;
        }
        .order-summary p, .order-details p {
          margin: 10px 0;
        }
        .order-details table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        .order-details table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        .order-totals {
          margin-top: 10px;
          text-align: right;
        }
        .order-totals p {
          margin: 5px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Order Received</h2>
        
        <div class="order-summary">
          <h3>Order Summary</h3>
          <p><strong>Status:</strong> ${orderSummary.customerPaid}</p>
          <p><strong>Name:</strong> ${orderSummary.customerName}</p>
          <p><strong>Phone:</strong> ${orderSummary.customerPhone}</p>
          <p><strong>Shipping Address:</strong> ${
            orderSummary.shippingAddress
          }, Apt: ${orderSummary.shippingApt || "N/A"}, ${
  orderSummary.shippingCity
}, ${orderSummary.shippingZipCode}</p>
          <p><strong>Delivery Time:</strong> ${orderSummary.deliveryTime}</p>
        </div>

        <div class="order-details">
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails
                .map(
                  (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>$${item.price.toFixed(2)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <div class="order-totals">
            <p><strong>Subtotal:</strong> $${orderSummary.subTotal.toFixed(
              2
            )}</p>
            <p><strong>Fees + Taxes:</strong> $${orderSummary.feesTaxes.toFixed(
              2
            )}</p>
            <p><strong>Total Amount Paid:</strong> $${orderSummary.totalAmount.toFixed(
              2
            )}</p>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for using our service!</p>
          <p>If you have any questions or issues, feel free to reach out.</p>
        </div>
      </div>
    </body>
  </html>
`;

export const pickupEmailTemplate = (orderSummary, orderDetails) => `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #f4f4f4;
          padding: 20px;
          border-radius: 8px;
        }
        h2 {
          color: #444;
        }
        .order-summary, .order-details {
          margin-bottom: 20px;
          padding: 10px;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .order-summary h3, .order-details h3 {
          margin: 0;
          font-size: 18px;
          color: #555;
        }
        .order-summary p, .order-details p {
          margin: 10px 0;
        }
        .order-details table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        .order-details table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f4f4f4;
        }
        .order-totals {
          margin-top: 10px;
          text-align: right;
        }
        .order-totals p {
          margin: 5px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Pickup Order Received</h2>
        
        <div class="order-summary">
          <h3>Order Summary</h3>
          <p><strong>Status:</strong> ${orderSummary.customerPaid}</p>
          <p><strong>Name:</strong> ${orderSummary.customerName}</p>
          <p><strong>Phone:</strong> ${orderSummary.customerPhone}</p>
          <p><strong>Pickup Time:</strong> ${orderSummary.pickupTime}</p>
        </div>

        <div class="order-details">
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails
                .map(
                  (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>$${item.price.toFixed(2)}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <div class="order-totals">
            <p><strong>Subtotal:</strong> $${orderSummary.subTotal.toFixed(
              2
            )}</p>
            <p><strong>Fees + Taxes:</strong> $${orderSummary.feesTaxes.toFixed(
              2
            )}</p>
            <p><strong>Total Amount Paid:</strong> $${orderSummary.totalAmount.toFixed(
              2
            )}</p>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing pickup! We’ll have your order ready soon.</p>
          <p>If you have any questions or issues, feel free to reach out.</p>
        </div>
      </div>
    </body>
  </html>
`;
