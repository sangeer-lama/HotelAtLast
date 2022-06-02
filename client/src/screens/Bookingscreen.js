import React, { useState, useEffect } from 'react'
import axios from "axios"
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import 'antd/dist/antd.css';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2'


import moment from 'moment';
import { DatePicker, Space } from 'antd';
import Item from 'antd/lib/list/Item';

import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init({
    duration:1000
});
const { RangePicker } = DatePicker;
function Bookingscreen({ match }) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();
    const [room, setroom] = useState();
    const params = useParams();
    const [fromdate, setfromdate] = useState()
    const [todate, settodate] = useState()
    const [rent, setrent] = useState()
    // const roomid = params.roomid


    const fd = moment(fromdate, 'DD-MM-YYYY')
    const td = moment(todate, 'DD-MM-YYYY')
    const totaldays = moment.duration(td.diff(fd)).asDays() + 1;
    const totalamount = rent * totaldays;

    useEffect(() => {
        if (!localStorage.getItem('currentUser')) {
            window.location.reload = '/login'
        }
        async function fetchData() {
            try {
                setloading(true);
                const data = (await axios.post('/api/rooms/getroombyid', { roomid: params.roomid })).data;
                setroom(data);
                setrent(data.rentperday);
                setloading(false);
            }
            catch (error) {
                seterror(true);
                setloading(false);
            }
        }
        fetchData();
    }, []);

    function clear() {
        setfromdate(null);
        settodate(null);

    }


    function filterByDate(dates) {
        setfromdate(moment(dates[0]).format('DD-MM-YYYY'))
        settodate(moment(dates[1]).format('DD-MM-YYYY'))
        setloading(true);
        setloading(false);
    }



    async function onToken(token) {
        const bookingDetails = {
            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            // fromdate:moment(fromdate).format('DD-MM-YYYY'),
            // todate:moment(todate).format('DD-MM-YYYY'),
            fromdate,
            todate,
            totalamount,
            totaldays,
            token
        }
        try {
            setloading(true);
            const result = await axios.post('/api/bookings/bookroom', bookingDetails)
            setloading(false);
            Swal.fire('Congratulations','Your room booked successfully','success').then(result=>{
                window.location.href='/profile'
            })
        } catch (error) {
            setloading(false);
            Swal.fire('Oops','Something went wrong','error')
        }
    }

    return (
        <div className='m-5' data-aos='flip-left'>

            {loading ? (<Loader />) : room ? (<div>

                <div className='row justify-content-center mt-5 bs'>

                    <div className='col-md-6'>
                        <h1>{room.name}</h1>
                        <img src={room.imageurls[0]} className='bigimg' alt="" />
                    </div>


                    <div className='col-md-6'>

                        <div style={{ textAlign: 'right' }}>
                            <h1>Booking Details</h1>
                            <hr />
                            <div style={{ textAlign: 'left', margin: '15px' }}>
                                <p>Choose your date</p>
                            </div>
                            <div className='col-md-5' style={{ display: 'flex' }} >

                                <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
                                <button className='c' onClick={clear}>x</button>
                            </div>
                            <b>
                                <p>Name:{JSON.parse(localStorage.getItem('currentUser')).name}</p>
                                {/* <p>From Date:{params.fromdate}</p>
                                    <p>To Date:{params.todate}</p> */}
                                <p>Max Count:{room.maxcount}</p>
                            </b>
                        </div>


                        <div style={{ textAlign: 'right' }}>
                            <b>
                                <hr />
                                <h1 >Amount</h1>
                                <hr />
                                <p>Total Days:{totaldays}</p>
                                <p>Rent per day:{room.rentperday}</p>
                                <p>Total Amount:{totalamount}</p>

                            </b>
                        </div>

                        <div style={{ float: 'right' }}>
                            <StripeCheckout
                                amount={totalamount * 100}
                                token={onToken}
                                currency='NPR'
                                stripeKey="pk_test_51KgkyBCjm49JZjwROIbPL3ky3Ur1s8vKzSc5DE2gFiTE08HvGamtmmyXhZ0dMlWRYBY4zp8eEsCUuNC5umb7U22300RtFvxBde"
                            >
                                <button className='btn btn-primary'>Pay Now{''}</button>

                            </StripeCheckout>
                        </div>
                    </div>
                </div>)
            </div>) : (<Error />)}
        </div>
    )
}

export default Bookingscreen
