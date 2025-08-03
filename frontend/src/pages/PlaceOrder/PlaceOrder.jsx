// src/pages/PlaceOrder/PlaceOrder.jsx
import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", address: "",
    city: "", state: "", zipcode: "", country: "", phone: ""
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({ ...item, quantity: cartItems[item._id] }));

    const totalAmount = getTotalCartAmount() + 40;

    const orderData = {
      items: orderItems,
      address: data,
      amount: totalAmount
    };

    try {
      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (res.data.success) {
        const options = {
          key: res.data.key,
          amount: res.data.amount * 100,
          currency: res.data.currency,
          name: "Food Cart",
          description: "Order Payment",
          order_id: res.data.razorpayOrderId,
         handler: function (responseRazorpay) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = responseRazorpay;
    localStorage.setItem("current_order_id", res.data.orderId);
  // Redirect to /verify with query params
   window.location.href = `/verify?razorpay_payment_id=${razorpay_payment_id}&razorpay_order_id=${razorpay_order_id}&razorpay_signature=${razorpay_signature}`;
},
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone
          },
          notes: { address: `${data.address}, ${data.city}` },
          theme: { color: "#3399cc" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while placing order");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
     <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' value={data.firstName} onChange={onChangeHandler} placeholder='First Name' />
          <input required name='lastName' value={data.lastName} onChange={onChangeHandler} placeholder='Last Name' />
        </div>
        <input required name='email' value={data.email} onChange={onChangeHandler} placeholder='Email Address' />
        <input required name='address' value={data.address} onChange={onChangeHandler} placeholder='Address' />
        <div className="multi-fields">
          <input required name='city' value={data.city} onChange={onChangeHandler} placeholder='City' />
          <input required name='state' value={data.state} onChange={onChangeHandler} placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' value={data.zipcode} onChange={onChangeHandler} placeholder='Zip Code' />
          <input required name='country' value={data.country} onChange={onChangeHandler} placeholder='Country' />
        </div>
        <input required name='phone' value={data.phone} onChange={onChangeHandler} placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs {getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Rs {getTotalCartAmount() === 0 ? 0 : 40}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>Rs {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}</b>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;


 
