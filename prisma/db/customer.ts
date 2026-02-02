export type CustomerType = {
  id: number;
  fullName: string;
  email: string;
  password: string;
  salt: string;
  role: "Customer";
  status: "Active";
  lastLogin: Date;
  memberSince: string;
  cardExpiry: string;
  rank: string;
  points: number;
};

export const customer: CustomerType = {
  id: 6789,
  fullName: "Brandon Lamagna",
  email: "brandon.kyle.lamagna@example.com",
  password: "hashed_password_placeholder",
  salt: "salt_placeholder",
  role: "Customer",
  status: "Active",
  lastLogin: new Date("2026-02-02T10:00:00Z"),
  memberSince: "October 2, 2025",
  cardExpiry: "December 16, 2027",
  rank: "Coffee Cutie",
  points: 669,
};
