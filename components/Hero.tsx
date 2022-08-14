
export default function Hero() {

  return (
    <div className="flex items-center justify-between px-10 mx-auto space-y-5 bg-black max-w-7xl sm:p-10">
      <div >
        <h1 className="max-w-xl text-5xl text-white">
          In hope to help you get started ...
        </h1>
        <h2 className="max-w-md pt-5 tracking-widest text-white">
          You'll find blogs of various development subjects written, chosen by me. <br/><br/>
          <span className="font-bold">Welcome to my blog</span>!
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





