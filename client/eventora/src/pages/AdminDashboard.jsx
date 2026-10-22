// import React, {useState,useEffect,useContext} from 'react';
// import {AuthContext} from '../context/AuthContext';
// import api from '../utils/axios';
// import {useNavigate} from 'react-router-dom';

// const AdminDashboard = () => {
//     const {user} = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [event,setEvent] = useState([]);
//     const [booking,setBooking] = useState([]);
//     const [loading,setLoading] = useState(true);
//     const [showEventFrom,setShowEventFrom] = useState(false);
//     const [fromData,setFromData] = useState({
//         title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
//     });

//     useEffect(()=>{
//         if(!user || user.role !== 'admin'){
//             navigate('/login');
//             return;
//         }
//         fetchData();
//     }, [user,navigate]);

//     const fetchData = async () =>{
//         try {
//             const [eventsRes,bookingsRes] = await Promise.all([
//                 api.get('/events'),
//                 api.get('/bookings/my')
//             ]);
//             setEvents(eventsRes.data);
//             setBookings(bookingsRes.data);
//         } catch (error) {
//             console.error('Error fetching admin data', error);
//         }finally{
//             setLoading(false);
//         }
//     };

//     const handleCreateEvent = async(e)=>{
//         e.preventDefault();
//         try {
//             await api.posr('event',fromData);
//             setShowEventFrom(false);
//             setFromData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
//             fetchData();
//         } catch (error) {
//             alert(error.response?.data?.message || 'Error creating event');
//         }
//     };
//     const handleDeleteEvent = async(id)=>{
//         if(window.confirm('are you sure you want to delete this event?')){
//             try {
//                 await api.delete(`/event/$i{id}`);
//                 fetchData();
//             } catch (error) {
//                 alert('Error deleting event');
//             }
//         }
//     };

//     const handleConfirmBooking = async (id,paymentStatus)=>{
//         try {
//             await api.put(`/bookings/${id}/confirm`,{paymentStatus});
//             fetchData();
//         } catch (error) {
//             alert(error.response?.data?.message || 'Error confirming booking');
//         }
//     };

//      const handleCancelBooking = async (id) => {
//         if (window.confirm('Cancel this user\'s booking request?')) {
//             try {
//                 await api.delete(`/bookings/${id}`);
//                 fetchData();
//             } catch (error) {
//                 alert(error.response?.data?.message || 'Error cancelling booking');
//             }
//         }
//     };

//     if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading admin panel...</div>;
//   return (
//      <div className="max-w-7xl mx-auto">
//             <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
//                 <div>
//                     <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Admin Dashboard</h1>
//                     <p className="text-gray-300">Manage events and manually confirm bookings.</p>
//                 </div>
//                 <button
//                     onClick={() => setShowEventForm(!showEventForm)}
//                     className="w-full md:w-auto bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition shadow-md"
//                 >
//                     {showEventForm ? 'Cancel Creation' : '+ Create New Event'}
//                 </button>
//             </div>

//             {/* Admin Stats Row */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
//                     <div>
//                         <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
//                         <h3 className="text-3xl font-black text-green-600">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
//                     </div>
//                     <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">₹</div>
//                 </div>
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
//                     <div>
//                         <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Paid Clients</p>
//                         <h3 className="text-3xl font-black text-blue-600">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
//                     </div>
//                     <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">👤</div>
//                 </div>
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
//                     <div>
//                         <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Requests</p>
//                         <h3 className="text-3xl font-black text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</h3>
//                     </div>
//                     <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">⏳</div>
//                 </div>
//             </div>

//             {showEventForm && (
//                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animation-slideDown">
//                     <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
//                     <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <input required type="text" placeholder="Event Title" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
//                         <input required type="text" placeholder="Category (e.g., Tech, Music)" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
//                         <input required type="date" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
//                         <input required type="text" placeholder="Location" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
//                         <input required type="number" placeholder="Total Seats" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
//                         <input required type="number" placeholder="Ticket Price (0 for free)" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

//                         <div className="md:col-span-2">
//                             <input type="text" placeholder="Image URL (Provide any direct link to an image)" className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
//                         </div>

//                         <textarea required placeholder="Event Description" className="border px-4 py-3 rounded-lg md:col-span-2 h-32 focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
//                         <button type="submit" className="md:col-span-2 bg-gray-900 text-white font-bold py-3 mt-2 rounded-lg hover:bg-black transition shadow-md">Publish Event</button>
//                     </form>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Events Section */}
//                 <div className="flex flex-col">
//                     <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
//                         <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">{events.length}</span>
//                         All Events
//                     </h2>
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                         <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
//                             {events.length === 0 ? <li className="p-6 text-gray-500 text-center">No events created yet.</li> :
//                                 events.map(event => (
//                                     <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
//                                         <div>
//                                             <h4 className="font-bold text-gray-900 mb-1 leading-tight">{event.title}</h4>
//                                             <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
//                                                 <span className="flex items-center gap-1 font-medium"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {new Date(event.date).toLocaleDateString()}</span>
//                                                 <span className="flex items-center gap-1 font-medium"><div className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div> {event.availableSeats}/{event.totalSeats} seats</span>
//                                             </div>
//                                         </div>
//                                         <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm shrink-0">
//                                             Delete
//                                         </button>
//                                     </li>
//                                 ))
//                             }
//                         </ul>
//                     </div>
//                 </div>

//                 {/* Bookings Section */}
//                 <div className="flex flex-col">
//                     <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
//                         <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">{bookings.length}</span>
//                         Booking Requests
//                     </h2>
//                     <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                         <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
//                             {bookings.length === 0 ? <li className="p-6 text-gray-500 text-center">No bookings yet.</li> :
//                                 bookings.map(booking => (
//                                     <li key={booking._id} className={`p-6 hover:bg-gray-50 transition border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : booking.status === 'confirmed' ? 'border-l-green-400' : 'border-l-red-400'}`}>
//                                         <div className="flex justify-between items-start mb-3">
//                                             <h4 className="font-bold text-gray-900 text-lg leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
//                                             <div className="flex flex-col gap-1 items-end shrink-0 ml-4">
//                                                 <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
//                                                 {booking.status !== 'cancelled' && <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-800'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
//                                             </div>
//                                         </div>
//                                         <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100 text-sm">
//                                             <p className="text-gray-700 flex items-center gap-2 mb-1">
//                                                 <span className="font-bold w-16 text-gray-500 uppercase text-xs">User:</span>
//                                                 <span className="font-semibold">{booking.userId?.name}</span>
//                                                 <span className="text-gray-400">({booking.userId?.email})</span>
//                                             </p>
//                                             <p className="text-gray-700 flex items-center gap-2 mb-1">
//                                                 <span className="font-bold w-16 text-gray-500 uppercase text-xs">Amount:</span>
//                                                 <span className={`font-semibold ${booking.amount === 0 ? 'text-green-600' : ''}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
//                                             </p>
//                                             <p className="text-gray-700 flex items-center gap-2 mb-1">
//                                                 <span className="font-bold w-16 text-gray-500 uppercase text-xs">Date:</span>
//                                                 <span>{new Date(booking.bookedAt).toLocaleString()}</span>
//                                             </p>
//                                             {booking.eventId && (
//                                                 <p className="text-gray-700 flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
//                                                     <span className="font-bold w-16 text-gray-500 uppercase text-xs">Seats:</span>
//                                                     <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
//                                                 </p>
//                                             )}
//                                         </div>

//                                         {/* Action buttons for admin */}
//                                         {booking.status === 'pending' && (
//                                             <div className="flex flex-wrap gap-2 mt-2">
//                                                 <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition">
//                                                     ✓ Approve as Paid
//                                                 </button>
//                                                 <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[120px] bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition">
//                                                     ✓ Approve Undecided
//                                                 </button>
//                                                 <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg transition">
//                                                     ✕ Reject
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </li>
//                                 ))
//                             }
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//   );
// };

// export default AdminDashboard


import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
} from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api/v1";

const getArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    return [];
};

const AdminDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);
    const [pageError, setPageError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
    });

    // Fetch events and all booking requests
    const fetchData = useCallback(async () => {
        setLoading(true);
        setPageError("");

        const [eventsResult, bookingsResult] =
            await Promise.allSettled([
                api.get(`${API_BASE}/events`),
                api.get(`${API_BASE}/bookings`),
            ]);

        const errors = [];

        if (eventsResult.status === "fulfilled") {
            setEvents(getArray(eventsResult.value.data, "events"));
        } else {
            setEvents([]);
            errors.push(
                "Unable to load events. Check your events API."
            );
            console.error(
                "Error fetching events:",
                eventsResult.reason?.response?.data ||
                eventsResult.reason?.message
            );
        }

        if (bookingsResult.status === "fulfilled") {
            setBookings(
                getArray(bookingsResult.value.data, "bookings")
            );
        } else {
            setBookings([]);
            errors.push(
                "Unable to load all booking requests. Your backend needs an admin-only GET /api/v1/bookings endpoint."
            );
            console.error(
                "Error fetching bookings:",
                bookingsResult.reason?.response?.data ||
                bookingsResult.reason?.message
            );
        }

        setPageError(errors.join(" "));
        setLoading(false);
    }, []);

    // Allow only authenticated admin users
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        if (user.role !== "admin") {
            navigate("/dashboard", { replace: true });
            return;
        }

        fetchData();
    }, [user, authLoading, navigate, fetchData]);

    // Create an event
    const handleCreateEvent = async (e) => {
        e.preventDefault();

        const totalSeats = Number(formData.totalSeats);
        const ticketPrice = Number(formData.ticketPrice);
        const imageUrl = formData.image.trim();

        if (!Number.isFinite(totalSeats) || totalSeats <= 0) {
            alert("Total seats must be greater than zero.");
            return;
        }

        if (!Number.isFinite(ticketPrice) || ticketPrice < 0) {
            alert("Ticket price cannot be negative.");
            return;
        }

        if (!imageUrl) {
            alert("Please enter an event image URL.");
            return;
        }

        try {
            await api.post(`${API_BASE}/events`, {
                title: formData.title.trim(),
                description: formData.description.trim(),
                date: formData.date,
                location: formData.location.trim(),
                category: formData.category.trim(),
                totalSeats,
                availableSeats: totalSeats,
                ticketPrice,
                imageUrl,
            });

            alert("Event created successfully!");

            setShowEventForm(false);

            setFormData({
                title: "",
                description: "",
                date: "",
                location: "",
                category: "",
                totalSeats: "",
                ticketPrice: "",
                image: "",
            });

            await fetchData();
        } catch (error) {
            console.error(
                "Create event error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Error creating event"
            );
        }
    };
    // const handleCreateEvent = async (e) => {
    //     e.preventDefault();

    //     const totalSeats = Number(formData.totalSeats);
    //     const ticketPrice = Number(formData.ticketPrice);

    //     if (
    //         !Number.isFinite(totalSeats) ||
    //         totalSeats <= 0 ||
    //         !Number.isFinite(ticketPrice) ||
    //         ticketPrice < 0
    //     ) {
    //         alert("Enter valid seats and a non-negative ticket price.");
    //         return;
    //     }

    //     try {
    //         await api.post(`${API_BASE}/events`, {
    //             ...formData,
    //             totalSeats,
    //             availableSeats: totalSeats,
    //             ticketPrice,
    //         });

    //         setShowEventForm(false);

    //         setFormData({
    //             title: "",
    //             description: "",
    //             date: "",
    //             location: "",
    //             category: "",
    //             totalSeats: "",
    //             ticketPrice: "",
    //             image: "",
    //         });

    //         await fetchData();
    //     } catch (error) {
    //         alert(
    //             error.response?.data?.message ||
    //                 error.response?.data?.error ||
    //                 "Error creating event"
    //         );
    //     }
    // };

    // Delete an event
    const handleDeleteEvent = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this event?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`${API_BASE}/events/${id}`);
            await fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error deleting event"
            );
        }
    };

    // Confirm a booking
    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(
                `${API_BASE}/bookings/${id}/confirm`,
                { paymentStatus }
            );

            await fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error confirming booking"
            );
        }
    };

    // Cancel or reject a booking
    const handleCancelBooking = async (id) => {
        if (
            !window.confirm(
                "Cancel this user's booking request?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`${API_BASE}/bookings/${id}`);
            await fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Error cancelling booking"
            );
        }
    };

    if (authLoading || loading) {
        return (
            <div className="text-center py-20 text-xl font-semibold">
                Loading admin panel...
            </div>
        );
    }

    const totalRevenue = bookings.reduce((sum, booking) => {
        if (
            booking.paymentStatus === "paid" &&
            booking.status === "confirmed"
        ) {
            return sum + Number(booking.amount || 0);
        }
        return sum;
    }, 0);

    const paidClients = new Set(
        bookings
            .filter(
                (booking) =>
                    booking.paymentStatus === "paid" &&
                    booking.status === "confirmed"
            )
            .map((booking) => booking.userId?._id)
            .filter(Boolean)
    ).size;

    const pendingBookings = bookings.filter(
        (booking) => booking.status === "pending"
    ).length;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-300">
                        Manage events and booking requests.
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Logged in as {user?.email}
                    </p>
                </div>

                <button
                    onClick={() =>
                        setShowEventForm((current) => !current)
                    }
                    className="w-full md:w-auto bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition"
                >
                    {showEventForm
                        ? "Cancel Creation"
                        : "+ Create New Event"}
                </button>
            </div>

            {/* API errors */}
            {pageError && (
                <div
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6"
                >
                    {pageError}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <p className="text-gray-500 text-sm font-bold uppercase mb-2">
                        Total Revenue
                    </p>
                    <h3 className="text-3xl font-black text-green-600">
                        ₹{totalRevenue.toLocaleString("en-IN")}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <p className="text-gray-500 text-sm font-bold uppercase mb-2">
                        Paid Clients
                    </p>
                    <h3 className="text-3xl font-black text-blue-600">
                        {paidClients}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border">
                    <p className="text-gray-500 text-sm font-bold uppercase mb-2">
                        Pending Requests
                    </p>
                    <h3 className="text-3xl font-black text-yellow-600">
                        {pendingBookings}
                    </h3>
                </div>
            </div>

            {/* Create Event Form */}
            {showEventForm && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Create New Event
                    </h2>

                    <form
                        onSubmit={handleCreateEvent}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                        <input
                            required
                            type="text"
                            placeholder="Event Title"
                            className="border px-4 py-3 rounded-lg"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                        />

                        <input
                            required
                            type="text"
                            placeholder="Category"
                            className="border px-4 py-3 rounded-lg"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    category: e.target.value,
                                })
                            }
                        />

                        <input
                            required
                            type="date"
                            className="border px-4 py-3 rounded-lg"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                })
                            }
                        />

                        <input
                            required
                            type="text"
                            placeholder="Location"
                            className="border px-4 py-3 rounded-lg"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value,
                                })
                            }
                        />

                        <input
                            required
                            min="1"
                            type="number"
                            placeholder="Total Seats"
                            className="border px-4 py-3 rounded-lg"
                            value={formData.totalSeats}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    totalSeats: e.target.value,
                                })
                            }
                        />

                        <input
                            required
                            min="0"
                            type="number"
                            placeholder="Ticket Price (0 for free)"
                            className="border px-4 py-3 rounded-lg"
                            value={formData.ticketPrice}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    ticketPrice: e.target.value,
                                })
                            }
                        />

                        <input
                            // type="url"
                            // placeholder="Direct Image URL (optional)"
                            // className="border px-4 py-3 rounded-lg md:col-span-2"
                            // value={formData.image}
                            // onChange={(e) =>
                            //     setFormData({
                            //         ...formData,
                            //         image: e.target.value,
                            //     })
                            // }
                            required
                            type="url"
                            placeholder="Direct image URL"
                            className="border px-4 py-3 rounded-lg md:col-span-2"
                            value={formData.image}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    image: e.target.value,
                                })
                            }
                        />

                        <textarea
                            required
                            placeholder="Event Description"
                            className="border px-4 py-3 rounded-lg md:col-span-2"
                            rows="4"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                        />

                        <button
                            type="submit"
                            className="md:col-span-2 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black"
                        >
                            Publish Event
                        </button>
                    </form>
                </div>
            )}

            {/* Events and Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">
                        All Events ({events.length})
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <ul className="divide-y max-h-[600px] overflow-y-auto">
                            {events.length === 0 ? (
                                <li className="p-6 text-gray-500 text-center">
                                    No events found.
                                </li>
                            ) : (
                                events.map((event) => (
                                    <li
                                        key={event._id}
                                        className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                    >
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {event.title}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {event.date
                                                    ? new Date(
                                                        event.date
                                                    ).toLocaleDateString()
                                                    : "Date unavailable"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {event.availableSeats ?? 0}
                                                {" / "}
                                                {event.totalSeats ?? 0}
                                                {" seats available"}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDeleteEvent(event._id)
                                            }
                                            className="text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </section>

                {/* Booking Requests */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">
                        Booking Requests ({bookings.length})
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <ul className="divide-y max-h-[600px] overflow-y-auto">
                            {bookings.length === 0 ? (
                                <li className="p-6 text-gray-500 text-center">
                                    No booking requests found.
                                </li>
                            ) : (
                                bookings.map((booking) => (
                                    <li
                                        key={booking._id}
                                        className="p-5 border-l-4 border-l-yellow-400"
                                    >
                                        <div className="flex justify-between gap-3 mb-3">
                                            <h3 className="font-bold text-gray-900">
                                                {booking.eventId?.title ||
                                                    "Event unavailable"}
                                            </h3>

                                            <div className="text-right">
                                                <span className="text-xs font-bold uppercase">
                                                    {booking.status ||
                                                        "unknown"}
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    {booking.paymentStatus?.replace(
                                                        "_",
                                                        " "
                                                    ) || "payment pending"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3 mb-3 text-sm space-y-1">
                                            <p>
                                                <strong>User:</strong>{" "}
                                                {booking.userId?.name ||
                                                    "Unknown"}
                                            </p>
                                            <p>
                                                <strong>Email:</strong>{" "}
                                                {booking.userId?.email ||
                                                    "Unavailable"}
                                            </p>
                                            <p>
                                                <strong>Amount:</strong>{" "}
                                                {Number(booking.amount) === 0
                                                    ? "Free"
                                                    : `₹${booking.amount ?? 0}`}
                                            </p>
                                            <p>
                                                <strong>Booked:</strong>{" "}
                                                {booking.bookedAt
                                                    ? new Date(
                                                        booking.bookedAt
                                                    ).toLocaleString()
                                                    : "Unavailable"}
                                            </p>
                                        </div>

                                        {booking.status === "pending" && (
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleConfirmBooking(
                                                            booking._id,
                                                            "paid"
                                                        )
                                                    }
                                                    className="flex-1 min-w-[120px] bg-green-100 text-green-800 font-bold text-xs py-3 px-3 rounded-lg hover:bg-green-200"
                                                >
                                                    Approve as Paid
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleConfirmBooking(
                                                            booking._id,
                                                            "not_paid"
                                                        )
                                                    }
                                                    className="flex-1 min-w-[120px] bg-gray-100 text-gray-800 font-bold text-xs py-3 px-3 rounded-lg hover:bg-gray-200"
                                                >
                                                    Approve Unpaid
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            booking._id
                                                        )
                                                    }
                                                    className="bg-red-100 text-red-700 font-bold text-xs py-3 px-3 rounded-lg hover:bg-red-200"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;