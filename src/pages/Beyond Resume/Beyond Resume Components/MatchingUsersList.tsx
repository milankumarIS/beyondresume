import { searchDataFromTable, searchOpenListDataFromTable } from "../../../services/services";

export type MatchingUser = {
  userId: number;
  fullName: string;
  matchPercent: number;
  matchedSkills: string[];
  userImage: string;
};

export async function fetchMatchingUsers(job: any): Promise<{
  matches: MatchingUser[];
  jobUsername: string;
}> {
  try {
    const userRes = await searchOpenListDataFromTable("userPersonalInfo", {});
    const users = userRes?.data?.data || [];

    const jobSkillsArray = Array.isArray(job.skills)
      ? job.skills
      : typeof job.skills === "string"
      ? job.skills.split(",").map((s) => s.trim())
      : [];
    const jobSkills = jobSkillsArray.map((s: string) => s.toLowerCase());

    const matchedUserList: MatchingUser[] = users.map((user: any) => {
      const userSkillsArray = Array.isArray(user.skills)
        ? user.skills
        : typeof user.skills === "string"
        ? user.skills.split(",").map((s) => s.trim())
        : [];

      const userSkills = userSkillsArray.map((s: string) => s.toLowerCase());
      const matchedSkills = jobSkills.filter((skill) => userSkills.includes(skill));

      const matchPercent =
        jobSkills.length > 0
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;

      const fullName = [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(" ");

      return {
        userId: user.userId,
        fullName,
        matchPercent,
        matchedSkills,
        userImage: user.userImage,
        resumeFileUrl:user?.resumeFile,
        about:user?.about,

      };
    });

    matchedUserList.sort((a, b) => b.matchPercent - a.matchPercent);

    const filteredMatches = matchedUserList.filter((u) => u.matchPercent > 0);

    const creatorRes = await searchOpenListDataFromTable("user", {
      userId: job?.createdBy,
    });
    const jobUsername = creatorRes?.data?.data[0]?.userName || "";

    return {
      matches: filteredMatches,
      jobUsername,
    };
  } catch (err) {
    console.error("Error fetching matching users:", err);
    return { matches: [], jobUsername: "" };
  }
}
