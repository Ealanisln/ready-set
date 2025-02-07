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

const SingleTeam = ({ team }: { team: TeamType }) => {
  const {
    image,
    name,
    designation,
    skills,
    description,
  } = team;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full px-2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
          <div className="group mb-6 flex h-[280px] transform cursor-pointer flex-col justify-between rounded-xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-dark dark:shadow-none">
            <div className="flex flex-col items-center">
              <div className="relative z-10 mx-auto mb-4 h-32 w-32 overflow-hidden">
                <Image
                  src={image}
                  alt={name}
                  className="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                  width={128}
                  height={128}
                />
                <div className="absolute inset-0 rounded-full bg-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="text-center">
                <h3 className="mb-1 line-clamp-1 text-base font-semibold text-dark transition-colors group-hover:text-primary dark:text-white md:text-lg">
                  {name}
                </h3>
                <p className="mb-4 line-clamp-2 h-10 text-sm text-body-color dark:text-dark-6">
                  {designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            {designation}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="mx-auto w-48">
            <Image
              src={image}
              alt={name}
              className="rounded-full"
              width={192}
              height={192}
            />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Skills:</h4>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">About:</h4>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SingleTeam;