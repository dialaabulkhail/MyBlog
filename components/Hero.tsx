
export default function Hero() {

  return (
    <div className="flex items-center justify-between px-10 mx-auto space-y-5 bg-black max-w-7xl sm:p-10">
      <div className="">
        <h1 className="max-w-xl text-5xl text-white">
          A place to inspire readers and support writers...
        </h1>
        <h2 className="pt-5 tracking-widest text-white">
          Welcome to <span className="font-bold">BLOGIT</span>!
        </h2>
      </div>

      <div className="hidden h-32 md:inline-flex lg:h-full">
        <video
          className="rounded-lg"
          autoPlay
          loop
          muted
          src="https://player.vimeo.com/external/403663000.sd.mp4?s=87419a3b18e64af06d9f88ef30f2c76e413badc5&profile_id=164&oauth2_token_id=57447761"
        />
      </div>
    </div>
  );
}





