export default function QuoteItemCard({ item, index, onItemChange }) {
  return (
    <div className="quoted-item">
      <h3>
        {item.name}
        <span>Quantity: {item.quantity}</span>
      </h3>

      <label>
        Unit Price
        <input
          type="number"
          value={item.unitPrice}
          onChange={(event) =>
            onItemChange(index, "unitPrice", event.target.value)
          }
        />
      </label>

      <label>
        Availability
        <input
          type="text"
          value={item.availability}
          onChange={(event) =>
            onItemChange(index, "availability", event.target.value)
          }
        />
      </label>
    </div>
  );
}
