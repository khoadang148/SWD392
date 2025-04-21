// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
// import Header from '../components/common/Header';
// import Footer from '../components/common/Footer';
// import CinemaList from '../components/booking/CinemaList';
// import ShowTimeList from '../components/booking/ShowTimeList';
// import { useBooking } from '../context/BookingContext';
// import { useAuth } from '../context/AuthContext';
// import { movieService, cinemaService, showTimeService } from '../services/api';
// import Button from '../components/common/Button';
// import Loading from '../components/common/Loading';

// const PageContainer = styled.div`
//   background-color: #0f0f1e;
//   color: #fff;
//   min-height: 100vh;
// `;

// const ContentContainer = styled.div`
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 2rem;
// `;

// const PageTitle = styled.h1`
//   font-size: 2rem;
//   margin-bottom: 2rem;
// `;

// const MovieInfo = styled.div`
//   display: flex;
//   margin-bottom: 2rem;
//   background: #16213e;
//   border-radius: 8px;
//   overflow: hidden;
// `;

// const MoviePoster = styled.img`
//   width: 120px;
//   height: 180px;
//   object-fit: cover;
// `;

// const MovieDetails = styled.div`
//   padding: 1rem;
//   flex: 1;
// `;

// const MovieTitle = styled.h2`
//   margin: 0 0 0.5rem;
//   font-size: 1.5rem;
// `;

// const MovieMeta = styled.div`
//   color: #a0a0a0;
//   font-size: 0.9rem;
//   margin-bottom: 1rem;
// `;

// const BookingGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   gap: 2rem;
  
//   @media (min-width: 768px) {
//     grid-template-columns: 1fr 1fr;
//   }
// `;

// const ButtonContainer = styled.div`
//   margin-top: 2rem;
//   display: flex;
//   justify-content: space-between;
// `;

// const BookingPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();
//   const { 
//     selectedMovie, 
//     selectedCinema, 
//     selectedShowTime, 
//     selectMovie, 
//     selectCinema, 
//     selectShowTime, 
//     resetBooking 
//   } = useBooking();
  
//   const [movie, setMovie] = useState(null);
//   const [cinemas, setCinemas] = useState([]);
//   const [showTimes, setShowTimes] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Fetch dữ liệu movie và các rạp chiếu
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch thông tin phim
//         const movieResponse = await movieService.getById(id);
//         const movieData = movieResponse.data;
//         setMovie(movieData);
//         selectMovie(movieData);
        
//         // Fetch danh sách rạp
//         const cinemasResponse = await cinemaService.getAll();
//         setCinemas(cinemasResponse.data);
        
//         // Fetch lịch chiếu của phim
//         const showTimesResponse = await showTimeService.getByMovieId(id);
//         setShowTimes(showTimesResponse.data);
        
//       } catch (err) {
//         console.error('Error fetching booking data:', err);
//         setError('Không thể tải thông tin đặt vé. Vui lòng thử lại sau.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     resetBooking();
//     fetchData();
//   }, [id, resetBooking, selectMovie]);
  
//   const handleCinemaSelect = (cinema) => {
//     selectCinema(cinema);
//     selectShowTime(null); // Reset chọn suất chiếu khi đổi rạp
//   };
  
//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     selectShowTime(null); // Reset chọn suất chiếu khi đổi ngày
//   };
  
//   const handleShowTimeSelect = (showTime) => {
//     selectShowTime(showTime);
//   };
  
//   const handleBack = () => {
//     navigate(`/movies/${id}`);
//   };
  
//   const handleContinue = () => {
//     if (!currentUser) {
//       if (window.confirm('Vui lòng đăng nhập để tiếp tục đặt vé. Bạn có muốn đăng nhập ngay?')) {
//         navigate('/login');
//       }
//       return;
//     }
    
//     if (!selectedMovie || !selectedCinema || !selectedShowTime) {
//       alert('Vui lòng chọn rạp và suất chiếu để tiếp tục.');
//       return;
//     }
    
//     navigate('/booking/seats');
//   };
  
//   // Lọc lịch chiếu theo rạp đã chọn
//   const filteredShowTimes = selectedCinema 
//     ? showTimes.filter(showtime => showtime.cinemaId === selectedCinema.id)
//     : [];

//   if (loading) return (
//     <PageContainer>
//       <Header />
//       <ContentContainer>
//         <Loading text="Đang tải thông tin đặt vé..." />
//       </ContentContainer>
//       <Footer />
//     </PageContainer>
//   );

//   if (error) return (
//     <PageContainer>
//       <Header />
//       <ContentContainer>
//         <div>{error}</div>
//         <Button variant="primary" onClick={() => navigate('/movies')}>
//           Quay lại danh sách phim
//         </Button>
//       </ContentContainer>
//       <Footer />
//     </PageContainer>
//   );

//   if (!movie) return (
//     <PageContainer>
//       <Header />
//       <ContentContainer>
//         <div>Không tìm thấy thông tin phim</div>
//         <Button variant="primary" onClick={() => navigate('/movies')}>
//           Quay lại danh sách phim
//         </Button>
//       </ContentContainer>
//       <Footer />
//     </PageContainer>
//   );

//   return (
//     <PageContainer>
//       <Header />
      
//       <ContentContainer>
//         <PageTitle>Đặt vé xem phim</PageTitle>
        
//         <MovieInfo>
//           <MoviePoster src={movie.poster} alt={movie.title} />
//           <MovieDetails>
//             <MovieTitle>{movie.title}</MovieTitle>
//             <MovieMeta>
//               {Math.floor(movie.duration / 60)}h {movie.duration % 60}m • {movie.genre.join(', ')}
//             </MovieMeta>
//           </MovieDetails>
//         </MovieInfo>
        
//         <BookingGrid>
//           <CinemaList 
//             cinemas={cinemas}
//             selectedCinema={selectedCinema}
//             onSelectCinema={handleCinemaSelect}
//           />
          
//           {selectedCinema && (
//             <ShowTimeList 
//               showTimes={filteredShowTimes}
//               selectedDate={selectedDate}
//               selectedShowTime={selectedShowTime}
//               onSelectDate={handleDateSelect}
//               onSelectShowTime={handleShowTimeSelect}
//               emptyMessage="Không có suất chiếu cho phim này tại rạp đã chọn"
//             />
//           )}
//         </BookingGrid>
        
//         <ButtonContainer>
//           <Button variant="secondary" onClick={handleBack}>
//             Quay lại
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={handleContinue}
//             disabled={!selectedCinema || !selectedShowTime}
//           >
//             Tiếp tục
//           </Button>
//         </ButtonContainer>
//       </ContentContainer>
      
//       <Footer />
//     </PageContainer>
//   );
// };

// export default BookingPage;