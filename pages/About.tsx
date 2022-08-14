import Header from "../components/Header";
import Image from "next/image";
import me from '../public/images/me.png'


function About() {
  return (
    <div>
        <Header />


    <div className="flex items-center justify-between px-10 mx-auto mt-10 bg-black space-y-15 max-w-7xl sm:p-10">
    <div >
    <h1 className="font-bold tracking-widest text-white">Who am I?</h1>
    <h2 className="max-w-3xl pt-2 tracking-widest text-white text-s">
        I am a Python developer with background in Civil engineering. Passionate about delivering creative, efficient and high quality applications using Python and Javascript based tools with eager to improve and inspire in the frontend. <br/><br/>
          
        </h2>
        <h1 className="font-bold tracking-widest text-white">Education</h1>
        <p className="max-w-3xl pt-2 tracking-widest text-white text-s"> I have completed my Bachelor degree in Civil Engineering in 2021 at
            Al-Hussein bin Talal University, Ma'an Jordan.
            It was then when I decided to sign up for something I always wanted
            to learn.. Programming!
            Recently, I have successfully completed the (Code fellows) intensive Software Development
            course in Python at Abdul-Aziz Ghurair School Of Advanced
            Computing (ASAC) that started in Jan,2022 and lasted until July,2022..</p>
    
        <br/>
        <p className="tracking-widest text-center text-white font-extralight ">"I’m a greater believer in luck, and I find the harder I work the more I have of it."</p>
      </div>

      <div className=" md:inline-flex lg:h-full">
        <Image
          className="rounded-lg"
            width={320}
            height={350}
          src={me}
        ></Image>
      </div>
        
    </div>
    </div>
  )
}

export default About