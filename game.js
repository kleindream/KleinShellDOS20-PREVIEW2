const terminal = document.getElementById("terminal");
const form = document.getElementById("commandForm");
const input = document.getElementById("cmd");
const promptEl = document.getElementById("prompt");
let cwd = "C:";
let soundOn = true;

const state = {
  missionsDone: new Set(),
  achievements: new Set(),
  flags: {
    readWelcome:false, readKlein:false, ranMemory:false, repairedBoot:false,
    foundHidden:false, decodedNote:false, enteredArchive:false, readMother:false,
    ranDream:false, backedUp:false, unlockedVault:false, final:false,
    readMaint:false, readReport:false, foundPage2:false, foundPage3:false,
    readUsers:false, foundUserX:false, readNetwork:false, tracedNetwork:false,
    ranRecover:false, ranSecure:false, readSecurity:false, readTemp:false,
    readArchive1999:false, readFinalLog:false, searchedUser:false, searchedLog:false,
    readRoadmap:false, usedStatus:false, usedNotes:false
  },
  notes: []
};

function addNote(note){ if(!state.notes.includes(note)) state.notes.push(note); }

const fs = {
  "C:": { type:"dir", items:{
    "README.TXT": {type:"file", text:`KLEIN SHELL DOS 2.0 - PREVIEW 2

Welcome, operator.

This computer was found during the renovation of an old technical office.
The machine still boots, but the file system contains strange logs,
missing reports, locked folders, and traces of an unknown user.

This system does not ask for clicks.
It asks for commands.

Type HELP to begin.
Type MISSIONS to see your objectives.
Type STATUS to see your rank.

Main commands:
DIR, DIR /A, TREE, CD, TYPE, RUN, SEARCH, FIND, NOTES, STATUS,
SCAN, DECODE, FIXBOOT, BACKUP, UNLOCK, MISSIONS, ACHIEVEMENTS, THEME.`},
    "KLEIN.TXT": {type:"file", text:`Rodrigo Klein Mariano Canto
Technician, dreamer, builder.

This system is a tribute to curiosity:
the kind that makes someone read manuals, test strange ideas,
repair old machines, and refuse to give up before understanding the logic.

Different, honest, nostalgic.`},
    "ROADMAP.TXT": {type:"file", text:`VERSION ROADMAP

Preview 2 expands the old system into a digital investigation.
Preview 3 will continue the mystery behind USER-X.
Beta 1 will focus on polish, balance, and bug fixes.

The final version must feel like a forgotten DOS computer with a soul.`},
    "AUTOEXEC.BAT": {type:"file", text:`@ECHO OFF
PROMPT $P$G
PATH=C:\\DOS;C:\\TOOLS;C:\\GAMES
REM If the system freezes, check C:\\DOS\\BOOTLOG.TXT
REM Maintenance records moved to C:\\MAINT`},
    "DOS": {type:"dir", items:{
      "BOOTLOG.TXT": {type:"file", text:`BOOT LOG - 1998/10/16

COMMAND.COM found.
HIMEM.SYS found.
MOUSE.COM missing.
KLEIN.SYS corrupted.

Warning: system memory map changed after midnight.
Suggested action: RUN MEMTEST.EXE, then FIXBOOT.`},
      "MEMTEST.EXE": {type:"program", run:()=>{state.flags.ranMemory=true; unlock("Memory Hunter"); return `Memory test started...

Base memory:       640K OK
Extended memory:  65536K OK
Shadow memory:    unstable sector found
Recommendation: run FIXBOOT from C:\\DOS`; }},
      "FIXBOOT.EXE": {type:"program", run:()=>`This tool cannot run directly.
Use command: FIXBOOT`}
    }},
    "TOOLS": {type:"dir", items:{
      "README.TXT": {type:"file", text:`TOOLS DIRECTORY

SCAN        Searches for hidden traces.
SEARCH      Searches known text indexes.
FIND        Finds known files by name.
DECODE      Decodes old notes.
BACKUP      Copies important logs to C:\\BACKUP.
FIXBOOT     Repairs simulated boot records.
RECOVER     Restores missing maintenance pages.
TRACE.EXE   Reconstructs network events.
SECURE.EXE  Checks suspicious access records.`},
      "NOTE.KDN": {type:"file", text:`Encoded note:
Uifsf jt b tfdsfu jo uif BSDIJWF.
Uif wbvmu lopxt uif obnf: LMFJO`},
      "DREAM.EXE": {type:"program", run:()=>{state.flags.ranDream=true; unlock("Dream Runner"); fs["C:"].items.DREAM.hidden=false; return `Klein Dream module loaded.

A social network can be more than a feed.
It can be a room, a memory, a little home on the internet.

New directory available: C:\\DREAM`; }},
      "RECOVER.EXE": {type:"program", run:()=>commands.RECOVER([])},
      "TRACE.EXE": {type:"program", run:()=>commands.TRACE([])},
      "SECURE.EXE": {type:"program", run:()=>commands.SECURE([])}
    }},
    "GAMES": {type:"dir", items:{
      "PAYNT.EXE": {type:"program", run:()=>`Paynt module preview:
[ Pencil ] [ Brush ] [ Spray ] [ Shapes ] [ Save ]

This is only an echo from another Klein project.`},
      "AUAU.EXE": {type:"program", run:()=>`Auau says: WOOF!
Happiness +5
Nostalgia +10`}
    }},
    "MAINT": {type:"dir", items:{
      "REPORT.TXT": {type:"file", text:`MAINTENANCE REPORT - PART 1/3

Machine ID: KSD-1998
Location: Old technical office
Status: Boots with warnings

Problem: several records were removed after an unknown night session.
Part 2 and Part 3 are missing from this directory.`},
      "TECHNOTES.TXT": {type:"file", text:`TECHNICIAN NOTES

The system behaves like a normal DOS machine until hidden directories are scanned.
Someone created ARCHIVE and VAULT entries, then tried to erase traces.

I found a reference to USER-X in C:\\USERS.`}
    }},
    "USERS": {type:"dir", items:{
      "USERS.LOG": {type:"file", text:`REGISTERED USERS

ADMIN       active
TECH01      active
TECH02      disabled
USER-X      reference found, home directory missing

Warning: USER-X is not listed in the original account table.`},
      "ADMIN.TXT": {type:"file", text:`ADMIN ACCOUNT

Created: 1998/10/16
Last command: BACKUP /VERIFY
Note: ADMIN denied deleting USER-X.`},
      "TECH01.TXT": {type:"file", text:`TECH01 ACCOUNT

Responsible for hardware diagnostics.
Reported unusual green shadow on black screens.
No relation to USER-X found.`},
      "TECH02.TXT": {type:"file", text:`TECH02 ACCOUNT

Disabled after network incident.
The account was active during the same hour as the unknown connection.`}
    }},
    "NETWORK": {type:"dir", items:{
      "ACCESS.LOG": {type:"file", text:`NETWORK ACCESS LOG

1999/03/12 23:14  Connection accepted
Address: 192.168.1.12
Account: UNKNOWN
Session: terminated manually

Trace recommendation: RUN TRACE.EXE from C:\\TOOLS or type TRACE.`},
      "MODEM.TXT": {type:"file", text:`MODEM STATUS

56K modem detected.
Dial tone unstable.
Last remote session closed without logout.

BBS note: The old internet was slower, but sometimes felt more human.`}
    }},
    "SECURITY": {type:"dir", items:{
      "ALERTS.TXT": {type:"file", text:`SECURITY ALERTS

Alert 01: hidden folder structure changed.
Alert 02: maintenance report fragmented.
Alert 03: USER-X referenced by network logs.
Alert 04: vault access key incomplete.

Run SECURE.EXE for a simulated inspection.`},
      "POLICY.TXT": {type:"file", text:`SECURITY POLICY

Do not delete logs.
Do not trust unknown macros.
Do not run destructive commands without reading the report first.
Good technicians verify before acting.`}
    }},
    "TEMP": {type:"dir", items:{
      "PAGE2.TMP": {type:"file", text:`MAINTENANCE REPORT - PART 2/3

Recovered from TEMP.

A user called USER-X appears only after the network incident.
The account may be a person, a script, or a recovery identity.`},
      "GREEN.SHD": {type:"file", text:`DISPLAY NOTE

On black screens, a green shadow may reveal panel wear.
On old systems, even defects become part of the story.`}
    }},
    "ARCHIVE": {type:"dir", hidden:true, locked:false, items:{
      "OLD_PC.LOG": {type:"file", text:`OLD PC LOG

386 -> 486 -> Pentium -> notebooks -> projects -> Klein Dream.

Every machine teaches something.
Every error message is a door.`},
      "1999.LOG": {type:"file", text:`ARCHIVE LOG - 1999

System transfer completed.
Operator removed.
Records deleted.

No operator name stored in visible index.`},
      "PAGE3.BAK": {type:"file", text:`MAINTENANCE REPORT - PART 3/3

Recovered from ARCHIVE.

The missing operator was not deleted by accident.
The system was modified to make the investigation look impossible.
If this page is found, unlock the vault with the old name.`},
      "MOTHER.TXT": {type:"file", text:`DEDICATION

To the mother who taught that we should be inspired by good people,
not by bad examples.

This file is protected as emotional memory.`},
      "VAULT.KEY": {type:"file", text:`VAULT KEY FRAGMENT:
KLEIN-1998-DREAM`}
    }},
    "DREAM": {type:"dir", hidden:true, items:{
      "NETWORK.TXT": {type:"file", text:`KLEIN DREAM NETWORK

No algorithmic feed.
No pressure.
More profile, more memory, more affection for the old internet.`},
      "USERS.LOG": {type:"file", text:`Initial dreamers detected.
Growth is slow, but honest.`}
    }},
    "BACKUP": {type:"dir", hidden:true, items:{}},
    "VAULT": {type:"dir", hidden:true, locked:true, items:{
      "FINAL.LOG": {type:"file", text:`If you are reading this...

you were never supposed to find this system.

USER-X was not the beginning.
USER-X was the warning.

TO BE CONTINUED...
KLEIN SHELL DOS 2.0 - PREVIEW 3`},
      "FINAL.TXT": {type:"file", text:`FINAL MESSAGE

You did not just use commands.
You investigated a machine.

Klein Shell DOS 2.0 is no longer only a prompt.
It is a retro digital investigation.

Preview 2 completed.`}
    }}
  }}
};

const missionList = [
  ["Read README.TXT", ()=>state.flags.readWelcome],
  ["Read KLEIN.TXT", ()=>state.flags.readKlein],
  ["Read ROADMAP.TXT", ()=>state.flags.readRoadmap],
  ["Run memory test in C:\\DOS", ()=>state.flags.ranMemory],
  ["Repair boot using FIXBOOT", ()=>state.flags.repairedBoot],
  ["Read the maintenance report", ()=>state.flags.readReport],
  ["Recover missing maintenance pages", ()=>state.flags.ranRecover],
  ["Read C:\\USERS\\USERS.LOG", ()=>state.flags.readUsers],
  ["Search for USER-X", ()=>state.flags.searchedUser],
  ["Read C:\\NETWORK\\ACCESS.LOG", ()=>state.flags.readNetwork],
  ["Trace the network incident", ()=>state.flags.tracedNetwork],
  ["Run a security inspection", ()=>state.flags.ranSecure],
  ["Scan for hidden directories", ()=>state.flags.foundHidden],
  ["Decode NOTE.KDN in C:\\TOOLS", ()=>state.flags.decodedNote],
  ["Enter C:\\ARCHIVE", ()=>state.flags.enteredArchive],
  ["Read ARCHIVE\\1999.LOG", ()=>state.flags.readArchive1999],
  ["Read MOTHER.TXT", ()=>state.flags.readMother],
  ["Run DREAM.EXE", ()=>state.flags.ranDream],
  ["Create backup using BACKUP", ()=>state.flags.backedUp],
  ["Unlock C:\\VAULT", ()=>state.flags.unlockedVault],
  ["Read FINAL.LOG", ()=>state.flags.readFinalLog],
  ["Read FINAL.TXT", ()=>state.flags.final],
  ["Use STATUS", ()=>state.flags.usedStatus],
  ["Use NOTES", ()=>state.flags.usedNotes],
  ["Search for LOG", ()=>state.flags.searchedLog]
];

function currentDir(){
  const parts = cwd.split("\\").filter(Boolean);
  let node = fs[parts[0]];
  for(let i=1;i<parts.length;i++) node = node.items[parts[i]];
  return node;
}
function pathOf(name){
  name = name.toUpperCase();
  if(name === ".") return currentDir();
  if(name === "..") return null;
  return currentDir().items[name];
}
function print(txt="", cls="sys"){
  const div=document.createElement("div");
  div.className=`line ${cls}`;
  div.textContent=txt;
  terminal.appendChild(div);
  terminal.scrollTop=terminal.scrollHeight;
}
function unlock(name){
  if(!state.achievements.has(name)){
    state.achievements.add(name);
    print(`Achievement unlocked: ${name}`,"ok");
    beep();
  }
}
function beep(){
  if(!soundOn) return;
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const osc=ctx.createOscillator(); const gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value=660; gain.gain.value=.035; osc.start();
    setTimeout(()=>{osc.stop(); ctx.close();},55);
  }catch(e){}
}
function setPrompt(){ promptEl.textContent = cwd + ">"; }
function xp(){ return state.missionsDone.size * 25 + state.achievements.size * 10; }
function rank(){
  const x=xp();
  if(x>=650) return "Retro Master";
  if(x>=500) return "Systems Engineer";
  if(x>=350) return "Senior Technician";
  if(x>=200) return "Field Technician";
  if(x>=90) return "Junior Technician";
  return "Apprentice Technician";
}
function checkMissions(){
  missionList.forEach(([name,done],i)=>{
    if(done() && !state.missionsDone.has(i)){
      state.missionsDone.add(i);
      print(`Mission complete: ${name}`,"ok");
      beep();
    }
  });
}
function allVisibleItems(node, base="C:"){
  let out=[];
  for(const [k,v] of Object.entries(node.items)){
    const path = base==="C:" ? `C:\\${k}` : `${base}\\${k}`;
    out.push([k,path,v]);
    if(v.type==="dir") out=out.concat(allVisibleItems(v,path));
  }
  return out;
}

const commands = {
  HELP(){
    return `Commands available:

HELP              Shows this help
DIR               Lists files and folders
DIR /A            Lists files including hidden
TREE              Shows directory tree
CD folder         Enters folder
CD..              Goes back
CD\\              Goes to C:\\
TYPE file         Reads text file
RUN program       Runs a program
SEARCH word       Searches indexed files
FIND name         Finds files by name
NOTES             Shows discovered notes
STATUS            Shows rank, XP and progress
SCAN              Finds hidden directories
DECODE file       Decodes simple encrypted notes
RECOVER           Restores missing report pages
TRACE             Reconstructs network events
SECURE            Runs a security inspection
FIXBOOT           Repairs simulated boot sector
BACKUP            Backs up important logs
UNLOCK key        Unlocks protected areas
MISSIONS          Shows objectives
ACHIEVEMENTS      Shows achievements
CLS               Clears screen
VER, MEM, DATE, TIME
THEME GREEN/AMBER/BLUE/WHITE
ABOUT`;
  },
  DIR(args){
    const showHidden = args[0] === "/A";
    const items = Object.entries(currentDir().items).filter(([k,v])=>showHidden || !v.hidden);
    if(!items.length) return "No files found.";
    return items.map(([k,v])=>{
      const tag = v.type==="dir" ? "<DIR>" : "     ";
      const hid = v.hidden ? " [hidden]" : "";
      const lock = v.locked ? " [locked]" : "";
      return `${tag} ${k}${hid}${lock}`;
    }).join("\n");
  },
  TREE(){
    const walk=(node,prefix="")=>{
      let out=[];
      for(const [k,v] of Object.entries(node.items)){
        if(v.hidden) continue;
        out.push(prefix+k+(v.type==="dir"?"\\":""));
        if(v.type==="dir") out=out.concat(walk(v,prefix+"  "));
      }
      return out;
    };
    return "C:\\\n"+walk(fs["C:"],"  ").join("\n");
  },
  CD(args){
    let target = args.join(" ").toUpperCase();
    if(!target) return cwd;
    if(target==="\\"){cwd="C:"; setPrompt(); return "";}
    if(target===".." || target==="CD.."){
      const parts=cwd.split("\\"); if(parts.length>1){parts.pop(); cwd=parts.join("\\");} setPrompt(); return "";
    }
    target = target.replace(/^C:\\?/,"");
    let node = currentDir().items[target];
    if(!node || node.type!=="dir" || node.hidden) return "Invalid directory.";
    if(node.locked) return "Access denied. This directory is locked.";
    cwd = cwd==="C:" ? `C:\\${target}` : `${cwd}\\${target}`;
    if(target==="ARCHIVE") { state.flags.enteredArchive=true; addNote("ARCHIVE contains old logs and a vault key fragment."); unlock("Digital Archaeologist"); }
    setPrompt(); return "";
  },
  TYPE(args){
    const name=args.join(" ").toUpperCase();
    const f=pathOf(name);
    if(!f || f.type!=="file") return "File not found.";
    if(name==="README.TXT" && cwd==="C:") state.flags.readWelcome=true;
    if(name==="KLEIN.TXT" && cwd==="C:") state.flags.readKlein=true;
    if(name==="ROADMAP.TXT" && cwd==="C:") state.flags.readRoadmap=true;
    if(name==="REPORT.TXT") { state.flags.readReport=true; addNote("The maintenance report is missing Part 2 and Part 3."); }
    if(name==="TECHNOTES.TXT") { state.flags.readMaint=true; addNote("TECHNOTES mention USER-X inside C:\\USERS."); }
    if(name==="USERS.LOG") { state.flags.readUsers=true; addNote("USER-X exists in references, but has no home directory."); }
    if(name==="ACCESS.LOG") { state.flags.readNetwork=true; addNote("Network log shows an unknown connection from 192.168.1.12."); }
    if(name==="ALERTS.TXT") { state.flags.readSecurity=true; addNote("Security alerts connect USER-X, hidden folders and fragmented reports."); }
    if(name==="PAGE2.TMP") { state.flags.foundPage2=true; addNote("Part 2 says USER-X may be a person, script or recovery identity."); }
    if(name==="PAGE3.BAK") { state.flags.foundPage3=true; addNote("Part 3 says the missing operator was removed on purpose."); }
    if(name==="1999.LOG") { state.flags.readArchive1999=true; addNote("1999.LOG says an operator was removed and records were deleted."); }
    if(name==="MOTHER.TXT") state.flags.readMother=true;
    if(name==="FINAL.LOG") { state.flags.readFinalLog=true; unlock("Preview 2 Cliffhanger"); }
    if(name==="FINAL.TXT") { state.flags.final=true; unlock("Preview 2 Completed"); }
    return f.text;
  },
  RUN(args){
    const name=args.join(" ").toUpperCase();
    const f=pathOf(name);
    if(!f || f.type!=="program") return "Program not found.";
    return f.run();
  },
  SCAN(){
    state.flags.foundHidden=true;
    fs["C:"].items.ARCHIVE.hidden=false;
    fs["C:"].items.BACKUP.hidden=false;
    if(state.flags.ranDream) fs["C:"].items.DREAM.hidden=false;
    addNote("SCAN revealed hidden system areas.");
    unlock("Hidden Seeker");
    return `Scan complete.

Hidden directories revealed:
C:\\ARCHIVE
C:\\BACKUP` + (state.flags.ranDream ? "\nC:\\DREAM" : "\nTip: run DREAM.EXE inside C:\\TOOLS later.");
  },
  SEARCH(args){
    const q=args.join(" ").toUpperCase();
    if(!q) return "Use: SEARCH word";
    if(q.includes("USER")) state.flags.searchedUser=true;
    if(q.includes("LOG")) state.flags.searchedLog=true;
    const results=[];
    for(const [name,path,node] of allVisibleItems(fs["C:"],"C:")){
      if(node.type==="file" && (name.includes(q) || (node.text||"").toUpperCase().includes(q))) results.push(path);
    }
    addNote(`SEARCH ${q} returned ${results.length} result(s).`);
    if(results.length) unlock("Search Operator");
    return results.length ? `${results.length} file(s) found:\n\n`+results.slice(0,16).join("\n") : "No indexed files found.";
  },
  FIND(args){
    const q=args.join(" ").toUpperCase();
    if(!q) return "Use: FIND filename";
    const results=[];
    for(const [name,path,node] of allVisibleItems(fs["C:"],"C:")){
      if(name.includes(q)) results.push(path + (node.type==="dir"?"\\":""));
    }
    return results.length ? results.join("\n") : "No matching names found.";
  },
  NOTES(){
    state.flags.usedNotes=true;
    return state.notes.length ? state.notes.map((n,i)=>`${String(i+1).padStart(2,"0")}. ${n}`).join("\n") : "No investigation notes yet.";
  },
  STATUS(){
    state.flags.usedStatus=true;
    return `KLEIN SHELL DOS 2.0 - PREVIEW 2

Rank: ${rank()}
XP: ${xp()} / 700
Missions: ${state.missionsDone.size} / ${missionList.length}
Achievements: ${state.achievements.size}
Current path: ${cwd}`;
  },
  DECODE(args){
    const name=args.join(" ").toUpperCase();
    if(name!=="NOTE.KDN") return "Decode target not recognized.";
    if(cwd!=="C:\\TOOLS") return "NOTE.KDN is not in this directory.";
    state.flags.decodedNote=true;
    addNote("Decoded note: the vault knows the name KLEIN.");
    return `Decoded note:
There is a secret in the ARCHIVE.
The vault knows the name: KLEIN`;
  },
  RECOVER(){
    state.flags.ranRecover=true;
    fs["C:"].items.MAINT.items["PAGE2.TXT"] = {type:"file", text:fs["C:"].items.TEMP.items["PAGE2.TMP"].text};
    fs["C:"].items.MAINT.items["PAGE3.TXT"] = {type:"file", text:fs["C:"].items.ARCHIVE.items["PAGE3.BAK"].text};
    addNote("RECOVER restored PAGE2.TXT and PAGE3.TXT into C:\\MAINT.");
    unlock("First Recovery");
    return `Recovery complete.

Restored files:
C:\\MAINT\\PAGE2.TXT
C:\\MAINT\\PAGE3.TXT`;
  },
  TRACE(){
    if(!state.flags.readNetwork) return "Read C:\\NETWORK\\ACCESS.LOG before tracing the incident.";
    state.flags.tracedNetwork=true;
    addNote("TRACE linked 192.168.1.12 to TECH02 and USER-X references.");
    unlock("Network Investigator");
    return `Trace complete.

Address: 192.168.1.12
Linked records: TECH02, USER-X, ARCHIVE/1999.LOG
Result: the session was not random. It was looking for archived records.`;
  },
  SECURE(){
    state.flags.ranSecure=true;
    addNote("SECURE found no active malware, only historical tampering.");
    unlock("Security Mindset");
    return `Security inspection complete.

Active threats: none
Historical tampering: detected
Deleted records: probable
Recommended action: recover reports, inspect ARCHIVE, unlock VAULT.`;
  },
  FIXBOOT(){
    if(!state.flags.ranMemory) return "Run MEMTEST.EXE before repairing boot.";
    state.flags.repairedBoot=true;
    unlock("Boot Doctor");
    return `Boot sector repaired.
KLEIN.SYS restored.
System stability improved.`;
  },
  BACKUP(){
    if(!state.flags.enteredArchive) return "Backup source not found. Explore C:\\ARCHIVE first.";
    fs["C:"].items.BACKUP.items["ARCHIVE_BAK.LOG"] = {type:"file", text:"Backup created from OLD_PC.LOG, 1999.LOG, PAGE3.BAK and MOTHER.TXT"};
    fs["C:"].items.BACKUP.hidden=false;
    state.flags.backedUp=true; unlock("Backup Soul");
    return "Backup complete: C:\\BACKUP\\ARCHIVE_BAK.LOG";
  },
  MISSIONS(){
    return missionList.map(([name,done],i)=>`${String(i+1).padStart(2,"0")}. [${done()?"X":" "}] ${name}`).join("\n");
  },
  ACHIEVEMENTS(){
    return state.achievements.size ? [...state.achievements].map(a=>"- "+a).join("\n") : "No achievements yet.";
  },
  VER(){ return "Klein Shell DOS 2.0 Preview 2 - 2026"; },
  MEM(){ return "655360 bytes conventional memory\n67108864 bytes extended memory\nMemory nostalgia: HIGH"; },
  DATE(){ return new Date().toLocaleDateString("en-US"); },
  TIME(){ return new Date().toLocaleTimeString("en-US"); },
  CLS(){ terminal.innerHTML=""; return ""; },
  ABOUT(){ return `Klein Shell DOS 2.0 Preview 2

A retro digital investigation created by Rodrigo Klein Mariano Canto
with Lolita / ChatGPT assistance.

Free, nostalgic, English-only, MIT-friendly, and designed to grow.`; },
  THEME(args){
    const t=(args[0]||"").toLowerCase();
    document.body.classList.remove("amber","blue","white");
    if(t==="amber") document.body.classList.add("amber");
    else if(t==="blue") document.body.classList.add("blue");
    else if(t==="white") document.body.classList.add("white");
    else if(t!=="green") return "Use: THEME GREEN, THEME AMBER, THEME BLUE or THEME WHITE";
    return `Theme changed to ${t.toUpperCase()||"GREEN"}.`;
  },
  UNLOCK(args){
    const key=args.join(" ").toUpperCase();
    if(key==="KLEIN-1998-DREAM" || key==="KLEIN"){
      fs["C:"].items.VAULT.hidden=false; fs["C:"].items.VAULT.locked=false;
      state.flags.unlockedVault=true; unlock("Vault Opener");
      addNote("VAULT unlocked. The system is ready to reveal the Preview 2 cliffhanger.");
      return "C:\\VAULT unlocked.";
    }
    return "Invalid key.";
  }
};

function process(raw){
  const line=raw.trim();
  if(!line) return;
  print(promptEl.textContent+" "+line,"cmdline");
  const normalized=line.replace(/^CD\.\.$/i,"CD ..").replace(/^CD\\$/i,"CD \\");
  const parts=normalized.split(/\s+/);
  const cmd=parts[0].toUpperCase();
  const args=parts.slice(1).map(x=>x.toUpperCase());
  let out;
  if(commands[cmd]) out=commands[cmd](args);
  else out="Bad command or file name.";
  if(out) print(out);
  checkMissions();
}

form.addEventListener("submit", e=>{e.preventDefault(); const v=input.value; input.value=""; process(v);});
document.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>process("THEME "+b.dataset.theme));
document.getElementById("soundBtn").onclick=()=>{soundOn=!soundOn; document.getElementById("soundBtn").textContent="SOUND: "+(soundOn?"ON":"OFF"); input.focus();};

print("Klein Shell DOS 2.0 Preview 2");
print("A retro digital investigation inside a forgotten DOS machine.");
print("Type HELP to begin. Type MISSIONS, STATUS and NOTES often.");
print("");
setPrompt();
input.focus();
