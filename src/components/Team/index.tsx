import { TeamType } from "@/types/team";
import SectionTitle from "../Common/SectionTitle";
import SingleTeam from "./SingleTeam";

const teamData: TeamType[] = [
  {
    id: 1,
    name: "Gilbert Bautista",
    designation: "Senior Brand Manager",
    image: "/images/team/Bautista_Gilbert.png",
    skills: [
      "Strategic Brand Management",
      "Cross-Functional Team Leadership",
      "Financial Management and Cost Control",
    ],
    description:
      "Over 4 years of experience in brand management, product marketing, sales support, and graphic design.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 2,
    name: "Bon Gonzales",
    designation: "Brand Manager",
    image: "/images/team/Gonzales_Bon.png",
    skills: ["Marketing Campaigns", "Financial Analysis", "Customer Support"],
    description:
      "Enjoys collaborating with teams and taking initiative in independent work, focusing on quality and efficiency.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 3,
    name: "Anne Leneth Logroño",
    designation: "Brand Manager Support Lead",
    image: "/images/team/Logroño_Leneth.png",
    skills: ["Social Media Metrics", "Content Creation", "Team Leadership"],
    description:
      "Strong organizational skills with proven ability to train teams on metrics and product analytics.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 4,
    name: "Bryan Toralba",
    designation: "Brand Manager Support Specialist",
    image: "/images/team/Toralba_Bryan.png",
    skills: ["Brand Management", "Project Coordination", "Technical Support"],
    description:
      "Punctual and adaptable with excellent problem-solving abilities and clear communication skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 5,
    name: "Trishelle Batingana",
    designation: "Sales and Marketing Coordinator",
    image: "/images/team/Batingana_Trishelle.png",
    skills: ["Customer Service", "Digital Marketing", "Graphic Design"],
    description:
      "Focuses on delivering quality work and meeting deadlines efficiently, both independently and in team environments.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 6,
    name: "Honey Bagay",
    designation: "Marketing Supervisor",
    image: "/images/team/Bagay_Honey.png",
    skills: [
      "Content Creation",
      "Operational Coordination",
      "Marketing Management",
    ],
    description:
      "My objective is to drive operational efficiency, mentor and develop staff, to secure a challenging role as an Operations and Social Media Coordinator Supervisor.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 7,
    name: "Zajarah Mae Cardoza",
    designation: "Logistics Supervisor",
    image: "/images/team/Cardoza_Zajarah.png",
    skills: [
      "Logistics and Operations",
      "Team Development",
      "Supplier and Payroll Management",
    ],
    description:
      "Seeking to leverage my skills and expertise in a dynamic organization committed to delivering top-notch support solutions.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 8,
    name: "Luther Homilda",
    designation: "Logistics Supervisor",
    image: "/images/team/Homilda_Luther.png",
    skills: ["Logistics Coordination", "Customer Service & Sales", "Team Management"],
    description:
      "Analytical abilities, problem-solving, leadership and team management, as well as strong communication skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 9,
    name: "April Ducao",
    designation: "Project and Human Resources Supervisor",
    image: "/images/team/Ducao_April.png",
    skills: [
      "Project Managment",
      "Recruitment & Onboarding",
      "Resource Coordination",
    ],
    description:
      "I'm a dedicated professional with experience in operations management, administration, and customer service.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 10,
    name: "Annamoira Homilda",
    designation: "Logistics Coordinator",
    image: "/images/team/Homilda_Annamoira.png",
    skills: [
      "Logistics",
      "Client and Vendor Communication",
      "Data Management",
    ],
    description:
      "Dedicated and reliable, thriving in busy environments with strong attention to detail and organizational skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 11,
    name: "Andrea Fetalyn Cartilla",
    designation: "Quality Assurance and Social Media Lead",
    image: "/images/team/Cartilla_Andrea.png",
    skills: [
      "Quality Control",
      "Social Media",
      "Lead Generation",
    ],
    description:
      "Excels in efficient food order management, driver communication, and food drive oversight.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 12,
    name: "Rochelle Dahan",
    designation: "Social Media Coordinator",
    image: "/images/team/Dahan_Rochelle.png",
    skills: ["Digital Marketing", "Lead Generation", "Quality Assurance"],
    description:
      "I seek for work efficiency and productivity to help fortify brand presence, drive customer loyalty, and achieve organizational success.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 13,
    name: "Lezylane Andig",
    designation: "Senior Graphic Designer",
    image: "/images/team/Andig_Lezylane.png",
    skills: [
      "Graphic Design",
      "Administrative Support",
      "Data Management",
    ],
    description:
      "Personally, I strive to learn and adapt to new technologies through internet resources.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 14,
    name: "Emmanuel Alanis",
    designation: "Full Stack Developer",
    image: "/images/team/Alanis_Emmanuel.png",
    skills: ["Web Development", "Problem Solving", "Operation Management"],
    description:
      "Streamlines food orders, manages driver communication, and oversees food drives while enhancing customer experiences.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 15,
    name: "Fernando Cardenas",
    designation: "Web Development Specialist",
    image: "/images/team/Cardenas_Fernando.png",
    skills: ["Web Development", "Bilingual Communication (English/Spanish)", "Sales Support and Recruitment"],
    description:
      "Experienced in customer service, logistics, and administrative skills, currently expanding web development expertise.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 16,
    name: "Maria Noreen Yap",
    designation: "Marketing Coordinator",
    image: "/images/team/Yap_Maria_Noreen.png",
    skills: [
      "Marketing Skills",
      "Operations Management",
      "Reliability & Resourcefulness",
    ],
    description:
      "Drives impactful email campaigns and optimizes automation processes through cross-functional collaboration.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 17,
    name: "Rochelle Lean Tan",
    designation: "Marketing Assistant Coordinator",
    image: "/images/team/Tan_Rochelle_Lean.png",
    skills: ["Customer Service", "Marketing Campaigns", "Sales Support"],
    description:
      "Experienced in handling inbound and outbound calls, emails, and correspondences with strong communication skills.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  {
    id: 18,
    name: "Romelita Fabian",
    designation: "Customer Service & Sales Support Specialist",
    image: "/images/team/Fabian_Romelita.png",
    skills: [
      "Customer Service Skills",
      "MS Software (Excel, Word & PP)",
      "Technical Support Skills",
    ],
    description:
      "Confident and ambitious professional with extensive experience in Sales, Marketing, and Customer Service.",
    facebookLink: "/#",
    twitterLink: "/#",
    instagramLink: "/#",
  },
  // {
  //   id: 19,
  //   name: "Efren Melchor III",
  //   designation: "Sales and Marketing Data Coordinator", // Updated from CSV
  //   image: "/images/team/Melchor_Efren III.png",
  //   skills: ["Marketing Data Analysis", "Email Campaign Management", "Lead Management & Prospecting"],
  //   description: "Committed to continuous learning and delivering top-notch service with enthusiasm for new opportunities.",
  //   facebookLink: "/#",
  //   twitterLink: "/#",
  //   instagramLink: "/#",
  // },
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
