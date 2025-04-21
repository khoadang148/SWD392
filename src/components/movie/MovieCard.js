import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaStar, FaClock } from 'react-icons/fa';

const Card = styled.div`
  background: #16213e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PosterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 150%;
  overflow: hidden;
`;

const Poster = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 18px;
  margin: 0 0 8px;
  color: #fff;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #a0a0a0;
  font-size: 14px;
`;

const InfoIcon = styled.span`
  margin-right: 5px;
  display: flex;
  align-items: center;
  color: #e94560;
`;

const GenreBadge = styled.span`
  background: #0f3460;
  color: #fff;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
  margin-bottom: 5px;
  display: inline-block;
`;

const BookButton = styled(Link)`
  margin-top: auto;
  background: #e94560;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
  text-decoration: none;
  display: block;

  &:hover {
    background: #ff6b81;
  }
`;

const GenresContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const MovieCard = ({ movie }) => {
  // Chuyển đổi thể loại nếu là chuỗi hoặc null
  let displayGenres = [];

  if (movie.filmGenres && Array.isArray(movie.filmGenres)) {
    displayGenres = movie.filmGenres.slice(0, 2);
  } else if (typeof movie.filmGenres === 'string') {
    displayGenres = movie.filmGenres.split(',').map(g => g.trim()).slice(0, 2);
  }

  return (
    <Card>
      <PosterContainer>
        <Poster
          src={movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.title}
        />
      </PosterContainer>
      <Content>
        <Title>{movie.title}</Title>

        <InfoRow>
          <InfoIcon><FaClock /></InfoIcon>
          {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
        </InfoRow>

        <GenresContainer>
          {displayGenres.map((genre, index) => (
            <GenreBadge key={index}>{genre}</GenreBadge>
          ))}
        </GenresContainer>

        <BookButton to={`/movies/${movie.id}`}>
          Chi tiết & Đặt vé
        </BookButton>
      </Content>
    </Card>
  );
};

export default MovieCard;
