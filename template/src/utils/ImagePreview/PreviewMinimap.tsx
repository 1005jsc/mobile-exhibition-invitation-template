import React, { useRef } from 'react';
import {
  useTransformEffect,
  useControls,
  useTransformContext,
} from 'react-zoom-pan-pinch';
import styled from 'styled-components';

interface PreviewMinimapProps {
  src: string;
  dimensionsRef: React.MutableRefObject<{
    imgWidth: number;
    imgHeight: number;
    wrapperWidth: number;
    wrapperHeight: number;
  }>;
}

export const usePreviewMinimap = (
  dimensionsRef: React.MutableRefObject<{
    imgWidth: number;
    imgHeight: number;
    wrapperWidth: number;
    wrapperHeight: number;
  }>,
) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useTransformEffect(({ state }) => {
    if (!boxRef.current) return;

    const { scale, positionX, positionY } = state;
    const { imgWidth, imgHeight, wrapperWidth, wrapperHeight } =
      dimensionsRef.current;

    if (imgWidth === 0 || imgHeight === 0) return;

    const miniMapWidth = 150;
    const scaleRatio = miniMapWidth / imgWidth;
    const miniMapHeight = imgHeight * scaleRatio;

    const viewLeft = -positionX / scale;
    const viewTop = -positionY / scale;
    const viewWidth = wrapperWidth / scale;
    const viewHeight = wrapperHeight / scale;

    const boxLeft = viewLeft * scaleRatio;
    const boxTop = viewTop * scaleRatio;
    const boxWidth = viewWidth * scaleRatio;
    const boxHeight = viewHeight * scaleRatio;

    boxRef.current.style.left = `${Math.max(0, boxLeft)}px`;
    boxRef.current.style.top = `${Math.max(0, boxTop)}px`;
    boxRef.current.style.width = `${Math.min(miniMapWidth, boxWidth)}px`;
    boxRef.current.style.height = `${Math.min(miniMapHeight, boxHeight)}px`;
  });

  return { boxRef };
};

export const PreviewMinimap = ({ src, dimensionsRef }: PreviewMinimapProps) => {
  const { boxRef } = usePreviewMinimap(dimensionsRef);
  const { setTransform } = useControls();
  const { transformState } = useTransformContext();
  const isDragging = useRef(false);

  const updatePosition = (
    clientX: number,
    clientY: number,
    currentTarget: EventTarget & HTMLDivElement,
  ) => {
    const { imgWidth, imgHeight, wrapperWidth, wrapperHeight } =
      dimensionsRef.current;
    if (imgWidth === 0) return;

    const miniMapWidth = 150;
    const scaleRatio = miniMapWidth / imgWidth;

    const rect = currentTarget.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const targetImageX = clickX / scaleRatio;
    const targetImageY = clickY / scaleRatio;

    const currentScale = transformState.scale;

    let newX = wrapperWidth / 2 - targetImageX * currentScale;
    let newY = wrapperHeight / 2 - targetImageY * currentScale;

    const contentWidth = imgWidth * currentScale;
    const contentHeight = imgHeight * currentScale;

    if (contentWidth > wrapperWidth) {
      const minX = wrapperWidth - contentWidth;
      const maxX = 0;
      newX = Math.min(Math.max(newX, minX), maxX);
    } else {
      newX = (wrapperWidth - contentWidth) / 2;
    }

    if (contentHeight > wrapperHeight) {
      const minY = wrapperHeight - contentHeight;
      const maxY = 0;
      newY = Math.min(Math.max(newY, minY), maxY);
    } else {
      newY = (wrapperHeight - contentHeight) / 2;
    }

    setTransform(newX, newY, currentScale, 0);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX, e.clientY, e.currentTarget);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX, e.clientY, e.currentTarget);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const { imgWidth, wrapperWidth, wrapperHeight } = dimensionsRef.current;
    if (imgWidth === 0) return;

    const miniMapWidth = 150;
    const scaleRatio = miniMapWidth / imgWidth;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetImageX = clickX / scaleRatio;
    const targetImageY = clickY / scaleRatio;

    const currentScale = transformState.scale;
    const step = 0.5;
    let newScale = currentScale + (e.deltaY < 0 ? step : -step);

    newScale = Math.min(Math.max(newScale, 1), 5);

    let newX = wrapperWidth / 2 - targetImageX * newScale;
    let newY = wrapperHeight / 2 - targetImageY * newScale;

    const contentWidth = imgWidth * newScale;
    const contentHeight = dimensionsRef.current.imgHeight * newScale;

    if (contentWidth > wrapperWidth) {
      const minX = wrapperWidth - contentWidth;
      const maxX = 0;
      newX = Math.min(Math.max(newX, minX), maxX);
    } else {
      newX = (wrapperWidth - contentWidth) / 2;
    }

    if (contentHeight > wrapperHeight) {
      const minY = wrapperHeight - contentHeight;
      const maxY = 0;
      newY = Math.min(Math.max(newY, minY), maxY);
    } else {
      newY = (wrapperHeight - contentHeight) / 2;
    }

    setTransform(newX, newY, newScale, 200, 'easeOut');
  };

  return (
    <MiniMapContainer
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onDragStart={(e) => e.preventDefault()}
    >
      <MiniMapImage src={src} alt="MiniMap" draggable={false} />
      <MiniMapBox ref={boxRef} />
    </MiniMapContainer>
  );
};

const MiniMapContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 150px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 100;
  overflow: hidden;
  border-radius: 4px;
  pointer-events: auto;
  cursor: crosshair;
  touch-action: none;
  user-select: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

const MiniMapImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  opacity: 0.6;
  pointer-events: none;
`;

const MiniMapBox = styled.div`
  position: absolute;
  border: 2px solid #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  box-sizing: border-box;
  pointer-events: none;
`;
