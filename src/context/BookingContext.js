import React, { createContext, useContext, useState } from 'react';
import { bookingService } from '../services/api';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedShowTime, setSelectedShowTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetBooking = () => {
    setSelectedMovie(null);
    setSelectedCinema(null);
    setSelectedShowTime(null);
    setSelectedSeats([]);
    setBookingStep(1);
    setError(null);
  };

  const selectMovie = (movie) => {
    setSelectedMovie(movie);
    setBookingStep(2);
  };

  const selectCinema = (cinema) => {
    setSelectedCinema(cinema);
    setBookingStep(3);
  };

  const selectShowTime = (showTime) => {
    setSelectedShowTime(showTime);
    setBookingStep(4);
  };

  const toggleSeatSelection = (seat) => {
    if (seat.isAvailable) {
      const isSeatSelected = selectedSeats.some((s) => s.id === seat.id);
      
      if (isSeatSelected) {
        setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
      } else {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const completeBooking = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedMovie || !selectedCinema || !selectedShowTime || selectedSeats.length === 0) {
        throw new Error('Vui lòng hoàn thành quá trình chọn phim, rạp, suất chiếu và ghế ngồi');
      }

      const bookingData = {
        userId,
        showTimeId: selectedShowTime.id,
        seatIds: selectedSeats.map((seat) => seat.id),
        totalPrice: calculateTotalPrice(),
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
      };

      const response = await bookingService.create(bookingData);
      
      // Cập nhật trạng thái ghế (đánh dấu là đã đặt)
      for (const seat of selectedSeats) {
        await bookingService.updateSeat(seat.id, { isAvailable: false });
      }

      resetBooking();
      return response.data;
    } catch (err) {
      setError(err.message || 'Đã có lỗi xảy ra khi đặt vé');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    selectedMovie,
    selectedCinema,
    selectedShowTime,
    selectedSeats,
    bookingStep,
    loading,
    error,
    selectMovie,
    selectCinema,
    selectShowTime,
    toggleSeatSelection,
    calculateTotalPrice,
    completeBooking,
    resetBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};