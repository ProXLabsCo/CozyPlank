'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Store, Truck, CreditCard, Mail, Bell, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('store');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement settings save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const tabs = [
    { id: 'store', label: 'Store Information', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-neutral-600 mt-1">Manage your store settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-amber-50 text-amber-700 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              {activeTab === 'store' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Store Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Name</label>
                      <input
                        type="text"
                        defaultValue="CozyPlank"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Description</label>
                      <textarea
                        rows={4}
                        defaultValue="Handcrafted wooden furniture and home decor"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Email</label>
                        <input
                          type="email"
                          defaultValue="info@cozyplank.com"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          defaultValue="+91 98765 43210"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Store Address</label>
                      <textarea
                        rows={3}
                        defaultValue="123 Kirti Nagar, New Delhi, Delhi 110015, India"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Shipping Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">Free Shipping</h3>
                        <p className="text-sm text-neutral-600">Offer free shipping on all orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Delivery Time</label>
                      <input
                        type="text"
                        defaultValue="5-7 business days"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Shipping Provider</label>
                      <select className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                        <option>Shiprocket</option>
                        <option>Delhivery</option>
                        <option>Blue Dart</option>
                        <option>India Post</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Payment Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">Cash on Delivery</h3>
                        <p className="text-sm text-neutral-600">Accept cash payments on delivery</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <div className="p-4 border border-neutral-200 rounded-lg">
                      <h3 className="font-medium mb-4">Razorpay Integration</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">API Key</label>
                          <input
                            type="text"
                            placeholder="rzp_test_xxxxxxxxxxxxx"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">API Secret</label>
                          <input
                            type="password"
                            placeholder="••••••••••••••••"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Email Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Provider</label>
                      <select className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                        <option>Resend</option>
                        <option>SendGrid</option>
                        <option>Mailgun</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">API Key</label>
                      <input
                        type="password"
                        placeholder="re_xxxxxxxxxxxxx"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">From Email</label>
                      <input
                        type="email"
                        defaultValue="noreply@cozyplank.com"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">From Name</label>
                      <input
                        type="text"
                        defaultValue="CozyPlank"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">Order Notifications</h3>
                        <p className="text-sm text-neutral-600">Get notified when new orders are placed</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">Low Stock Alerts</h3>
                        <p className="text-sm text-neutral-600">Get notified when products are low in stock</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">Customer Messages</h3>
                        <p className="text-sm text-neutral-600">Get notified when customers send messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Authentication and security settings are managed through Supabase.
                        Configure additional security options in your Supabase dashboard.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}