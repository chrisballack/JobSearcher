import { create } from "zustand";
import { JobCardProps } from "@/presentation/components/JobCard";

interface JobsState {
  jobs: JobCardProps[];
  setJobs: (jobs: JobCardProps[]) => void;
  getJobById: (id: string) => JobCardProps | undefined;
  clearJobs: () => void;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],

  setJobs: (jobs: JobCardProps[]) => {
    set({ jobs });
  },

  getJobById: (id: string) => {
    return get().jobs.find((job: JobCardProps) => job.id === id);
  },

  clearJobs: () => {
    set({ jobs: [] });
  },
}));
