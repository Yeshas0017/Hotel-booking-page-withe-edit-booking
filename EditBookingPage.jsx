import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./EditBookingPage.css";

function EditBookingPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(""); // To store validation errors

  useEffect(() => {
    const storedBooking = JSON.parse(localStorage.getItem("latestBooking"));
    if (!storedBooking) {
      alert("No booking found. Redirecting to booking page.");
      navigate("/booking");
    } else {
      setBooking(storedBooking);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Phone number validation (only allow 10 digits)
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return; // Limit to 10 digits
  
    // Number of guests validation (ensure value is at least 1 and no leading zeros)
    if (name === "guests") {
      // Parse the value, ensure it's a number, and set it to at least 1
      const guestValue = Math.max(1, parseInt(value, 10) || 1); // Ensure guests is at least 1
      setBooking({ ...booking, [name]: guestValue });
      return;
    }
  
    setBooking({ ...booking, [name]: value });
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    if (!booking) {
      console.error("Booking data is missing, cannot save.");
      return;
    }

    const allBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
    const updatedBookings = allBookings.map((b) => (b.id === booking.id ? booking : b));

    localStorage.setItem("allBookings", JSON.stringify(updatedBookings));
    localStorage.setItem("latestBooking", JSON.stringify(booking)); // Update latestBooking for ConfirmationPage
    alert("Booking updated successfully!");
    navigate("/confirmation");

    // Generate the PDF after saving changes
    generatePDF();
  };

  const generatePDF = () => {
    const input = document.getElementById("receipt");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // Add the "This Booking Has Been Edited" message in the PDF
      pdf.setFontSize(16);
      pdf.text("This Booking Has Been Edited", 10, 10);

      // Save the PDF with the updated booking details
      pdf.save("Updated_Booking_Receipt.pdf");
    });
  };

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="booking-page">
      <h1>Edit Your Booking</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="booking-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={booking.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={booking.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={booking.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={booking.phone}
            onChange={handleChange}
            required
            maxLength="10"
          />
        </div>
        <div className="form-group">
          <label>Check-In Date:</label>
          <input
            type="date"
            name="checkIn"
            value={booking.checkIn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Check-Out Date:</label>
          <input
            type="date"
            name="checkOut"
            value={booking.checkOut}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Guests:</label>
          <input
            type="number"
            name="guests"
            value={booking.guests}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <button type="submit" className="confirm-btn">
          Save Changes
        </button>
      </form>

      {/* Booking Details Preview (for PDF generation) */}
      <div id="receipt" className="booking-details">
        <h2>Booking Receipt</h2>
        <p><strong>Booking ID:</strong> {booking.id}</p>
        <p><strong>Guest Name:</strong> {booking.firstName} {booking.lastName}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>
        <p><strong>Room:</strong> {booking.selectedRoom}</p>
        <p><strong>Price:</strong> {booking.price}</p>
        <p><strong>Check-In:</strong> {booking.checkIn}</p>
        <p><strong>Check-Out:</strong> {booking.checkOut}</p>
        <p><strong>Guests:</strong> {booking.guests}</p>
      </div>
    </div>
  );
}

export default EditBookingPage;
