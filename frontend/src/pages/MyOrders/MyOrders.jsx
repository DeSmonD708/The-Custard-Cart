import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyOrders.css'; // Make sure to import the styles

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://custardcart.onrender.com/api/order/myorders', {
          headers: { token }
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError('Failed to load orders');
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="my-orders-container">
      <h2 className="my-orders-title">My Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-meta">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p className="order-status"><strong>Status:</strong> {order.status}</p>
            <p className={order.payment ? "order-paid" : "order-unpaid"}>
              <strong>Paid:</strong> {order.payment ? "Yes" : "No"}
            </p>
            <p><strong>Amount:</strong> ₹{order.amount}</p>
          </div>
          <ul className="order-items">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity} — ₹{item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p className="order-address">
            <strong>Address:</strong> {`${order.address?.address}, ${order.address?.city}, ${order.address?.state}`}
          </p>
          
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
