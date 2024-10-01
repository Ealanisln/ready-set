import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";

const teamData: TeamType[] = [
  {
    id: 1,
    name: "Efren Melchor III",
    designation: "Market and Social Media Coordinator",
    image: "/images/team/Melchor_Efren III.png",
    skills: ["Marketing Data Analysis", "Email Campaign Management", "Lead Management & Prospecting"],
    description: "Committed to continuous learning and delivering top-notch service with enthusiasm for new opportunities.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 2,
    name: "Michael Pinzon",
    designation: "SEO Specialist and Social Media Coordinator",
    image: "/images/team/Pinzon_Michael.png",
    skills: ["SEO Optimization", "Social Media Management", "Content Creation"],
    description: "Excels at developing and executing strategic plans to enhance client revenue through optimization and data analysis.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 3,
    name: "Annamoira Homilda",
    designation: "Operations and Recruitment Coordinator",
    image: "/images/team/Homilda_Annamoira.png",
    skills: ["Google Voice Conversations", "Data Entry", "Delivery Route Planning"],
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
    name: "Anne Leneth Logroño",
    designation: "Brand Manager Support Lead",
    image: "/images/team/Logroño_Leneth.png",
    skills: ["Social Media Metrics", "Content Creation", "Team Leadership"],
    description: "Strong organizational skills with proven ability to train teams on metrics and product analytics.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 6,
    name: "Emmanuel Alanis",
    designation: "Operations and Full Stack Developer",
    image: "/images/team/Alanis_Emmanuel.png",
    skills: ["Web Development", "Problem Resolution", "Team Leadership"],
    description: "Streamlines food orders, manages driver communication, and oversees food drives while enhancing customer experiences.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 7,
    name: "Fernando Cardenas",
    designation: "Operations and Web Development",
    image: "/images/team/Cardenas_Fernando.png",
    skills: ["Communication", "Team Work", "Web Development"],
    description: "Experienced in customer service, logistics, and administrative skills, currently expanding web development expertise.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 8,
    name: "Maria Noreen Yap",
    designation: "Marketing Coordinator",
    image: "/images/team/Yap_Maria_Noreen.png",
    skills: ["Marketing Skills", "Operations Management", "Reliability & Resourcefulness"],
    description: "Drives impactful email campaigns and optimizes automation processes through cross-functional collaboration.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 9,
    name: "Gilbert Bautista",
    designation: "Senior Brand Manager",
    image: "/images/team/Bautista_Gilbert.png",
    skills: ["Strategic Brand Management", "Cross-Functional Team Leadership", "Financial Management and Cost Control"],
    description: "Over 4 years of experience in brand management, product marketing, sales support, and graphic design.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 10,
    name: "Rochelle Lean Tan",
    designation: "Marketing Assistant Coordinator",
    image: "/images/team/Tan_Rochelle_Lean.png",
    skills: ["Customer Service", "Marketing Campaigns", "Sales Support"],
    description: "Experienced in handling inbound and outbound calls, emails, and correspondences with strong communication skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 11,
    name: "Romelita Fabian",
    designation: "Customer Service & Sales Support Specialist",
    image: "/images/team/Fabian_Romelita.png",
    skills: ["Customer Service Skills", "MS Software (Excel, Word & PP)", "Technical Support Skills"],
    description: "Confident and ambitious professional with extensive experience in Sales, Marketing, and Customer Service.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 12,
    name: "Bryan Toralba",
    designation: "Brand Manager Support Specialist",
    image: "/images/team/Toralba_Bryan.png",
    skills: ["Brand Management", "Project Coordination", "Technical Support"],
    description: "Punctual and adaptable with excellent problem-solving abilities and clear communication skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 13,
    name: "Trishelle Batingana",
    designation: "Brand Manager Support Specialist",
    image: "/images/team/Batingana_Trishelle.png",
    skills: ["Customer Service", "Digital Marketing", "Graphic Design"],
    description: "Focuses on delivering quality work and meeting deadlines efficiently, both independently and in team environments.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 14,
    name: "Bon Gonzales",
    designation: "Brand Manager",
    image: "/images/team/Gonzales_Bon.png",
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
            title="Meet Our Data Ready Set Team"
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