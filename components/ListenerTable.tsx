"use client";

import { useEffect, useState } from "react";

interface Listener {
  location?: {
    city?: string;
    country?: string;
    region?: string;
    lat?: number;
    lon?: number;
  };
  device?: {
    client?: string;
  };
}

interface ListenerResponse {
  status: "online" | "offline";
  current: number;
  unique: number;
  total: number;
  listeners?: Listener[];
}

export default function ListenerTable() {

  const [data, setData] = useState<ListenerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTableData = async () => {
    try {

      const res = await fetch("/api/listeners");

      const json = await res.json();

      setData(json);

    } catch (error) {
      console.error("Table Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();

    const interval = setInterval(fetchTableData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse text-emerald-300 font-bold uppercase text-[10px] tracking-widest">
        Memuat Rincian...
      </div>
    );

  const listeners = data?.listeners ?? [];

  return (
    <div className="overflow-x-auto">

      {/* STATUS RADIO */}

      <div className="mb-6 flex items-center justify-between">

        <div className="text-sm font-semibold">

          {data?.status === "online" ? (
            <span className="text-emerald-600">
              🟢 Radio Live
            </span>
          ) : (
            <span className="text-red-500">
              🔴 Radio Offline
            </span>
          )}

        </div>

        <div className="text-xs text-gray-500 font-mono">
          Current: {data?.current ?? 0} |
          Unique: {data?.unique ?? 0}
        </div>

      </div>

      <table className="w-full text-left border-collapse">

        <thead>
          <tr className="border-b border-emerald-50 text-[10px] font-black text-emerald-800 uppercase tracking-widest">
            <th className="py-4 px-4">Lokasi / Kota</th>
            <th className="py-4 px-4">Koordinat</th>
            <th className="py-4 px-4">Perangkat (Client)</th>
            <th className="py-4 px-4 text-right">Status</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 font-medium text-sm">

          {listeners.length === 0 ? (

            <tr>
              <td colSpan={4} className="py-10 text-center text-gray-400 italic">
                Tidak ada detail listener yang tersedia.
              </td>
            </tr>

          ) : (

            listeners.map((l, index) => (

              <tr
                key={index}
                className="border-b border-gray-50 hover:bg-emerald-50 transition-colors"
              >

                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-black uppercase">
                      {l.location?.city || "Unknown"},{" "}
                      {l.location?.country || "ID"}
                    </span>

                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">
                      {l.location?.region || "Global Access"}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4 text-xs font-mono text-gray-400">
                  {l.location?.lat?.toFixed?.(4) ?? "-"},{" "}
                  {l.location?.lon?.toFixed?.(4) ?? "-"}
                </td>

                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-200">
                    {l.device?.client || "Web Player"}
                  </span>
                </td>

                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Mendengarkan
                  </span>
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}