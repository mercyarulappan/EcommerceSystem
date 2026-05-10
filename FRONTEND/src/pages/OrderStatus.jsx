function OrderStatus({ status }) {
  const steps = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {steps.map((step) => (
        <div
          key={step}
          style={{
            padding: "10px",
            background:
              steps.indexOf(step) <= steps.indexOf(status)
                ? "green"
                : "lightgray",
            color: "white",
          }}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

export default OrderStatus;
