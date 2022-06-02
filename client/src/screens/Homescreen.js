import React, { useState, useEffect } from 'react'
import axios from "axios"
import Room from "../components/Room";
import Loader from '../components/Loader';
import Error from '../components/Error';
import 'antd/dist/antd.css';
import moment from 'moment'
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;
function Homescreen() {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();
    const [rooms, setrooms] = useState([]);
    const [fromdate, setfromdate] = useState()
    const [todate, settodate] = useState()
    const [duplicaterooms, setduplicaterooms] = useState([])

    const [searchkey, setsearchkey] = useState('')
    const [type, settype] = useState('all')



    useEffect(() => {
        async function fetchData() {
            try {
                const data = (await axios.get('/api/rooms/getallrooms')).data;
                setrooms(data);
                setduplicaterooms(data);
                setloading(false);
            }
            catch (error) {
                seterror(true);
                console.log(error);
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

        var temprooms = [];
        var availability = false;
        for (const room of duplicaterooms) {
            if (room.currentbookings.length > 0) {
                for (const booking of room.currentbookings) {
                    if (!moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(
                        booking.fromdate,
                        booking.todate
                    ) &&
                        !
                        moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(
                            booking.fromdate,
                            booking.todate
                        )
                    ) {
                        if (
                            moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
                            moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
                            moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
                            moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
                        ) {
                            availability = true
                        }
                    }
                }
            }

            if (availability === true || room.currentbookings.length === 0) {
                temprooms.push(room)
            }
            setrooms(temprooms)
        }
    }
    function filterBySearch() {
        const temprooms = duplicaterooms.filter(room => room.name.toLowerCase().includes(searchkey.toLowerCase()))
        setrooms(temprooms)
    }
    function filterByType(e) {
        settype(e)
        if (e !== 'all') {
            const temprooms = duplicaterooms.filter(room => room.type.toLowerCase() === e.toLowerCase())
            setrooms(temprooms)
        }
        else {
            setrooms(duplicaterooms)
        }
    }

    let NO_OF_CHARS = 256;

    // A utility function to get maximum of two integers
    function max(a, b) {
        return (a > b) ? a : b;
    }

    // The preprocessing function for Boyer Moore's
    // bad character heuristic
    function badCharHeuristic(str, size, badchar) {
        // Initialize all occurrences as -1
        for (let i = 0; i < NO_OF_CHARS; i++)
            badchar[i] = -1;

        // Fill the actual value of last occurrence
        // of a character (indices of table are ascii and values are index of occurrence)
        for (let i = 0; i < size; i++)
            badchar[str[i].charCodeAt(0)] = i;
    }

    /* A pattern searching function that uses Bad
         Character Heuristic of Boyer Moore Algorithm */
    function search(txt, pat) {
        let m = pat.length;
        let n = txt.length;

        let badchar = new Array(NO_OF_CHARS);

        /* Fill the bad character array by calling
           the preprocessing function badCharHeuristic()
           for given pattern */
        badCharHeuristic(pat, m, badchar);

        let s = 0;  // s is shift of the pattern with
        // respect to text
        // there are n-m+1 potential alignments
        while (s <= (n - m)) {
            let j = m - 1;

            /* Keep reducing index j of pattern while
               characters of pattern and text are
               matching at this shift s */
            while (j >= 0 && pat[j] == txt[s + j])
                j--;

            /* If the pattern is present at current
               shift, then index j will become -1 after
               the above loop */
            if (j < 0) {

                /* Shift the pattern so that the next
                   character in text aligns with the last
                   occurrence of it in pattern.
                   The condition s+m < n is necessary for
                   the case when pattern occurs at the end
                   of text */
                //txt[s+m] is character after the pattern in text
                s += (s + m < n) ? m - badchar[txt[s + m].charCodeAt(0)] : 1;

            }

            else
                /* Shift the pattern so that the bad character
                   in text aligns with the last occurrence of
                   it in pattern. The max function is used to
                   make sure that we get a positive shift.
                   We may get a negative shift if the last
                   occurrence  of bad character in pattern
                   is on the right side of the current
                   character. */
                s += max(1, j - badchar[txt[s + j].charCodeAt(0)]);
        }
    }
    search(searchkey,"hotel")
    console.log(search)


    return (
        <div className='bgimg'>
            <div className='container'>

                <div className='row bs '>
                    <div className='col-md-5' style={{ display: 'flex' }}>
                        <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
                        <button className='c' onClick={clear}>x</button>

                    </div>
                    <div className='col-md-3'>
                        <input type='text' className='form-control' placeholder='Search rooms'
                            value={searchkey} onChange={(e) => { setsearchkey(e.target.value) }} onKeyUp={filterBySearch}></input>
                    </div>

                    <div className='col-md-3'>
                        <select className='form-control' value={type} onChange={(e) => { filterByType(e.target.value) }} >
                            <option value='all'>All</option>
                            <option value='delux'>Delux</option>
                            <option value='non-delux'>Non-Delux</option>
                        </select>
                    </div>
                </div>
                <div>
                    <a class="fcc-btn" href={'/map'}><h6 >
                        <i class="fa fa-location-arrow" aria-hidden="true"></i>
                        Google Map</h6>
                        <div className='qwe'>
                            <img src="map.png" alt="" />
                        </div></a>

                </div>

                <div className='row justify-content-center mt-5'>
                    {loading ? (
                        <Loader />
                    ) : (
                        rooms.map((room) => {
                            return <div className='col-md-9 mt-2'>
                                <Room room={room} />
                            </div>
                        })
                    )}
                </div>

            </div>
        </div>
    )
}

export default Homescreen
