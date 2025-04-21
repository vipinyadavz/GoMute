import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";

import OpinionCard from "../cards/OpinionCard";

interface Result {
  name: string;
  image: string;
  id: string;
  opinions: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function OpinionsTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) {
    redirect("/");
  }

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.opinions.map((opinion) => (
        <OpinionCard
          key={opinion._id}
          id={opinion._id}
          currentUserId={currentUserId}
          parentId={opinion.parentId}
          content={opinion.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                name: opinion.author.name,
                image: opinion.author.image,
                id: opinion.author.id,
              }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : opinion.community
          }
          createdAt={opinion.createdAt}
          comments={opinion.children}
        />
      ))}
    </section>
  );
}

export default OpinionsTab;
