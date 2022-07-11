import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Link from "next/link";


import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  console.log(posts);
  return (
    <div className="">
      <Head>
        <title>BLOGIT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Hero />

      {/* posts */}
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 md:p-10" id="posts">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="overflow-hidden border rounded-lg shadow-md cursor-pointer group">
              <img src={urlFor(post.mainImage).url()!} alt="" className="object-cover w-full transition-transform duration-300 ease-in-out h-60 group-hover:scale-105"/>
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-sm">{post.description} by {post.author.name}</p>
                </div>

                <img className="w-12 h-12 rounded-full" src={urlFor(post.author.image).url()!}/>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author -> {
    name,
    image
  },
  description,
  mainImage,
  slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
