import emailjs from "@emailjs/browser";
import Header from "../components/Header";
import Link from "next/link";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose, AiOutlineMail } from "react-icons/ai";

const Contact = () => {
  function sendEmail(e) {
    e.preventDefault();
    alert("Your message was sent. \n will reply soon!");

    emailjs.sendForm(
      "service_19mckop",
      "template_2qf2ml4",
      e.target,
      "AL4X4TAccfBeR34fy"
    );
  }

  return (
    <>
      <Header />
      <div className="flex items-center justify-between px-10 mx-auto mt-10 bg-black space-y-15 max-w-7xl sm:p-10">
     
        <div className="w-full col-span-3 mr-2 shadow-xl rounded-xl lg:p-4">
          <form onSubmit={sendEmail}>
            <div className="grid w-full gap-4 text-white md:grid-cols-2">
              <div className="flex flex-col">
                <label className="py-2 text-sm uppercase">Name</label>
                <input
                  className="flex p-1 text-gray-800 border-2 border-gray-200 rounded-lg focus:outline-none"
                  type="text"
                  name="name"
                  required={true}
                />
              </div>

              <div className="flex flex-col text-white">
                <label className="py-2 text-sm uppercase">Phone Number</label>
                <input
                  className="flex p-1 text-gray-800 border-2 border-gray-200 rounded-lg focus:outline-none"
                  type="text"
                  name="phone"
                />
              </div>
            </div>

            <div className="flex flex-col text-white">
              <label className="py-2 text-sm uppercase">Email</label>
              <input
                className="flex p-1 text-gray-800 border-2 border-gray-200 rounded-lg focus:outline-none"
                type="email"
                name="email"
                required={true}
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="py-2 text-sm uppercase">Subject</label>
              <input
                className="flex p-1 text-gray-800 border-2 border-gray-200 rounded-lg focus:outline-none"
                type="text"
                name="subject"
              />
            </div>

            <div className="flex flex-col text-white">
              <label className="py-2 text-sm uppercase">message</label>
              <textarea
                className="p-3 text-gray-800 border-2 border-gray-300 rounded-lg focus:outline-none"
                name="message"
                required={true}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full p-3 mt-4 mb-3 text-gray-500 duration-200 ease-in-out bg-white rounded-full hover:bg-black hover:text-white"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="text-white">
          <ul >
            <li className="py-3 cursor-pointer"><Link href="https://www.linkedin.com/in/dialaabulkhail/"><FaLinkedinIn size={50}/></Link></li>
            <li className="py-3 cursor-pointer"> <Link href="https://github.com/dialaabulkhail"><FaGithub size={50}/></Link></li>
            <li className="py-3 cursor-pointer"><Link href="mailto:diala.sh.98@gmail.com"><AiOutlineMail size={50}/></Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Contact;