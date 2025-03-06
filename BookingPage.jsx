import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingPage.css";

// Import images
import roomImage1 from "../assets/room1.jpg";
import roomImage2 from "../assets/room2.jpg";
import roomImage3 from "../assets/room3.jpg";



// Room Types
const roomTypes = [
  { id: 1, name: "Standard Room", image: roomImage1, price: "$100/night" },
  { id: 2, name: "Deluxe Room", image: roomImage2, price: "$150/night" },
  { id: 3, name: "Suite", image: roomImage3, price: "$200/night" },
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cvv, setCvv] = useState("");

  // Get today's date to disable past dates
  const today = new Date().toISOString().split("T")[0];

  // Handle card name change (only letters and spaces)
  const handleCardNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetical characters
    setCardName(value);
  };

  // Handle form submission
  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedRoom) {
      alert("Please select a room type.");
      return;
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      alert("CVV must be exactly 3 digits.");
      return;
    }

    // Generate a unique ID using Date + Random Number
    const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

    // Get selected room details
    const roomDetails = roomTypes.find(room => room.id === selectedRoom);

    // Generate a unique ID for the booking
    const bookingId = Date.now(); // Unique timestamp-based ID

    // Save booking details to localStorage
    const newBooking = {
      id: uniqueId, // Assign unique ID
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      selectedRoom: roomDetails.name,
      price: roomDetails.price,
    };

    // Retrieve existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem("allBookings")) || [];

    // Add new booking to the list
    const updatedBookings = [...existingBookings, newBooking];

    // Save updated bookings back to localStorage
    localStorage.setItem("allBookings", JSON.stringify(updatedBookings));

    // ✅ Save the latest booking separately
    localStorage.setItem("latestBooking", JSON.stringify(newBooking));

    alert("Booking successful!");
    navigate("/confirmation");
  };

  return (
    
    <div className="booking-page">
      <h1>Book Your Stay</h1>
      <div className="room-selection">
        {roomTypes.map((room) => (
          <div
            key={room.id}
            className={`room-card ${selectedRoom === room.id ? "selected" : ""}`}
            onClick={() => setSelectedRoom(room.id)}
          >
            <img src={room.image} alt={room.name} />
            <h3>{room.name}</h3>
            <p>{room.price}</p>
          </div>
        ))}
      </div>
      <form className="booking-form" onSubmit={handleBooking}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
  <label>Phone Number:</label>
  <input
    type="tel"
    name="phone"
    value={phone}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10); // Only digits and limit to 10 characters
      setPhone(value);
    }}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="checkIn">Check-In Date:</label>
  <input
    type="date"
    id="checkIn"  // Added id here
    name="checkIn"
    min={today}
    value={checkIn}
    onChange={(e) => setCheckIn(e.target.value)}
    required
  />
</div>
<div className="form-group">
  <label htmlFor="checkOut">Check-Out Date:</label>
  <input
    type="date"
    id="checkOut"  // Added id here
    name="checkOut"
    min={checkIn || today}
    value={checkOut}
    onChange={(e) => setCheckOut(e.target.value)}
    required
  />
</div>

        <div className="form-group">
  <label htmlFor="guests">Number of Guests:</label> {/* Add htmlFor */}
  <input
    type="number"
    id="guests"  // Add an ID that matches the label
    name="guests"
    min="1"
    value={guests}
    onChange={(e) => setGuests(e.target.value)}
    required
  />
</div>

        <h2>Payment Details</h2>
        <div className="form-group">
          <label>Card Number:</label>
          <input
            type="text"
            name="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
            maxLength="16"
            required
          />
        </div>
        <div className="form-group">
          <label>Card Name:</label>
          <input
            type="text"
            name="cardName"
            value={cardName}
            onChange={handleCardNameChange} // Use handleCardNameChange for validation
            required
          />
        </div>
        <div className="form-group">
          <label>CVV:</label>
          <input
            type="text"
            name="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
            maxLength="3"
            required
          />
        </div>
        <button type="submit" className="confirm-btn">Confirm Booking</button>
      </form>
    </div>
    
  );
};

export default BookingPage;

