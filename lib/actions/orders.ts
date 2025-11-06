'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
  };
  payment_method: string;
  items: Array<{
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    unit_price: number;
  }>;
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = await createClient();
  
  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Calculate totals
  const subtotal = input.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const shipping_fee = 0; // Free shipping
  const tax = 0; // Tax included
  const discount = 0;
  const total_amount = subtotal + shipping_fee + tax - discount;

  // Generate order number
  const order_number = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number,
        user_id: user?.id || null,
        customer_name: input.customer_name,
        customer_email: input.customer_email,
        customer_phone: input.customer_phone,
        subtotal,
        shipping_fee,
        tax,
        discount,
        total_amount,
        order_status: 'pending',
        payment_status: 'pending',
        payment_method: input.payment_method,
        shipping_address: input.shipping_address,
        billing_address: input.shipping_address, // Same as shipping
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return { success: false, error: 'Failed to create order', order: null };
    }

    // Create order items
    const orderItems = input.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Rollback: delete order
      await supabase.from('orders').delete().eq('id', order.id);
      return { success: false, error: 'Failed to create order items', order: null };
    }

    // Update product stock
    for (const item of input.items) {
      const { error: stockError } = await supabase
        .rpc('decrement_stock', {
          product_id: item.product_id,
          quantity: item.quantity
        });

      if (stockError) {
        console.error('Error updating stock:', stockError);
        // Continue anyway - admin can manually adjust
      }
    }

    // Revalidate paths
    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return { 
      success: true, 
      error: null,
      order: {
        id: order.id,
        order_number: order.order_number
      }
    };

  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return { success: false, error: 'Internal server error', order: null };
  }
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          images,
          slug
        )
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return { order: null, error: error.message };
  }

  // Check if user owns this order
  if (data.user_id && data.user_id !== user?.id) {
    return { order: null, error: 'Unauthorized' };
  }

  return { order: data, error: null };
}

export async function getUserOrders() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { orders: [], error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (
          name,
          images,
          slug
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user orders:', error);
    return { orders: [], error: error.message };
  }

  return { orders: data, error: null };
}

export async function getAllOrders(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        total_price
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('order_status', filters.status);
  }

  if (filters?.search) {
    query = query.or(`order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], count: 0, error: error.message };
  }

  return { orders: data, count, error: null };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ 
      order_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);

  return { success: true, error: null };
}

export async function getOrderStats() {
  const supabase = await createClient();

  // Get total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get pending orders
  const { count: pendingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'pending');

  // Get processing orders
  const { count: processingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'processing');

  // Get shipped orders
  const { count: shippedOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'shipped');

  // Get delivered orders
  const { count: deliveredOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('order_status', 'delivered');

  // Get total revenue (only from delivered orders)
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('order_status', 'delivered');

  const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

  return {
    totalOrders: totalOrders || 0,
    pendingOrders: pendingOrders || 0,
    processingOrders: processingOrders || 0,
    shippedOrders: shippedOrders || 0,
    deliveredOrders: deliveredOrders || 0,
    totalRevenue,
  };
}