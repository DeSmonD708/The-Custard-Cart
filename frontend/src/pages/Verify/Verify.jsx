import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const razorpay_order_id = query.get('razorpay_order_id');
  const razorpay_payment_id = query.get('razorpay_payment_id');
  const razorpay_signature = query.get('razorpay_signature');
  const orderId = localStorage.getItem('current_order_id');

  useEffect(() => {
    const verify = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.post('https://custardcart.onrender.com/api/order/verify', {
          orderId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        }, {
          headers: {
             token: token
            }
        });

        if (res.data.success) {
          alert('Payment verified!');
          localStorage.removeItem('current_order_id');
          navigate('/myorders');
        } else {
          alert('Payment verification failed.');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong during verification.');
        navigate('/');
      }
    };

    if (razorpay_payment_id) {
      verify();
    }
  }, [razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, navigate]);

  return <p>Verifying payment...</p>;
};

export default VerifyPayment;
