'use client';

import styled from 'styled-components';

interface ArtworkTypes {
  width: number;
  height: number;
}

export default function ImageContainer({
  handleClick,
  artwork,
  children,
}: {
  handleClick: () => void;
  artwork: ArtworkTypes;
  children: React.ReactNode;
}) {
  return (
    <Wrapper
      onClick={handleClick}
      $aspectRatio={artwork.width / artwork.height}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $aspectRatio: number }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  background-color: #faf8f5;
  margin-bottom: 24px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;

  &:hover {
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.99);
  }
`;
