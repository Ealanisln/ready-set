import React from "react";
import { TeamType } from "@/types/team";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SectionTitle from "../Common/SectionTitle";

const SingleTeam = ({ team }: { team: TeamType }) => {
  const {
    image,
    name,
    designation,
    skills,
    description,
    facebookLink,
    twitterLink,
    instagramLink,
  } = team;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full px-4 sm:w-1/2 lg:w-1/4 xl:w-1/4">
          <div className="group mb-8 transform cursor-pointer rounded-xl bg-white px-5 pb-10 pt-12 shadow-testimonial transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-dark dark:shadow-none">
            <div className="relative z-10 mx-auto mb-5 h-[120px] w-[120px]">
              <Image
                src={image}
                alt={name}
                className="w-full rounded-full"
                width={120}
                height={120}
              />
              <span className="absolute bottom-0 left-0 -z-10 h-10 w-10 rounded-full bg-secondary opacity-0 transition-all group-hover:opacity-100"></span>
              <span className="absolute right-0 top-0 -z-10 opacity-0 transition-all group-hover:opacity-100"></span>
            </div>

            <div className="text-center">
              <h3 className="mb-1 text-lg font-semibold text-dark dark:text-white">
                {name}
              </h3>
              <p className="mb-5 text-sm text-body-color dark:text-dark-6">
                {designation}
              </p>
              <div className="flex items-center justify-center gap-5">
                <a
                  aria-label="social link"
                  href={facebookLink}
                  className="text-dark-6 hover:text-primary"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path
                      d="M13.3315 7.25625H11.7565H11.194V6.69375V4.95V4.3875H11.7565H12.9377C13.2471 4.3875 13.5002 4.1625 13.5002 3.825V0.84375C13.5002 0.534375 13.2752 0.28125 12.9377 0.28125H10.8846C8.66272 0.28125 7.11584 1.85625 7.11584 4.19062V6.6375V7.2H6.55334H4.64084C4.24709 7.2 3.88147 7.50937 3.88147 7.95937V9.98438C3.88147 10.3781 4.19084 10.7438 4.64084 10.7438H6.49709H7.05959V11.3063V16.9594C7.05959 17.3531 7.36897 17.7188 7.81897 17.7188H10.4627C10.6315 17.7188 10.7721 17.6344 10.8846 17.5219C10.9971 17.4094 11.0815 17.2125 11.0815 17.0437V11.3344V10.7719H11.6721H12.9377C13.3033 10.7719 13.5846 10.5469 13.6408 10.2094V10.1813V10.1531L14.0346 8.2125C14.0627 8.01562 14.0346 7.79063 13.8658 7.56562C13.8096 7.425 13.5565 7.28437 13.3315 7.25625Z"
                      fill=""
                    />
                  </svg>
                </a>
                <a
                  aria-label="social link"
                  href={twitterLink}
                  className="text-dark-6 hover:text-primary"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path
                      d="M16.4647 4.83752C16.565 4.72065 16.4343 4.56793 16.2859 4.62263C15.9549 4.74474 15.6523 4.82528 15.2049 4.875C15.7552 4.56855 16.0112 4.13054 16.2194 3.59407C16.2696 3.46467 16.1182 3.34725 15.9877 3.40907C15.458 3.66023 14.8864 3.84658 14.2854 3.95668C13.6913 3.3679 12.8445 3 11.9077 3C10.1089 3 8.65027 4.35658 8.65027 6.02938C8.65027 6.26686 8.67937 6.49818 8.73427 6.71966C6.14854 6.59919 3.84286 5.49307 2.24098 3.79696C2.13119 3.68071 1.93197 3.69614 1.86361 3.83792C1.68124 4.21619 1.57957 4.63582 1.57957 5.07762C1.57957 6.12843 2.15446 7.05557 3.02837 7.59885C2.63653 7.58707 2.2618 7.51073 1.91647 7.38116C1.74834 7.31808 1.5556 7.42893 1.57819 7.59847C1.75162 8.9004 2.80568 9.97447 4.16624 10.2283C3.89302 10.2978 3.60524 10.3347 3.30754 10.3347C3.23536 10.3347 3.16381 10.3324 3.0929 10.3281C2.91247 10.3169 2.76583 10.4783 2.84319 10.6328C3.35357 11.6514 4.45563 12.3625 5.73809 12.3847C4.62337 13.1974 3.21889 13.6816 1.69269 13.6816C1.50451 13.6816 1.42378 13.9235 1.59073 14.0056C2.88015 14.6394 4.34854 15 5.90878 15C11.9005 15 15.1765 10.384 15.1765 6.38067C15.1765 6.24963 15.1732 6.11858 15.1672 5.98877C15.6535 5.66205 16.0907 5.27354 16.4647 4.83752Z"
                      fill=""
                    />
                  </svg>
                </a>
                <a
                  aria-label="social link"
                  href={instagramLink}
                  className="text-dark-6 hover:text-primary"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path
                      d="M9.02429 11.8066C10.5742 11.8066 11.8307 10.5501 11.8307 9.00018C11.8307 7.45022 10.5742 6.19373 9.02429 6.19373C7.47433 6.19373 6.21783 7.45022 6.21783 9.00018C6.21783 10.5501 7.47433 11.8066 9.02429 11.8066Z"
                      fill=""
                    />
                    <path
                      d="M12.0726 1.5H5.92742C3.48387 1.5 1.5 3.48387 1.5 5.92742V12.0242C1.5 14.5161 3.48387 16.5 5.92742 16.5H12.0242C14.5161 16.5 16.5 14.5161 16.5 12.0726V5.92742C16.5 3.48387 14.5161 1.5 12.0726 1.5ZM9.02419 12.6774C6.96774 12.6774 5.34677 11.0081 5.34677 9C5.34677 6.99194 6.99194 5.32258 9.02419 5.32258C11.0323 5.32258 12.6774 6.99194 12.6774 9C12.6774 11.0081 11.0565 12.6774 9.02419 12.6774ZM14.1048 5.66129C13.8629 5.92742 13.5 6.07258 13.0887 6.07258C12.7258 6.07258 12.3629 5.92742 12.0726 5.66129C11.8065 5.39516 11.6613 5.05645 11.6613 4.64516C11.6613 4.23387 11.8065 3.91935 12.0726 3.62903C12.3387 3.33871 12.6774 3.19355 13.0887 3.19355C13.4516 3.19355 13.8387 3.33871 14.1048 3.60484C14.3468 3.91935 14.5161 4.28226 14.5161 4.66935C14.4919 5.05645 14.3468 5.39516 14.1048 5.66129Z"
                      fill=""
                    />
                    <path
                      d="M13.1135 4.06433C12.799 4.06433 12.5329 4.33046 12.5329 4.64498C12.5329 4.95949 12.799 5.22562 13.1135 5.22562C13.428 5.22562 13.6942 4.95949 13.6942 4.64498C13.6942 4.33046 13.4522 4.06433 13.1135 4.06433Z"
                      fill=""
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{designation}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Image
            src={image}
            alt={name}
            className="w-full rounded-full"
            width={200}
            height={200}
          />
          <div>
            <h4 className="font-semibold">Skills:</h4>
            <ul className="list-inside list-disc">
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Description:</h4>
            <p>{description}</p>
          </div>
        </div>
        {/* <div className="flex justify-center space-x-4">
          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Facebook
          </a>
          <a
            href={twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600"
          >
            Twitter
          </a>
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800"
          >
            Instagram
          </a>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default SingleTeam;
