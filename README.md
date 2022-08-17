## [sanity backend](https://blogit.sanity.studio/desk)
## [vercel deployment link](https://blogit-812np4qpm-dialaabulkhail.vercel.app/#posts)


## Setup

```
npx craete-next-app --example with-tailwindcss projectname
```


```
cd projectname
```

- run this yet
```
npm install -g @sanity/cli
```
this command allows me to have cli tools which means i can run stuff inside the terminal

- this command will let me initialize a sanity studio inside this diretcory
```
sanity init --coupon sonny2022
```

-  when asks to choose project templates: choose blog (schema) to shortcut the process 

- after this you can see your project name in your sanity projects 


- you'll see that the index and app are in txs format - typescript and not javascript, the browser doesn't actually understand that but next js prepares all that behind the scenes and this is called transpiing when i save the file it will be automatically translated to javascript

```
npm run dev
```

using Link from next js will prefetch the page by default, which means it will make it super fast because its already fitched


```
cd sanityproject
```

this runs up our local studio
```
sanity start
```

after creating posts and authors we want to pull them into our project



## Updates
To be able to see your updates you should add them to sanity then open your local repo and push it to github to be redeployed (this is aweful)

## How to use



- in the vision of the sanity add a query of all needed data that you want to fetch 

```
*[_type == "post"]{
  _id,
  title,
  slug,
  author -> {
  name,
  image,
}
}
```

```
npm install next-sanity
```
to connect everything together go to package.json public file and add:

```
npm install @sanity/image-url
```

create sanity.js file same level as package.json

add these imports:

```
import {
    createCurrentUserHook,
    createClient,
} from 'next-sanity'; 

import createImageUrlBuilder from '@sanity/image-url'
```


```
export const config = {
    // sanity id is found on sanity.json in the sanity project
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-03-25",
    useCdn: process.env.NODE_ENV === "production",
}
```

add this to sanity file:

```
// to fetch data
export const sanityClient = createClient(config)


// to extract the image urls
export const urlFor = (source) => createImageUtlBuilder(config).image(source)
```
create .env.local file and create variables of NEXT_PUBLIC_SANITY_DATASET, you will find this in your sanity.json file in the sanity project folder as dataset
and the other one NEXT_PUBLIC_SANITY_PROJECT_ID as projectid


make sure you start these names by NEXT_PUBLIC, that will enhance the security of your data 


start with server side render at the home page
that means its going to be rendered by request of anyone who visits the home page


go to home page or any page you want to make the SSR in
add a new function :
import the sanityClient from sanity.js

```
export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    author -> {
    name,
    image,
  },
  mainImage,
  slug
  }`;

  const posts = await sanityClient.fetch(query);
};

```

return props in the same function

```
return {
    props: {
      posts,
    },
  }
```

and pass it in the main function with defining it as interface
```
interface Props {
  posts: [Post];
}


function Hero({posts}: Props)
```

- create  a new file called typings.d.tx:

```
// definistion typescript file

export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  mainImage: {
    asset: {
      url: string;
    };
  };

  description: string;
  slug: {
    current: string;
  };
  body: [object];
}

```

now we can make a map for the posts and use it in the jsx


after this we need to create a dynamic post page -> for post or blog details,
create a folder in the pages directory (post) and inside it create [slug].tsx component.

we are going to use a special function called get static paths, this is going to allow next js to know  which routes it should pre build 

```

import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";

function Post() {
  return <div></div>;
}

export default Post;

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

```


- in the same page, add this function for getting the data from each post

```
export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `
    *[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author => {
        name,
        image,
      },
      description,
      mainImage,
        slug,
      body
      }`
      const post = await sanityClient.fetch(query, {
        slug: params?.slug,
      });

      if (!post) {
        return {
            notFound: true
        } 
      }

      return {
        props: {
            post,
        }
      }
}
```

now a new page is generated for each post that I have. but until now it won't take changes, so we have to do the following to regenerate the page every 60 seconds:

just add revalidate: 60 with the props

install this and import it in the page so we can render the body field 
```
npm install react-portable-text
```


continue editing the blog article and create serializers for the body

```

import { GetStaticProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import Header from '../../components/Header'
import PortableText from 'react-portable-text'

interface Props {
    post: Post;
}

function Post({ post }: Props) {
    return <div>
        <Header />

        <img src={urlFor(post.mainImage).url()!} className="object-cover w-full h-40"/>
        <article className="max-w-4xl p-5 mx-auto ">
            <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
            <h2 className="mb-2 text-xl font-light text-gray-500">{post.description}</h2>

            <div className="flex items-center space-x-2">
                <img src={urlFor(post.author.image).url()!} 
                className="w-10 h-10 rounded-full"/>
                <p className="text-sm font-light text-gray-500">Blog post by {" "} {post.author.name} - Published at {" "}
                {new Date(post._createdAt).toLocaleString()}</p>
                
            </div>
            
            <div>

                {/* this is how we render the body */}
            <PortableText
            className="h-screen p-3 mt-10 tracking-wider "
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
                h1: (props: any) => (
                    <h1 className="my-5 text-2xl " {...props}/>
                ),
                h2: (props: any) => (
                    <h1 className="my-5 text-xl " {...props}/>
                ),
                p: (props: any) => (
                    <p className="my-5 " {...props}/>
                ),
                li: ({childern} : any) => (
                    <li className="ml-4 list-disc">{childern}</li>
                ),
                link: ({href, children}: any) => (
                    <a href={href} className="text-blue-900 hover:underline" >{children}</a>
                ),
            }}
            />
            </div>
        </article>
 
    </div>;
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
export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `
    *[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author -> {
        name,
        image,
      },
      description,
      mainImage,
        slug,
      body
      }`
      const post = await sanityClient.fetch(query, {
        slug: params?.slug,
      });

      if (!post) {
        return {
            notFound: true
        } 
      }

      return {
        props: {
            post,
        },
        revalidate: 60, // after 60 seconds it will update the page (for catching updates)
      }
}
```


now after this is finished we will start making the API form that handles commenting on the blog post:

in the same page add the form jsx

```
<form className="flex flex-col max-w-2xl p-5 mx-auto my-10" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl">Leave a comment below!</h3>
        <hr className="py-3 mt-2" />

        <input type="hidden" {...register("_id")} name="_id" value={post._id} />

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
        
        <button className="p-3 text-white duration-200 ease-in-out bg-black border rounded-full cursor-pointer hover:bg-white hover:text-black hover:border-black" type="submit">Send</button>
      </form>
```

you have to install:

```
npm install react-hook-form
```

and import the following hooks to handle the form

```
import { useForm, SubmitHandler } from "react-hook-form";
```

- define the interface of which data we want to be renderd:

```
interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
```

for the id field, we will create a hidden input for that and then pass the register to the rest of inputs.
 note: if we have a non required input we can add a question mark before its name in the interface ?name: string ..


```
function Post({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();


```

start to create an api route:

```
  // special submit handler
  const onSubmit: SubmitHandler<IFormInput> = async(data)=>{
    await fetch('/api/createComment', {
        method: 'POST',
        body: JSON.stringify(data),
    }).then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
```

- create a tsx file in the api folder with the same name in the url 

copy the content of the hello.tsx file inside the createcomment but remove the <data> stuff, then copy the config function from sanity.js


install sanityClient
```
npm install @sanity/client
```
import it this way:

```
import sanityClient from "@sanity/client";
```


- go get the sanity token from the sanity dashboard in the browser, from API go to add token, enter a name and choose editor then copy the token

- this api file should look like this:
```
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from "@sanity/client";

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_TOKEN,
  };

  const client = sanityClient(config)

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ name: 'John Doe' })
}

```

now restart the localhost server and check for updates

- create a new schema for the comment

```
const { _id, name, email, comment } = JSON.parse(req.body);

  try {
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
    });
  } catch (err) {
    return res.status(500).json({ message: "Comment not sent", err });
  }
  console.log("submitted");
  return res.status(200).json({ message: "Comment sent!" });
}
```


after this we need to update the sanity schema 
new file in the schema : comment.js
```
export default {
  name: "comment",
  type: "document",
  title: "comment",
  fields: [
    {
      name: "name",
      type: "string",
    },
    {
      title: "Approved",
      name: "approved",
      type: "boolean",
      description: "comments won't show on the site without approval",
    },
    {
      name: "email",
      type: "string",
    },
    {
      name: "comment",
      type: "text",
    },
    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
    },
  ],
};
```

go to schema.js file and import the new schema:

```
import comment from './comment'
```

here and in the types section


you can now see it in the desk of sanity in the browser with all our specified fields


now you can create a state variable with false initial value to track the sent messages, you can make ma condition to render the form only when its false else render a message saying comment was sent, we can change the value of the state whenever we press the button in the onsubmit function.


add this comment field to the query

```
'comments': *[
  _type == 'comment' &&
  post._ref == ^._id ,
  approved == true
],
```
to check if the post reference equals the id and make sure you approve the comments before from the comment schema

go back to the typings.b.ts and add the ( comments: Comment[];)
then add another export

```

export interface Comment {
  approved: boolean;
  comment: string;
  email: string;
  name: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}
```

## Deploying
- cd into the sanity folder
- run sanity deploy
- give it a name


the deployed url of the sanity project
```
https://blogit.sanity.studio/desk
```

create a github repo and initialize it there then push it to guithub

continue deploying with VERCEL
