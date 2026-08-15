import React from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import EmptyState from "../../components/Common/EmptyState";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { orders, formatNaira, cms } = useStore();

  const order = orders.find(
    (o) => o.orderNumber === orderId || o.id === orderId || o.orderNumber?.toLowerCase() === orderId?.toLowerCase()
  ) || orders[0];

  if (!order) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="fa-solid fa-receipt"
          title="Order Not Found"
          description="We couldn't locate this order in our records."
          actionText="Go to Home"
          actionLink="/"
        />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappPhone = cms?.storeContact?.whatsapp || "2347035518331";
  const whatsappCheckUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello GlozzyFoods, I just placed order ${order.orderNumber}. Could you confirm receipt and estimated prep time?`
  )}`;

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* SUCCESS BANNER */}
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: "80px", height: "80px", fontSize: "36px" }}
          >
            <i className="fa-solid fa-check"></i>
          </div>
          <h1 className="fw-bold text-dark mb-1">Order Confirmed!</h1>
          <p className="text-muted">
            Thank you for ordering with GlozzyFoods ND More. We are preparing your delicious meal!
          </p>
          <span className="badge bg-danger fs-6 px-4 py-2 rounded-pill font-monospace">
            Order Reference: {order.orderNumber}
          </span>
        </div>

        {/* ORDER DETAILS RECEIPT CARD */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-2">
            <div>
              <h5 className="fw-bold text-dark mb-0">Delivery Details</h5>
              <small className="text-muted">Placed on {new Date(order.createdAt).toLocaleString()}</small>
            </div>
            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">
              Payment: {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>

          <div className="row g-3 mb-4 small">
            <div className="col-sm-6">
              <strong className="text-muted d-block">Recipient:</strong>
              <span className="text-dark fw-bold">{order.customerName}</span>
              <div className="text-muted">{order.customerPhone}</div>
              <div className="text-muted">{order.customerEmail}</div>
            </div>
            <div className="col-sm-6">
              <strong className="text-muted d-block">Destination / Method:</strong>
              <span className="text-dark fw-bold">{order.deliveryZone}</span>
              <div className="text-muted">{order.deliveryAddress}</div>
              {order.customerNotes && (
                <div className="text-danger mt-1">
                  <em>Notes: {order.customerNotes}</em>
                </div>
              )}
            </div>
          </div>

          <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Ordered Items</h6>
          <div className="table-responsive mb-4">
            <table className="table align-middle table-sm">
              <thead className="table-light">
                <tr>
                  <th>Dish</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="rounded-2 object-fit-cover"
                          style={{ width: "40px", height: "40px" }}
                        />
                        <div>
                          <strong className="text-dark small d-block">{item.productName}</strong>
                          <small className="text-muted">{item.variantName}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">{formatNaira(item.price)}</td>
                    <td className="text-end fw-bold">{formatNaira(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="d-flex flex-column gap-2 border-top pt-3">
            <div className="d-flex justify-content-between text-muted small">
              <span>Subtotal:</span>
              <span className="fw-bold text-dark">{formatNaira(order.subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between text-muted small">
              <span>Delivery Fee:</span>
              <span className="fw-bold text-dark">{formatNaira(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="d-flex justify-content-between text-success small">
                <span>Discount ({order.couponCode || "Coupon"}):</span>
                <span className="fw-bold">-{formatNaira(order.discount)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-1">
              <span className="fw-bold text-dark fs-5">Total Paid:</span>
              <span className="fw-bold text-danger fs-4">{formatNaira(order.total)}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Link
            to={`/order-tracking?orderId=${order.orderNumber}`}
            className="btn btn-glozzy-primary px-4 py-2 rounded-pill shadow-sm"
          >
            <i className="fa-solid fa-truck-fast me-2"></i> Track My Order Live
          </Link>
          <a
            href={whatsappCheckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-glozzy-whatsapp px-4 py-2"
          >
            <i className="fa-brands fa-whatsapp me-2"></i> Check on WhatsApp
          </a>
          <button
            type="button"
            className="btn btn-outline-secondary px-4 py-2 rounded-pill"
            onClick={handlePrint}
          >
            <i className="fa-solid fa-print me-2"></i> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
