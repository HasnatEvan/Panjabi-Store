import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const CheckoutForm = ({ purchaseInfo }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(purchaseInfo?.quantity);
  const [processing, setProcessing] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    getPaymentIntent();
  }, [purchaseInfo]);

  const getPaymentIntent = async () => {
    try {
      const { data } = await axiosSecure.post('/create-payment-intent', {
        quantity: purchaseInfo?.quantity,
        panjabiId: purchaseInfo?.panjabiId,
      });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setProcessing(false);
      return;
    }

    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (paymentMethodError) {
      console.error('[Stripe error]', paymentMethodError);
      Swal.fire('Error!', paymentMethodError.message, 'error');
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: purchaseInfo?.customer?.name,
          email: purchaseInfo?.customer?.email,
        },
      },
    });

    if (confirmError) {
      console.error('[Payment Confirmation Error]', confirmError);
      Swal.fire('Error!', confirmError.message, 'error');
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        const response = await axiosSecure.post('/purchases', purchaseInfo);
        if (response.data.insertedId) {
          await axiosSecure.patch(`/panjabi/quantity/${purchaseInfo?.panjabiId}`, {
            quantityToUpdate: selectedQuantity,
            status: 'decrease',
          });

          Swal.fire({
            title: 'Success!',
            text: 'Your purchase has been confirmed!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            setIsModalOpen(false);
            window.location.reload();
          });
        } else {
          Swal.fire('Error!', 'Something went wrong! Please try again.', 'error');
        }
      } catch (error) {
        console.error('Purchase Error:', error);
        Swal.fire('Error!', 'Something went wrong! Please try again.', 'error');
      }
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4"
      >
        {processing ? 'Processing...' : `Pay $${purchaseInfo?.price?.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
