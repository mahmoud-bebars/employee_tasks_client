import { ModeToggle } from "./mode-toggle";
import logo from "/logo.png";

const Header = () => {
  return (
    <header className="sticky w-full   px-3 py-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-6 w-6" />
          <h1 className="text-xl font-normal">Task Manger</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
