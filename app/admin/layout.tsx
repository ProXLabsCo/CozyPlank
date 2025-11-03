import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ArrowLeft } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Bar */}
      <div className="bg-amber-700 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold">
                CozyPlank Admin
              </Link>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm hover:text-amber-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-[calc(100vh-52px)] hidden lg:block">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-100 transition-colors group"
                >
                  <Icon className="w-5 h-5 text-neutral-600 group-hover:text-amber-700" />
                  <span className="font-medium text-neutral-700 group-hover:text-amber-700">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2">
        <div className="flex justify-around">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg hover:bg-neutral-100"
              >
                <Icon className="w-5 h-5 text-neutral-600" />
                <span className="text-xs text-neutral-600">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}