import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

async function Onboarding() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  const userData = {
    id: user?.id,
    objectId: userInfo?.id,
    username: userInfo ? userInfo?.username : user?.username,
    name: userInfo ? userInfo?.name : user?.firstName,
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo?.image,
  };

  return (
    <main className="flex flex-col max-w-3xl mx-auto justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-light-2 text-base-regular">
        Complete your profile now to use Threads
      </p>

      <section className="bg-dark-2 p-10 mt-9">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Onboarding;
