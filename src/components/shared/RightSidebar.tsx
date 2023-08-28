import { fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import UserCard from "../cards/UserCard";

async function RightSidebar() {
  const user = await currentUser();

  if (!user) return null;

  const result = await fetchUsers({
    userId: user?.id,
    pageNumber: 1,
    pageSize: 5,
    sortBy: "desc",
  });

  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

        <div className=" mt-10 flex flex-col gap-9">
          {result.users.length === 0 ? (
            <p className="no-result">No Result</p>
          ) : (
            <>
              {result.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
