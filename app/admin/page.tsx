import Link from 'next/link';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  // TODO: Fetch real data from Supabase
  const stats = {
    totalRevenue: 125000,
    totalOrders: 156,
    totalProducts: 48,
    totalCustomers: 89,
    revenueChange: 12.5,
    ordersChange: 8.2,
    productsChange: -2.1,
    customersChange: 15.3,
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      amount: 2499,
      status: 'Pending',
      date: '2024-01-15',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      amount: 4999,
      status: 'Processing',
      date: '2024-01-15',
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      amount: 1299,
      status: 'Completed',
      date: '2024-01-14',
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Williams',
      amount: 3599,
      status: 'Pending',
      date: '2024-01-14',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-neutral-600 mt-1">Welcome back! Here's your store overview.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/products/new">
                <Button>Add Product</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">View Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-700" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueChange > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.revenueChange)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-700" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.ordersChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.ordersChange > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.ordersChange)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-700" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.productsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.productsChange > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.productsChange)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-700" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.customersChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.customersChange > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(stats.customersChange)}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Customers</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </div>
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-amber-700 hover:underline text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/admin/products" className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <Package className="w-10 h-10 text-amber-700 mb-4" />
            <h3 className="text-lg font-bold mb-2">Manage Products</h3>
            <p className="text-neutral-600 text-sm">Add, edit, or remove products from your store</p>
          </Link>

          <Link href="/admin/orders" className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <ShoppingCart className="w-10 h-10 text-amber-700 mb-4" />
            <h3 className="text-lg font-bold mb-2">View Orders</h3>
            <p className="text-neutral-600 text-sm">Process and manage customer orders</p>
          </Link>

          <Link href="/admin/customers" className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
            <Users className="w-10 h-10 text-amber-700 mb-4" />
            <h3 className="text-lg font-bold mb-2">Customer List</h3>
            <p className="text-neutral-600 text-sm">View and manage customer information</p>
          </Link>
        </div>
      </div>
    </div>
  );
}