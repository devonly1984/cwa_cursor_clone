"use client"
import {useEffect,useRef} from 'react'
import {Terminal} from '@xterm/xterm'
import {FitAddon} from '@xterm/addon-fit'
import "@xterm/xterm/css/xterm.css"

interface PreviewTerminalProps {
  output: string;
}

const PreviewTerminal = ({output}:PreviewTerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal|null>(null);
  const fitAddonRef = useRef<FitAddon|null>(null);
  const lastLengthRef = useRef(0);

  useEffect(()=>{
    if (!containerRef.current|| terminalRef.current) return;
    const terminal = new Terminal({
      convertEol: true,
      disableStdin: true,
      fontSize: 12,
      fontFamily: "monospace",
      theme: { background: "#1f2228" },

    });
    const fitAddOn = new FitAddon();
    terminal.loadAddon(fitAddOn);
    terminal.open(containerRef.current);

    terminalRef.current=terminal;
    fitAddonRef.current=fitAddOn;
    //Write existing out to terminal
    if (output) {
      terminal.write(output);
      lastLengthRef.current=output.length;

    }
    requestAnimationFrame(()=>fitAddOn.fit());
    const resizeObserver = new ResizeObserver(()=>fitAddOn.fit());
    resizeObserver.observe(containerRef.current)
    return ()=>{
      resizeObserver.disconnect();
      terminal.dispose();
      terminalRef.current=null;
      fitAddonRef.current = null;
    }
//output does not need to be a dependency just used on mount
  },[])

useEffect(()=>{
  if (!terminalRef.current)return;
  if (output.length < lastLengthRef.current) {
    lastLengthRef.current=0;
    terminalRef.current.clear();
  }
  const newData = output.slice(lastLengthRef.current);
  if (newData) {
    terminalRef.current.write(newData);
    lastLengthRef.current=output.length
  }
},[output])
  return (
    <div
      className="flex-1 min-h-0 p-3 [&_.xterm]:h-full! [&_.xterm-viewport]:h-full!
      [&_.xterm-screen]:h-full! bg-sidebar"
      ref={containerRef}
    />
  );


}
export default PreviewTerminal