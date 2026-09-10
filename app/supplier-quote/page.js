const items = [
  {
    id: 1,
    name: "Office Chair",
    quantity: 20,
  },
  {
    id: 2,
    name: "Standing Desk",
    quantity: 10,
  },
  {
    id: 3,
    name: "Monitor Arm",
    quantity: 20,
  },
];

export default function SupplierQuote() {
  return (
    <main>
      <h1>Supplier Quote</h1>

      <section>
        <h2>Supplier Details</h2>

        <div>
          <label>
            Supplier Name
            <input type="text" placeholder="e.g. Acme Office Supplies" />
          </label>

          <label>
            Delivery Cost
            <input type="number" placeholder="e.g. 120" />
          </label>

          <label>
            Lead Time
            <input type="text" placeholder="e.g. 7 days" />
          </label>
        </div>
      </section>

      <section>
        <h2>Quoted Items</h2>

        {items.map((item) => (
          <div className="quoted-item" key={item.id}>
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
        ))}
      </section>

      <button>Save Quote</button>
    </main>
  );
}
