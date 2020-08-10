import React, {
  useRef,
  useEffect,
  useState,
  MouseEvent,
  ChangeEvent,
} from "react";

interface IPropTypes {
  src: any;
  filename: string;
}

const Audio: React.FC<IPropTypes> = ({ src, filename }) => {
  const ctxRef = useRef<AudioContext>();
  const lpfRef = useRef<BiquadFilterNode>();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const AudioContext = window.AudioContext;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpfRef.current = lpf;

    const track = ctx.createMediaElementSource(audioRef.current!);

    track.connect(lpf);
    lpf.connect(ctx.destination);
  }, []);

  const [playing, setPlaying] = useState(false);
  const [freq, setFreq] = useState(2);
  const [q, setQ] = useState(0);

  useEffect(() => {
    if (lpfRef.current)
      lpfRef.current.frequency.value = 20 * Math.pow(10, freq);
  }, [freq]);
  useEffect(() => {
    if (lpfRef.current) lpfRef.current.Q.value = Math.pow(10, q);
  }, [q]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ctx = ctxRef.current;
    if (ctx?.state === "suspended") {
      ctx.resume();
    }
    if (!playing) {
      audioRef.current?.play();
      setPlaying(true);
    } else {
      audioRef.current?.pause();
      setPlaying(false);
    }
  };

  const handleFreq = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFreq(Number(e.currentTarget.value));
  };

  const handleQ = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setQ(Number(e.currentTarget.value));
  };

  return (
    <div className="audio-player">
      <audio src={src} ref={audioRef} />
      <p>Now playing: {filename}</p>
      <br />
      <button onClick={handleClick}>{playing ? "pause" : "play"}</button>
      <p>Frequency: {(20 * Math.pow(10, freq)).toFixed(0)}Hz</p>
      <input
        type="range"
        value={freq}
        max={3}
        min={0}
        step={0.01}
        onChange={handleFreq}
      />
      <p>Q: {Math.pow(10, q).toFixed(4)}</p>
      <input
        type="range"
        value={q}
        onChange={handleQ}
        min={-3}
        max={3}
        step={0.01}
      />
    </div>
  );
};

export default Audio;
