// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api/axios";

// const Events = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const { data } = await api.get(
//           "http://localhost:5000/api/v1/events"
//         );

//         const eventList = Array.isArray(data)
//           ? data
//           : Array.isArray(data.events)
//           ? data.events
//           : [];

//         setEvents(eventList);
//       } catch (err) {
//         console.error("Failed to fetch events:", err);
//         setError("Unable to load events. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   if (loading) return <p>Loading events...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-10">
//       <h1 className="mb-8 text-center text-3xl font-bold">
//         Explore Events
//       </h1>

//       {events.length === 0 ? (
//         <p className="text-center">No events found.</p>
//       ) : (
//         <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {events.map((event) => (
//             <div
//               key={event._id}
//               className="overflow-hidden rounded-lg bg-white shadow"
//             >
//               <img
//                 src={event.imageUrl || event.image}
//                 alt={event.title}
//                 className="h-48 w-full object-cover"
//               />

//               <div className="p-5">
//                 <h2 className="mb-2 text-xl font-semibold">
//                   {event.title}
//                 </h2>

//                 <p className="mb-2 text-gray-600">
//                   {event.location}
//                 </p>

//                 <p className="mb-4 text-gray-600">
//                   {event.date
//                     ? new Date(event.date).toLocaleDateString()
//                     : "Date not available"}
//                 </p>

//                 <Link
//                   to={`/events/${event._id}`}
//                   className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//                 >
//                   View Details
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Events;



import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import api from "../utils/axios.js";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(
          "http://localhost:5000/api/v1/events",
          {
            params: { search: search.trim() },
            signal: controller.signal,
          }
        );

        const eventList = Array.isArray(data)
          ? data
          : Array.isArray(data?.events)
          ? data.events
          : [];

        setEvents(eventList);
      } catch (err) {
        if (
          err.name === "CanceledError" ||
          err.name === "AbortError" ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error("Error fetching events:", err);
        setError("Unable to load events. Please try again.");
        setEvents([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search, refreshKey]);

  const getSeatPercentage = (availableSeats, totalSeats) => {
    if (!totalSeats || totalSeats <= 0) return 0;

    return Math.min(
      100,
      Math.max(0, (availableSeats / totalSeats) * 100)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Upcoming Events
            </h1>
            <p className="mt-2 text-gray-500">
              Discover events and reserve your spot.
            </p>
          </div>

          <p className="font-medium text-gray-500">
            {events.length} results found
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-xl">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title..."
            aria-label="Search events by title"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Error */}
        {error && !loading && (
          <div className="mb-6 rounded-lg bg-red-50 p-5 text-center">
            <p className="mb-3 text-red-600">{error}</p>

            <button
              onClick={() =>
                setRefreshKey((current) => current + 1)
              }
              className="rounded-lg bg-gray-900 px-5 py-2 text-white transition hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
            <p className="text-xl font-semibold text-gray-600">
              Loading events...
            </p>
          </div>
        ) : error ? null : events.length === 0 ? (
          <div className="py-20 text-center text-xl text-gray-500">
            No events found matching your search.
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const availableSeats = Number(event.availableSeats ?? 0);
              const totalSeats = Number(event.totalSeats ?? 0);

              const seatPercentage = getSeatPercentage(
                availableSeats,
                totalSeats
              );

              return (
                <div
                  key={event._id}
                  className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    {event.imageUrl || event.image ? (
                      <img
                        src={event.imageUrl || event.image}
                        alt={event.title || "Event"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback =
                            e.currentTarget.nextElementSibling;

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      style={{
                        display:
                          event.imageUrl || event.image ? "none" : "flex",
                      }}
                      className="h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-600"
                    >
                      {event.category || "Event"}
                    </div>

                    {/* Price */}
                    <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-bold shadow-sm backdrop-blur-sm">
                      {Number(event.ticketPrice) === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span className="text-gray-900">
                          ₹{event.ticketPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="flex flex-grow flex-col p-6">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                      {event.category || "Event"}
                    </div>

                    <h2 className="mb-3 text-xl font-bold text-gray-800">
                      {event.title || "Untitled Event"}
                    </h2>

                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
                      {event.description || "No description available."}
                    </p>

                    <div className="mb-4 flex flex-col gap-2 text-sm text-gray-600">
                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="shrink-0 text-gray-400" />

                        <span>
                          {event.date &&
                          !Number.isNaN(new Date(event.date).getTime())
                            ? new Date(event.date).toLocaleDateString(
                                undefined,
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Date not available"}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="shrink-0 text-gray-400" />

                        <span>
                          {event.location || "Location not available"}
                        </span>
                      </div>
                    </div>

                    {/* Seats and Details */}
                    <div className="mt-auto">
                      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-gray-700 transition-all duration-300"
                          style={{ width: `${seatPercentage}%` }}
                        />
                      </div>

                      <p className="mb-4 text-xs text-gray-500">
                        {availableSeats} of {totalSeats} seats remaining
                      </p>

                      <Link
                        to={`/events/${event._id}`}
                        className="block w-full rounded-lg bg-gray-900 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
