import React, { useState, useRef, useEffect } from "react";
import Checkbox from "./Checkbox";
import { PencilIcon } from '@heroicons/react/24/outline';

function getSortIcon(column, sortBy, sortDir) {
  if (sortBy !== column) return null;
  return sortDir === "asc" ? "▲" : "▼";
}

export default function BlogTable({ blogs, onEdit, onView, onDelete }) {
  const [sortBy, setSortBy] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [hasOverflow, setHasOverflow] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const tableContainerRef = useRef(null);

  // Get unique statuses for dropdown
  const uniqueStatuses = Array.from(new Set(blogs.map(blog => blog.status)));

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false);
      }
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(event.target)) {
        setRowsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check for horizontal overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (tableContainerRef.current) {
        const hasHorizontalOverflow = tableContainerRef.current.scrollWidth > tableContainerRef.current.clientWidth;
        setHasOverflow(hasHorizontalOverflow);
      }
    };
    const timeoutId = setTimeout(checkOverflow, 0);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [search, statusFilter, sortBy, sortDir]);

  // Sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => {
    let valA, valB;
    if (sortBy === "title") {
      valA = a.title?.toLowerCase() || "";
      valB = b.title?.toLowerCase() || "";
    } else if (sortBy === "category") {
      valA = a.category_name?.toLowerCase() || "";
      valB = b.category_name?.toLowerCase() || "";
    } else if (sortBy === "author") {
      valA = a.author?.toLowerCase() || "";
      valB = b.author?.toLowerCase() || "";
    } else if (sortBy === "status") {
      valA = a.status?.toLowerCase() || "";
      valB = b.status?.toLowerCase() || "";
    } else {
      return 0;
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Filtering
  const filteredBlogs = sortedBlogs.filter(blog => {
    const q = search.toLowerCase();
    const matchesSearch =
      blog.title?.toLowerCase().includes(q) ||
      blog.category_name?.toLowerCase().includes(q) ||
      blog.author?.toLowerCase().includes(q) ||
      blog.status?.toLowerCase().includes(q) ||
      blog.description?.toLowerCase().includes(q);
    const matchesStatus = statusFilter && statusFilter !== "all" ? blog.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBlogs.length / pageSize);
  const paginatedBlogs = filteredBlogs.slice((page - 1) * pageSize, page * pageSize);
  const rowsEnd = Math.min(page * pageSize, filteredBlogs.length);

  // Reset to page 1 if filters/search change and current page is out of range
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [search, statusFilter, sortBy, sortDir, totalPages, pageSize]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredBlogs.map(blog => blog.id || blog._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const IMAGE_BASE_URL = 'http://164.52.202.121:4545';

  return (
    <div className="my-5 relative rounded-t-lg shadow-md bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 pt-3 pb-1 mb-4">
        <div className="text-2xl">
          {selected.length > 0 ? `${selected.length} selected` : "Blogs"}
        </div>
        <div className="flex gap-2 items-center ms-auto">
          <div className="relative w-48" ref={statusDropdownRef}>
            <input type="hidden" name="status" id="selected-status" value={statusFilter} />
            <button
              type="button"
              className="mt-2 w-full h-[3.15rem] px-4 text-left text-[1.063rem] font-normal text-[#333] border border-[#C7BEBE] border-b-[0.156rem] rounded-lg bg-transparent transition-all duration-300 ease-in-out focus:border-pink-600 hover:border-pink-600 flex items-center justify-between"
              onClick={e => {
                e.stopPropagation();
                setStatusDropdownOpen(!statusDropdownOpen);
              }}
            >
              <span>{statusFilter || "Select Status"}</span>
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 14l6-6H4l6 6z" clipRule="evenodd" />
              </svg>
            </button>
            <ul className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-[200px] overflow-auto ${statusDropdownOpen ? '' : 'hidden'}`}>
              <li
                className="px-4 py-2 text-gray-400 cursor-not-allowed"
                data-value=""
              >
                Select Status
              </li>
              <li
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                data-value="all"
                onClick={e => {
                  e.stopPropagation();
                  setStatusFilter("all");
                  setStatusDropdownOpen(false);
                }}
              >
                All
              </li>
              {uniqueStatuses.map(status => (
                <li
                  key={status}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  data-value={status}
                  onClick={e => {
                    e.stopPropagation();
                    setStatusFilter(status);
                    setStatusDropdownOpen(false);
                  }}
                >
                  {status}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none mt-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <input
              type="text"
              id="table-search-blogs"
              className="mt-2 w-full h-[3.15rem] pl-12 pr-12 text-[1.063rem] font-normal text-[#333] border border-[#C7BEBE] border-b-[0.156rem] rounded-lg bg-transparent transition-all duration-300 ease-in-out focus:border-pink-600 hover:border-pink-600 focus:outline-none placeholder-gray-400"
              placeholder="Search for blogs"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-red-500 focus:outline-none mt-2"
                onClick={() => setSearch("")}
                tabIndex={-1}
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto relative" ref={tableContainerRef}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 min-w-[1200px]">
          <thead className="text-xs text-gray-700 uppercase bg-transparent border-b border-gray-400/60">
            <tr>
              <th scope="col" className="w-16 p-4">
                <div className="flex items-center">
                  <Checkbox
                    id="checkbox-all-search"  
                    checked={filteredBlogs.length > 0 && filteredBlogs.every(blog => selected.includes(blog.id || blog._id))}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="w-48 px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("title")}>Title {getSortIcon("title", sortBy, sortDir)}</th>
              <th scope="col" className="w-64 px-6 py-3">Description</th>
              <th scope="col" className="w-40 px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("category")}>Category {getSortIcon("category", sortBy, sortDir)}</th>
              <th scope="col" className="w-40 px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("author")}>Author {getSortIcon("author", sortBy, sortDir)}</th>
              <th scope="col" className="w-40 px-6 py-3">Poster</th>
              <th scope="col" className="w-40 px-6 py-3">Publish Date</th>
              <th scope="col" className="w-32 px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("status")}>Status {getSortIcon("status", sortBy, sortDir)}</th>
              <th scope="col" className="w-32 px-6 py-3 sticky right-0 bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlogs.map((blog) => (
              <tr key={blog.id || blog._id} className={`group ${selected.includes(blog.id || blog._id) ? 'bg-pink-100 hover:bg-pink-200' : 'bg-transparent hover:bg-pink-100'}`}>
                <td className="w-16 p-4">
                  <div className="flex items-center">
                    <Checkbox
                      id={`checkbox-table-search-${blog.id || blog._id}`}
                      checked={selected.includes(blog.id || blog._id)}
                      onChange={() => handleSelect(blog.id || blog._id)}
                    />
                  </div>
                </td>
                <td className="w-48 px-6 py-4 text-gray-900 whitespace-nowrap">
                  <div className="text-sm font-medium">{blog.title}</div>
                </td>
                <td className="w-64 px-6 py-4 max-w-xs truncate" title={blog.description}>{blog.description}</td>
                <td className="w-40 px-6 py-4">{blog.category_name}</td>
                <td className="w-40 px-6 py-4">{blog.author}</td>
                <td className="w-40 px-6 py-4">
                  {blog.poster && (
                    <img src={`${IMAGE_BASE_URL}${blog.poster}`} alt={blog.poster_alt || 'Poster'} className="h-12 w-20 object-cover rounded" />
                  )}
                </td>
                <td className="w-40 px-6 py-4">{blog.publish_date}</td>
                <td className="w-32 px-6 py-4">{blog.status}</td>
                <td className="w-32 px-6 py-4 sticky right-0 bg-white group-hover:bg-pink-100">
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button type="button" title="Edit Blog" onClick={() => onEdit && onEdit(blog)}>
                      <PencilIcon className="h-5 w-5 text-pink-600" />
                    </button>
                    {/* View */}
                    <button type="button" title="View Blog" onClick={() => onView && onView(blog)}>
                      <lord-icon
                        src="https://cdn.lordicon.com/dicvhxpz.json"
                        trigger="hover"
                        stroke="bold"
                        colors="primary:#2563eb,secondary:#2563eb"
                        style={{ width: '24px', height: '24px' }}>
                      </lord-icon>
                    </button>
                    {/* Delete */}
                    <button type="button" title="Delete Blog" onClick={() => onDelete && onDelete(blog)}>
                      <lord-icon
                        src="https://cdn.lordicon.com/jzinekkv.json"
                        trigger="hover"
                        stroke="bold"
                        colors="primary:#2563eb,secondary:#2563eb"
                        style={{ width: '24px', height: '24px' }}>
                      </lord-icon>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBlogs.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">No blogs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      <div className="w-full border border-white flex items-center justify-between px-6 py-4 bg-white rounded-b-lg overflow-visible absolute z-20">
        {/* Left: Showing X out of Y */}
        <div className="text-gray-800 text-base">
          Showing {filteredBlogs.length === 0 ? 0 : rowsEnd} out of {filteredBlogs.length}
        </div>
        {/* Center: Pagination */}
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <span className="sr-only">Previous</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-800 font-semibold">{page}</span>
          <button
            className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            <span className="sr-only">Next</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        {/* Right: Rows per page (custom dropdown) */}
        <div className="flex items-center gap-2" ref={rowsDropdownRef}>
          <span className="text-gray-800">Rows per page:</span>
          <div className="relative w-20">
            <button
              type="button"
              className="w-full h-[2.3rem] px-4 text-left text-[1.063rem] font-normal text-[#333] border border-[#C7BEBE] border-b-[0.156rem] rounded-lg bg-transparent transition-all duration-300 ease-in-out focus:border-pink-600 hover:border-pink-600 flex items-center justify-between"
              onClick={e => {
                e.stopPropagation();
                setRowsDropdownOpen(!rowsDropdownOpen);
              }}
            >
              <span>{pageSize}</span>
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 14l6-6H4l6 6z" clipRule="evenodd" />
              </svg>
            </button>
            <ul className={`absolute z-10 bottom-full mb-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-[200px] overflow-auto ${rowsDropdownOpen ? '' : 'hidden'}`}>
              {[5, 10, 15, 20].map(size => (
                <li
                  key={size}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={e => {
                    e.stopPropagation();
                    setPageSize(size);
                    setPage(1);
                    setRowsDropdownOpen(false);
                  }}
                >
                  {size}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 