'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  TransformWrapper,
  TransformComponent,
  useControls,
  useTransformEffect,
} from 'react-zoom-pan-pinch';
import styled from 'styled-components';
import { PreviewMinimap } from './PreviewMinimap';

interface ImagePreviewWithLibProps {
  src: string;
  onClose: () => void;
  warningText: string;
  maxScale?: number;
  isWarningVisible: boolean;
}

const Controls = ({
  onClose,
  isMinimapVisible,
  toggleMinimap,
}: {
  onClose: () => void;
  isMinimapVisible: boolean;
  toggleMinimap: () => void;
}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <ControlsContainer>
      <MinimapButton onClick={toggleMinimap}>
        {isMinimapVisible ? '미니맵 끄기' : '미니맵 켜기'}
      </MinimapButton>
      <ControlButton onClick={() => zoomIn()}>+</ControlButton>
      <ControlButton onClick={() => zoomOut()}>-</ControlButton>
      <ControlButton onClick={() => resetTransform()}>초기화</ControlButton>
      <CloseButton
        onClick={() => {
          resetTransform();
          onClose();
        }}
      >
        닫기
      </CloseButton>
    </ControlsContainer>
  );
};

export default function ImagePreviewWithLib({
  src,
  onClose,
  warningText,
  maxScale = 5,
}: ImagePreviewWithLibProps) {
  const [isVerticalLong, setIsVerticalLong] = useState(false);
  const [isHorizontalLong, setIsHorizontalLong] = useState(false);
  const [isMinimapVisible, setIsMinimapVisible] = useState(true);
  const [isWarningVisible, setIsWarningVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dimensionsRef = useRef({
    imgWidth: 0,
    imgHeight: 0,
    wrapperWidth: 0,
    wrapperHeight: 0,
  });

  React.useEffect(() => {
    const isHidden = localStorage.getItem('hide_preview_warning');
    if (isHidden === 'true') {
      setIsWarningVisible(false);
    }

    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      return mobile;
    };

    const initialMobile = checkMobile();
    if (initialMobile) {
      setIsMinimapVisible(false);
    }

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCloseWarning = () => {
    localStorage.setItem('hide_preview_warning', 'true');
    setIsWarningVisible(false);
  };

  const [wrapperOptions, setWrapperOptions] = useState({
    panning: {
      lockAxisX: false,
      lockAxisY: false,
      velocityDisabled: true,
    },
    alignmentAnimation: {
      disabled: false,
    },
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;

    let wrapperH, wrapperW;

    if (window.innerWidth <= 768) {
      wrapperH = window.innerHeight * 0.8;
      wrapperW = window.innerWidth * 0.85;
    } else {
      wrapperH = window.innerHeight - 100;
      wrapperW = window.innerWidth * 0.75;
    }

    const renderedImgWidth = img.offsetWidth || wrapperW;
    const renderedImgHeight =
      img.offsetHeight || (img.naturalHeight / img.naturalWidth) * wrapperW;

    dimensionsRef.current = {
      imgWidth: renderedImgWidth,
      imgHeight: renderedImgHeight,
      wrapperWidth: wrapperW,
      wrapperHeight: wrapperH,
    };

    const containerWidth = wrapperW;
    const containerHeight = wrapperH;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const containerRatio = containerWidth / containerHeight;

    let vLong = false;
    let hLong = false;

    if (imgRatio < containerRatio) {
      vLong = true;
    } else if (imgRatio > containerRatio) {
      hLong = true;
    } else {
      vLong = true;
      hLong = true;
    }

    setIsVerticalLong(vLong);
    setIsHorizontalLong(hLong);

    setWrapperOptions({
      panning: {
        lockAxisX: vLong,
        lockAxisY: hLong,
        velocityDisabled: true,
      },
      alignmentAnimation: {
        disabled: false,
      },
    });
  };

  const updateWrapperOptions = useCallback(
    (isZoomedOut: boolean) => {
      setWrapperOptions((prev) => {
        const newLockX = isZoomedOut && isVerticalLong;
        const newLockY = isZoomedOut && isHorizontalLong;

        const newAnimDisabled = !isZoomedOut;

        if (
          prev.panning.lockAxisX === newLockX &&
          prev.panning.lockAxisY === newLockY &&
          prev.alignmentAnimation.disabled === newAnimDisabled
        ) {
          return prev;
        }

        return {
          panning: {
            ...prev.panning,
            lockAxisX: newLockX,
            lockAxisY: newLockY,
          },
          alignmentAnimation: {
            disabled: newAnimDisabled,
          },
        };
      });
    },
    [isVerticalLong, isHorizontalLong]
  );

  const overlayDragStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleOverlayMouseDown = (e: React.MouseEvent) => {
    overlayDragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!overlayDragStartRef.current) return;

    const dx = Math.abs(e.clientX - overlayDragStartRef.current.x);
    const dy = Math.abs(e.clientY - overlayDragStartRef.current.y);

    if (dx < 5 && dy < 5) {
      onClose();
    }

    overlayDragStartRef.current = null;
  };

  return (
    <Overlay onMouseDown={handleOverlayMouseDown} onClick={handleOverlayClick}>
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={maxScale}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        limitToBounds={true}
        panning={wrapperOptions.panning}
        alignmentAnimation={wrapperOptions.alignmentAnimation}
      >
        <ModalContent onClick={(e) => e.stopPropagation()}>
          {isWarningVisible && (
            <WarningText onClick={handleCloseWarning}>
              <span>{warningText}</span>
              <WarningCloseButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseWarning();
                }}
              >
                X
              </WarningCloseButton>
            </WarningText>
          )}
          <Controls
            onClose={onClose}
            isMinimapVisible={isMinimapVisible}
            toggleMinimap={() => setIsMinimapVisible((prev) => !prev)}
          />
          <TransformComponent
            wrapperStyle={
              isMobile
                ? {
                    width: '85vw',
                    height: '80vh',
                    overflow: 'hidden',
                  }
                : {
                    width: '100%',
                    height: 'calc(100vh - 100px)',
                    marginTop: '50px',
                    marginBottom: '50px',
                    overflow: 'hidden',
                  }
            }
            contentStyle={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <StyledImage src={src} alt="Preview" onLoad={handleImageLoad} />
          </TransformComponent>

          <LockHandler onUpdate={updateWrapperOptions} />
          {isMinimapVisible && (
            <PreviewMinimap src={src} dimensionsRef={dimensionsRef} />
          )}
        </ModalContent>
      </TransformWrapper>
    </Overlay>
  );
}

const LockHandler = ({
  onUpdate,
}: {
  onUpdate: (isZoomedOut: boolean) => void;
}) => {
  useTransformEffect(({ state }) => {
    const isZoomedOut = state.scale < 1.01;
    onUpdate(isZoomedOut);
  });

  return null;
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  position: relative;
  width: 75vw;
  height: 100vh;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 85vw;
    height: 90vh;
  }

  & > * {
    pointer-events: auto;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const ControlsContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  backdrop-filter: blur(4px);
  font-size: 14px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const MinimapButton = styled(ControlButton)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const CloseButton = styled(ControlButton)`
  background-color: rgba(220, 38, 38, 0.8);
  border-color: rgba(220, 38, 38, 0.6);

  &:hover {
    background-color: rgba(220, 38, 38, 1);
  }
`;

const WarningText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 100;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 8px 12px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    bottom: auto;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    justify-content: center;
    text-align: center;
    cursor: pointer;
  }
`;

const WarningCloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 12px;
  padding: 2px 5px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
