import { useJobsStore } from "../jobsStore";
import { JobCardProps } from "@/presentation/components/JobCard";

describe("jobsStore", () => {
  const mockJob1: JobCardProps = {
    id: "1",
    title: "Senior Developer",
    companyName: "TechCorp",
    location: "Remote",
    postedAt: "2 days ago",
    salaryMin: 50000,
    salaryMax: 70000,
    currency: "$",
  };

  const mockJob2: JobCardProps = {
    id: "2",
    title: "Product Designer",
    companyName: "DesignHub",
    location: "Remote",
    postedAt: "1 week ago",
    salaryMin: 40000,
    salaryMax: 60000,
    currency: "$",
  };

  const mockJob3: JobCardProps = {
    id: "3",
    title: "QA Engineer",
    companyName: "TestCorp",
    location: "Hybrid",
    postedAt: "3 days ago",
    salaryMin: 45000,
    salaryMax: 65000,
    currency: "$",
  };

  beforeEach(() => {
    useJobsStore.setState({ jobs: [] });
  });

  describe("setJobs", () => {
    it("debería actualizar la lista de jobs", () => {
      useJobsStore.getState().setJobs([mockJob1, mockJob2]);

      const jobs = useJobsStore.getState().jobs;
      expect(jobs).toHaveLength(2);
      expect(jobs[0].id).toBe("1");
      expect(jobs[1].id).toBe("2");
    });

    it("debería reemplazar jobs existentes", () => {
      useJobsStore.getState().setJobs([mockJob1]);
      expect(useJobsStore.getState().jobs).toHaveLength(1);

      useJobsStore.getState().setJobs([mockJob2, mockJob3]);
      expect(useJobsStore.getState().jobs).toHaveLength(2);
      expect(useJobsStore.getState().jobs[0].id).toBe("2");
    });

    it("debería manejar array vacío", () => {
      useJobsStore.getState().setJobs([mockJob1]);
      useJobsStore.getState().setJobs([]);

      expect(useJobsStore.getState().jobs).toHaveLength(0);
    });
  });

  describe("getJobById", () => {
    beforeEach(() => {
      useJobsStore.getState().setJobs([mockJob1, mockJob2, mockJob3]);
    });

    it("debería retornar el job correcto por id", () => {
      const job = useJobsStore.getState().getJobById("2");

      expect(job).toBeDefined();
      expect(job?.id).toBe("2");
      expect(job?.title).toBe("Product Designer");
    });

    it("debería retornar undefined si el id no existe", () => {
      const job = useJobsStore.getState().getJobById("999");

      expect(job).toBeUndefined();
    });

    it("debería retornar undefined si no hay jobs", () => {
      useJobsStore.getState().clearJobs();
      const job = useJobsStore.getState().getJobById("1");

      expect(job).toBeUndefined();
    });

    it("debería funcionar con el primer job", () => {
      const job = useJobsStore.getState().getJobById("1");

      expect(job).toBeDefined();
      expect(job?.companyName).toBe("TechCorp");
    });

    it("debería funcionar con el último job", () => {
      const job = useJobsStore.getState().getJobById("3");

      expect(job).toBeDefined();
      expect(job?.companyName).toBe("TestCorp");
    });
  });

  describe("clearJobs", () => {
    it("debería limpiar todos los jobs", () => {
      useJobsStore.getState().setJobs([mockJob1, mockJob2, mockJob3]);
      expect(useJobsStore.getState().jobs).toHaveLength(3);

      useJobsStore.getState().clearJobs();
      expect(useJobsStore.getState().jobs).toHaveLength(0);
    });

    it("debería funcionar si ya está vacío", () => {
      expect(useJobsStore.getState().jobs).toHaveLength(0);

      useJobsStore.getState().clearJobs();
      expect(useJobsStore.getState().jobs).toHaveLength(0);
    });
  });
});
