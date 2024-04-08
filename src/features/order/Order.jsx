// Test ID: IIDSAT
import { useFetcher, useLoaderData } from "react-router-dom";
import OrderItem from './OrderItem'
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { useEffect } from 'react';

function Order() {
  const order = useLoaderData();

const fetcher = useFetcher();

useEffect(function(){
  if(!fetcher.data && fetcher.state === 'idle')
  fetcher.load('/menu')
},[fetcher])


  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className='py-6 px-4 space-y-8'>
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <h2 className='text-xl font-semibold' >Order #{id} status</h2>

        <div className='space-x-2'>
          {priority && <span className='text-red-50 tracking-wide bg-red-500 rounded-full py-1 px-3 text-sm uppercase font-semibold'>Priority</span>}
          <span className='text-green-50 tracking-wide bg-green-500 rounded-full py-1 px-3 text-sm uppercase font-semibold'>{status} order</span>
        </div>
      </div>

      <div className='flex items-center justify-between flex-wrap gap-2 bg-stone-200 py-5 px-6'>
        <p className='font-medium'>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className='text-xs text-stone-500'>(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div> 
<ul className="dive-stone-200 divide-y border-b border-t">
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.pizzaId}
            isLoadingIngredients={fetcher.state === 'loading'}
            ingredients={
              fetcher?.data?.find((el) => el.id === item.pizzaId)
                ?.ingredients ?? []
            }
          />
        ))}
      </ul>

      <div className='space-y-2 bg-stone-200 py-5 px-6'>
        <p className='text-sm font-medium text-stone-600'>Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p className='text-sm font-medium text-stone-600'>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className='font-bold'>To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
