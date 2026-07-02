import supabase from "../supabase";
import type { CartItemWithProduct } from "./cart";

export async function createOrderFromCart(
  userId: string,
  cart: CartItemWithProduct[],
  shippingAddress: string,
  notes?: string,
): Promise<string> {
  if (!cart.length) throw new Error("Cart is empty");

  // Group items by seller so each seller gets their own order
  const bySeller = cart.reduce(
    (acc, item) => {
      const sellerId = item.product?.seller_id ?? "";
      if (!acc[sellerId]) acc[sellerId] = [];
      acc[sellerId].push(item);
      return acc;
    },
    {} as Record<string, CartItemWithProduct[]>,
  );

  const orderIds: string[] = [];

  for (const [sellerId, items] of Object.entries(bySeller)) {
    const totalAmount = items.reduce(
      (s, i) => s + (i.product?.price ?? 0) * i.qty,
      0,
    );
    const koperasiId = items[0]?.product?.koperasi_id ?? null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: order, error: orderErr } = await db
      .from("orders")
      .insert({
        buyer_id: userId,
        seller_id: sellerId,
        koperasi_id: koperasiId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        notes,
        status: "pending",
      })
      .select()
      .single();
    if (orderErr) throw orderErr;
    if (!order) throw new Error("Order creation returned null");

    const orderItems = items.map((i) => ({
      order_id: order.id,
      product_id: i.product_id,
      qty: i.qty,
      unit_price: i.product?.price ?? 0,
      subtotal: (i.product?.price ?? 0) * i.qty,
    }));

    const { error: itemsErr } = await db.from("order_items").insert(orderItems);
    if (itemsErr) throw itemsErr;

    orderIds.push(order.id);
  }

  // Clear cart after all orders are created
  await supabase.from("cart_items").delete().eq("user_id", userId);

  return orderIds[0];
}
