import { GetStaticProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import Header from "../../components/Header";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { HiOutlineChevronUp } from "react-icons/hi";
import Link from 'next/link'

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  console.log(post);
  // this state will keep track of any comments to be sent via the form
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // special submit handler
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        // console.log(res);
        setSent(true);
      })
      .catch((err) => {
        // console.log(err);
        setSent(false);
      });
  };
  return (
    <div >
      <Header />

      <img
        src={urlFor(post.mainImage).url()!}
        className="object-cover w-full h-40"
      />
      <article className="max-w-3xl p-5 mx-auto " >
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            className="w-10 h-10 rounded-full"
          />
          <p className="text-sm font-light text-gray-500">
            Blog post by {post.author.name} - Published at{" "}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <hr className="mt-5"/>

        <div>
          {/* this is how we render the body */}
          <PortableText
            className="p-3 tracking-wider mt-7 "
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => <h1 className="my-5 text-2xl " {...props} />,
              h2: (props: any) => <h1 className="my-5 text-xl " {...props} />,
              h3: (props: any) => <h1 className="my-5 text-l " {...props} />,
              p: (props: any) => <p className="my-5 " {...props} />,
              li: ({ childern }: any) => (
                <li className="pt-2 ml-4 list-disc">{childern}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-900 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-2xl mx-auto my-5 border border-gray-800" />

      {/* form section */}
      {sent ? (
        <div className="max-w-xl py-10 mx-auto my-10 bg-gray-100">
          <h1 className="text-xl tracking-widest text-center">Comment Sent!</h1>{" "}
          <p className="text-sm tracking-widest text-center">
            Thank you..
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col max-w-2xl p-5 mx-auto my-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-2xl">Leave a comment below!</h3>
          <hr className="py-3 mt-2" />

          <input
            type="hidden"
            {...register("_id")}
            name="_id"
            value={post._id}
          />

          <label className="mb-5 ">
            <input
              {...register("name", { required: true })}
              className="w-full px-3 py-1 border rounded shadow-sm focus:outline-blue-200 "
              placeholder="Name*"
              type="text"
            />
          </label>

          <label className="mb-5 ">
            <input
              {...register("email", { required: true })}
              className="w-full px-3 py-1 border rounded shadow-sm focus:outline-blue-200"
              placeholder="Email*"
              type="email"
            />
          </label>

          <label className="mb-5 ">
            <textarea
              {...register("comment", { required: true })}
              className="w-full px-3 py-10 border rounded shadow-sm focus:outline-blue-200"
              placeholder="Comment..."
            />
          </label>

          <div className="flex flex-col p-5">
            {errors.name && (
              <p className="text-sm text-red-400">Name field is required!</p>
            )}
            {errors.email && (
              <p className="text-sm text-red-400">Email field is required!</p>
            )}
            {errors.comment && (
              <p className="text-sm text-red-400">Comment field is required!</p>
            )}
          </div>

          <button
            className="p-3 text-white duration-200 ease-in-out bg-black border rounded-full cursor-pointer hover:bg-white hover:text-black hover:border-black"
            type="submit"
          >
            Send
          </button>
        </form>
      )}

      {/* comments section */}
      <div className="flex flex-col max-w-2xl p-10 mx-auto my-10 space-y-2 rounded-lg shadow-lg shadow-gray-300">
        <h3 className="text-2xl">Comments</h3>
        <hr className="pb-5" />

        {post.comments.map((comment) => {
          return (
            <div>
              <h1>
                {comment.name}:{" "}
                <span className="text-gray-400">{comment.comment}</span>
              </h1>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center py-5">
          <Link href="/">
            <div className="p-1 duration-200 ease-in bg-black rounded-full shadow cursor-pointer hover:scale-110">
              <HiOutlineChevronUp
                className="m-auto text-white"
                size={30}
              />
            </div>
          </Link>
        </div>
    </div>
  );
}

export default Post;

// this function is to find existing posts
export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug,
      }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};
// we need to provide the props as array
// for every single post i want to return an object
// the first is a params and the second one matches the fle name (slug)

// the structure will be an array of objects each have a slug

// this function is for getting the data from each post
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
    name,
    image,
  },
  'comments': *[
    _type == 'comment' &&
    post._ref == ^._id
  ],
  description,
  category,
  mainImage,
    slug,
  body
  }`;
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds it will update the page (for catching updates)
  };
};
