export default function QuoteItemCard({ item }) {
  return (
    <div className="quoted-item">
      <h3>
        {item.name}
        <span>Quantity: {item.quantity}</span>
      </h3>

      <label>
        Unit Price
        <input type="number" placeholder="e.g. 145" />
      </label>

      <label>
        Availability
        <input type="text" placeholder="e.g. In stock" />
      </label>
    </div>
  );
}
