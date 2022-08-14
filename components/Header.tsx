import Link from "next/link";


function Header() {
  
  return (
    <header className="flex justify-between p-5 mx-auto max-w-7xl">
      <div className="flex items-center space-x-5">
        <Link href="/" >
          <h1 className="text-3xl uppercase cursor-pointer">Diala's BLOG</h1>
        </Link>
        <div className="items-center hidden space-x-2 text-gray-600 md:inline-flex ">
          <h3  className="px-3 duration-300 ease-in-out rounded-full cursor-pointer hover:bg-gray-200"><Link href="/About" >About me</Link></h3>
          <h3 className="px-3 duration-300 ease-in-out rounded-full cursor-pointer hover:bg-gray-200"><Link href="/Contact">Contact</Link></h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-gray-600 ">
        <Link href="/#posts" ><h3 className="px-4 py-1 duration-300 ease-in-out border border-gray-300 rounded-full cursor-pointer hover:bg-gray-300 hover:text-white">View Articles</h3></Link>
      </div>
    </header>
  );
}

export default Header;
