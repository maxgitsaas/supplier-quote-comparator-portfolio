const suppliers = [
  {
    id: 1,
    name: "Acme Office Supplies",
    items: {
      officeChair: 2900,
      standingDesk: 3800,
      monitorArm: 1080,
    },
    itemsTotal: 7780,
    delivery: 120,
    total: 7900,
    leadTime: "7 days",
  },
  {
    id: 2,
    name: "OfficeCo",
    items: {
      officeChair: 2700,
      standingDesk: 3900,
      monitorArm: 1040,
    },
    itemsTotal: 7640,
    delivery: 300,
    total: 7940,
    leadTime: "14 days",
  },
  {
    id: 3,
    name: "FurniPro",
    items: {
      officeChair: 3000,
      standingDesk: 3700,
      monitorArm: 1120,
    },
    itemsTotal: 7820,
    delivery: 0,
    total: 7820,
    leadTime: "5 days",
  },
];

export default function Comparison() {
  return (
    <main>
      <h1>Office Furniture Comparison</h1>

      <section>
        <h2>Supplier Comparison</h2>

        <table>
          <thead>
            <tr>
              <th></th>

              {suppliers.map((supplier) => (
                <th key={supplier.id}>{supplier.name}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>Office Chairs</th>

              {suppliers.map((supplier) => (
                <td key={supplier.id}>€{supplier.items.officeChair}</td>
              ))}
            </tr>

            <tr>
              <th>Standing Desks</th>

              {suppliers.map((supplier) => (
                <td key={supplier.id}>€{supplier.items.standingDesk}</td>
              ))}
            </tr>

            <tr>
              <th>Monitor Arms</th>

              {suppliers.map((supplier) => (
                <td key={supplier.id}>€{supplier.items.monitorArm}</td>
              ))}
            </tr>

            <tr>
              <th>Items Total</th>

              {suppliers.map((supplier) => (
                <td key={supplier.id}>€{supplier.itemsTotal}</td>
              ))}
            </tr>

            <tr>
              <th>Delivery</th>

              {suppliers.map((supplier) => (
                <td key={supplier.id}>€{supplier.delivery}</td>
              ))}
            </tr>

            <tr className="total-row">
              <th>Total</th>

              {suppliers.map((supplier) => (
                <td key={supplier.id}>€{supplier.total}</td>
              ))}
            </tr>

            <tr>
              <th>Lead Time</th>

              {suppliers.map((supplier) => (
                <td key={supplier.id}>{supplier.leadTime}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
