import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { editEvent } from '../../../store/event';
import { addNewVenue, editOldVenue } from '../../../store/venue';



function HasEvent({event, eventId}){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const types = useSelector(state => state?.type?.types);
    const typesArr = Object.values(types)
    const [venueErrors, setVenueErrors] = useState([]);
    const [eventErrors, setEventErrors] = useState([]);

    const [name, setName] = useState(event?.name);
    const [date, setDate] = useState(event?.date);
    const [capacity, setCapacity] = useState(event?.capacity);
    const [description, setDescription] = useState(event?.description);
    const [virtual, setVirtual] = useState(event?.virtual);
    const [virtualUrl, setVirtualUrl] = useState(event?.virtualUrl);
    const [imgUrl, setImgUrl] = useState(event?.imgUrl);
    const [published, setPublished] = useState(event?.published);
    const [typeId, setTypeId] = useState(event?.typeId);
    const [venueId, setVenueId] = useState(event?.venueId);
    const [venueName, setVenueName] = useState(event?.Venue?.name);
    const [venueAddress, setVenueAddress] = useState(event?.Venue?.address);
    const [venueCity, setVenueCity] = useState(event?.Venue?.city);
    const [venueState, setVenueState] = useState(event?.Venue?.state);
    const [venueZipCode, setVenueZipCode] = useState(event?.Venue?.zipCode);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (virtual === false) {
            const venue = {
                name: venueName ? venueName : null,
                address: venueAddress ? venueAddress : null,
                city: venueCity ? venueCity : null,
                state: venueState ? venueState : null,
                zipCode: venueZipCode ? venueZipCode : null,
                published: published
            }

            if (venueId) {
                const data = await dispatch(editOldVenue(venue, venueId));

                let errVenue = [];
                const errors = data.errors;
                if (errors) { // if data has errors inside
                    const errList = Object.values(errors)  // get values from obj
                    const flatErrList = [...errList];  // flat
                    flatErrList.map(each => errVenue.push(each.msg))  // make it in an array
                    setVenueErrors(errVenue)  // right now get errors
                }
            } else {
                const data = await dispatch(addNewVenue(venue, published));
                let venueId = data.id
                let errVenue = [];
                const errors = data.errors;
                if (errors) { // if data has errors inside
                    const errList = Object.values(errors)  // get values from obj
                    const flatErrList = [...errList];  // flat
                    flatErrList.map(each => errVenue.push(each.msg))  // make it in an array
                    setVenueErrors(errVenue)  // right now get errors
                }
            }
        }

        // console.log(venueId);
        const editedEvent = {
            name: name ? name : 'draft event',
            date: date ? date: null,
            capacity:capacity ? capacity : null,
            description: description ? description : null,
            virtual,
            virtualUrl: virtualUrl ? virtualUrl : null,
            imgUrl: imgUrl ? imgUrl : null,
            published,
            typeId:typeId ? +typeId : null,
            venueId: venueId ? +venueId : null,
        }


        let errEvent = [];
        const data2 = await dispatch(editEvent(editedEvent, eventId, published))
        // console.log("EditEvent Component",data2)
        const errors2 = data2?.errors;
        if (errors2) { // if data has errors inside
            // venueHasError === true
            const errList2 = Object.values(errors2)  // get values from obj
            const flatErrList2 = [...errList2];  // flat
            flatErrList2.map(each => errEvent.push(each.msg))  // make it in an array
            setEventErrors(errEvent)  // right now get errors
            } else {
            if (published) navigate(`/events/${data2?.id}`);
            else navigate('/events');
            }
    }

    return (
        <>
            <div id="main2">
                <div className="add_title">Edit your event</div>
                <div className='add_info'>Name your event and tell event-goers why they should come. Add details that highlight what makes it unique.</div>
                <div className="add_container">
                    <form className='form_container' onSubmit={handleSubmit}>
                    <ul>
                        {venueErrors.concat(eventErrors).map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    <div className="form_content">
                        <label htmlFor='name'>* Event Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            // required
                            name='name'
                        />
                    </div>
                    <div className="form_content">
                        <label htmlFor='date'>* Event Time:</label>
                        <input
                            type="datetime-local"
                            value={date.split('Z')[0]}
                            onChange={(e) => setDate(e.target.value)}
                            // required
                            name='date'
                        />
                    </div>
                    <div className="form_content">
                        <label htmlFor='type'>* Event Type:</label>
                        <select
                            type="text"
                            // required
                            value={typeId}
                            onChange={(e) => setTypeId(e.target.value)}
                            >
                            <option value=''>Select</option>
                            {typesArr.map((type) => (
                                <option key={type?.id} value={type?.id}>{type?.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form_content">
                        <label htmlFor='capacity'>* Capacity:</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            // required
                            name='capacity'
                        />
                    </div>
                    <div className="form_content">
                        <label htmlFor='description'>* Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            // required
                            name='description'
                        />
                    </div>
                    <div className="form_content">
                        <label htmlFor='imgUrl'>* Image Link</label>
                        <input
                            type="text"
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                            // required
                            name='imgUrl'
                        />
                    </div>
                    <div id="add_location">
                        <label htmlFor='virtual'>Location:</label>
                        <input
                            name='virtual'
                            type='radio'
                            value='false'
                            checked={virtual === false}
                            onChange={(e) => setVirtual(false)}
                        /> Venue
                        <input
                            name='virtual'
                            type='radio'
                            value='true'
                            checked={virtual === true}
                            onChange={(e) => setVirtual(true)}
                        /> Online Event
                    </div>
                    {virtual === true && (
                        <div className="form_content">
                            <label htmlFor='virtualUrl'>Online Link</label>
                            <input
                                type="text"
                                value={virtualUrl}
                                name="virtualUrl"
                                onChange={(e) => setVirtualUrl(e.target.value)}
                            />
                        </div>

                    )}
                    {virtual === false && (
                        <div className="venue_container ">
                            <div className="form_content">
                                <label htmlFor='venueName'>Venue Name:</label>
                                <input
                                    type="text"
                                    name='venueName'
                                    value={venueName}
                                    // required
                                    onChange={(e) => setVenueName(e.target.value)}
                                />
                            </div>
                            <div className="form_content">
                                <label htmlFor='venueAddress'>Address:</label>
                                <input
                                    type="text"
                                    name='venueAddress'
                                    value={venueAddress}
                                    // required
                                    onChange={(e) => setVenueAddress(e.target.value)}
                                />
                            </div>
                            <div className="form_content">
                                <label htmlFor='venueCity'>City:</label>
                                <input
                                    type="text"
                                    name="venueCity"
                                    value={venueCity}
                                    // required
                                    onChange={(e) => setVenueCity(e.target.value)}
                                />
                            </div>
                            <div className="form_content">
                                 <label htmlFor='venueState'>State:</label>
                                 <input
                                    type="text"
                                    name="venueState"
                                    value={venueState}
                                    // required
                                    onChange={(e) => setVenueState(e.target.value)}
                                />
                            </div>
                            <div className="form_content">
                                <label htmlFor='venueZipCode'>Zip Code:</label>
                                <input
                                    type="text"
                                    name="venueZipCode"
                                    value={venueZipCode}
                                    // required
                                    onChange={(e) => setVenueZipCode(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    <div className="add_btn_container">
                        <button
                            className="add_btn add_btn_1"
                            type="submit"
                            onClick={() => setPublished(false)}
                        >Save Draft
                        </button>
                        <button
                            className="add_btn add_btn_2"
                            type="submit"
                            onClick={() => setPublished(true)}
                        >Publish Event
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        </>
    )
}


export default HasEvent;
