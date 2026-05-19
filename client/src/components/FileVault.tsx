"use client";
import { useState, useRef } from "react";

type FileCategory = "All" | "PDF" | "Image" | "Document" | "Other";
export interface VaultFile {
  id: string; name: string; size: string; sizeBytes: number;
  type: string; category: FileCategory; uploadedAt: string;
  dataUrl: string; folder: string; note: string;
}

function fileIcon(cat: FileCategory) {
  return cat === "PDF" ? "📕" : cat === "Image" ? "🖼️" : cat === "Document" ? "📝" : "📦";
}
function fileBadge(cat: FileCategory) {
  return cat === "PDF" ? "bg-red-50 text-red-600" : cat === "Image" ? "bg-blue-50 text-blue-600" :
    cat === "Document" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-600";
}
function exportCSV(rows: Record<string, string | number>[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + body], { type: "text/csv" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

export default function FileVault() {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<VaultFile[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("eduflow_files") || "[]"); } catch { return []; }
  });
  const [folders, setFolders] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["General", "Assignments", "Research"];
    try { return JSON.parse(localStorage.getItem("eduflow_folders") || '["General","Assignments","Research"]'); } catch { return ["General","Assignments","Research"]; }
  });

  const [fileSearch, setFileSearch] = useState("");
  const [fileCategory, setFileCategory] = useState<FileCategory>("All");
  const [fileFolder, setFileFolder] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  function persist(updated: VaultFile[]) {
    setFiles(updated);
    localStorage.setItem("eduflow_files", JSON.stringify(updated));
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    picked.forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        const ext = f.name.split(".").pop()?.toLowerCase() || "";
        const category: FileCategory =
          ext === "pdf" ? "PDF" :
          ["png","jpg","jpeg","gif","webp","svg"].includes(ext) ? "Image" :
          ["doc","docx","txt","ppt","pptx","xls","xlsx"].includes(ext) ? "Document" : "Other";
        const nf: VaultFile = {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          name: f.name,
          size: f.size > 1024*1024 ? (f.size/1024/1024).toFixed(1)+" MB" : (f.size/1024).toFixed(1)+" KB",
          sizeBytes: f.size, type: ext.toUpperCase() || "FILE", category,
          uploadedAt: new Date().toLocaleDateString(),
          dataUrl: ev.target?.result as string,
          folder: fileFolder === "All" ? "General" : fileFolder, note: "",
        };
        setFiles(prev => { const u = [nf, ...prev]; localStorage.setItem("eduflow_files", JSON.stringify(u)); return u; });
      };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  }

  function deleteFile(id: string) {
    persist(files.filter(f => f.id !== id));
    if (previewFile?.id === id) setPreviewFile(null);
  }
  function saveRename(id: string) {
    persist(files.map(f => f.id === id ? { ...f, name: renameValue || f.name } : f));
    setRenamingId(null); setRenameValue("");
  }
  function updateNote(id: string, note: string) {
    persist(files.map(f => f.id === id ? { ...f, note } : f));
  }
  function moveFolder(id: string, folder: string) {
    persist(files.map(f => f.id === id ? { ...f, folder } : f));
  }
  function addFolder() {
    const name = newFolder.trim();
    if (!name || folders.includes(name)) return;
    const u = [...folders, name];
    setFolders(u); localStorage.setItem("eduflow_folders", JSON.stringify(u));
    setNewFolder(""); setShowFolderInput(false);
  }

  const filtered = files.filter(f => {
    const s = f.name.toLowerCase().includes(fileSearch.toLowerCase()) || f.note.toLowerCase().includes(fileSearch.toLowerCase());
    const c = fileCategory === "All" || f.category === fileCategory;
    const fo = fileFolder === "All" || f.folder === fileFolder;
    return s && c && fo;
  });

  const totalBytes = files.reduce((a, f) => a + f.sizeBytes, 0);
  const usedMB = (totalBytes / 1024 / 1024).toFixed(2);
  const limitMB = 100;
  const usedPct = Math.min((totalBytes / 1024 / 1024 / limitMB) * 100, 100);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">My File Vault 🗄️</h1>
          <p className="text-slate-500 text-sm">Save and manage your PDFs, papers, notes, and documents — stored in your browser.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {files.length > 0 && (
            <button onClick={() => exportCSV(files.map(f => ({ Name: f.name, Type: f.type, Size: f.size, Folder: f.folder, Uploaded: f.uploadedAt, Note: f.note })), "my-files.csv")}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export CSV
            </button>
          )}
          <button onClick={() => uploadInputRef.current?.click()}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" /></svg>
            Upload Files
          </button>
          <input ref={uploadInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.svg" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Storage bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">Storage Used</span>
          <span className="text-sm font-bold text-slate-900">{usedMB} MB <span className="text-slate-400 font-normal">/ {limitMB} MB</span></span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all ${usedPct > 80 ? "bg-red-500" : usedPct > 50 ? "bg-amber-500" : "bg-indigo-500"}`} style={{ width: `${usedPct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
          <span>{files.length} file{files.length !== 1 ? "s" : ""} saved</span>
          <span>{(limitMB - parseFloat(usedMB)).toFixed(1)} MB free</span>
        </div>
      </div>

      {/* Category stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(["PDF","Image","Document","Other"] as FileCategory[]).map(cat => (
          <button key={cat} onClick={() => setFileCategory(fileCategory === cat ? "All" : cat)}
            className={`rounded-xl p-4 text-center border transition-all ${fileCategory === cat ? "ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50" : "bg-white border-slate-100 hover:border-indigo-200"}`}>
            <div className="text-2xl mb-1">{fileIcon(cat)}</div>
            <p className="text-lg font-extrabold text-slate-900">{files.filter(f => f.category === cat).length}</p>
            <p className="text-xs text-slate-500">{cat}s</p>
          </button>
        ))}
      </div>

      {/* Search + Folders + View toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={fileSearch} onChange={e => setFileSearch(e.target.value)} placeholder="Search files and notes..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {["All", ...folders].map(fo => (
            <button key={fo} onClick={() => setFileFolder(fo)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${fileFolder === fo ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
              {fo === "All" ? "📁 All" : `📂 ${fo}`}
            </button>
          ))}
          {showFolderInput ? (
            <div className="flex gap-1">
              <input value={newFolder} onChange={e => setNewFolder(e.target.value)} onKeyDown={e => e.key === "Enter" && addFolder()} placeholder="Folder name" className="px-3 py-2 border border-indigo-300 rounded-xl text-xs w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400" autoFocus />
              <button onClick={addFolder} className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Add</button>
              <button onClick={() => setShowFolderInput(false)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs">✕</button>
            </div>
          ) : (
            <button onClick={() => setShowFolderInput(true)} className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">+ Folder</button>
          )}
          <div className="flex border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`px-3 py-2 text-xs transition-colors ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>⊞</button>
            <button onClick={() => setViewMode("list")} className={`px-3 py-2 text-xs transition-colors ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}>☰</button>
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div onClick={() => uploadInputRef.current?.click()}
        className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 rounded-2xl p-8 text-center cursor-pointer transition-all mb-6">
        <div className="text-4xl mb-2">📂</div>
        <p className="text-slate-700 font-semibold text-sm mb-1">Click or drag files here to upload</p>
        <p className="text-slate-400 text-xs">PDF, DOC, DOCX, TXT, PPT, XLS, PNG, JPG, SVG</p>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="text-5xl mb-3">{files.length === 0 ? "📂" : "🔍"}</div>
          <p className="text-slate-700 font-semibold mb-1">{files.length === 0 ? "No files yet" : "No files match"}</p>
          <p className="text-slate-400 text-sm">{files.length === 0 ? "Upload your first file using the button above." : "Try a different search or filter."}</p>
        </div>
      )}

      {/* Grid view */}
      {filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(f => (
            <div key={f.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col">
              <div className="w-full h-24 bg-slate-50 rounded-xl flex items-center justify-center mb-3 overflow-hidden cursor-pointer flex-shrink-0" onClick={() => setPreviewFile(f)}>
                {f.category === "Image"
                  ? <img src={f.dataUrl} alt={f.name} className="w-full h-full object-cover rounded-xl" />
                  : <span className="text-4xl">{fileIcon(f.category)}</span>}
              </div>
              {renamingId === f.id ? (
                <input value={renameValue} onChange={e => setRenameValue(e.target.value)}
                  onBlur={() => saveRename(f.id)}
                  onKeyDown={e => { if (e.key === "Enter") saveRename(f.id); if (e.key === "Escape") { setRenamingId(null); setRenameValue(""); } }}
                  className="w-full text-xs border border-indigo-300 rounded-lg px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" autoFocus />
              ) : (
                <p className="text-xs font-semibold text-slate-900 truncate mb-1 cursor-pointer hover:text-indigo-600"
                  onClick={() => { setRenamingId(f.id); setRenameValue(f.name); }} title="Click to rename">{f.name}</p>
              )}
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${fileBadge(f.category)}`}>{f.type}</span>
                <span className="text-xs text-slate-400">{f.size}</span>
              </div>
              <p className="text-xs text-slate-400 truncate mb-3">📂 {f.folder}</p>
              <div className="flex gap-1 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewFile(f)} className="flex-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-1.5 rounded-lg transition-colors">View</button>
                <a href={f.dataUrl} download={f.name} className="flex-1 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 py-1.5 rounded-lg transition-colors text-center">Save</a>
                <button onClick={() => deleteFile(f.id)} className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-2 py-1.5 rounded-lg transition-colors">🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {filtered.length > 0 && viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">File</div>
            <div className="col-span-2">Folder</div>
            <div className="col-span-1 text-center">Type</div>
            <div className="col-span-1 text-center">Size</div>
            <div className="col-span-2">Note</div>
            <div className="col-span-1 text-center">Date</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {filtered.map(f => (
            <div key={f.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
              {/* Desktop row */}
              <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 items-center">
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <span className="text-xl flex-shrink-0">{fileIcon(f.category)}</span>
                  {renamingId === f.id ? (
                    <input value={renameValue} onChange={e => setRenameValue(e.target.value)}
                      onBlur={() => saveRename(f.id)}
                      onKeyDown={e => { if (e.key === "Enter") saveRename(f.id); if (e.key === "Escape") { setRenamingId(null); setRenameValue(""); } }}
                      className="flex-1 text-xs border border-indigo-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" autoFocus />
                  ) : (
                    <span className="text-sm font-medium text-slate-900 truncate cursor-pointer hover:text-indigo-600"
                      onClick={() => { setRenamingId(f.id); setRenameValue(f.name); }} title="Click to rename">{f.name}</span>
                  )}
                </div>
                <div className="col-span-2">
                  <select value={f.folder} onChange={e => moveFolder(f.id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white w-full">
                    {folders.map(fo => <option key={fo} value={fo}>{fo}</option>)}
                  </select>
                </div>
                <div className="col-span-1 text-center"><span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${fileBadge(f.category)}`}>{f.type}</span></div>
                <div className="col-span-1 text-center text-xs text-slate-400">{f.size}</div>
                <div className="col-span-2">
                  <input value={f.note} onChange={e => updateNote(f.id, e.target.value)} placeholder="Add note..."
                    className="w-full text-xs border border-slate-100 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-transparent hover:bg-white" />
                </div>
                <div className="col-span-1 text-center text-xs text-slate-400">{f.uploadedAt}</div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button onClick={() => setPreviewFile(f)} className="text-indigo-400 hover:text-indigo-600 p-1 rounded transition-colors" title="Preview">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <a href={f.dataUrl} download={f.name} className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors" title="Download">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                  <button onClick={() => deleteFile(f.id)} className="text-red-400 hover:text-red-600 p-1 rounded transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              {/* Mobile card row */}
              <div className="md:hidden flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl flex-shrink-0 cursor-pointer" onClick={() => setPreviewFile(f)}>
                  {f.category === "Image" ? <img src={f.dataUrl} alt={f.name} className="w-full h-full object-cover rounded-xl" /> : fileIcon(f.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{f.name}</p>
                  <p className="text-xs text-slate-400">{f.size} · {f.folder} · {f.uploadedAt}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setPreviewFile(f)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <a href={f.dataUrl} download={f.name} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                  <button onClick={() => deleteFile(f.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-6" onClick={() => setPreviewFile(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{fileIcon(previewFile.category)}</span>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate text-sm sm:text-base">{previewFile.name}</p>
                  <p className="text-xs text-slate-400">{previewFile.size} · {previewFile.uploadedAt} · 📂 {previewFile.folder}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <a href={previewFile.dataUrl} download={previewFile.name}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download
                </a>
                <button onClick={() => setPreviewFile(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            {/* Preview body */}
            <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-4 min-h-0">
              {previewFile.category === "Image" ? (
                <img src={previewFile.dataUrl} alt={previewFile.name} className="max-w-full max-h-full rounded-xl shadow-md object-contain" />
              ) : previewFile.category === "PDF" ? (
                <iframe src={previewFile.dataUrl} className="w-full h-80 sm:h-96 rounded-xl border border-slate-200" title={previewFile.name} />
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="text-6xl mb-4">{fileIcon(previewFile.category)}</div>
                  <p className="text-slate-700 font-semibold mb-2 break-all">{previewFile.name}</p>
                  <p className="text-slate-400 text-sm mb-5">Preview not available for this file type.</p>
                  <a href={previewFile.dataUrl} download={previewFile.name}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download to Open
                  </a>
                </div>
              )}
            </div>
            {/* Note + mobile download */}
            <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex-shrink-0 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Note</label>
                <input value={previewFile.note}
                  onChange={e => { updateNote(previewFile.id, e.target.value); setPreviewFile({ ...previewFile, note: e.target.value }); }}
                  placeholder="Add a note about this file..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" />
              </div>
              <a href={previewFile.dataUrl} download={previewFile.name}
                className="sm:hidden flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-colors w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download File
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
