import prisma from "../../../lib/prisma";

const TestUI = async () => {
  const users = await prisma.user.findMany();
  return (
    <div>
      {users.map((user) => (
        <h1 key={user.id}>{user.name}</h1>
      ))}
    </div>
  );
};

export default TestUI;
