const express = require('express');
const router = express.Router();
const Booking = require("../models/booking")
const moment = require('moment');
const Room = require('../models/room');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51KgkyBCjm49JZjwRHHale9mvlmkwnTzcVLT6JXojT5YLNUXAALet2L3P62Oyc1nhFbCdQth6ap0y7nHiM9nk73ko001iUBsFK3')


router.post("/bookroom", async (req, res) => {

    const { room,userid,fromdate,todate,totalamount,totaldays,token } = req.body

    console.log(req.body);
    try {
        const customer= await stripe.customers.create({
            email:token.email,
            source :token.id
        })
        const payment = await stripe.charges.create(
            {
                amount : totalamount *100,
                customer : customer.id,
                currency : 'npr',
                receipt_email : token.email
            },{
                idempotencyKey : uuidv4()
            }
        )
        if(payment){
                const newbooking = new Booking({
                    room: room.name,
                    roomid: room._id,
                    userid,
                    fromdate,
                    todate,
                    totalamount,
                    totaldays,
                    transcationId: '1234'
                })
                const booking = await newbooking.save()
                const roomtemp = await Room.findOne({ _id: room._id })
                roomtemp.currentbookings.push({
                    bookingid: booking._id,
                    fromdate,
                    todate,
                    userid: userid,
                    status: booking.status
                });
                await roomtemp.save()
        }
        res.send('Payment Successful, Your Room is booked')
    } catch (error) {
        return res.status(400).json({error});
    }
});

router.post("/getbookingsbyuserid", async (req, res) => {

    const userid = req.body.userid
    try {
        const bookings = await Booking.find({ userid: userid })
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({ error });

    }

});

router.post("/cancelbooking", async (req, res) => {
    const { bookingid, roomid } = req.body;
    try {
        const bookingitem = await Booking.findOne({ _id: bookingid })
        bookingitem.status = 'cancelled'
        await bookingitem.save()
        const room = await Room.findOne({ _id: roomid })
        const bookings = room.currentbookings
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbookings = temp
        await room.save()
        res.send('Your booking is cancelled successfully')

    } catch (error) {
        return res.status(400).json({ error });
    }
})

router.get("/getallbookings", async (req, res) => {

    const userid = req.body.userid
    try {
        const bookings = await Booking.find()
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({ error });

    }

});


module.exports = router;