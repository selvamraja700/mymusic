import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Heart
} from "lucide-react";
import { useMusic } from "../../context/MusicContext";
import { formatDuration } from "../../utils/formatters";

// --- STYLED COMPONENTS (Desktop/Tablet only) ---
const PlayerBarRoot = styled.div`
  position: fixed;
  left: 16rem;
  right: 0;
  bottom: 0;
  background: #151515;
  border-top: 1px solid #222;
  padding: 1rem 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  z-index: 50;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: ${props => props.$visible ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.12s;
  z-index: 1000;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TrackMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TrackTitle = styled.h4`
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: #b3b3b3;
  font-size: 13px;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ControlGroup = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TimeLabel = styled.span`
  width: 48px;
  color: #ccc;
  font-size: 12px;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  position: relative;
  height: 16px;
  &:hover input[type="range"]::-webkit-slider-thumb {
    display: block;
  }
  &:hover input[type="range"]::-moz-range-thumb {
    display: block;
  }
  &:hover input[type="range"]::-ms-thumb {
    display: block;
  }
`;

const BaseBar = styled.div`
  width: 100%;
  height: 6px;
  background: #444;
  border-radius: 6px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const ProgressBarFill = styled.div`
  height: 6px;
  background: #22c55e;
  border-radius: 6px;
  width: ${({ $percent }) => $percent}%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: width 0.1s linear;
`;

const SeekInput = styled.input.attrs({ type: "range" })`
  appearance: none;
  width: 100%;
  height: 16px;
  background: transparent;
  position: absolute;
  z-index: 20;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    height: 16px;
    background: transparent;
  }
  &::-moz-range-track {
    height: 16px;
    background: transparent;
  }
  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #22c55e;
    box-shadow: 0 0 4px #22c55e60;
    margin-top: 1px;
    display: none;
  }
  &:hover::-webkit-slider-thumb {
    display: block;
  }
  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #22c55e;
    margin-top: 1px;
    display: none;
  }
  &:hover::-moz-range-thumb {
    display: block;
  }
  &::-ms-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #22c55e;
    margin-top: 1px;
    display: none;
  }
  &:hover::-ms-thumb {
    display: block;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
  margin-top: 0.4rem;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const VolumeBase = styled.div`
  width: 130px;
  height: 18px;
  position: relative;
`;

const VolumeGray = styled.div`
  width: 100%;
  height: 6px;
  background: #444;
  border-radius: 6px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const VolumeFill = styled.div`
  height: 6px;
  background: #22c55e;
  border-radius: 6px;
  width: ${({ $percent }) => $percent}%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const VolumeRange = styled.input.attrs({ type: "range" })`
  appearance: none;
  width: 100%;
  height: 18px;
  background: transparent;
  position: absolute;
  z-index: 20;
  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 50%;
    border: 2px solid #22c55e;
    margin-top: -4px;
  }
`;

// --- PLAYERBAR COMPONENT (desktop only) ---
export default function PlayerBar() {
  const {
    currentSong, isPlaying, setIsPlaying,
    volume, setVolume, isMuted, setIsMuted,
    isLiked, toggleLike
  } = useMusic();

  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltip, setTooltip] = useState({btn: ''});

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
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

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
    <PlayerBarRoot>
      <audio ref={audioRef} preload="auto" />
      {/* Track Info */}
      <TrackInfo>
        <img
          src={currentSong.coverImage}
          alt={currentSong.title}
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            objectFit: "cover",
          }}
        />
        <TrackMeta>
          <TrackTitle>{currentSong.title}</TrackTitle>
          <TrackArtist>{currentSong.artist}</TrackArtist>
        </TrackMeta>
        <IconButton onClick={() => toggleLike(currentSong)} aria-label="Toggle Like">
          <Heart
            size={20}
            color={isLiked(currentSong.id) ? "#22c55e" : "#b9b9b9"}
            fill={isLiked(currentSong.id) ? "#22c55e" : "none"}
          />
        </IconButton>
      </TrackInfo>
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
            onMouseEnter={() => setTooltip({btn: 'shuffle'})}
            onMouseLeave={() => setTooltip({btn: ''})}
          >
            <Shuffle color="#ccc" />
            <Tooltip $visible={tooltip.btn === "shuffle"}>Shuffle</Tooltip>
          </IconButton>
          <IconButton>
            <SkipBack size={26} color="#ccc" />
          </IconButton>
          <IconButton
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: 50,
              height: 50,
              background: "#22c55e",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
              position: "relative"
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
            onMouseEnter={() => setTooltip({btn: isPlaying ? 'pause' : 'play'})}
            onMouseLeave={() => setTooltip({btn: ''})}
            disabled={isLoading}
          >
            {isPlaying ? <Pause size={26} color="#fff" /> : <Play size={26} color="#fff" />}
            <Tooltip $visible={tooltip.btn === "play"}>Play</Tooltip>
            <Tooltip $visible={tooltip.btn === "pause"}>Pause</Tooltip>
          </IconButton>
          <IconButton>
            <SkipForward size={26} color="#ccc" />
          </IconButton>
          <IconButton
            onMouseEnter={() => setTooltip({btn: 'repeat'})}
            onMouseLeave={() => setTooltip({btn: ''})}
          >
            <Repeat color="#ccc" />
            <Tooltip $visible={tooltip.btn === "repeat"}>Repeat</Tooltip>
          </IconButton>
        </ControlsRow>
      </ControlGroup>
      {/* Volume Controls */}
      <VolumeContainer>
        <IconButton
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </IconButton>
        <VolumeBase>
          <VolumeGray />
          <VolumeFill $percent={volume * 100} />
          <VolumeRange
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </VolumeBase>
      </VolumeContainer>
    </PlayerBarRoot>
  );
}
