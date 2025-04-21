import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaUser, FaEnvelope, FaPhone, FaTicketAlt, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { bookingService, movieService, cinemaService, showTimeService } from '../services/api';

const PageContainer = styled.div`
  background-color: #0f0f1e;
  color: #fff;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #16213e;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #e94560;
`;

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 0.8rem;
`;

const ProfileInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  color: #a0a0a0;
  width: 20px;
`;

const InfoLabel = styled.div`
  width: 100px;
  color: #a0a0a0;
`;

const InfoValue = styled.div`
  flex: 1;
`;

const BookingCard = styled.div`
  background: #1a1a2e;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e94560;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BookingDate = styled.div`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const BookingId = styled.div`
  background: #0f0f1e;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const BookingDetails = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const MoviePoster = styled.img`
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const BookingInfo = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
`;

const BookingStatus = styled.div`
  display: inline-block;
  background: ${props => 
    props.status === 'confirmed' ? '#4caf50' : 
    props.status === 'cancelled' ? '#f44336' : '#ff9800'};
  color: white;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const SeatsInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SeatBadge = styled.span`
  background: #0f0f1e;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #a0a0a0;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: ${props => props.secondary ? 'transparent' : '#e94560'};
  color: white;
  border: ${props => props.secondary ? '1px solid #333' : 'none'};
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.secondary ? 'rgba(255, 255, 255, 0.1)' : '#ff6b81'};
  }
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState({});
  const [cinemas, setCinemas] = useState({});
  const [showTimes, setShowTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch các đặt vé của người dùng
        const bookingsResponse = await bookingService.getByUserId(currentUser.id);
        const userBookings = bookingsResponse.data;
        setBookings(userBookings);
        
        // Lấy danh sách các suất chiếu duy nhất
        const showTimeIds = [...new Set(userBookings.map(booking => booking.showTimeId))];
        
        // Fetch thông tin về các suất chiếu
        const showTimesData = {};
        for (const id of showTimeIds) {
          const response = await showTimeService.getById(id);
          showTimesData[id] = response.data;
        }
        setShowTimes(showTimesData);
        
        // Lấy danh sách các phim và rạp duy nhất
        const movieIds = [...new Set(Object.values(showTimesData).map(showTime => showTime.movieId))];
        const cinemaIds = [...new Set(Object.values(showTimesData).map(showTime => showTime.cinemaId))];
        
        // Fetch thông tin về các phim
        const moviesData = {};
        for (const id of movieIds) {
          const response = await movieService.getById(id);
          moviesData[id] = response.data;
        }
        setMovies(moviesData);
        
        // Fetch thông tin về các rạp
        const cinemasData = {};
        for (const id of cinemaIds) {
          const response = await cinemaService.getById(id);
          cinemasData[id] = response.data;
        }
        setCinemas(cinemasData);
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Sắp xếp đặt vé theo thời gian gần nhất
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.bookingDate) - new Date(a.bookingDate);
  });
  
  // Function để chuyển đổi trạng thái đặt vé sang tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
        return 'Đang chờ xác nhận';
      default:
        return status;
    }
  };
  
  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <PageContainer><Header /><div style={{ padding: '2rem' }}>Đang tải...</div></PageContainer>;
  if (error) return <PageContainer><Header /><div style={{ padding: '2rem' }}>{error}</div></PageContainer>;

  return (
    <PageContainer>
      <Header />
      
      <ContentContainer>
        <PageTitle>Tài khoản của tôi</PageTitle>
        
        <ProfileGrid>
          <div>
            <Section>
              <SectionTitle>
                <SectionIcon><FaUser /></SectionIcon>
                Thông tin cá nhân
              </SectionTitle>
              
              <ProfileInfo>
                <InfoRow>
                  <InfoIcon><FaUser /></InfoIcon>
                  <InfoLabel>Họ tên:</InfoLabel>
                  <InfoValue>{currentUser.name}</InfoValue>
                </InfoRow>
                
                <InfoRow>
                  <InfoIcon><FaEnvelope /></InfoIcon>
                  <InfoLabel>Email:</InfoLabel>
                  <InfoValue>{currentUser.email}</InfoValue>
                </InfoRow>
                
                <InfoRow>
                  <InfoIcon><FaPhone /></InfoIcon>
                  <InfoLabel>Điện thoại:</InfoLabel>
                  <InfoValue>{currentUser.phone}</InfoValue>
                </InfoRow>
              </ProfileInfo>
              
              <Button secondary onClick={handleLogout}>
                Đăng xuất
              </Button>
            </Section>
          </div>
          
          <div>
            <Section>
              <SectionTitle>
                <SectionIcon><FaHistory /></SectionIcon>
                Lịch sử đặt vé
              </SectionTitle>
              
              {sortedBookings.length > 0 ? (
                sortedBookings.map(booking => {
                  const showTime = showTimes[booking.showTimeId];
                  const movie = showTime ? movies[showTime.movieId] : null;
                  const cinema = showTime ? cinemas[showTime.cinemaId] : null;
                  
                  if (!showTime || !movie || !cinema) return null;
                  
                  return (
                    <BookingCard key={booking.id}>
                      <BookingHeader>
                        <BookingDate>
                          {format(new Date(booking.bookingDate), 'dd/MM/yyyy HH:mm')}
                        </BookingDate>
                        <BookingId>Mã đặt vé: #{booking.id}</BookingId>
                      </BookingHeader>
                      
                      <BookingDetails>
                        <MoviePoster src={movie.poster} alt={movie.title} />
                        <BookingInfo>
                          <MovieTitle>{movie.title}</MovieTitle>
                          
                          <InfoRow>
                            <InfoLabel>Rạp:</InfoLabel>
                            <InfoValue>{cinema.name}</InfoValue>
                          </InfoRow>
                          
                          <InfoRow>
                            <InfoLabel>Suất chiếu:</InfoLabel>
                            <InfoValue>
                              {format(new Date(showTime.date), 'dd/MM/yyyy')} - {showTime.startTime}
                            </InfoValue>
                          </InfoRow>
                          
                          <InfoRow>
                            <InfoLabel>Tổng tiền:</InfoLabel>
                            <InfoValue>{formatPrice(booking.totalPrice)}</InfoValue>
                          </InfoRow>
                          
                          <BookingStatus status={booking.status}>
                            {getStatusText(booking.status)}
                          </BookingStatus>
                        </BookingInfo>
                      </BookingDetails>
                    </BookingCard>
                  );
                })
              ) : (
                <EmptyState>
                  <FaTicketAlt size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h4>Bạn chưa có đặt vé nào</h4>
                  <p>Hãy đặt vé ngay để xem những bộ phim hot nhất</p>
                  <Button onClick={() => navigate('/movies')} style={{ marginTop: '1rem' }}>
                    Đặt vé ngay
                  </Button>
                </EmptyState>
              )}
            </Section>
          </div>
        </ProfileGrid>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProfilePage;