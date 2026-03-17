export const FOOTER_MESSAGE_EVENT = "grindspot:open-footer-message";

export const FOOTER_MESSAGES = {
  helpCenter: {
    title: "Help Center",
    body: "Standard products may be returned within 7 days of delivery when unused, in original packaging, and accompanied by proof of purchase. Custom-built or specially configured desktop systems may only be returned if they arrive defective or damaged. If a product is defective, customers should notify GrindSpot within 7 days of delivery so warranty handling can begin promptly.",
  },
  orderTracking: {
    title: "Order Tracking",
    body: "Order tracking provides visibility from confirmation to delivery through clear status milestones. After dispatch, each order timeline includes carrier details, tracking references, and transit updates so customers can monitor progress in real time. Delays, reroutes, or delivery exceptions are surfaced quickly to keep expectations aligned.",
  },
  contactSupport: {
    title: "Contact Support",
    body: "For support inquiries, contact GrindSpot by email at giannis93.tds@gmail.com, visit www.grindspot.com, or call +306977664135.",
  },
  warrantyClaims: {
    title: "Warranty Claims",
    body: "Warranty claims follow a structured review process so outcomes remain fair and transparent. Customers may be asked for proof of purchase, serial information, and a short defect summary. Once eligibility is confirmed, GrindSpot coordinates the repair, replacement, or equivalent resolution path and keeps the customer informed through completion.",
  },
  shippingPolicy: {
    title: "Shipping Policy",
    body: "Delivery windows are estimates and are not guaranteed. GrindSpot is not responsible for delays caused by shipping carriers, customs processes, incorrect delivery details, or force majeure events. Risk of loss transfers to the customer once delivery has been confirmed.",
  },
  returnsRefunds: {
    title: "Returns & Refunds",
    body: "Standard products may be returned within 7 days of delivery when unused, in original packaging, and accompanied by proof of purchase. Refunds are issued to the original payment method unless another arrangement is agreed. Custom-built PCs may only be returned when defective or damaged on arrival, and defective products must be reported within 7 days of delivery.",
  },
  privacySecurity: {
    title: "Privacy & Policy",
    body: "GrindSpot collects customer, order, and technical usage information to process orders, support accounts, improve the platform, prevent fraud, and satisfy legal obligations. Payment information is handled by secure third-party providers, and GrindSpot does not sell personal information to third parties.",
  },
  termsOfService: {
    title: "Terms of Service",
    body: "These terms govern access to the GrindSpot website, online store, and related services. By using the platform or placing an order, customers agree to be bound by these terms. Users must meet the applicable age-of-majority requirement in their jurisdiction, and privacy handling is governed separately by the Privacy Policy.",
  },
} as const;

export type FooterMessageKey = keyof typeof FOOTER_MESSAGES;

export const SUPPORT_FOOTER_LINKS: Array<{ key: FooterMessageKey; label: string }> = [
  { key: "helpCenter", label: "Help Center" },
  { key: "orderTracking", label: "Order Tracking" },
  { key: "contactSupport", label: "Contact Support" },
  { key: "warrantyClaims", label: "Warranty Claims" },
];

export const POLICY_FOOTER_LINKS: Array<{ key: FooterMessageKey; label: string }> = [
  { key: "shippingPolicy", label: "Shipping Policy" },
  { key: "returnsRefunds", label: "Returns & Refunds" },
  { key: "privacySecurity", label: "Privacy & Security" },
  { key: "termsOfService", label: "Terms of Service" },
];
