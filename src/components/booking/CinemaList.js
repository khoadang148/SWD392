import React from 'react';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const Container = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  margin-bottom: 1.5rem;
  color: #e94560;
`;

const CinemaItem = styled.div`
  background: ${props => props.selected ? 'rgba(233, 69, 96, 0.1)' : '#16213e'};
  border: 1px solid ${props => props.selected ? '#e94560' : '#333'};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #e94560;
    background: ${props => props.selected ? 'rgba(233, 69, 96, 0.1)' : 'rgba(233, 69, 96, 0.05)'};
  }
`;

const CinemaName = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: ${props => props.selected ? '#e94560' : 'white'};
`;

const CinemaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 0.8rem;
  color: ${props => props.selected ? '#e94560' : '#a0a0a0'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a0a0a0;
  background: #16213e;
  border-radius: 8px;
`;

const CinemaList = ({ 
  cinemas = [], 
  selectedCinema = null, 
  onSelectCinema,
  emptyMessage = 'Không có rạp chiếu phim nào' 
}) => {
  if (cinemas.length === 0) {
    return (
      <Container>
        <Title>Chọn rạp chiếu</Title>
        <EmptyState>
          <p>{emptyMessage}</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Chọn rạp chiếu</Title>
      {cinemas.map(cinema => (
        <CinemaItem 
          key={cinema.id} 
          selected={selectedCinema && selectedCinema.id === cinema.id}
          onClick={() => onSelectCinema(cinema)}
        >
          <CinemaName selected={selectedCinema && selectedCinema.id === cinema.id}>
            {cinema.name}
          </CinemaName>
          
          <CinemaInfo>
            <InfoRow>
              <InfoIcon selected={selectedCinema && selectedCinema.id === cinema.id}>
                <FaMapMarkerAlt />
              </InfoIcon>
              <div>{cinema.address}</div>
            </InfoRow>
            
            <InfoRow>
              <InfoIcon selected={selectedCinema && selectedCinema.id === cinema.id}>
                <FaPhoneAlt />
              </InfoIcon>
              <div>{cinema.phone}</div>
            </InfoRow>
          </CinemaInfo>
        </CinemaItem>
      ))}
    </Container>
  );
};

export default CinemaList;