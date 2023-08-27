import { fetchUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import ThreadsTab from "@/components/shared/ThreadsTab";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={params.id}
        authUserId={user.id}
        name={userInfo.name}
        imageUrl={userInfo.image}
        bio={userInfo.bio}
        username={userInfo.username}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => {
              return (
                <TabsTrigger className="tab" value={tab.value} key={tab.value}>
                  <Image
                    src={tab.icon}
                    alt={tab.value}
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                  <p className="max-sm:hidden">{tab.label}</p>
                  {tab.label === "Threads" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {userInfo?.threads?.length || 0}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {profileTabs.map((tab) => {
            return (
              <TabsContent value={tab.value} key={tab.value}>
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType="User"
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};

export default ProfilePage;
