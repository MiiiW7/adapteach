"use client"
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function IkutKelasDialog({ onSukses }) {
    const [open, setOpen] = useState(false);
    const [kode, setKode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        // Validasi kode kelas di frontend
        if (!/^\d{4}$/.test(kode)) {
            setError("Kode kelas harus 4 digit angka");
            setLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch("/api/enroll", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ code: kode })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Gagal masuk kelas");
            setOpen(false);
            setKode("");
            if (onSukses) onSukses(data.courseId);
            // Redirect ke halaman kelas
            window.location.href = `/dashboard/siswa/kelas/${data.courseId}`;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Masuk Kelas</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Masuk Kelas Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Kode Kelas (4 digit angka)</label>
                        <input
                            className="w-full border rounded px-3 py-2 focus:outline-none"
                            type="text"
                            inputMode="numeric"
                            maxLength={4}
                            value={kode}
                            onChange={e => setKode(e.target.value.replace(/[^0-9]/g, ''))}
                            required
                            placeholder="Contoh: 1234"
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