import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";

const teamData: TeamType[] = [
  {
    id: 1,
    name: "Efren Melchor III",
    designation: "Virtual Assistant",
    image: "/images/team/Melchor_Efren.png",
    skills: ["Virtual Assistance", "Social Media Management", "Content Creation"],
    description: "Committed to continuous learning and delivering top-notch service with enthusiasm for new opportunities.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 2,
    name: "Michael Pinzon",
    designation: "Administrative Tools Specialist",
    image: "/images/team/Pinzon_Michael.png",
    skills: ["Administrative Tools", "Creative Software", "Optimization"],
    description: "Excels at developing and executing strategic plans to enhance client revenue through optimization and data analysis.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 3,
    name: "Annamoira Homilda",
    designation: "Data Management Specialist",
    image: "/images/team/Homilda_Annamoira.png",
    skills: ["Administrative Tools", "Creative Software", "Data Management"],
    description: "Dedicated and reliable, thriving in busy environments with strong attention to detail and organizational skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 4,
    name: "Andrea Cartilla",
    designation: "Operations and Social Media Coordinator",
    image: "/images/team/Cartilla_Andrea.png",
    skills: ["Marketing Platforms", "Social Media Management", "Creative Software"],
    description: "Excels in efficient food order management, driver communication, and food drive oversight.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 5,
    name: "Leneth Logroño",
    designation: "Creative Software Specialist",
    image: "/images/team/Logroño_Leneth.png",
    skills: ["Creative Software", "Administrative Tools", "Marketing Platforms"],
    description: "Strong organizational skills with proven ability to train teams on metrics and product analytics.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 6,
    name: "Emmanuel Alanis",
    designation: "Web Developer",
    image: "/images/team/Alanis_Emmanuel.png",
    skills: ["Web Development", "Problem-Solving", "Operations Management"],
    description: "Streamlines food orders, manages driver communication, and oversees food drives while enhancing customer experiences.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 7,
    name: "Fernando Cardenas",
    designation: "Administrative Tools Specialist",
    image: "/images/team/Cardenas_Fernando.png",
    skills: ["Administrative Tools", "Web Development", "Problem Solving"],
    description: "Experienced in customer service, logistics, and administrative skills, currently expanding web development expertise.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 8,
    name: "Maria Noreen Yap",
    designation: "Marketing Specialist",
    image: "/images/team/Yap_Maria_Noreen.png",
    skills: ["Marketing Skills", "Operations Management", "Administrative Tools"],
    description: "Drives impactful email campaigns and optimizes automation processes through cross-functional collaboration.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 9,
    name: "Gilbert Bautista",
    designation: "General Virtual Assistant",
    image: "/images/team/Bautista_Gilbert.png",
    skills: ["Brand Management", "Product Management", "Project Management"],
    description: "Over 4 years of experience in brand management, product marketing, sales support, and graphic design.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 10,
    name: "Rochelle Lean Tan",
    designation: "Marketing Assistant",
    image: "/images/team/Tan_Rochelle_Lean.png",
    skills: ["Administrative Tools", "Creative Software", "Data Management"],
    description: "Experienced in handling inbound and outbound calls, emails, and correspondences with strong communication skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 11,
    name: "Romelita Fabian",
    designation: "Customer Service Specialist",
    image: "/images/team/Fabian_Romelita.png",
    skills: ["Customer Service Skills", "Sales Skills", "Adaptability"],
    description: "Confident and ambitious professional with extensive experience in Sales, Marketing, and Customer Service.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 12,
    name: "Bryan Toralba",
    designation: "Project Manager",
    image: "/images/team/Toralba_Bryan.png",
    skills: ["Project Management", "Problem Solving", "Creativity"],
    description: "Punctual and adaptable with excellent problem-solving abilities and clear communication skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 13,
    name: "Trishelle Batingana",
    designation: "Customer Service Specialist",
    image: "/images/team/Batingana_Trishelle.png",
    skills: ["Customer Service", "Sales Support", "Graphic Design"],
    description: "Focuses on delivering quality work and meeting deadlines efficiently, both independently and in team environments.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 14,
    name: "Bon Gonsalez",
    designation: "Marketing Specialist",
    image: "/images/team/Gonsalez_Bon.png",
    skills: ["Marketing Campaigns", "Financial Analysis", "Customer Support"],
    description: "Enjoys collaborating with teams and taking initiative in independent work, focusing on quality and efficiency.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
];

const Team = () => {
  return (
    <section
      id="team"
      className="overflow-hidden bg-gray-1 pb-12 pt-20 dark:bg-dark-2 lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Our Team"
            title="Meet Our Ready Set Team"
            paragraph="We are a diverse group of professionals committed to delivering top-notch service and driving growth through analysis and collaboration."
            width="640px"
            center
          />
        </div>
        <div className="-mx-4 flex flex-wrap justify-center">
          {teamData.map((team) => (
            <SingleTeam key={team.id} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;