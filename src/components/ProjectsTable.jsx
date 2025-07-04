import React, { useState, useRef, useEffect } from "react";
import Checkbox from "./Checkbox";
import { PencilIcon } from '@heroicons/react/24/outline';

function getSortIcon(column, sortBy, sortDir) {
  if (sortBy !== column) return null;
  return sortDir === "asc" ? "▲" : "▼";
}

export default function ProjectsTable({ projects, technologies = [], categories = [], onEdit, onView, onDelete }) {
  const [sortBy, setSortBy] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [hasOverflow, setHasOverflow] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const tableContainerRef = useRef(null);

  // Get unique category IDs for dropdown
  const uniqueCategoryIds = Array.from(new Set(projects.map(project => {
    if (project.category_name) return null; // prefer not to show if name is present
    if (typeof project.category === 'object' && project.category !== null) return project.category.id || project.category._id || project.category.category;
    return project.category;
  }))).filter(Boolean);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
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
  }, [search, categoryFilter, sortBy, sortDir]);

  // Sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    let valA, valB;
    if (sortBy === "title") {
      valA = a.title?.toLowerCase() || "";
      valB = b.title?.toLowerCase() || "";
    } else if (sortBy === "category") {
      valA = (a.category_name || a.category)?.toLowerCase() || "";
      valB = (b.category_name || b.category)?.toLowerCase() || "";
    } else if (sortBy === "duration") {
      valA = a.project_duration?.toLowerCase() || "";
      valB = b.project_duration?.toLowerCase() || "";
    } else {
      return 0;
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Filtering
  const filteredProjects = sortedProjects.filter(project => {
    const q = search.toLowerCase();
    const matchesSearch =
      project.title?.toLowerCase().includes(q) ||
      (project.category_name || project.category)?.toLowerCase().includes(q) ||
      project.description?.toLowerCase().includes(q) ||
      project.project_duration?.toLowerCase().includes(q);
    const matchesCategory = categoryFilter && categoryFilter !== "all" ? (project.category_name || project.category) === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice((page - 1) * pageSize, page * pageSize);
  const rowsEnd = Math.min(page * pageSize, filteredProjects.length);

  // Reset to page 1 if filters/search change and current page is out of range
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [search, categoryFilter, sortBy, sortDir, totalPages, pageSize]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredProjects.map(project => project.id || project._id));
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
          {selected.length > 0 ? `${selected.length} selected` : "Projects"}
        </div>
        <div className="flex gap-2 items-center ms-auto">
          <div className="relative w-48" ref={categoryDropdownRef}>
            <input type="hidden" name="category" id="selected-category" value={categoryFilter} />
            <button
              type="button"
              className="mt-2 w-full h-[3.15rem] px-4 text-left text-[1.063rem] font-normal text-[#333] border border-[#C7BEBE] border-b-[0.156rem] rounded-lg bg-transparent transition-all duration-300 ease-in-out focus:border-pink-600 hover:border-pink-600 flex items-center justify-between"
              onClick={e => {
                e.stopPropagation();
                setCategoryDropdownOpen(!categoryDropdownOpen);
              }}
            >
              <span>{categoryFilter || "Select Category"}</span>
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 14l6-6H4l6 6z" clipRule="evenodd" />
              </svg>
            </button>
            <ul className={`absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-[200px] overflow-auto ${categoryDropdownOpen ? '' : 'hidden'}`}>
              <li
                className="px-4 py-2 text-gray-400 cursor-not-allowed"
                data-value=""
              >
                Select Category
              </li>
              <li
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                data-value="all"
                onClick={e => {
                  e.stopPropagation();
                  setCategoryFilter("all");
                  setCategoryDropdownOpen(false);
                }}
              >
                All
              </li>
              {uniqueCategoryIds.map(categoryId => {
                const cat = categories.find(c => (c.id || c._id || c.category) == categoryId);
                const name = cat ? (cat.category || cat.name || cat.title) : categoryId;
                return (
                  <li
                    key={categoryId}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    data-value={categoryId}
                    onClick={e => {
                      e.stopPropagation();
                      setCategoryFilter(categoryId);
                      setCategoryDropdownOpen(false);
                    }}
                  >
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none mt-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <input
              type="text"
              id="table-search-projects"
              className="mt-2 w-full h-[3.15rem] pl-12 pr-12 text-[1.063rem] font-normal text-[#333] border border-[#C7BEBE] border-b-[0.156rem] rounded-lg bg-transparent transition-all duration-300 ease-in-out focus:border-pink-600 hover:border-pink-600 focus:outline-none placeholder-gray-400"
              placeholder="Search for projects"
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
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 min-w-[1200px] table-fixed">
          <thead className="text-xs text-gray-700 uppercase bg-transparent border-b border-gray-400/60">
            <tr>
              <th scope="col" className="w-16 p-4">
                <div className="flex items-center">
                  <Checkbox
                    id="checkbox-all-search"  
                    checked={filteredProjects.length > 0 && filteredProjects.every(project => selected.includes(project.id || project._id))}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th scope="col" className="w-48 px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("title")}>Title {getSortIcon("title", sortBy, sortDir)}</th>
              <th scope="col" className="w-64 px-6 py-3">Description</th>
              <th scope="col" className="w-40 px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("category")}>Category {getSortIcon("category", sortBy, sortDir)}</th>
              <th scope="col" className="w-40 px-6 py-3">Technologies</th>
              <th scope="col" className="w-40 px-6 py-3 cursor-pointer select-none" onClick={() => handleSort("duration")}>Duration {getSortIcon("duration", sortBy, sortDir)}</th>
              <th scope="col" className="w-40 px-6 py-3">Image</th>
              <th scope="col" className="w-40 px-6 py-3">Website</th>
              <th scope="col" className="w-32 px-6 py-3 sticky right-0 bg-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project) => (
              <tr key={project.id || project._id} className={`group ${selected.includes(project.id || project._id) ? 'bg-pink-100 hover:bg-pink-200' : 'bg-transparent hover:bg-pink-100'}`}>
                <td className="w-16 p-4">
                  <div className="flex items-center">
                    <Checkbox
                      id={`checkbox-table-search-${project.id || project._id}`}
                      checked={selected.includes(project.id || project._id)}
                      onChange={() => handleSelect(project.id || project._id)}
                    />
                  </div>
                </td>
                <td className="w-48 px-6 py-4 text-gray-900">
                  <div className="text-sm font-medium break-words min-w-0 w-full">{project.title}</div>
                </td>
                <td className="w-64 px-6 py-4 max-w-xs truncate" title={project.description}>{project.description}</td>
                <td className="w-40 px-6 py-4">{
                  (() => {
                    // Prefer category_name if present
                    if (project.category_name) return project.category_name;
                    // If project.category is an object with a name
                    if (typeof project.category === 'object' && project.category !== null) {
                      return project.category.name || project.category.title || project.category.category || '';
                    }
                    // If project.category is an ID, map to name
                    if (project.category) {
                      const cat = categories.find(c => (c.id || c._id || c.category) == project.category);
                      return cat ? (cat.category || cat.name || cat.title) : project.category;
                    }
                    return '';
                  })()
                }</td>
                <td className="w-40 px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      let techNames = [];
                      if (Array.isArray(project.technology)) {
                        // If technology is an array of IDs, map them to names
                        techNames = project.technology.map(techId => {
                          const tech = technologies.find(t => (t.id || t._id || t.technology) == techId);
                          return tech ? (tech.technology || tech.name || tech.title) : techId;
                        });
                      } else if (project.technology_names) {
                        // If technology_names is already provided
                        techNames = project.technology_names;
                      } else if (project.technology) {
                        // Fallback to technology field
                        techNames = Array.isArray(project.technology) ? project.technology : [project.technology];
                      }
                      
                      return (
                        <>
                          {techNames.slice(0, 2).map((techName, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-600">
                              {techName}
                            </span>
                          ))}
                          {techNames.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{techNames.length - 2}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </td>
                <td className="w-40 px-6 py-4">{project.project_duration}</td>
                <td className="w-40 px-6 py-4">
                  {project.image && (
                    <img src={`${IMAGE_BASE_URL}${project.image}`} alt={project.image_alt || 'Project'} className="h-12 w-20 object-cover rounded" />
                  )}
                </td>
                <td className="w-40 px-6 py-4">
                  {project.website_link && (
                    <a 
                      href={project.website_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit
                    </a>
                  )}
                </td>
                <td className={`w-32 px-6 py-4 sticky right-0 ${selected.includes(project.id || project._id) ? 'bg-pink-100 group-hover:bg-pink-200' : 'bg-white group-hover:bg-pink-100'}`}>
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button type="button" title="Edit Project" onClick={() => onEdit && onEdit(project)}>
                      <PencilIcon className="h-5 w-5 text-pink-600" />
                    </button>
                    {/* View */}
                    <button type="button" title="View Project" onClick={() => onView && onView(project)}>
                      <lord-icon
                        src="https://cdn.lordicon.com/dicvhxpz.json"
                        trigger="hover"
                        stroke="bold"
                        colors="primary:#2563eb,secondary:#2563eb"
                        style={{ width: '24px', height: '24px' }}>
                      </lord-icon>
                    </button>
                    {/* Delete */}
                    <button type="button" title="Delete Project" onClick={() => onDelete && onDelete(project)}>
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
            {filteredProjects.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-400">No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      <div className="w-full border border-white flex items-center justify-between px-6 py-4 bg-white rounded-b-lg overflow-visible absolute z-20">
        {/* Left: Showing X out of Y */}
        <div className="text-gray-800 text-base">
          Showing {filteredProjects.length === 0 ? 0 : rowsEnd} out of {filteredProjects.length}
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