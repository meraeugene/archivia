export type Request = {
  id: string;
  adviserId: string;
  studentId: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "already_handled"
    | "referred"
    | "reserved"
    | "returned";
  submittedAt: string;
  studentUserId: string;
  studentName: string;
  studentEmail: string;
  studentProfilePicture: string | null;
  title: string;
  abstract: string;
  feedback: string | null;
  referred_to: string | null;
  referred_by: string | null;
  thesisUrl: string;
  recommendedAdviserIds: string[] | null;
};
