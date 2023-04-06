import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FETCH_ACTIONS, ORDER_ACTIONS } from '../utils/reducer-actions';
import { Store } from '../utils/Store';
import { getError } from '../utils/utils';
import { Helmet } from 'react-helmet-async';
import { Card, Col, ListGroup, Row } from 'react-bootstrap';
import LoadingBox from '../components/ui/LoadingBox';
import MessageBox from '../components/ui/MessageBox';
import axios from 'axios';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_ACTIONS.FETCH_REQUEST:
      return { loading: true };
    case FETCH_ACTIONS.FETCH_SUCCESS:
      return { loading: false, order: action.payload };
    case FETCH_ACTIONS.FETCH_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_ACTIONS.PAY_REQUEST:
      return { ...state, loadingPay: true };
    case ORDER_ACTIONS.PAY_SUCCESS:
      return { ...state, loadingPay: false, successPay: true };
    case ORDER_ACTIONS.PAY_FAIL:
      return { ...state, loadingPay: false };
    case ORDER_ACTIONS.PAY_RESET:
      return { ...state, successPay: false, loadingPay: false };
    default:
      return state;
  }
};

export default function OrderScreen() {
  const { state } = useContext(Store);
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;
  const { userInfo } = state;
  const [{ loading, error, order, loadingPay, successPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
      loadingPay: false,
      successPay: false,
    });
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = async (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = async (data, actions) => {
    return actions.order
      .capture()
      .then(async (details) => {
        try {
          dispatch({ type: ORDER_ACTIONS.PAY_REQUEST });
          const { data: updatedOrder } = await axios.put(
            `/api/orders/${order._id}/pay`,
            details,
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          dispatch({
            type: ORDER_ACTIONS.PAY_SUCCESS,
            payload: updatedOrder,
          });
          toast.success('Payment successful');
        } catch (error) {
          dispatch({
            type: ORDER_ACTIONS.PAY_FAIL,
            payload: getError(error),
          });
          toast.error(getError(error));
        }
      })
      .catch((error) => {
        dispatch({ type: FETCH_ACTIONS.FETCH_FAIL, payload: getError(error) });
      });
  };

  const onError = (error) => {
    toast.error(getError(error));
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: FETCH_ACTIONS.FETCH_REQUEST });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: FETCH_ACTIONS.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_ACTIONS.FETCH_FAIL, payload: getError(error) });
      }
    };
    if (
      !order ||
      !order._id ||
      successPay ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: ORDER_ACTIONS.PAY_RESET });
      }
    } else {
      const loadingPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadingPaypalScript();
    }
  }, [order, orderId, userInfo, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        />
                      </div>
                    )}
                    {loadingPay && <LoadingBox />}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
