import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Eye, Download } from 'lucide-react';

export default function AdminOrdersPage() {
  // TODO: Fetch real orders from Supabase
  const orders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      items: 3,
      amount: 4599,
      status: 'pending',
      paymentMethod: 'COD',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      items: 1,
      amount: 2499,
      status: 'processing',
      paymentMethod: 'Online',
      date: '2024-01-15',
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      items: 2,
      amount: 3299,
      status: 'shipped',
      paymentMethod: 'COD',
      date: '2024-01-14',
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Williams',
      email: 'sarah@example.com',
      items: 5,
      amount: 8999,
      status: 'delivered',
      paymentMethod: 'Online',
      date: '2024-01-13',
    },
    {
      id: 'ORD-005',
      customer: 'David Brown',
      email: 'david@example.com',
      items: 1,
      amount: 1299,
      status: 'cancelled',
      paymentMethod: 'COD',
      date: '2024-01-13',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status as keyof typeof styles] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-neutral-600 mt-1">Manage customer orders</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Orders
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="">All Payment Methods</option>
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
            <p className="text-sm text-neutral-600 mb-1">Pending</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
            <p className="text-sm text-neutral-600 mb-1">Processing</p>
            <p className="text-2xl font-bold">8</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
            <p className="text-sm text-neutral-600 mb-1">Shipped</p>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-neutral-200">
            <p className="text-sm text-neutral-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold">89</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-neutral-500">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {order.items} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {order.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/orders/${order.id}`}>
                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-neutral-600" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              Showing 1 to {orders.length} of {orders.length} orders
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}