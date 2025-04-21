import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FaCouch, FaRegCheckCircle, FaRegTimesCircle, FaLock, FaChild } from 'react-icons/fa';
import { seatService } from '../services/api';
import Header from '../components/common/Header';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

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

const MovieInfo = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: #16213e;
  border-radius: 8px;
  overflow: hidden;
`;

const MoviePoster = styled.img`
  width: 100px;
  height: 150px;
  object-fit: cover;
`;

const MovieDetails = styled.div`
  padding: 1rem;
  flex: 1;
`;

const MovieTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`;

const ShowtimeInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  color: #e94560;
`;

const SeatSelectionContainer = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1.5rem;
  color: #e94560;
`;

const Screen = styled.div`
  height: 40px;
  background: #1a1a2e;
  margin: 0 auto 2rem;
  width: 80%;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a0a0a0;
  font-size: 0.9rem;
  transform: perspective(300px) rotateX(-30deg);
`;

const SeatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-bottom: 2rem;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RowLabel = styled.div`
  width: 30px;
  text-align: center;
  font-weight: bold;
`;

const Seat = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: ${props => props.isAvailable ? 'pointer' : 'not-allowed'};
  background-color: ${props => {
    if (props.isSelected) return '#e94560';
    if (!props.isAvailable) return '#333';
    return props.type === 'vip' ? '#ff9800' : '#1a1a2e';
  }};
  color: ${props => {
    if (props.isSelected) return '#fff';
    if (!props.isAvailable) return '#777';
    return props.type === 'vip' ? '#fff' : '#fff';
  }};
  transition: all 0.2s;
  
  &:hover {
    transform: ${props => props.isAvailable ? 'scale(1.1)' : 'none'};
  }
`;

const SeatIcon = styled(FaCouch)`
  font-size: 1.5rem;
`;

const SeatLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #a0a0a0;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 8px;
  background-color: ${props => props.color};
`;

const SummaryContainer = styled.div`
  background: #16213e;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 1px solid #333;
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const SelectedSeatsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SelectedSeatBadge = styled.span`
  background: #1a1a2e;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled(Button)`
  background: transparent;
  color: white;
  border: 1px solid #333;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ContinueButton = styled(Button)`
  background: #e94560;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: #ff6b81;
  }
`;

// Mảng các hàng và số lượng ghế mỗi hàng
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 12;

const SeatSelectionPage = () => {
  const navigate = useNavigate();
  const { selectedMovie, selectedCinema, selectedShowTime, selectedSeats, toggleSeatSelection, calculateTotalPrice } = useBooking();
  const { currentUser } = useAuth();
  
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seatMap, setSeatMap] = useState([]);
  
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Kiểm tra xem đã chọn phim, rạp, suất chiếu chưa
    if (!selectedMovie || !selectedCinema || !selectedShowTime) {
      navigate('/movies');
      return;
    }
    
    const fetchSeats = async () => {
      try {
        setLoading(true);
        
        // Fetch danh sách ghế cho suất chiếu đã chọn
        const response = await seatService.getByShowTimeId(selectedShowTime.id);
        setSeats(response.data);
        
      } catch (err) {
        console.error('Error fetching seats:', err);
        setError('Không thể tải thông tin ghế. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSeats();
  }, [currentUser, navigate, selectedMovie, selectedCinema, selectedShowTime]);
  
  // Tạo sơ đồ ghế ngồi khi danh sách ghế thay đổi
  useEffect(() => {
    if (seats.length > 0) {
      const map = [];
      
      // Tạo một mẫu dữ liệu ghế nếu API không đủ ghế
      const sampleSeats = [];
      
      ROWS.forEach(row => {
        const rowSeats = [];
        
        for (let num = 1; num <= SEATS_PER_ROW; num++) {
          // Tìm ghế trong dữ liệu từ API
          const seatFromApi = seats.find(s => s.row === row && s.number === num);
          
          if (seatFromApi) {
            rowSeats.push(seatFromApi);
          } else {
            // Nếu không có ghế từ API, tạo ghế mẫu
            const isAvailable = Math.random() > 0.3; // 70% ghế trống
            const type = (row === 'A' || row === 'B') ? 'standard' : 
                         (row === 'C' || row === 'D') ? 'vip' : 'standard';
            const price = type === 'vip' ? selectedShowTime.price * 1.2 : selectedShowTime.price;
            
            const sampleSeat = {
              id: `sample-${row}-${num}`,
              showTimeId: selectedShowTime.id,
              row,
              number: num,
              type,
              price,
              isAvailable
            };
            
            sampleSeats.push(sampleSeat);
            rowSeats.push(sampleSeat);
          }
        }
        
        map.push({ row, seats: rowSeats });
      });
      
      // Kết hợp ghế từ API và ghế mẫu
      if (sampleSeats.length > 0 && seats.length < ROWS.length * SEATS_PER_ROW) {
        setSeats([...seats, ...sampleSeats]);
      }
      
      setSeatMap(map);
    }
  }, [seats, selectedShowTime]);
  
  const handleSeatClick = (seat) => {
    if (seat.isAvailable) {
      toggleSeatSelection(seat);
    }
  };
  
  const handleContinue = () => {
    if (selectedSeats.length > 0) {
      navigate('/booking/checkout');
    }
  };
  
  const handleBack = () => {
    navigate(`/movies/${selectedMovie.id}`);
  };
  
  // Kiểm tra xem ghế đã được chọn chưa
  const isSeatSelected = (seat) => {
    return selectedSeats.some(s => s.id === seat.id);
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
        <MovieInfo>
          <MoviePoster src={selectedMovie.poster} alt={selectedMovie.title} />
          <MovieDetails>
            <MovieTitle>{selectedMovie.title}</MovieTitle>
            <ShowtimeInfo>
              <InfoItem>
                <InfoIcon><FaRegCheckCircle /></InfoIcon>
                <div>{selectedCinema.name}</div>
              </InfoItem>
              <InfoItem>
                <InfoIcon><FaRegTimesCircle /></InfoIcon>
                <div>{format(new Date(selectedShowTime.date), 'dd/MM/yyyy')} - {selectedShowTime.startTime}</div>
              </InfoItem>
              <InfoItem>
                <InfoIcon><FaLock /></InfoIcon>
                <div>{selectedShowTime.hall}</div>
              </InfoItem>
            </ShowtimeInfo>
          </MovieDetails>
        </MovieInfo>
        
        <SeatSelectionContainer>
          <SectionTitle>Chọn ghế ngồi</SectionTitle>
          
          <Screen>Màn hình</Screen>
          
          <SeatsContainer>
            {seatMap.map(row => (
              <Row key={row.row}>
                <RowLabel>{row.row}</RowLabel>
                {row.seats.map(seat => (
                  <Seat
                    key={`${seat.row}-${seat.number}`}
                    isAvailable={seat.isAvailable}
                    isSelected={isSeatSelected(seat)}
                    type={seat.type}
                    onClick={() => handleSeatClick(seat)}
                  >
                    <SeatIcon />
                  </Seat>
                ))}
                <RowLabel>{row.row}</RowLabel>
              </Row>
            ))}
          </SeatsContainer>
          
          <SeatLegend>
            <LegendItem>
              <LegendColor color="#1a1a2e" />
              <span>Ghế thường</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#ff9800" />
              <span>Ghế VIP</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#e94560" />
              <span>Đang chọn</span>
            </LegendItem>
            <LegendItem>
              <LegendColor color="#333" />
              <span>Đã đặt</span>
            </LegendItem>
          </SeatLegend>
          
          <SummaryContainer>
            <SectionTitle>Thông tin đặt vé</SectionTitle>
            
            <SummaryRow>
              <div>Ghế đã chọn:</div>
              <SelectedSeatsList>
                {selectedSeats.length > 0 ? (
                  selectedSeats.map(seat => (
                    <SelectedSeatBadge key={seat.id}>
                      {seat.row}{seat.number} ({seat.type === 'vip' ? 'VIP' : 'Thường'})
                    </SelectedSeatBadge>
                  ))
                ) : (
                  <span style={{ color: '#a0a0a0' }}>Chưa chọn ghế</span>
                )}
              </SelectedSeatsList>
            </SummaryRow>
            
            <SummaryRow>
              <div>Tổng số ghế:</div>
              <div>{selectedSeats.length}</div>
            </SummaryRow>
            
            <SummaryRow>
              <div>Tổng tiền:</div>
              <div>{formatPrice(calculateTotalPrice())}</div>
            </SummaryRow>
          </SummaryContainer>
          
          <ButtonContainer>
            <BackButton onClick={handleBack}>Quay lại</BackButton>
            <ContinueButton 
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
            >
              Tiếp tục
            </ContinueButton>
          </ButtonContainer>
        </SeatSelectionContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default SeatSelectionPage;