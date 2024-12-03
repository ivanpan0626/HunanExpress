const expiryDateMillis = 1733207040255;
const expiryDate = new Date(expiryDateMillis);

console.log(
  expiryDate.toLocaleString("en-US", { timeZone: "America/New_York" })
);

console.log(
  new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
);

console.log(new Date());

// Example expiry date (timestamp in milliseconds)
const expiry_date = 1733207040255; // Replace this with your actual expiry date

// Get the current time (milliseconds since Unix epoch)
const current_time = Date.now();

// Check if the current time has exceeded the expiry date
if (current_time > expiry_date) {
  console.log("The current time has exceeded the expiry date.");
} else {
  console.log("The current time has not yet exceeded the expiry date.");
}
