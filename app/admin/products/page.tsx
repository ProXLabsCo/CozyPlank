import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminProductsPage() {
  // TODO: Fetch real products from Supabase
  const products = [
    {
      id: '1',
      name: 'Wooden Cutting Board',
      category: 'Kitchen',
      price: 1299,
      stock: 15,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400',
    },
    {
      id: '2',
      name: 'Rustic Serving Tray',
      category: 'Kitchen',
      price: 2499,
      stock: 8,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=400',
    },
    {
      id: '3',
      name: 'Laptop Stand',
      category: 'Office',
      price: 1999,
      stock: 0,
      status: 'out_of_stock',
      image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400',
    },
    {
      id: '4',
      name: 'Wall Shelf',
      category: 'Furniture',
      price: 3499,
      stock: 12,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?w=400',
    },
    {
      id: '5',
      name: 'Coaster Set',
      category: 'Kitchen',
      price: 599,
      stock: 25,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0 || status === 'out_of_stock') {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>;
    }
    if (stock <= 5) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Low Stock</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Products</h1>
              <p className="text-neutral-600 mt-1">Manage your product inventory</p>
            </div>
            <Link href="/admin/products/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Product
              </Button>
            </Link>
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
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="kitchen">Kitchen</option>
              <option value="office">Office</option>
              <option value="furniture">Furniture</option>
              <option value="decor">Decor</option>
            </select>
            <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={product.stock <= 5 ? 'text-amber-600 font-medium' : ''}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status, product.stock)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-neutral-600" />
                          </button>
                        </Link>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <div className="text-sm text-neutral-600">
              Showing 1 to {products.length} of {products.length} products
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