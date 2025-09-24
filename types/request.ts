export type Request = {
  id: string;
  adviserId: string;
  studentId: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
  studentUserId: string;
  studentName: string;
  studentEmail: string;
  studentProfilePicture: string | null;
  title: string;
  abstract: string;
};
