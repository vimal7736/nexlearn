import Image from 'next/image';

interface HeaderProps {
  onLogout: () => void;
  showLogout?: boolean;
}

export default function Header({ onLogout, showLogout = true }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className=" px-1 py-2.5 flex items-center justify-between">
        <div></div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center transform -rotate-12">
            <Image src="/Group.svg" alt="Logo" width={60} height={40} />
          </div>

          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#4FAAC4] to-[#177A9C] bg-clip-text text-transparent">
              NexLearn
            </h1>
            <p className="text-[8px] leading-none bg-gradient-to-r from-[#4FAAC4] to-[#177A9C] bg-clip-text text-transparent">
              futuristic learning
            </p>
          </div>
        </div>

        {showLogout && (
          <button 
            onClick={onLogout}
            className="bg-[#177A9C] text-white px-3.5 py-2 cursor-pointer rounded-md hover:bg-gray-800 font-medium text-xs transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}