import { useState, useRef, useEffect } from 'react';
import { UserRound, ChevronUp } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from "../shared/context/AuthProvider";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const { user, postLogout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await postLogout(user);
  };

  return (
    <div ref={ref}>
      <button
        className="flex items-center gap-1 rounded-md bg-linear-135 from-emerald-500 from-0% to-emerald-600 to-100% h-9"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* User Icon */}
        <UserRound className="inline-flex items-center justify-center py-0 w-4 h-4 rounded-full text-white-400" />
        <span className="py-0 max-w-30 truncate text-white text-[13px]">{user?.user?.user_name}</span>
        {/* Caret Icon */}
        <ChevronUp className={`w-4 h-4 text-white-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50 flex flex-col">
          <Link className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-600 transition" onClick={handleLogout}>Logout</Link>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;