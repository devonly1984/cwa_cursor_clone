import { useCallback, useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";

import { buildFileTree, getFilePath } from "@/lib/preview/FileTree";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { webContainerStatus } from "@/lib/types";
import { useFiles } from "@/hooks/useFiles";

let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

const getWebContainer = async (): Promise<WebContainer> => {
  if (webcontainerInstance) {
    return webcontainerInstance;
  }
  if (!bootPromise) {
    bootPromise = WebContainer.boot({ coep: "credentialless" });
  }
  webcontainerInstance = await bootPromise;
  return webcontainerInstance;
};
const tearDownWebContainer = () => {
  if (webcontainerInstance) {
    webcontainerInstance.teardown();
    webcontainerInstance = null;
  }
  bootPromise = null;
};
interface UseWebContainerProps {
  projectId: Id<"projects">;
  enabled: boolean;
  settings?: {
    installCommand?: string;
    devCommand?: string;
  };
}

export const useWebContainer = ({
  projectId,
  enabled,
  settings,
}: UseWebContainerProps) => {
  const [status, setStatus] = useState<webContainerStatus>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [restartKey, setRestartKey] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState("");
  const containerRef = useRef<WebContainer | null>(null);
  const hasStartedRef = useRef(false);
  //fetch Files from Convex
  const files = useFiles(projectId);
  //initial Boot
  useEffect(() => {
    if (
      !enabled ||
      !files ||
      files.length === 0 ||
      hasStartedRef.current
    ) {
      return;
    }
    hasStartedRef.current = true;
    const start = async () => {
      try {
        setStatus("booting");
        setError(null);
        setTerminalOutput("");
        const appendOutput = (data: string) => {
          setTerminalOutput((prev) => prev + data);
        };
        const container = await getWebContainer();
        containerRef.current = container;
        const fileTree = buildFileTree(files);
        await container.mount(fileTree);
        container.on("server-ready", (_port, url) => {
          setPreviewUrl(url);
          setStatus("running");
        });
        setStatus("installing");

        const installCommand = settings?.installCommand || "npm install";
        const [installBin, ...installArgs] = installCommand.split(" ");
        appendOutput(`$ ${installCommand}\n`);
        const installProcess = await container.spawn(
          installBin,
          installArgs,
        );
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              appendOutput(data);
            },
          }),
        );
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error(
            `${installCommand} failed with code ${installExitCode}`,
          );
        }
        const devCmd = settings?.devCommand || "npm run dev";
        const [devBin, ...devArgs] = devCmd.split(" ");
        appendOutput(`\n$ ${devCmd}\n`);
        const devProcess = await container.spawn(devBin, devArgs);
        devProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              appendOutput(data);
            },
          }),
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown Error");
        setStatus("error");
      }
    };
    start();
  }, [
    enabled,
    files,
    restartKey,
    settings?.devCommand,
    settings?.installCommand,
  ]);
  //Sync file changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !files || status !== "running") return;
    const filesMap = new Map(files.map((f) => [f._id, f]));
    for (const file of files) {
      if (file.type !== "file" || file.storageId || !file.content)
        continue;
      const filePath = getFilePath(file, filesMap);
      container.fs.writeFile(filePath, file.content);
    }
  }, [files, status]);

  //reset when disabled
  useEffect(() => {
    if (!enabled) {
      hasStartedRef.current = false;
      setStatus("idle");
      setPreviewUrl(null);
      setError(null);
    }
  }, [enabled]);

  //Restart the entire WebContainer process
  const restart = useCallback(() => {
    tearDownWebContainer();
    containerRef.current = null;
    hasStartedRef.current = false;
    setStatus("idle");
    setPreviewUrl(null);
    setError(null);
    setRestartKey((k) => k + 1);
  }, []);
  return {
    status,
    previewUrl,
    error,
    restart,
    terminalOutput,
  };
};
