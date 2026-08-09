'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react'

export default function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch(`/api/customers/${resolvedParams.id}`)
        const json = await res.json()
        if (json.success) {
          setCustomer(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch customer', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [resolvedParams.id])

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading customer details...</div>
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Customer not found</h2>
        <Link href="/admin/customers" className="text-[#8c763e] hover:underline">Return to customers list</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/customers" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </Link>
      </div>

      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Customer since {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Contact Info */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Contact Information</h3>
            </div>
            <div className="px-6 py-5 space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${customer.email}`} className="text-[#8c763e] hover:underline">{customer.email}</a>
                  </dd>
                </div>
              </div>
              
              {customer.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a href={`tel:${customer.phone}`} className="text-[#8c763e] hover:underline">{customer.phone}</a>
                    </dd>
                  </div>
                </div>
              )}
              
              {customer.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Default Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {customer.address.street}<br />
                      {customer.address.city}, {customer.address.postCode}<br />
                      {customer.address.country}
                    </dd>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Order History */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
                Order History
              </h3>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {customer.orderHistory?.length || 0} Orders
              </span>
            </div>
            
            {(!customer.orderHistory || customer.orderHistory.length === 0) ? (
              <div className="p-12 text-center text-gray-500">
                This customer hasn't placed any orders yet.
              </div>
            ) : (
              <ul role="list" className="divide-y divide-gray-200">
                {customer.orderHistory.map((orderId: string, idx: number) => (
                  <li key={idx} className="px-6 py-5 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order {orderId}</p>
                        {/* We would ideally fetch the full order details here to show date/total, 
                            but for this mockup we just show the ID and a link */}
                      </div>
                      <Link 
                        href={`/admin/orders?search=${orderId}`}
                        className="text-sm font-medium text-[#8c763e] hover:text-[#6b5a2e]"
                      >
                        Find Order
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
