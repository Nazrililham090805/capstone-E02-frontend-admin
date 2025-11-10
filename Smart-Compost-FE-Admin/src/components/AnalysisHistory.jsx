import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnalysisHistory = ({
  records = [],
  page = 1,
  totalPages = 1,
  onChangePage,
  onFilterChange,
  filters = {},
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [isChangingPage, setIsChangingPage] = useState(false);

  // Local state untuk filter UI
  const [selectedMonth, setSelectedMonth] = useState(filters.bulan || "");
  const [selectedStatus, setSelectedStatus] = useState(filters.status || "");
  const [searchQuery, setSearchQuery] = useState(filters.keterangan || "");
  const [sortNitrogen, setSortNitrogen] = useState("none");
  const [sortFosfor, setSortFosfor] = useState("none");
  const [sortKalium, setSortKalium] = useState("none");

  // Debounce timer untuk search
  const [searchTimer, setSearchTimer] = useState(null);

  useEffect(() => {
    if (!isLoading) setIsChangingPage(false);
  }, [isLoading, page]);

  // Handle month filter change
  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    updateFilters({ bulan: value === "all" ? "" : value });
  };

  // Handle status filter change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    updateFilters({ status: value === "all" ? "" : value });
  };

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchQuery(value);

    // Clear previous timer
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    // Set new timer untuk debounce (500ms)
    const timer = setTimeout(() => {
      updateFilters({ keterangan: value.trim() });
    }, 500);

    setSearchTimer(timer);
  };

  // Handle sort changes
  const handleSortChange = (nutrient, direction) => {
    let newSortNitrogen = sortNitrogen;
    let newSortFosfor = sortFosfor;
    let newSortKalium = sortKalium;

    if (nutrient === "nitrogen") {
      // Hitung nilai baru secara manual agar langsung bisa dipakai
      if (sortNitrogen === "none") newSortNitrogen = "desc";
      else if (sortNitrogen === "desc") newSortNitrogen = "asc";
      else newSortNitrogen = "none";

      newSortFosfor = "none";
      newSortKalium = "none";

      // Update state
      setSortNitrogen(newSortNitrogen);
      setSortFosfor("none");
      setSortKalium("none");
    } else if (nutrient === "fosfor") {
      if (sortFosfor === "none") newSortFosfor = "desc";
      else if (sortFosfor === "desc") newSortFosfor = "asc";
      else newSortFosfor = "none";

      newSortNitrogen = "none";
      newSortKalium = "none";

      setSortFosfor(newSortFosfor);
      setSortNitrogen("none");
      setSortKalium("none");
    } else if (nutrient === "kalium") {
      if (sortKalium === "none") newSortKalium = "desc";
      else if (sortKalium === "desc") newSortKalium = "asc";
      else newSortKalium = "none";

      newSortFosfor = "none";
      newSortNitrogen = "none";

      setSortKalium(newSortKalium);
      setSortNitrogen("none");
      setSortFosfor("none");
    }

    // Build sort string langsung dari nilai baru (bukan dari state lama)
    let sortString = "";
    if (newSortNitrogen !== "none") sortString = `kadar_n:${newSortNitrogen}`;
    else if (newSortFosfor !== "none") sortString = `kadar_p:${newSortFosfor}`;
    else if (newSortKalium !== "none") sortString = `kadar_k:${newSortKalium}`;

    updateFilters({ sort: sortString });
    console.log("Updated sort:", sortString);
  };

  // Update filters dan kirim ke parent
  const updateFilters = (newFilter) => {
    if (!onFilterChange) return;

    const updatedFilters = {
      bulan: selectedMonth === "all" ? "" : selectedMonth,
      status: selectedStatus === "all" ? "" : selectedStatus,
      keterangan: searchQuery.trim(),
      sort: "",
      ...newFilter,
    };

    onFilterChange(updatedFilters);
  };

  const handlePageClick = (p) => {
    if (!onChangePage || isLoading || p === page) return;
    setIsChangingPage(true);
    onChangePage(p);
  };

  const showSkeletonOnly = isChangingPage || isLoading;

  const renderPages = () => {
    if (!onChangePage) return null;
    const MAX_INLINE = 7;
    if (totalPages <= MAX_INLINE) {
      return Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => handlePageClick(p)}
            disabled={isLoading || p === page}
            className={`px-3 py-1 rounded ${
              p === page
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {p}
          </button>
        );
      });
    }

    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);
    const items = [1];
    if (left > 2) items.push("left-ellipsis");
    for (let p = left; p <= right; p++) items.push(p);
    if (right < totalPages - 1) items.push("right-ellipsis");
    items.push(totalPages);

    const uniq = [...new Set(items)];
    return uniq.map((p, idx) => {
      if (p === "left-ellipsis" || p === "right-ellipsis") {
        return (
          <span key={`e-${idx}`} className="px-2">
            …
          </span>
        );
      }
      return (
        <button
          key={p}
          onClick={() => handlePageClick(p)}
          disabled={isLoading || p === page}
          className={`px-3 py-1 rounded ${
            p === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {p}
        </button>
      );
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">
        RIWAYAT ANALISIS
      </h2>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full rounded-lg border border-gray-100">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase border-r border-gray-100">
                <div className="flex items-center justify-center gap-2">
                  TANGGAL / WAKTU
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase border-r border-gray-100">
                STATUS
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase border-r border-gray-100">
                KETERANGAN
              </th>
              <th
                colSpan={3}
                className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase border-r border-gray-100"
              >
                Kandungan Nutrisi (mg/kg)
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black-500 uppercase">
                AKSI
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            <tr>
              {/* Dropdown filter bulan */}
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">
                <select
                  value={selectedMonth || "all"}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="text-sm border border-gray-300 w-32 rounded px-2 py-1 bg-white text-gray-700"
                  disabled={isLoading}
                >
                  <option value="all">All</option>
                  <option value="2025-01">Januari 2025</option>
                  <option value="2025-02">Februari 2025</option>
                  <option value="2025-03">Maret 2025</option>
                  <option value="2025-04">April 2025</option>
                  <option value="2025-05">Mei 2025</option>
                  <option value="2025-06">Juni 2025</option>
                  <option value="2025-07">Juli 2025</option>
                  <option value="2025-08">Agustus 2025</option>
                  <option value="2025-09">September 2025</option>
                  <option value="2025-10">Oktober 2025</option>
                  <option value="2025-11">November 2025</option>
                  <option value="2025-12">Desember 2025</option>
                </select>
              </td>

              {/* Dropdown filter Status */}
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">
                <select
                  value={selectedStatus || "all"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-sm border border-gray-300 w-32 rounded px-2 py-1 bg-white text-gray-700"
                  disabled={isLoading}
                >
                  <option value="all">All</option>
                  <option value="Sesuai Standar">Sesuai Standar</option>
                  <option value="Tidak Sesuai Standar">
                    Tidak Sesuai Standar
                  </option>
                </select>
              </td>

              {/* Filter Pencarian */}
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">
                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-gray-600"
                  >
                    <svg
                      width="17"
                      height="16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-labelledby="search"
                      className="w-5 h-5"
                    >
                      <path
                        d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                        stroke="currentColor"
                        strokeWidth="1.333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <input
                    type="text"
                    placeholder="Cari keterangan"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    disabled={isLoading}
                    className="text-sm border border-gray-300 w-44 h-8 rounded px-2 pl-8 pr-8 py-2 bg-white text-gray-600 focus:outline-none focus:border-black shadow-sm transition-all duration-300"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchChange("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </form>
              </td>

              {/* Sort Kadar Nitrogen */}
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">
                <div className="flex items-center justify-between w-32 bg-white text-gray-700 px-5 py-1">
                  <span className="text-sm">Nitrogen</span>
                  <div className="flex flex-col justify-center leading-none">
                    {/* 🔹 Default: satu tombol dengan dua panah */}
                    {sortNitrogen === "none" ? (
                      // Default: Double segitiga (atas + bawah)
                      <button
                        onClick={() => handleSortChange("nitrogen")}
                        disabled={isLoading}
                        className="p-0 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Urutkan Nitrogen"
                      >
                        <div className="flex flex-col items-center justify-center leading-none">
                          <svg
                            className="w-5 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                          </svg>
                          <svg
                            className="w-5 h-4 rotate-180 -mt-[12px]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                          </svg>
                        </div>
                      </button>
                    ) : sortNitrogen === "asc" ? (
                      // Ascending: Segitiga ke atas
                      <button
                        onClick={() => handleSortChange("nitrogen")}
                        disabled={isLoading}
                        className="p-0 text-blue-600 transition-colors flex items-center"
                        title="Urutkan Nitrogen (Terendah → Tertinggi)"
                      >
                        <svg
                          className="w-5 h-4 mt-[9px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                        </svg>
                      </button>
                    ) : (
                      // Descending: Segitiga ke bawah
                      <button
                        onClick={() => handleSortChange("nitrogen")}
                        disabled={isLoading}
                        className="p-0 text-blue-600 transition-colors flex items-center"
                        title="Urutkan Nitrogen (Tertinggi → Terendah)"
                      >
                        <svg
                          className="w-5 h-4 rotate-180 mt-[-9px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </td>

              {/* Sort Kadar Fosfor */}
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">
                <div className="flex items-center justify-between w-32 bg-white text-gray-700 px-5 py-1">
                  <span className="text-sm">Fosfor</span>
                  <div className="flex flex-col justify-center leading-none">
                    {/* 🔹 Default: satu tombol dengan dua panah */}
                    {sortFosfor === "none" ? (
                      // Default: Double segitiga (atas + bawah)
                      <button
                        onClick={() => handleSortChange("fosfor")}
                        disabled={isLoading}
                        className="p-0 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Urutkan Fosfor"
                      >
                        <div className="flex flex-col items-center justify-center leading-none">
                          <svg
                            className="w-5 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                          </svg>
                          <svg
                            className="w-5 h-4 rotate-180 -mt-[12px]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                          </svg>
                        </div>
                      </button>
                    ) : sortFosfor === "asc" ? (
                      // Ascending: Segitiga ke atas
                      <button
                        onClick={() => handleSortChange("fosfor")}
                        disabled={isLoading}
                        className="p-0 text-blue-600 transition-colors flex items-center"
                        title="Urutkan Fosfor (Terendah → Tertinggi)"
                      >
                        <svg
                          className="w-5 h-4 mt-[9px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                        </svg>
                      </button>
                    ) : (
                      // Descending: Segitiga ke bawah
                      <button
                        onClick={() => handleSortChange("fosfor")}
                        disabled={isLoading}
                        className="p-0 text-blue-600 transition-colors flex items-center"
                        title="Urutkan Fosfor (Tertinggi → Terendah)"
                      >
                        <svg
                          className="w-5 h-4 rotate-180 mt-[-9px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </td>

              {/* Sort Kadar Kalium */}
              <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">
                <div className="flex items-center justify-between w-32 bg-white text-gray-700 px-5 py-1">
                  <span className="text-sm">Kalium</span>
                  <div className="flex flex-col justify-center leading-none">
                    {/* 🔹 Default: satu tombol dengan dua panah */}
                    {sortKalium === "none" ? (
                      // Default: Double segitiga (atas + bawah)
                      <button
                        onClick={() => handleSortChange("kalium")}
                        disabled={isLoading}
                        className="p-0 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Urutkan Kalium"
                      >
                        <div className="flex flex-col items-center justify-center leading-none">
                          <svg
                            className="w-5 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                          </svg>
                          <svg
                            className="w-5 h-4 rotate-180 -mt-[12px]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                          </svg>
                        </div>
                      </button>
                    ) : sortKalium === "asc" ? (
                      // Ascending: Segitiga ke atas
                      <button
                        onClick={() => handleSortChange("kalium")}
                        disabled={isLoading}
                        className="p-0 text-blue-600 transition-colors flex items-center"
                        title="Urutkan Kalium (Terendah → Tertinggi)"
                      >
                        <svg
                          className="w-5 h-4 mt-[9px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                        </svg>
                      </button>
                    ) : (
                      // Descending: Segitiga ke bawah
                      <button
                        onClick={() => handleSortChange("kalium")}
                        disabled={isLoading}
                        className="p-0 text-blue-600 transition-colors flex items-center"
                        title="Urutkan Kalium (Tertinggi → Terendah)"
                      >
                        <svg
                          className="w-5 h-4 rotate-180 mt-[-9px]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4"></td>
            </tr>

            {!showSkeletonOnly && records.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}

            {!showSkeletonOnly &&
              records.map((row) => {
                const tanggal = row.tanggal ? new Date(row.tanggal) : null;
                const tanggalStr = tanggal
                  ? tanggal.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "-";
                const waktuStr = tanggal
                  ? tanggal.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";

                // Tentukan status berdasarkan standar kompos
                // Standar SNI: N: 0.4-2%, P: 0.1-2%, K: 0.2-2% (dalam persen)
                // Data dalam mg/kg, konversi: 1% = 10000 mg/kg
                const kadarN = parseFloat(row.kadar_n || 0);
                const kadarP = parseFloat(row.kadar_p || 0);
                const kadarK = parseFloat(row.kadar_k || 0);

                const status = row.status;

                return (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">{`${tanggalStr} / ${waktuStr}`}</td>
                    <td className="px-6 py-4 text-left border-r border-gray-100">
                      <span
                        className={`text-sm font-semibold ${
                          status == "Sesuai Standar"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 border-r border-gray-100">
                      {row.keterangan ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600 border-r border-gray-100">
                      {row.kadar_n ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600 border-r border-gray-100">
                      {row.kadar_p ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600 border-r border-gray-100">
                      {row.kadar_k ?? "-"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/detail/${row.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                      >
                        Lihat Detail <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

            {showSkeletonOnly &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-4">
          {showSkeletonOnly ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            <button
              onClick={() => handlePageClick(page - 1)}
              disabled={isLoading || page <= 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>
          )}

          <div className="flex items-center gap-2">
            {showSkeletonOnly ? (
              <>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </>
            ) : (
              renderPages()
            )}
          </div>

          {showSkeletonOnly ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            <button
              onClick={() => handlePageClick(page + 1)}
              disabled={isLoading || page >= totalPages}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>

        <div className="mt-2 text-sm text-gray-500">
          {showSkeletonOnly ? (
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              Halaman {page} dari {totalPages}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;
