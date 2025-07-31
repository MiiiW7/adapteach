"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function TambahKelasDialog({ onSukses }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah kelas");
      setOpen(false);
      setTitle("");
      setDescription("");
      if (onSukses) onSukses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Tambah Kelas</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kelas Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Judul Kelas</label>
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Masukkan judul kelas"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Deskripsi</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Deskripsi kelas (opsional)"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Batal</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
