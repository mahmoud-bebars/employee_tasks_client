import { useState } from "react";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { Employees } from "./features/employees/Employees";
import logo from "/logo.svg";
import { Employee } from "./common.types";
import { Tasks } from "./features/tasks/Tasks";

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const onClose = () => {
    setSelectedEmployee(null);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <header className="sticky w-full   px-3 py-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="h-6 w-6" />
              <h1 className="text-xl font-normal">Employees Tasks</h1>
            </div>
            <ModeToggle />
          </div>
        </header>
        <section className="w-full px-3 py-8 md:py-10 space-y-3">
          {selectedEmployee ? (
            <Tasks onClose={onClose} employee={selectedEmployee} />
          ) : (
            <Employees setSelectedEmployee={setSelectedEmployee} />
          )}
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
