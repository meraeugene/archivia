"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Copy,
  Loader2,
  Lock,
  ArrowLeft,
  Send,
  KeyRound,
  Check,
  X,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function ThesisGroupFlow() {
  const [step, setStep] = useState<
    "selectRole" | "leader" | "enterCode" | "memberRole" | "requestSent"
  >("selectRole");
  const [groupCode, setGroupCode] = useState("THS-9248");
  const [members, setMembers] = useState([
    { id: 1, name: "Andrew R. Villalon (Leader)" },
  ]);
  const [requests, setRequests] = useState<
    { id: number; name: string; role: string }[]
  >([
    { id: 1, name: "John Doe", role: "Frontend Developer" },
    {
      id: 2,
      name: "Jane Smith",
      role: "Backend Developer",
    },
    { id: 3, name: "Alice Johnson", role: "Database Administrator" },
    { id: 4, name: "Bob Brown", role: "UX Designer" },
  ]);
  const [memberCodeInput, setMemberCodeInput] = useState("");
  const [memberRole, setMemberRole] = useState("");

  const finalizeGroup = () => {
    if (members.length !== 5) {
      toast.info("You need exactly 5 members to finalize the group.");
      return;
    }
    toast.success(`Group finalized with code ${groupCode}`);
  };

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="absolute top-24 left-0 cursor-pointer">
      <ArrowLeft size={20} className="text-gray-600 hover:text-black" />
    </button>
  );

  const handleRequest = (action: "accept" | "reject", requestId: number) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    if (action === "accept") {
      setMembers([
        ...members,
        { id: Date.now(), name: `${req.name} (${req.role})` },
      ]);
    }
    setRequests(requests.filter((r) => r.id !== requestId));
  };

  return (
    <div className=" max-w-6xl px-5 min-h-screen  mx-auto h-auto  ">
      <div className="relative   ">
        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === "selectRole" && (
            <motion.div
              key="selectRole"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col justify-center py-56 items-center text-center space-y-6"
            >
              <div className="p-3 bg-black text-white rounded-full self-center ">
                <Users size={28} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Choose Your Role
              </h2>
              <p className="text-gray-600 text-sm max-w-sm mb-8">
                Are you the leader or joining as a member?
              </p>
              <div className="flex flex-col gap-4 w-full">
                <button
                  onClick={() => setStep("leader")}
                  className="cursor-pointer  w-[25%] mx-auto py-3 bg-black text-white rounded-md hover:bg-black/90 transition font-medium"
                >
                  Leader
                </button>

                <button
                  onClick={() => setStep("enterCode")}
                  className="cursor-pointer w-[25%] mx-auto border border-gray-200 py-3 bg-gray-50 text-gray-900 rounded-md hover:bg-gray-100 transition font-medium"
                >
                  Group Member
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Leader View */}
          {step === "leader" && (
            <motion.div
              key="leader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative flex py-40 gap-8 "
            >
              <BackButton onClick={() => setStep("selectRole")} />

              {/* Left Side: Code & Members */}
              <div className="flex-1 flex flex-col space-y-6">
                <div className="p-3 bg-black text-white rounded-full self-center ">
                  <Users size={28} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                  Thesis Group Setup
                </h2>
                <p className="text-gray-600 text-sm max-w-sm mb-8 text-center self-center">
                  Share the code with your teammates. Once all 5 members have
                  joined, you can finalize the group.
                </p>

                {/* Group Code */}
                <div className="flex items-center justify-between w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
                  <span className="font-mono text-lg text-gray-900">
                    {groupCode}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(groupCode)}
                    className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <Copy size={18} className="text-gray-600" />
                  </button>
                </div>

                {/* Members List */}
                <div className="w-full text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Members
                    </h3>
                    <span className="text-xs text-gray-500">
                      {members.length} / 5 joined
                    </span>
                  </div>
                  <ul className="space-y-3 text-gray-800">
                    {members.map((m) => (
                      <li
                        key={m.id}
                        className="flex items-center justify-between border border-gray-200 px-4 py-2 rounded-lg"
                      >
                        <span>{m.name}</span>
                      </li>
                    ))}
                  </ul>
                  {members.length < 5 && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      Waiting for {5 - members.length} more member(s) to join...
                    </p>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={finalizeGroup}
                  disabled={members.length !== 5}
                  className="cursor-pointer mt-2 w-full py-3 bg-black text-white rounded-md hover:bg-black/90 transition font-medium disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {members.length === 5 ? (
                    "Finalize Group"
                  ) : (
                    <>
                      <Lock size={16} /> Finalize Group
                    </>
                  )}
                </button>
              </div>

              {/* Right Side: Pending Requests */}
              <div className="flex-1 flex flex-col space-y-4 border-l border-gray-100 pl-8">
                <h3 className="text-xl font-semibold mb-4">Pending Requests</h3>
                {requests.length === 0 ? (
                  <p className="text-sm text-gray-500">No pending requests.</p>
                ) : (
                  <ul className="space-y-3">
                    {requests.map((req) => (
                      <li
                        key={req.id}
                        className="flex items-center justify-between border hover:shadow-md transition ease-in border-gray-200 px-4 py-2 rounded-lg"
                      >
                        <span>
                          {req.name} —{" "}
                          <span className="text-gray-500">{req.role}</span>
                        </span>
                        <div className="flex gap-2">
                          {/* Accept */}
                          <button
                            onClick={() => handleRequest("accept", req.id)}
                            className="p-2 cursor-pointer rounded-md bg-black hover:bg-black/90 transition"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </button>

                          {/* Reject */}
                          <button
                            onClick={() => handleRequest("reject", req.id)}
                            className="p-2 cursor-pointer rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Member enters code */}
          {step === "enterCode" && (
            <motion.div
              key="enterCode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col py-56 items-center text-center space-y-6"
            >
              <BackButton onClick={() => setStep("selectRole")} />
              <div className="p-3 bg-black text-white rounded-full self-center ">
                <KeyRound size={28} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Enter Group Code
              </h2>
              <p className="text-gray-600 text-sm max-w-sm mb-8">
                Paste the group code you received from your leader.
              </p>
              <input
                type="text"
                value={memberCodeInput}
                onChange={(e) => setMemberCodeInput(e.target.value)}
                placeholder="Enter group code"
                className="w-[30%] focus:border-gray-800 mx-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none "
              />
              <button
                onClick={() => {
                  if (!memberCodeInput) {
                    toast.info("Please enter a group code.");
                    return;
                  }
                  setStep("memberRole");
                }}
                className="w-[30%] mx-auto cursor-pointer  py-3 bg-black text-white rounded-md hover:bg-black/90 transition font-medium"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 4: Member chooses role */}
          {step === "memberRole" && (
            <motion.div
              key="memberRole"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col py-40 items-center text-center space-y-6"
            >
              <BackButton onClick={() => setStep("enterCode")} />
              <div className="p-3 bg-black text-white rounded-full self-center ">
                <BadgeCheck size={28} />{" "}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Select Your Role
              </h2>
              <p className="text-gray-600 text-sm max-w-sm mb-8">
                Choose the role you will take in the thesis group.
              </p>

              <div className="grid grid-cols-1 gap-3 w-full">
                {[
                  "System Analyst",
                  "Researcher",
                  "Frontend Developer",
                  "Backend Developer",
                  "Database Administrator",
                ].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setMemberRole(role);
                      setRequests([
                        ...requests,
                        { id: Date.now(), name: "Pending Member", role },
                      ]);
                      setStep("requestSent");
                    }}
                    className={`cursor-pointer w-[30%]  hover:shadow-md mx-auto py-3 rounded border border-gray-300 font-medium transition ${
                      memberRole === role
                        ? "bg-black text-white"
                        : "bg-white text-black "
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Request Sent */}
          {step === "requestSent" && (
            <motion.div
              key="requestSent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col py-70 items-center text-center space-y-6"
            >
              <div className="p-3 bg-black text-white rounded-full self-center ">
                <Send size={28} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Request Sent
              </h2>
              <p className="text-gray-600 text-sm max-w-sm">
                Your join request has been sent to the leader. Please wait until
                your request is accepted.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
