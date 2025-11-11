'use client';
import { useState, useEffect } from 'react';
import LazyGlobeLoader from '@/components/common/lazyLoading';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'Booking Code', selector: row => row.BookingCode, sortable: true },
  { name: 'Status', selector: row => row.Status, sortable: true },
  { name: 'Client Ref', selector: row => row.OurReferenceId },
  {
    name: 'Total Fare (USD)',
    selector: row => row.Pricing?.FinalPrice?.toFixed(2),
    sortable: true,
  },
  {
    name: 'Customer Names',
    selector: row =>
      row.CustomerDetails?.map(n => `${n.Title} ${n.FirstName} ${n.LastName}`).join(', '),
    wrap: true,
  },
  { name: 'Email', selector: row => row.Email },
  { name: 'Phone', selector: row => row.PhoneNumber },
];

export default function Booking() {
  const [activeTab, setActiveTab] = useState('hotels');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'hotels') fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payments/hotel-payments');
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('hotels')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'hotels' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Hotels
        </button>
        <button
          onClick={() => setActiveTab('flights')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'flights' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Flights
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'hotels' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center min-h-[40vh]">
              <LazyGlobeLoader size={240} speed={10} planeColor="#0d47a1" />
            </div>
          ) : bookings.length === 0 ? (
            <p>No hotel bookings found.</p>
          ) : (
            <DataTable
              columns={columns}
              data={bookings}
              pagination
              highlightOnHover
              responsive
              striped
              customStyles={{
                headCells: {
                  style: {
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: '#f3f4f6', // light gray header
                    color: '#111827',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                  },
                },
                cells: {
                  style: {
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontSize: '14px',
                    color: '#374151',
                  },
                },
                rows: {
                  style: {
                    minHeight: '50px',
                  },
                  highlightOnHoverStyle: {
                    backgroundColor: '#e0f2fe',
                    borderBottomColor: '#d1d5db',
                    borderRadius: '4px',
                    outline: '1px solid #d1d5db',
                  },
                },
                pagination: {
                  style: {
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  },
                },
              }}
            />
          )}
        </>
      )}

      {activeTab === 'flights' && <p>Flight bookings will be shown here (soon)</p>}
    </div>
  );
}
