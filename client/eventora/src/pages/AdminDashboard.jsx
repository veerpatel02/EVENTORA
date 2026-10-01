import React, {useState,useEffect,useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import aoi from '../utils/axios';
import {useNavigate} from 'react-router-dom';

const AdminDashboard = () => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [event,setEvent] = useState([]);
    const [booking,setBooking] = useState([]);
    const [loading,setLoading] = useState(true);
    const [showEventFrom,setShowEventFrom] = useState(false);
    const [fromData,setFromData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(()=>{
        if(!user || user.role !== 'admin'){
            navigate('/login');
            return;
        }
        fetchData();
    }, [user,navigate]);

    const fetchData = async () =>{
        try {
            const [eventsRes,bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        }finally{
            setLoading(false);
        }
    };
  return (
    <div>
      
    </div>
  )
}

export default AdminDashboard
