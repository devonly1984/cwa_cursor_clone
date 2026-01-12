"use client"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

const HomePage = () => {
  const projects = useQuery(api.queries.projects.get)
  return (
    <div className="flex flex-col gap-2 p-4">
      {projects?.map((project) => (
        <div className="border rounded p-2 flex flex-col" key={project._id}>
          <p>{project.name}</p>
          <p>{project.ownerId}</p>
        </div>
      ))}
    </div>
  );
}
export default HomePage