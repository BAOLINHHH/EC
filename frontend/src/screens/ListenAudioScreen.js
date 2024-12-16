import React, { useEffect, useRef, useState } from "react";
import img from "../imageshome/banner2.jpg";
import audioSrc from "../imageshome/videoplayback.mp3";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { useParams } from "react-router-dom";
import listProduct from "../api/productsAPI";
import Loader from "../componets/Loader";
const ListenAudioScreen = () => {
  const { id } = useParams();
  const [dataProduct, SetdataProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPlay, setIsPlay] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBar = useRef();
  // const audioRef = useState('');
  const audioPlay = useRef();
  const animationRef = useRef();

  useEffect(() => {
    flechData();
  }, []);
  const flechData = async () => {
    try {
      const responseProduct = await listProduct.getProductDetail(id);
      console.log("aaa",responseProduct )
      SetdataProduct(responseProduct);
      setIsLoading(false);
    } catch (error) {}
  };
  // const handleRange =()=>{
  //   audioPlay.current.currentTime = progressBar.current.vaule;
  //   progressBar.current.setProperty('seek-before-width', `${progressBar.current.value / duration * 100}%`)
  //   setCurrentTime(progressBar.current.vaule)
  //     // audioRef.currentTime = e.target.value;
  //     // setCurrentTime(e.target.value);
  // }
  const changeRange = () => {
    audioPlay.current.currentTime = progressBar.current.value;
    // handleRange();
  };
  const handlePlay = () => {
    // audioRef.play();
    // setIsPlay(true);
  };
  const handlePause = () => {
    // audioRef.pause();
    // setIsPlay(false);
  };
  const handleTimeUpdate = () => {
    // setCurrentTime(audioRef.currentTime)
    // setDuration (audioRef.duration)
  };
  const handlePlayPause = () => {
    setIsPlay(!isPlay);
    if (isPlay) {
      audioPlay.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlay.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };
  const whilePlaying = () => {
    progressBar.current.value = audioPlay.current.currentTime;
    setCurrentTime(progressBar.current.value);
    animationRef.current = requestAnimationFrame(whilePlaying);
  };
  useEffect(() => {
    const seconds = Math.floor(audioPlay.current.duration);
    setDuration(seconds);
    // audioRef.addEventListener("timeupdate",handleTimeUpdate);
    // return () => {
    //   audioRef.removeEventListener("timeupdate",handleTimeUpdate);
    // };
    progressBar.current.max = seconds;
  }, [audioPlay?.current?.loadedmetadata, audioPlay?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };
  return (
    <>
      <section className="py-5">
        <div className="container-sm">
          <div className="flex justify-center">
            <div className="w-[500px] flex flex-col items-center border-[3px] border-[#d97f2a] rounded-[10px] p-3">
              <img
                className=" w-[200px] h-[200px]"
                src={dataProduct.bookImage}
              />
              <input
                className="w-[300px] mt-2"
                // className="progressBar"
                type="range"
                defaultValue="0"
                ref={progressBar}
                // min="0"
                // max={duration}
                // value={currentTime}
                onChange={changeRange}
              />
              <audio ref={audioPlay} src={dataProduct.audioUrl} />
              <div className="flex justify-between w-[300px]">
                <p>{calculateTime(currentTime)}</p>
                <p>{duration && !isNaN(duration) && calculateTime(duration)}</p>
              </div>
              <button
                onClick={handlePlayPause}
                className=" text-[#fff] text-[30px] w-[3rem] h-[3rem] bg-[#4a30df] border-none rounded-[50%] flex items-center justify-center "
              >
                <span>{isPlay ? <CiPlay1 /> : <CiPause1 />}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListenAudioScreen;
