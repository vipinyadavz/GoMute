import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import Comment from "@/components/forms/Comment";
import OpinionCard from "@/components/cards/OpinionCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchOpinionById } from "@/lib/actions/opinion.actions";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const opinion = await fetchOpinionById(params.id);

  return (
    <section className='relative'>
      <div>
        <OpinionCard
          id={opinion._id}
          currentUserId={user.id}
          parentId={opinion.parentId}
          content={opinion.text}
          author={opinion.author}
          community={opinion.community}
          createdAt={opinion.createdAt}
          comments={opinion.children}
        />
      </div>

      <div className='mt-7'>
        <Comment
          opinionId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className='mt-10'>
        {opinion.children.map((childItem: any) => (
          <OpinionCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
