import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart
} from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { formatDuration } from "../../utils/formatters";

// --- Styled Components (Mobile-optimized) ---
const MobileBarRoot = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 64px; /* Place above bottom navbar (h-16) */
  background: #151515;
  border-top: 1px solid #222;
  padding: 0.7rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
  z-index: 50;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.12);

  @media (min-width: 900px) {
    display: none;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const TrackMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TrackTitle = styled.h4`
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: #fff;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 11px;
  white-space: nowrap;
  opacity: ${props => props.$visible ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.12s;
  z-index: 1000;
`;

const ControlGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
`;

const TimeLabel = styled.span`
  width: 38px;
  color: #ccc;
  font-size: 11px;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  position: relative;
  height: 14px;
`;

const BaseBar = styled.div`
  width: 100%;
  height: 5px;
  background: #444;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const ProgressBarFill = styled.div`
  height: 5px;
  background: #22c55e;
  border-radius: 5px;
  width: ${({ $percent }) => $percent}%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: width 0.11s linear;
`;

// FIX: Thumb is always visible for working mobile seek!
const SeekInput = styled.input.attrs({ type: "range" })`
  appearance: none;
  width: 100%;
  height: 14px;
  background: transparent;
  position: absolute;
  z-index: 20;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #22c55e;
    margin-top: 1px;
  }
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #22c55e;
    margin-top: 1px;
  }
  &::-ms-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #22c55e;
    margin-top: 1px;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 0.21rem;
  justify-content: center;
`;

// --- Main Mobile PlayerBar Component ---
export default function MobilePlayerBar() {
  const {
    currentSong, isPlaying, setIsPlaying,
    isLiked, toggleLike
  } = useMusic();

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltip, setTooltip] = useState({ btn: '' });

  function handleSeek(e) {
    if (!audioRef.current || !duration || isNaN(duration)) return;
    const pct = Number(e.target.value);
    const newTime = (pct / 100) * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.url) return;
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    audio.src = currentSong.url;
    audio.load();
    return () => {
      audio.src = "";
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(false);
    };
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.play().catch(() => {}); }
    else { audio.pause(); }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(isNaN(audio.duration) ? 0 : audio.duration);
      setCurrentTime(audio.currentTime || 0);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [currentSong]);

  if (!currentSong) return null;
  const percent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <MobileBarRoot>
      <audio ref={audioRef} preload="auto" />
      {/* Song Info */}
      <TrackInfo>
        <img
          src={currentSong.coverImage}
          alt={currentSong.title}
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <TrackMeta>
          <TrackTitle>{currentSong.title}</TrackTitle>
          <TrackArtist>{currentSong.artist}</TrackArtist>
        </TrackMeta>
        <IconButton onClick={() => toggleLike(currentSong)} aria-label="Toggle Like">
          <Heart
            size={17}
            color={isLiked(currentSong.id) ? "#22c55e" : "#b9b9b9"}
            fill={isLiked(currentSong.id) ? "#22c55e" : "none"}
          />
        </IconButton>
      </TrackInfo>
      {/* Controls & Progress */}
      <ControlGroup>
        <ProgressWrapper>
          <TimeLabel>
            {isLoading ? "..." : formatDuration(currentTime)}
          </TimeLabel>
          <ProgressBarContainer>
            <BaseBar />
            <ProgressBarFill $percent={percent} />
            <SeekInput
              min={0}
              max={100}
              step={0.1}
              value={duration ? percent : 0}
              onChange={handleSeek}
              aria-label="Seek"
              disabled={isLoading || !duration || isNaN(duration) || duration === 0}
            />
          </ProgressBarContainer>
          <TimeLabel>
            {isLoading ? "..." : formatDuration(duration)}
          </TimeLabel>
        </ProgressWrapper>
        <ControlsRow>
          <IconButton
            onMouseEnter={() => setTooltip({ btn: 'shuffle' })}
            onMouseLeave={() => setTooltip({ btn: '' })}
          >
            <Shuffle color="#ccc" />
            <Tooltip $visible={tooltip.btn === "shuffle"}>Shuffle</Tooltip>
          </IconButton>
          <IconButton>
            <SkipBack size={22} color="#ccc" />
          </IconButton>
          <IconButton
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: 36,
              height: 36,
              background: "#22c55e",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
              position: "relative"
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={isLoading}
            onMouseEnter={() => setTooltip({ btn: isPlaying ? 'pause' : 'play' })}
            onMouseLeave={() => setTooltip({ btn: '' })}
          >
            {isPlaying ? <Pause size={19} color="#fff" /> : <Play size={19} color="#fff" />}
            <Tooltip $visible={tooltip.btn === "play"}>Play</Tooltip>
            <Tooltip $visible={tooltip.btn === "pause"}>Pause</Tooltip>
          </IconButton>
          <IconButton>
            <SkipForward size={22} color="#ccc" />
          </IconButton>
          <IconButton
            onMouseEnter={() => setTooltip({ btn: 'repeat' })}
            onMouseLeave={() => setTooltip({ btn: '' })}
          >
            <Repeat color="#ccc" />
            <Tooltip $visible={tooltip.btn === "repeat"}>Repeat</Tooltip>
          </IconButton>
        </ControlsRow>
      </ControlGroup>
      {/* No Volume controls */}
    </MobileBarRoot>
  );
}
